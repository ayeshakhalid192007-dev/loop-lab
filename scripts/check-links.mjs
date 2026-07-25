/**
 * Verifies every internal link in the static export resolves to a real file.
 *
 * The curriculum is vendored from another repo, and its internal links are
 * rewritten from relative markdown paths to site routes at build time. That
 * rewrite is driven by a hand-written directory map in lib/docs.ts, so renaming a
 * folder in the course repo — an ordinary thing to do — silently turns links into
 * 404s that nothing else would catch until a crawler found them.
 *
 * Also reports the internal/outbound ratio on the homepage, which is the number
 * the audit was actually about: it was 0 internal against 70 to github.com.
 *
 * Usage: npm run build && node scripts/check-links.mjs
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, "out");
const basePath = process.env.PAGES_BASE_PATH || "";

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "_next") continue;
      out.push(...(await htmlFiles(full)));
    } else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

const isFile = async (p) => !!(await stat(p).catch(() => null))?.isFile();

/**
 * A site path resolves if it is a real file, or a directory holding an index.html.
 *
 * The file check must be isFile(), not merely "stat succeeds": a section directory
 * like out/methods/ exists because its child pages do, while having no index.html
 * of its own. Treating that as resolved hides exactly the bug this script is for —
 * a hub page every one of the 150 sidebars links to that was never generated.
 */
async function resolves(path) {
  const clean = path.replace(/[?#].*$/, "");
  if (basePath && !clean.startsWith(basePath)) return false; // missing basePath
  const rel = basePath ? clean.slice(basePath.length) : clean;
  const target = join(OUT, rel);
  if (await isFile(join(target, "index.html"))) return true;
  return isFile(target);
}

const files = await htmlFiles(OUT);
const broken = [];
let checked = 0;

for (const file of files) {
  const html = await readFile(file, "utf8");
  const refs = [
    ...[...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/src="(\/[^"]*)"/g)].map((m) => m[1]),
  ].filter((u) => !u.startsWith("/_next/"));

  for (const ref of new Set(refs)) {
    checked++;
    if (!(await resolves(ref))) {
      broken.push({ file: file.replace(OUT + "/", ""), ref });
    }
  }
}

// The headline number from the audit, recomputed.
const home = await readFile(join(OUT, "index.html"), "utf8");
const anchors = [...home.matchAll(/<a\s[^>]*href="([^"]+)"/g)].map((m) => m[1]);
const internal = anchors.filter((h) => h.startsWith("/") || h.startsWith("#")).length;
const github = anchors.filter((h) => h.includes("github.com")).length;

console.log(`Pages:      ${files.length}`);
console.log(`Refs:       ${checked} internal href/src checked`);
console.log(`Homepage:   ${anchors.length} anchors — ${internal} internal, ${github} to github.com`);

if (broken.length) {
  console.error(`\n${broken.length} broken internal link(s):`);
  for (const b of broken.slice(0, 40)) console.error(`  ${b.file}  ->  ${b.ref}`);
  if (broken.length > 40) console.error(`  … and ${broken.length - 40} more`);
  process.exit(1);
}
console.log("\nAll internal links resolve.");
