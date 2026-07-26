/**
 * Vendors the course curriculum into content/ so the Next.js app can render it.
 *
 * The curriculum lives in a different repo (LoopEngineering-CrashCourse); this app
 * is loop-lab. Rather than a submodule — which would force `submodules: recursive`
 * into the Pages workflow and friction into every clone — the markdown is copied in
 * and committed. `npm run sync:docs` refreshes it after the course changes.
 *
 * Two things happen here that cannot happen at build time:
 *
 * 1. Mermaid pre-rendering. 61 of the 106 docs contain mermaid fences. Rendering
 *    them in the browser would mean shipping ~1 MB of JS to a course site whose
 *    open audit item is *cutting* page weight; rendering them in CI would mean a
 *    chromium download on every build. So they are rendered here, once, on a
 *    machine that already has Chrome, and the SVGs are committed. The build stays
 *    a pure static export and the pages ship zero diagram JS.
 *
 * 2. The markdown itself is copied verbatim. Diagrams are keyed by a hash of their
 *    mermaid source and stored as public/diagrams/<hash>.svg, so the vendored copy
 *    stays a faithful mirror of the course repo and `diff` against it stays
 *    meaningful. That file existing is the only record that a diagram rendered.
 *
 * Mermaid CLI is invoked through `npx -y`, deliberately not a devDependency: it
 * pulls puppeteer and a chromium download, and CI must never pay for that.
 *
 * Usage:
 *   npm run sync:docs                       # ../loop-project-seo by default
 *   COURSE_REPO=/path/to/course npm run sync:docs
 *   npm run sync:docs -- --skip-diagrams    # markdown only, reuse cached SVGs
 */
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const source = process.env.COURSE_REPO || join(root, "..", "loop-project-seo");
const skipDiagrams = process.argv.includes("--skip-diagrams");

const CONTENT = join(root, "content");
const DIAGRAM_DIR = join(root, "public", "diagrams");

/**
 * Trees copied out of the course repo, and where they land under content/.
 *
 * `include` filters which markdown files are published. It exists for `starters`:
 * each of the 21 kits ships the same six scaffold files (LOOP.md, loop-budget.md,
 * loop-constraints.md, loop-run-log.md, <name>-state.md), which are configuration
 * templates, not prose. Publishing 126 near-identical files would be index bloat
 * and thin content — the opposite of what this exercise is for. Each kit's README
 * is a real page and does get published; the scaffolds stay on GitHub, where
 * someone forking a kit actually wants them.
 */
const TREES = [
  { from: "docs", to: "docs" },
  { from: "patterns", to: "patterns" },
  {
    from: "starters",
    to: "starters",
    include: (rel) => rel.endsWith("README.md") || rel === "getting-started.md",
  },
];

if (!existsSync(source)) {
  console.error(`Course repo not found at ${source}. Set COURSE_REPO.`);
  process.exit(1);
}

/** Total bytes of the files directly inside `dir`. */
async function dirBytes(dir) {
  const names = await readdir(dir).catch(() => []);
  let total = 0;
  for (const name of names) total += (await stat(join(dir, name))).size;
  return total;
}

/** Every .md under `dir`, recursively, as paths relative to `dir`. */
async function markdownFiles(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await markdownFiles(full, base)));
    else if (entry.name.endsWith(".md")) out.push(relative(base, full));
  }
  return out;
}

// ── 1. Copy markdown ─────────────────────────────────────────────────────────
await rm(CONTENT, { recursive: true, force: true });
let copied = 0;
const allMarkdown = [];

for (const tree of TREES) {
  const from = join(source, tree.from);
  if (!existsSync(from)) {
    console.warn(`  skip ${tree.from} (not in course repo)`);
    continue;
  }
  for (const rel of await markdownFiles(from)) {
    if (tree.include && !tree.include(rel)) continue;
    const body = await readFile(join(from, rel), "utf8");
    const dest = join(CONTENT, tree.to, rel);
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, body);
    allMarkdown.push({ dest, body });
    copied++;
  }
}
console.log(`Copied ${copied} markdown files into content/`);

