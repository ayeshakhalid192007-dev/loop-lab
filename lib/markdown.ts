/**
 * Markdown → HTML for the curriculum pages. Build-time only.
 *
 * Three things this does beyond a stock `marked` call, each of them the reason
 * publishing the docs is worth anything:
 *
 * 1. Rewrites relative links. A doc that says `[Part 2](../04-part-2-heartbeat/README.md)`
 *    becomes a link to /parts/heartbeat/ — an internal link. Left alone it would
 *    404, and pointed at GitHub it would keep handing our own PageRank away, which
 *    is the exact problem this whole exercise exists to fix.
 * 2. Swaps mermaid fences for the SVGs pre-rendered by scripts/sync-docs.mjs, so
 *    diagrams cost zero client JS.
 * 3. Adds stable heading ids, so every H2/H3 in the glossary is directly linkable —
 *    which is what makes a definition citable by an AI engine and linkable from a
 *    SERP.
 *
 * No sanitiser: the input is our own curriculum, vendored from a repo we control,
 * and marked is configured without raw-HTML passthrough for anything user-supplied.
 */
import { Marked, type Tokens } from "marked";
import GithubSlugger from "github-slugger";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { resolveDocLink } from "@/lib/docs";
import { withBasePath } from "@/lib/base-path";

/**
 * Rendered diagrams live at public/diagrams/<hash>.svg, and that file existing is
 * the whole truth about whether a diagram rendered.
 *
 * This used to consult a content/diagrams.json written by sync-docs. That index
 * was a second copy of the same fact — and it could disagree with the filesystem.
 * It did: all 64 SVGs were rendered and committed while the index was committed as
 * `{}`, so every page silently fell back to printing mermaid source as a code
 * block. Reading the directory removes the class of bug rather than that instance.
 */
const DIAGRAM_DIR = join(process.cwd(), "public", "diagrams");
const rendered = new Set(
  existsSync(DIAGRAM_DIR)
    ? readdirSync(DIAGRAM_DIR)
        .filter((f) => f.endsWith(".svg"))
        .map((f) => f.slice(0, -4))
    : [],
);

/**
 * Assets sync-docs rewrote — the raster-in-SVG banners it unwrapped to WebP.
 * The markdown still says `../../assets/the-shift.svg`, so without this the six
 * part pages would each request a file that no longer exists.
 */
const ASSET_INDEX = join(process.cwd(), "content", "assets.json");
const assetRewrites: Record<string, string> = existsSync(ASSET_INDEX)
  ? JSON.parse(readFileSync(ASSET_INDEX, "utf8"))
  : {};

function rewriteAsset(url: string): string {
  const match = url.match(/^\/course-assets\/(.+)$/);
  const renamed = match && assetRewrites[match[1]];
  return renamed ? `/course-assets/${renamed}` : url;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

export interface RenderedDoc {
  html: string;
  /** H2/H3s, for the on-page table of contents. */
  headings: Heading[];
}

export function renderMarkdown(markdown: string, sourcePath: string): RenderedDoc {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      /**
       * The H1 is dropped: the page shell renders the title as the document's
       * single <h1>, and a second one in the body would put two competing top-level
       * headings in the outline. Everything else is demoted one level so the
       * document outline is H1 → H2 → H3 rather than H1 → H1 → H2.
       */
      heading({ tokens, depth }: Tokens.Heading) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "").trim();
        if (depth === 1) return "";

        const id = slugger.slug(plain);
        if (depth <= 4) headings.push({ depth: depth - 1, text: plain, id });
        return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}">${text}</a></h${depth}>\n`;
      },

      link({ href, title, tokens }: Tokens.Link) {
        const text = this.parser.parseInline(tokens);
        const resolved = resolveDocLink(sourcePath, href) ?? href;
        const external = /^https?:\/\//i.test(resolved);
        const attrs = [
          `href="${escapeHtml(withBasePath(resolved))}"`,
          title ? `title="${escapeHtml(title)}"` : "",
          external ? 'target="_blank" rel="noopener noreferrer"' : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<a ${attrs}>${text}</a>`;
      },

      image({ href, title, text }: Tokens.Image) {
        const resolved = rewriteAsset(resolveDocLink(sourcePath, href) ?? href);
        // Explicit dimensions are unavailable for these SVGs, so the CSS gives
        // .doc-figure a fixed aspect box instead — that is what keeps CLS at zero.
        return `<img src="${escapeHtml(withBasePath(resolved))}" alt="${escapeHtml(text ?? "")}"${
          title ? ` title="${escapeHtml(title)}"` : ""
        } loading="lazy" decoding="async" class="doc-figure" />`;
      },

      code({ text, lang }: Tokens.Code) {
        if (lang === "mermaid") {
          const hash = createHash("sha256").update(text.trim()).digest("hex").slice(0, 16);
          if (rendered.has(hash)) {
            return `<figure class="doc-diagram"><img src="${withBasePath(`/diagrams/${hash}.svg`)}" alt="Diagram" loading="lazy" decoding="async" /></figure>\n`;
          }
          // Unrendered diagram (sync ran with --skip-diagrams, or mermaid choked on
          // it). Showing the source beats showing nothing, and it stays indexable.
          return `<pre class="doc-code" data-lang="mermaid"><code>${escapeHtml(text)}</code></pre>\n`;
        }
        const langAttr = lang ? ` data-lang="${escapeHtml(lang)}"` : "";
        const cls = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        return `<pre class="doc-code"${langAttr}><code${cls}>${escapeHtml(text)}</code></pre>\n`;
      },

      table(token: Tokens.Table) {
        // Same reasoning as the patterns table on the landing page: a wide table
        // has to scroll inside its own box or it drags the whole page sideways on
        // mobile. tabIndex keeps that scroll reachable from the keyboard.
        const header = token.header
          .map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`)
          .join("");
        const body = token.rows
          .map(
            (row) =>
              `<tr>${row.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join("")}</tr>`,
          )
          .join("");
        return `<div class="doc-table-scroll" tabindex="0" role="region" aria-label="Table"><table><thead><tr>${header}</tr></thead><tbody>${body}</tbody></table></div>\n`;
      },
    },
  });

  const html = marked.parse(markdown, { async: false }) as string;
  return { html, headings };
}
