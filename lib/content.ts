/**
 * All section copy as typed data. Components stay dumb — they render this.
 * Every href is built through the helpers in `lib/links.ts`, so no URL is hardcoded
 * in a component. Repo paths below are real files on the course's `main` branch.
 */
import { doc, folder, links } from "@/lib/links";

export interface NavContent {
  wordmark: string;
  anchors: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export interface HeroContent {
  headline: string;
  lede: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
  featureLine: string;
}

export interface BuildingBlock {
  title: string;
  blurb: string;
  href: string;
}

/** The course's own model of a loop — six parts, from `03-anatomy-of-a-loop.md`. */
export interface LoopPart {
  name: string;
  metaphor: string;
  answers: string;
}

export interface Lesson {
  title: string;
  href: string;
}

export interface CurriculumPart {
  part: string;
  title: string;
  folderHref: string;
  lessons: Lesson[];
  quizHref: string;
  flashcardsHref?: string;
}

export interface PatternCard {
  name: string;
  frequency: string;
  risk: "low" | "medium" | "high";
  patternHref: string;
  starterHref: string;
}

export interface GetStartedStep {
  title: string;
  blurb: string;
  href: string;
}

export const nav: NavContent = {
  wordmark: "Loop Engineering",
  anchors: [
    { label: "Curriculum", href: "#curriculum" },
    { label: "Patterns", href: "#patterns" },
    { label: "Get started", href: "#start" },
  ],
  cta: { label: "View on GitHub", href: links.repo },
};

export const hero: HeroContent = {
  headline: "Stop prompting. Start looping.",
  lede: "A hands-on crash course in loop engineering — building agents that run on a heartbeat, checked by a second pair of eyes, and gated by a human who stays the engineer.",
  primary: { label: "Start the course", href: links.startCourse },
  secondary: { label: "Browse the repo", href: links.repo },
  featureLine: "MIT · 6 parts · 20 starter kits · 11 projects",
};

/** The six primitives (Body layer). Each links to the doc that teaches it. */
export const buildingBlocks: BuildingBlock[] = [
  {
    title: "Scheduling",
    blurb: "Give a loop a heartbeat: timers, conditions, and unattended runs.",
    href: doc("docs/04-part-2-heartbeat/06-unattended-schedules.md"),
  },
  {
    title: "Worktrees",
    blurb: "Isolate each run in its own checkout so parallel loops never collide.",
    href: doc("docs/05-part-3-the-body/08-worktrees.md"),
  },
  {
    title: "Skills",
    blurb: "Package repeatable know-how the agent can load on demand.",
    href: doc("docs/05-part-3-the-body/09-skills.md"),
  },
  {
    title: "Connectors",
    blurb: "Reach real systems over MCP — the hands of the loop.",
    href: doc("docs/05-part-3-the-body/10-connectors-mcp.md"),
  },
  {
    title: "Sub-agents",
    blurb: "A separate checker grades the work — never the maker itself.",
    href: doc("docs/05-part-3-the-body/11-maker-checker.md"),
  },
  {
    title: "State",
    blurb: "A spine that survives between beats: state files and run logs.",
    href: doc("docs/06-part-4-the-spine/12-state-between-runs.md"),
  },
];

/** The eight-of-record is actually six — the course's anatomy of a loop. */
export const loopParts: LoopPart[] = [
  { name: "Heartbeat", metaphor: "pulse", answers: "When does a beat start?" },
  { name: "Body", metaphor: "hands", answers: "What may it do and touch?" },
  { name: "Spine", metaphor: "memory", answers: "What survives between beats?" },
  { name: "Stopping condition", metaphor: "finish line", answers: "How does it provably end?" },
  { name: "Checker", metaphor: "second pair of eyes", answers: "Who grades the work?" },
  { name: "Human gate", metaphor: "signature", answers: "Where does a person decide?" },
];

export const curriculum: CurriculumPart[] = [
  {
    part: "Part 1",
    title: "The Shift",
    folderHref: folder("docs/03-part-1-the-shift"),
    lessons: [
      { title: "From Prompting to Looping", href: doc("docs/03-part-1-the-shift/01-from-prompting-to-looping.md") },
      { title: "The Four Layers", href: doc("docs/03-part-1-the-shift/02-the-four-layers.md") },
      { title: "Anatomy of a Loop", href: doc("docs/03-part-1-the-shift/03-anatomy-of-a-loop.md") },
    ],
    quizHref: doc("docs/03-part-1-the-shift/quiz.md"),
    flashcardsHref: doc("docs/03-part-1-the-shift/flashcards.md"),
  },
  {
    part: "Part 2",
    title: "Heartbeat",
    folderHref: folder("docs/04-part-2-heartbeat"),
    lessons: [
      { title: "In-Session Loops", href: doc("docs/04-part-2-heartbeat/04-in-session-loops.md") },
      { title: "Conditional: Run Until Done", href: doc("docs/04-part-2-heartbeat/05-conditional-run-until-done.md") },
      { title: "Unattended Schedules", href: doc("docs/04-part-2-heartbeat/06-unattended-schedules.md") },
      { title: "Event-Driven", href: doc("docs/04-part-2-heartbeat/07-event-driven.md") },
    ],
    quizHref: doc("docs/04-part-2-heartbeat/quiz.md"),
    flashcardsHref: doc("docs/04-part-2-heartbeat/flashcards.md"),
  },
  {
    part: "Part 3",
    title: "The Body",
    folderHref: folder("docs/05-part-3-the-body"),
    lessons: [
      { title: "Worktrees", href: doc("docs/05-part-3-the-body/08-worktrees.md") },
      { title: "Skills", href: doc("docs/05-part-3-the-body/09-skills.md") },
      { title: "Connectors (MCP)", href: doc("docs/05-part-3-the-body/10-connectors-mcp.md") },
      { title: "Maker–Checker", href: doc("docs/05-part-3-the-body/11-maker-checker.md") },
    ],
    quizHref: doc("docs/05-part-3-the-body/quiz.md"),
    flashcardsHref: doc("docs/05-part-3-the-body/flashcards.md"),
  },
  {
    part: "Part 4",
    title: "The Spine",
    folderHref: folder("docs/06-part-4-the-spine"),
    lessons: [
      { title: "State Between Runs", href: doc("docs/06-part-4-the-spine/12-state-between-runs.md") },
    ],
    quizHref: doc("docs/06-part-4-the-spine/quiz.md"),
    flashcardsHref: doc("docs/06-part-4-the-spine/flashcards.md"),
  },
  {
    part: "Part 5",
    title: "Complete Loop",
    folderHref: folder("docs/07-part-5-complete-loop"),
    lessons: [
      { title: "Build the Loop Twice", href: doc("docs/07-part-5-complete-loop/13-build-the-loop-twice.md") },
      { title: "Claude Code Walkthrough", href: doc("docs/07-part-5-complete-loop/13a-claude-code-walkthrough.md") },
      { title: "OpenCode Walkthrough", href: doc("docs/07-part-5-complete-loop/13b-opencode-walkthrough.md") },
    ],
    quizHref: doc("docs/07-part-5-complete-loop/quiz.md"),
    // Part 5 has no flashcards deck in the repo.
  },
  {
    part: "Part 6",
    title: "Human Control",
    folderHref: folder("docs/08-part-6-human-control"),
    lessons: [
      { title: "Staying the Engineer", href: doc("docs/08-part-6-human-control/14-staying-the-engineer.md") },
      { title: "The Three Nested Loops", href: doc("docs/08-part-6-human-control/the-three-nested-loops.md") },
      { title: "Verification", href: doc("docs/08-part-6-human-control/verification.md") },
      { title: "Cost Management", href: doc("docs/08-part-6-human-control/cost-management.md") },
    ],
    quizHref: doc("docs/08-part-6-human-control/quiz.md"),
    flashcardsHref: doc("docs/08-part-6-human-control/flashcards.md"),
  },
];

export const patterns: PatternCard[] = [
  {
    name: "PR Babysitter",
    frequency: "On PR events",
    risk: "medium",
    patternHref: doc("patterns/pr-babysitter.md"),
    starterHref: folder("starters/pr-babysitter"),
  },
  {
    name: "Daily Triage",
    frequency: "Daily",
    risk: "low",
    patternHref: doc("patterns/daily-triage.md"),
    starterHref: folder("starters/daily-triage"),
  },
  {
    name: "CI Sweeper",
    frequency: "On CI failure",
    risk: "medium",
    patternHref: doc("patterns/ci-sweeper.md"),
    starterHref: folder("starters/ci-sweeper"),
  },
  {
    name: "Dependency Sweeper",
    frequency: "Weekly",
    risk: "medium",
    patternHref: doc("patterns/dependency-sweeper.md"),
    starterHref: folder("starters/dependency-sweeper"),
  },
  {
    name: "Issue Triage",
    frequency: "On new issue",
    risk: "low",
    patternHref: doc("patterns/issue-triage.md"),
    starterHref: folder("starters/issue-triage"),
  },
  {
    name: "Changelog Drafter",
    frequency: "On release",
    risk: "low",
    patternHref: doc("patterns/changelog-drafter.md"),
    starterHref: folder("starters/changelog-drafter"),
  },
];

export const getStarted = {
  cloneCommand: `git clone ${links.clone}`,
  steps: [
    {
      title: "Clone & skim the map",
      blurb: "Start here — the course overview and how to navigate it.",
      href: links.startCourse,
    },
    {
      title: "Learn the foundations",
      blurb: "The primitives and mental models every loop is built from.",
      href: links.foundations,
    },
    {
      title: "Build your first loop",
      blurb: "A guided watch loop — your first hands-on project.",
      href: doc("docs/projects/01-a-watch-loop.md"),
    },
  ] satisfies GetStartedStep[],
};

export const finalCta = {
  headline: "Build a loop that ships while you sleep.",
  cta: { label: "Get the course on GitHub", href: links.repo },
};

export const footer = {
  columns: [
    { label: "Course", href: links.startCourse },
    { label: "Patterns", href: links.patterns },
    { label: "Starters", href: links.starters },
    { label: "Projects", href: links.projects },
    { label: "Assessments", href: links.assessments },
    { label: "License", href: links.license },
  ],
  note: "The GitHub repo is the content. This site is the front door.",
};
