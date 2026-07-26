/**
 * The route model for the vendored curriculum in content/.
 *
 * Read at build time only — every page is prerendered by `output: "export"`, so
 * node:fs here never reaches the client. The whole tree is walked once and cached
 * in module scope, because generateStaticParams, generateMetadata and the page
 * body each need it and Next calls them per route.
 *
 * URLs are hand-mapped rather than derived from the directory names. The course
 * repo orders its folders with numeric prefixes (03-part-1-the-shift) which are
 * meaningful to someone browsing the repo and meaningless in a URL — nobody
 * searches for "03 part 1". The mapping below is the one place that translation
 * happens, and it is the contract the sitemap, llms.txt and internal links all
 * read from.
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join, posix } from "node:path";

const CONTENT = join(process.cwd(), "content");

export const REPO = "https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse";
const BRANCH = "main";

/**
 * Content directory → URL path. Anything not listed falls through to a slugified
 * version of its own path, which is what carries the 21 per-kit starter folders.
 */
const DIR_URL: Record<string, string> = {
  docs: "/curriculum",
  "docs/00-start-here": "/start-here",
  "docs/01-prerequisites": "/prerequisites",
  "docs/02-foundations": "/foundations",
  "docs/03-part-1-the-shift": "/parts/the-shift",
  "docs/04-part-2-heartbeat": "/parts/heartbeat",
  "docs/05-part-3-the-body": "/parts/the-body",
  "docs/06-part-4-the-spine": "/parts/the-spine",
  "docs/07-part-5-complete-loop": "/parts/complete-loop",
  "docs/08-part-6-human-control": "/parts/human-control",
  "docs/09-methods": "/methods",
  "docs/10-operating": "/operating",
  "docs/advanced": "/advanced",
  "docs/appendix": "/appendix",
  "docs/appendix/cheatsheets": "/appendix/cheatsheets",
  "docs/assessments": "/certification",
  "docs/projects": "/projects",
  "docs/projects/solutions": "/projects/solutions",
  patterns: "/patterns",
  starters: "/starters",
};

/**
 * Top-level groupings for navigation and breadcrumbs, in teaching order.
 * `href` is the section's own index page; `match` is the URL prefix its pages share.
 */
export interface Section {
  label: string;
  href: string;
  match: string;
}

export const SECTIONS: Section[] = [
  { label: "Start here", href: "/start-here", match: "/start-here" },
  { label: "Prerequisites", href: "/prerequisites", match: "/prerequisites" },
  { label: "Foundations", href: "/foundations", match: "/foundations" },
  { label: "The Shift", href: "/parts/the-shift", match: "/parts/the-shift" },
  { label: "Heartbeat", href: "/parts/heartbeat", match: "/parts/heartbeat" },
  { label: "The Body", href: "/parts/the-body", match: "/parts/the-body" },
  { label: "The Spine", href: "/parts/the-spine", match: "/parts/the-spine" },
  { label: "Complete Loop", href: "/parts/complete-loop", match: "/parts/complete-loop" },
  { label: "Human Control", href: "/parts/human-control", match: "/parts/human-control" },
  { label: "Methods", href: "/methods", match: "/methods" },
  { label: "Operating", href: "/operating", match: "/operating" },
  { label: "Advanced", href: "/advanced", match: "/advanced" },
  { label: "Projects", href: "/projects", match: "/projects" },
  { label: "Certification", href: "/certification", match: "/certification" },
  { label: "Patterns", href: "/patterns", match: "/patterns" },
  { label: "Starter kits", href: "/starters", match: "/starters" },
  { label: "Appendix", href: "/appendix", match: "/appendix" },
  { label: "Curriculum map", href: "/curriculum", match: "/curriculum" },
];

export interface DocPage {
  /** Route segments, e.g. ["parts", "the-shift", "anatomy-of-a-loop"]. */
  slug: string[];
  /** Site-absolute path with a trailing slash, matching `trailingSlash: true`. */
  url: string;
  title: string;
  /** First prose paragraph, trimmed for a meta description. */
  description: string;
  /** Path under content/, e.g. "docs/02-foundations/glossary.md". */
  sourcePath: string;
  /** The same file on GitHub — kept as the secondary "view source" link. */
  githubUrl: string;
  markdown: string;
  section: Section | undefined;
  /** True for a directory's README, which becomes that directory's index page. */
  isIndex: boolean;
  /** Sort key from the numeric filename prefix; READMEs sort first. */
  order: number;
}

