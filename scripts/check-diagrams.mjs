/**
 * Verify every mermaid diagram in the curriculum actually rendered.
 *
 * Companion to check-links.mjs, and written because the failure it guards against
 * is silent: lib/markdown.ts falls back to printing the mermaid source as a code
 * block when it cannot find a rendered SVG. That fallback is deliberate — one bad
 * diagram should not blank a page — but it means a *total* rendering failure looks
 * like a successful build that happens to show 64 walls of code to readers.
 *
 * Run after `npm run build`.
 *
 *   node scripts/check-diagrams.mjs
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";

const CONTENT = "content";
const OUT = "out";
const DIAGRAM_DIR = join("public", "diagrams");

// Must stay identical to the pattern in sync-docs.mjs and the hashing in
// lib/markdown.ts — all three key off the same digest of the same source text.
const MERMAID = /^[ \t]*```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n[ \t]*```[ \t]*$/gm;
const hashOf = (code) =>
  createHash("sha256").update(code.trim()).digest("hex").slice(0, 16);

function walk(dir, test, hits = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, test, hits);
    else if (test(e.name)) hits.push(p);
  }
  return hits;
}

// 1. Every mermaid block in the source has a rendered SVG.
const wanted = new Map();
for (const f of walk(CONTENT, (n) => n.endsWith(".md"))) {
  for (const m of readFileSync(f, "utf8").matchAll(MERMAID)) {
    wanted.set(hashOf(m[1]), f);
  }
}
const unrendered = [...wanted].filter(([h]) => !existsSync(join(DIAGRAM_DIR, `${h}.svg`)));

// 2. The built pages show figures, not the fallback code block. This is the check
//    that actually catches an empty index: the SVGs can all be present and the
//    pages still render every one of them as source.
let figures = 0;
let fallbacks = 0;
if (existsSync(OUT)) {
  for (const f of walk(OUT, (n) => n === "index.html")) {
    const html = readFileSync(f, "utf8");
    figures += (html.match(/class="doc-diagram"/g) ?? []).length;
    fallbacks += (html.match(/data-lang="mermaid"/g) ?? []).length;
  }
}

console.log(`Diagrams:   ${wanted.size} in source, ${unrendered.length} without an SVG`);
console.log(`Built HTML: ${figures} rendered figures, ${fallbacks} unrendered fallbacks`);

if (unrendered.length) {
  console.error("\nMermaid blocks with no rendered SVG — run `npm run sync:docs`:");
  for (const [h, f] of unrendered.slice(0, 10)) console.error(`  ${h}  ${f}`);
  if (unrendered.length > 10) console.error(`  … ${unrendered.length - 10} more`);
}
if (fallbacks) {
  console.error(
    `\n${fallbacks} diagram(s) rendered as a source code block instead of an image.` +
      `\nEvery SVG can be present and this still fail — that is the point of the check.`,
  );
}

if (unrendered.length || fallbacks) process.exit(1);
console.log("\nAll diagrams rendered.");
