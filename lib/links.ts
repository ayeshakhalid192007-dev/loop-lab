/**
 * Every URL on the site lives here — no hardcoded hrefs in components.
 *
 * These used to all point at github.com. The audit's finding was blunt: 77 anchors
 * on the homepage, zero of them internal, 70 of them to github.com. Every citation
 * an AI engine made and every unit of PageRank the site generated was handed to a
 * domain we do not own, for content we wrote.
 *
 * Now that the curriculum is published as routes (see lib/docs.ts), the primary
 * link for anything we publish is our own page, and github.com survives only as the
 * secondary "view source" link on each page and as the repo/clone CTA — which is
 * correct, because forking the repo genuinely is the call to action.
 *
 * The internal paths below are asserted against the built route table by
 * scripts/check-links.mjs, so a renamed curriculum folder fails the check rather
 * than silently emitting a 404.
 */

const REPO = "https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse";
const BRANCH = "main";

/** A single file on GitHub (…/blob/main/<path>) — the "view source" form. */
export const doc = (path: string) => `${REPO}/blob/${BRANCH}/${path}`;

/**
 * A folder's rendered index on GitHub (…/blob/main/<path>/README.md).
 *
 * Deliberately NOT a /tree/ URL — github.com/robots.txt disallows tree paths under
 * every owner, so each such link was a dead end for crawlers. /blob/ is allowed.
 */
export const folder = (path: string) => `${REPO}/blob/${BRANCH}/${path}/README.md`;

export const links = {
  repo: REPO,
  clone: `${REPO}.git`,

  /** Course entry points — all internal now. */
  startCourse: "/start-here/",
  learningTracks: "/start-here/learning-tracks/",
  curriculum: "/curriculum/",
  foundations: "/foundations/",
  glossary: "/foundations/glossary/",
  concepts: "/foundations/concepts/",
  primitives: "/foundations/primitives/",

  /** Build / reference destinations. */
  patterns: "/patterns/",
  starters: "/starters/",
  projects: "/projects/",
  certification: "/certification/",
  methods: "/methods/",
  operating: "/operating/",
  advanced: "/advanced/",
  about: "/about/",

  /** The first hands-on project, linked from Get started. */
  firstProject: "/projects/a-watch-loop/",

  /** Genuinely external: the licence file and the repo itself. */
  license: doc("LICENSE"),
} as const;

export type Links = typeof links;