/** "01-from-prompting-to-looping" → "from-prompting-to-looping". */
function slugifyFile(name: string): string {
  return name.replace(/\.md$/, "").replace(/^\d+[a-z]?[-_]/i, "").toLowerCase();
}

/** URL path for a content directory, falling back to slugified segments. */
function urlForDir(dir: string): string {
  if (DIR_URL[dir]) return DIR_URL[dir];
  const parent = dir.split("/").slice(0, -1).join("/");
  const last = dir.split("/").slice(-1)[0];
  return `${urlForDir(parent)}/${slugifyFile(last)}`;
}

/** First `# H1`, else the first heading of any level, else the slug. */
function extractTitle(md: string, fallback: string): string {
  const h1 = md.match(/^#\s+(.+?)\s*$/m);
  if (h1) return stripInline(h1[1]);
  const any = md.match(/^#{2,6}\s+(.+?)\s*$/m);
  return any ? stripInline(any[1]) : fallback;
}

/** Strip the markdown inline syntax that would otherwise land in a <title>. */
function stripInline(s: string): string {
  return s
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * The first real paragraph, used as the meta description.
 *
 * Skips the things these docs open with — a banner image, the H1, blockquote
 * callouts, tables, and fenced code — so the description is prose a human wrote
 * about the topic, not "| Step | Page | One-line takeaway |".
 */
function extractDescription(md: string): string {
  const body = md.replace(/^```[\s\S]*?^```/gm, "");
  const blocks = body.split(/\n{2,}/);
  for (const raw of blocks) {
    const block = raw.trim();
    if (!block) continue;
    if (block.startsWith("#")) continue;
    if (block.startsWith("!")) continue;
    if (block.startsWith("|") || block.startsWith("---")) continue;
    if (block.startsWith("<")) continue;

    // A leading blockquote is usually the page's own summary — good description
    // material, just needs its "> " markers removed.
    const text = stripInline(block.replace(/^>\s?/gm, ""));
    if (text.length < 40) continue;
    return text.length > 155 ? text.slice(0, 152).replace(/\s+\S*$/, "") + "…" : text;
  }
  return "";
}

function walk(dir: string, base: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.name.endsWith(".md")) out.push(posix.relative(base, full.split("\\").join("/")));
  }
  return out;
}

function build(): DocPage[] {
  if (!existsSync(CONTENT)) return [];

  return walk(CONTENT, CONTENT.split("\\").join("/"))
    .map((sourcePath): DocPage => {
      const parts = sourcePath.split("/");
      const file = parts.pop()!;
      const dir = parts.join("/");
      const isIndex = file.toLowerCase() === "readme.md";

      const dirUrl = urlForDir(dir);
      const url = (isIndex ? dirUrl : `${dirUrl}/${slugifyFile(file)}`) + "/";
      const markdown = readFileSync(join(CONTENT, sourcePath), "utf8");
      const orderMatch = file.match(/^(\d+)/);

      return {
        slug: url.replace(/^\/|\/$/g, "").split("/"),
        url,
        title: extractTitle(markdown, slugifyFile(file)),
        description: extractDescription(markdown),
        sourcePath,
        githubUrl: `${REPO}/blob/${BRANCH}/${sourcePath}`,
        markdown,
        section: SECTIONS.find((s) => url === s.match + "/" || url.startsWith(s.match + "/")),
        isIndex,
        order: isIndex ? -1 : orderMatch ? Number(orderMatch[1]) : 500,
      };
    })
    .sort((a, b) => a.url.localeCompare(b.url));
}

/**
 * Blurbs for the sections the course repo has no README for.
 *
 * Four of its folders — 01-prerequisites, 09-methods, 10-operating, appendix —
 * hold pages but no index. On GitHub that is fine, because a folder listing IS an
 * index. On a website it is a hole: every one of the 150 sidebars links to those
 * four hubs, so without them the site ships ~580 links to nothing. These are the
 * only words on the site not lifted from the curriculum.
 */
const SECTION_INTROS: Record<string, string> = {
  "/prerequisites":
    "What to have in place before the first loop runs: a working agentic coding setup, the spec-driven habits the course assumes, and a primer on agentic coding itself. Skip whichever you already know.",
  "/methods":
    "The reusable procedures — how to choose a pattern, how to check a loop design before you run it, and how to scaffold a new loop from a template. These are the pages you come back to, not the ones you read once.",
  "/operating":
    "Running loops in anger: the failure modes, the anti-patterns, what observability a loop needs, how to recover one that has gone wrong, and how to keep an infinite loop from being infinite.",
  "/appendix":
    "Reference material — per-tool cheatsheets for Claude Code, Codex, Cursor, OpenCode, Windsurf and Grok, plus the routines reference.",
};

/**
 * Build an index page for a section that has no README in the course repo, listing
 * its pages. Generated as markdown so it goes through exactly the same renderer,
 * styling and metadata path as every authored page.
 */
function synthesizeIndex(section: Section, pages: DocPage[]): DocPage {
  const intro = SECTION_INTROS[section.match] ?? "";
  const body = pages
    .sort((a, b) => a.order - b.order || a.url.localeCompare(b.url))
    .map((p) => `- [${p.title}](${p.url})${p.description ? ` — ${p.description}` : ""}`)
    .join("\n");

  return {
    slug: section.match.replace(/^\//, "").split("/"),
    url: section.match + "/",
    title: section.label,
    description: intro,
    // No source file — this page has no counterpart in the course repo, so the
    // "view source" link points at the nearest thing that does: the folder.
    sourcePath: `${section.match.replace(/^\//, "")}/index.md`,
    githubUrl: REPO,
    markdown: `# ${section.label}\n\n> ${intro}\n\n${body}\n`,
    section,
    isIndex: true,
    order: -1,
  };
}

let cache: DocPage[] | null = null;

export function allDocs(): DocPage[] {
  if (!cache) {
    const pages = build();
    const have = new Set(pages.map((p) => p.url));
    for (const section of SECTIONS) {
      if (have.has(section.match + "/")) continue;
      const children = pages.filter((p) => p.url.startsWith(section.match + "/"));
      if (children.length) pages.push(synthesizeIndex(section, children));
    }
    cache = pages.sort((a, b) => a.url.localeCompare(b.url));
  }
  return cache;
}

export function docByUrl(url: string): DocPage | undefined {
  return allDocs().find((d) => d.url === url);
}

/** Pages in a section, in reading order — drives the sidebar and prev/next. */
export function sectionPages(section: Section): DocPage[] {
  return allDocs()
    .filter((d) => d.url === section.match + "/" || d.url.startsWith(section.match + "/"))
    .sort((a, b) => a.order - b.order || a.url.localeCompare(b.url));
}

/**
 * Resolve a relative link found inside a doc to a site URL.
 *
 * Returns an internal path when the target is a page we publish, and the GitHub
 * blob URL when it is not (the starter scaffolds, LICENSE, and anything else that
 * deliberately stays in the repo). Returning null means "leave the href alone".
 */
export function resolveDocLink(fromSourcePath: string, href: string): string | null {
  if (/^([a-z]+:|#|\/\/)/i.test(href)) return null;
  // Already a site-absolute route — the synthesized section indexes below write
  // these directly, and there is nothing to resolve.
  if (href.startsWith("/")) return href;

  const [pathPart, hash = ""] = href.split("#");
  if (!pathPart) return null;

  const fromDir = posix.dirname(fromSourcePath);
  const target = posix.normalize(posix.join(fromDir, pathPart)).replace(/^\.\//, "");

  // ../../assets/the-shift.svg — synced into public/course-assets by sync-docs.
  const asset = target.match(/^(?:\.\.\/)*assets\/(.+)$/);
  if (asset) return `/course-assets/${asset[1]}`;

  // A path that climbed above content/ points into the repo, not into the site.
  if (target.startsWith("..")) {
    return `${REPO}/blob/${BRANCH}/${target.replace(/^(?:\.\.\/)+/, "")}${hash ? "#" + hash : ""}`;
  }

  const page = allDocs().find((d) => d.sourcePath === target);
  if (page) return page.url + (hash ? "#" + hash : "");

  if (target.endsWith(".md")) return `${REPO}/blob/${BRANCH}/${target}${hash ? "#" + hash : ""}`;
  return `${REPO}/blob/${BRANCH}/${target}`;
}
