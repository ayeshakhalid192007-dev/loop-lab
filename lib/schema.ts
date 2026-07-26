/**
 * Shared JSON-LD identity for the whole site.
 *
 * Every node the site emits — the landing page graph, and one LearningResource per
 * curriculum page — cross-references the same three @ids. That is what makes 150
 * pages read as one course by one author rather than 150 unrelated documents, and
 * it means the Organization and Person are described once, here, instead of being
 * re-stated (and drifting) on every page.
 */

export const SITE = "https://ayeshakhalid192007-dev.github.io/loop-lab/";

export const COURSE_ID = `${SITE}#course`;
export const ORG_ID = `${SITE}#org`;
export const WEBSITE_ID = `${SITE}#website`;

/** First commit on the curriculum repo, and the last content sync. */
export const DATE_PUBLISHED = "2026-07-16";
export const DATE_MODIFIED = "2026-07-25";

/** One entry per maintainer — name, initials for the avatar, and their GitHub profile. */
export const MAINTAINER_PROFILES = [
  { name: "Ayesha Khalid", initials: "AK", github: "https://github.com/ayeshakhalid192007-dev" },
  { name: "Saram Ali", initials: "SA", github: "https://github.com/SARAMALI15792" },
] as const;

export const MAINTAINER_NAMES = MAINTAINER_PROFILES.map((m) => m.name);
export const MAINTAINERS_LABEL = MAINTAINER_NAMES.join(" & ");

/**
 * Organization. Was `name` + `url` only — the weakest kind of node, since it gives
 * Google nothing to attach a knowledge panel to. `logo` is what Google's own
 * guidance asks for and what a panel image is drawn from.
 */
export const organization = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Loop Engineering Crash Course",
  url: SITE,
  logo: {
    "@type": "ImageObject",
    url: `${SITE}icon.svg`,
    caption: "Loop Engineering",
  },
  image: `${SITE}og.png`,
  description:
    "Publisher of the Loop Engineering Crash Course — a free, MIT-licensed curriculum on designing agent loops: heartbeats, checkers, durable state, and human gates.",
  sameAs: [
    "https://github.com/ayeshakhalid192007-dev",
    "https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse",
  ],
} as const;

/**
 * Maintainers, one Person node each. `url` points at the shared /about/ page
 * rather than back at the course homepage — a Person whose url is the thing
 * they maintain gives a search engine no separate entity to resolve.
 */
export const maintainers = MAINTAINER_PROFILES.map((m) => ({
  "@type": "Person",
  "@id": `${SITE}#maintainer-${m.name.toLowerCase().replace(/\s+/g, "-")}`,
  name: m.name,
  url: `${SITE}about/`,
  sameAs: [m.github],
}));

export const MAINTAINER_IDS = maintainers.map((m) => m["@id"]);

/**
 * The six parts, as real URLs.
 *
 * Before the curriculum was published as routes these existed only as <h3> prose
 * on the landing page, so the course's structure was invisible to anything that
 * reads markup. Each entry is a LearningResource the crawler can actually follow.
 */
export const COURSE_PARTS: { name: string; path: string; description: string }[] = [
  {
    name: "Part 1 · The Shift",
    path: "parts/the-shift/",
    description:
      "From prompting to looping: what changes, which of the four layers you are standing in, and the six-part anatomy every loop shares.",
  },
  {
    name: "Part 2 · Heartbeat",
    path: "parts/heartbeat/",
    description:
      "The four ways a loop starts a beat: in-session, conditional run-until-done, unattended schedules, and event-driven triggers.",
  },
  {
    name: "Part 3 · The Body",
    path: "parts/the-body/",
    description:
      "What a loop may do and touch: worktrees for isolation, skills, MCP connectors, and the maker–checker split.",
  },
  {
    name: "Part 4 · The Spine",
    path: "parts/the-spine/",
    description:
      "Durable state between runs — the state file and run log that let an interrupted loop resume instead of restarting.",
  },
  {
    name: "Part 5 · The Complete Loop",
    path: "parts/complete-loop/",
    description:
      "Building the same loop twice, once in Claude Code and once in OpenCode, to separate the pattern from the tool.",
  },
  {
    name: "Part 6 · Human Control",
    path: "parts/human-control/",
    description:
      "Staying the engineer: the three nested loops, verification, cost management, and where a person decides.",
  },
];

export const courseParts = COURSE_PARTS.map((part, i) => ({
  "@type": "LearningResource",
  "@id": `${SITE}${part.path}#page`,
  position: i + 1,
  name: part.name,
  description: part.description,
  url: `${SITE}${part.path}`,
  isPartOf: { "@id": COURSE_ID },
}));
