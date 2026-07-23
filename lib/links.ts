/**
 * Every external URL on the site lives here — no hardcoded hrefs in components.
 * All targets point at the course repo on GitHub. Rename a folder there, fix it once
 * here. Paths below were taken from the repo's real `main` tree, so each one resolves
 * to a genuine file/folder.
 */

const REPO = "https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse";
const BRANCH = "main";

/** A single file on GitHub (…/blob/main/<path>). */
export const doc = (path: string) => `${REPO}/blob/${BRANCH}/${path}`;

/** A folder on GitHub (…/tree/main/<path>). */
export const folder = (path: string) => `${REPO}/tree/${BRANCH}/${path}`;

export const links = {
  repo: REPO,
  clone: `${REPO}.git`,

  /** Hero: the course entry point. */
  startCourse: doc("docs/00-start-here/README.md"),
  learningTracks: doc("docs/00-start-here/learning-tracks.md"),

  /** Footer / GetStarted destinations. */
  patterns: folder("patterns"),
  starters: folder("starters"),
  projects: folder("docs/projects"),
  assessments: folder("docs/assessments"),
  foundations: folder("docs/02-foundations"),
  license: doc("LICENSE"),
} as const;

export type Links = typeof links;