// ── 2. Copy the SVG artwork the docs reference ───────────────────────────────
// Docs link these as ../../assets/foo.svg; the renderer rewrites those to
// /course-assets/foo.svg, which resolves to this directory under public/.
const assetsFrom = join(source, "assets");
if (existsSync(assetsFrom)) {
  const dest = join(root, "public", "course-assets");
  await rm(dest, { recursive: true, force: true });
  await cp(assetsFrom, dest, { recursive: true });
  console.log(`Copied ${(await readdir(dest)).length} assets into public/course-assets/`);
}

// ── 2b. Unwrap the fake SVGs ─────────────────────────────────────────────────
// Eight of the course's twelve "SVG" assets are not vector art: each is a 450-byte
// <svg> wrapping one base64-encoded PNG, which is how a raster banner ends up
// costing 825 KB. Base64 alone inflates the payload by a third, and these sit at
// the top of the six part pages — above the fold, on the pages the course most
// wants read.
//
// Decoding to a real file and re-encoding as WebP takes the set from ~4.2 MB to a
// fraction of it. The rewritten name is recorded in content/assets.json so the
// markdown renderer can point ../assets/foo.svg at the file that now exists.
const assetsTo = join(root, "public", "course-assets");
const assetMap = {};

if (existsSync(assetsTo)) {
  let saved = 0;
  for (const name of await readdir(assetsTo)) {
    if (!name.endsWith(".svg")) continue;
    const full = join(assetsTo, name);
    const svg = await readFile(full, "utf8");

    // Only unwrap when the SVG is *nothing but* the embedded raster. A real
    // drawing that happens to contain one bitmap must be left alone.
    const embedded = svg.match(/data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/=]+)/);
    if (!embedded || svg.length - embedded[2].length > 4096) continue;

    const raw = Buffer.from(embedded[2], "base64");
    const before = Buffer.byteLength(svg);
    const out = name.replace(/\.svg$/, ".webp");
    try {
      const sharp = (await import("sharp")).default;
      await sharp(raw).webp({ quality: 82 }).toFile(join(assetsTo, out));
      await rm(full, { force: true });
      assetMap[name] = out;
      saved += before - (await stat(join(assetsTo, out))).size;
    } catch (err) {
      console.warn(`  ! ${name}: ${String(err.message).split("\n")[0]}`);
    }
  }
  if (saved > 0) {
    console.log(
      `Unwrapped ${Object.keys(assetMap).length} raster-in-SVG assets to WebP, saving ${(saved / 1e6).toFixed(1)} MB`,
    );
  }
}
await writeFile(join(CONTENT, "assets.json"), JSON.stringify(assetMap, null, 2) + "\n");

// ── 3. Pre-render mermaid ────────────────────────────────────────────────────
// Keyed by a hash of the diagram source, so unchanged diagrams are never re-rendered
// and a diagram shared between pages is rendered once.
const MERMAID = /^[ \t]*```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```[ \t]*$/gm;

const wanted = new Map(); // hash -> mermaid source
for (const { body } of allMarkdown) {
  for (const match of body.matchAll(MERMAID)) {
    const code = match[1].trim();
    wanted.set(createHash("sha256").update(code).digest("hex").slice(0, 16), code);
  }
}

await mkdir(DIAGRAM_DIR, { recursive: true });

// The rendered file is the record. There used to be a content/diagrams.json
// alongside it mapping hash -> "<hash>.svg" — an identity map, so it held no
// information the directory listing does not, but it could still fall out of step
// with it. It did: every SVG rendered and committed while the index committed as
// `{}`, and the renderer, trusting the index, printed 64 diagrams as source code.
const missing = [...wanted.keys()].filter(
  (hash) => !existsSync(join(DIAGRAM_DIR, `${hash}.svg`)),
);

