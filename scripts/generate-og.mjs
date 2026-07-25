/**
 * Renders the Open Graph card to a real `public/og.png` before `next build`.
 *
 * Why this is a script and not `app/opengraph-image.tsx`:
 * Next's file convention emits the image at the extensionless route
 * `out/opengraph-image`. GitHub Pages derives Content-Type from the file
 * extension, so that route was served as `application/octet-stream` while the
 * markup claimed `image/png` — a mismatch that makes some crawlers and social
 * scrapers drop the card. Writing a genuine `.png` into `public/` gives the
 * file an extension, so Pages serves `image/png` and the markup is honest.
 *
 * Uses React.createElement rather than JSX so this runs under plain `node`
 * with no build step. Same layout and palette as the route it replaced.
 *
 * The 1280x640 second output is the GitHub repo social preview (audit item M5),
 * which has to be uploaded by hand under Settings -> Social preview.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement as h } from "react";
// `next/og.js`, not `next/og` — the bare specifier only resolves through Next's
// own bundler, and this script runs under plain node.
import { ImageResponse } from "next/og.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Lifted from app/globals.css so the card cannot drift from the site's palette.
const INK = "#10120C";
const CREAM = "#DBC2A6";
const SAND = "#A5997F";
const BRONZE = "#99744A";
const OLIVE = "#414A37";

/** One card. `scale` lets the 1280x640 variant reuse the 1200x630 type ramp. */
function Card({ width }) {
  const scale = width / 1200;
  const px = (n) => Math.round(n * scale);

  return h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: INK,
        color: CREAM,
        padding: px(80),
        fontFamily: "sans-serif",
      },
    },
    h(
      "div",
      { style: { display: "flex", alignItems: "center", gap: px(18) } },
      h("div", {
        style: {
          width: px(30),
          height: px(30),
          borderRadius: 9999,
          background: BRONZE,
          border: `${Math.max(2, px(3))}px solid ${OLIVE}`,
        },
      }),
      h("div", { style: { fontSize: px(30), color: SAND } }, "Loop Engineering"),
    ),
    h(
      "div",
      { style: { display: "flex", flexDirection: "column" } },
      h("div", { style: { fontSize: px(82), fontWeight: 800, lineHeight: 1.05 } }, "Stop prompting."),
      h("div", { style: { fontSize: px(82), fontWeight: 800, lineHeight: 1.05 } }, "Start looping."),
      h(
        "div",
        { style: { marginTop: px(28), fontSize: px(32), color: SAND } },
        "A hands-on crash course in loop engineering · MIT",
      ),
    ),
    h(
      "div",
      { style: { fontSize: px(26), color: BRONZE } },
      "6 parts · 20 starter kits · 11 projects",
    ),
  );
}

async function render(outPath, width, height) {
  const res = new ImageResponse(Card({ width }), { width, height });
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, buf);
  console.log(`  ${outPath.replace(root + "/", "")}  ${width}x${height}  ${(buf.length / 1024).toFixed(1)} KB`);
}

console.log("Generating social cards…");
await render(join(root, "public", "og.png"), 1200, 630);
await render(join(root, "assets", "social-preview.png"), 1280, 640);