if (skipDiagrams) {
  console.log(`Diagrams: ${wanted.size} referenced, ${missing.length} missing (--skip-diagrams)`);
} else if (missing.length === 0) {
  console.log(`Diagrams: ${wanted.size} referenced, all cached`);
} else {
  console.log(`Diagrams: rendering ${missing.length} of ${wanted.size}…`);

  // Transparent background so the SVG sits on either theme's surface.
  const config = join(CONTENT, ".mermaid-config.json");
  await writeFile(config, JSON.stringify({ theme: "base", flowchart: { useMaxWidth: true } }));
  const puppeteerConfig = join(CONTENT, ".puppeteer.json");
  await writeFile(puppeteerConfig, JSON.stringify({ args: ["--no-sandbox", "--disable-gpu"] }));

  let ok = 0;
  for (const [i, hash] of missing.entries()) {
    const input = join(CONTENT, `.tmp-${hash}.mmd`);
    const output = join(DIAGRAM_DIR, `${hash}.svg`);
    await writeFile(input, wanted.get(hash));
    try {
      await execFileAsync(
        "npx",
        ["-y", "@mermaid-js/mermaid-cli", "-i", input, "-o", output,
         "-b", "transparent", "-c", config, "-p", puppeteerConfig],
        { timeout: 120_000, cwd: root },
      );
      ok++;
      process.stdout.write(`\r  ${i + 1}/${missing.length} rendered`);
    } catch (err) {
      // One bad diagram must not abandon the other 60. The renderer falls back to
      // showing the mermaid source as a code block for any hash left unindexed.
      console.warn(`\n  ! ${hash} failed to render: ${String(err.message).split("\n")[0]}`);
    } finally {
      await rm(input, { force: true });
    }
  }
  console.log(`\n  ${ok}/${missing.length} rendered`);
  await rm(config, { force: true });
  await rm(puppeteerConfig, { force: true });
}

// ── 3b. Optimise the SVGs ────────────────────────────────────────────────────
// Mermaid's raw output runs 60–250 KB per diagram — mostly redundant attributes
// and full-precision path coordinates. svgo takes ~80% off with no visible
// difference, which matters when 61 of the 106 pages carry one and the page they
// sit on just had 100 KB of fonts cut out of it for the same reason.
// Same `npx -y` treatment as mermaid-cli: a tool the build must never depend on.
if (!skipDiagrams && missing.length > 0) {
  const before = await dirBytes(DIAGRAM_DIR);
  try {
    await execFileAsync("npx", ["-y", "svgo", "--multipass", "-q", "-f", DIAGRAM_DIR], {
      timeout: 600_000,
      cwd: root,
    });
    const after = await dirBytes(DIAGRAM_DIR);
    console.log(
      `  optimised: ${(before / 1e6).toFixed(1)} MB -> ${(after / 1e6).toFixed(1)} MB (${Math.round((1 - after / before) * 100)}% smaller)`,
    );
  } catch (err) {
    console.warn(`  ! svgo failed, keeping unoptimised SVGs: ${String(err.message).split("\n")[0]}`);
  }
}

// Drop SVGs whose diagram no longer appears anywhere in the curriculum.
for (const file of await readdir(DIAGRAM_DIR)) {
  if (file.endsWith(".svg") && !wanted.has(file.slice(0, -4))) {
    await rm(join(DIAGRAM_DIR, file), { force: true });
  }
}

// ── 4. Record provenance ─────────────────────────────────────────────────────
const { stdout: sha } = await execFileAsync("git", ["rev-parse", "HEAD"], { cwd: source });
await writeFile(
  join(CONTENT, "SOURCE.json"),
  JSON.stringify(
    { repo: "ayeshakhalid192007-dev/LoopEngineering-CrashCourse", commit: sha.trim(), syncedAt: new Date().toISOString(), files: copied },
    null,
    2,
  ) + "\n",
);

const size = await stat(CONTENT);
console.log(`Synced from ${source} @ ${sha.trim().slice(0, 8)}`);
void size;
