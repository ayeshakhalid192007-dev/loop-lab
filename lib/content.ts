/**
 * All section copy as typed data. Components stay dumb — they render this.
 *
 * Every course href here is now an internal route. They used to be
 * github.com/blob/main URLs almost without exception, which meant the landing
 * page's 77 anchors included exactly zero internal links — a front door that sent
 * every visitor, every crawler and every unit of PageRank straight back out to a
 * domain we do not own, for content we wrote. The curriculum is published at these
 * paths now (lib/docs.ts), so this is where that changes. github.com survives as
 * the repo/clone CTA and the per-page "view source" link, which is what it should
 * have been from the start.
 */
import { links } from "@/lib/links";

export interface NavContent {
  wordmark: string;
  anchors: { label: string; href: string }[];
  cta: { label: string; href: string };
}

export interface HeroContent {
  /** The H1. Carries the search term — the hook lives in `tagline`, rendered below it. */
  headline: string;
  /** The original hook, kept as a sub-headline so the voice survives the SEO rewrite. */
  tagline: string;
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
  blurb: string;
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
  headline: "Loop Engineering: Build Agents That Run Themselves",
  tagline: "Stop prompting. Start looping.",
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
    href: "/parts/heartbeat/unattended-schedules/",
  },
  {
    title: "Worktrees",
    blurb: "Isolate each run in its own checkout so parallel loops never collide.",
    href: "/parts/the-body/worktrees/",
  },
  {
    title: "Skills",
    blurb: "Package repeatable know-how the agent can load on demand.",
    href: "/parts/the-body/skills/",
  },
  {
    title: "Connectors",
    blurb: "Reach real systems over MCP — the hands of the loop.",
    href: "/parts/the-body/connectors-mcp/",
  },
  {
    title: "Sub-agents",
    blurb: "A separate checker grades the work — never the maker itself.",
    href: "/parts/the-body/maker-checker/",
  },
  {
    title: "State",
    blurb: "A spine that survives between beats: state files and run logs.",
    href: "/parts/the-spine/state-between-runs/",
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
    folderHref: "/parts/the-shift/",
    lessons: [
      { title: "From Prompting to Looping", href: "/parts/the-shift/from-prompting-to-looping/" },
      { title: "The Four Layers", href: "/parts/the-shift/the-four-layers/" },
      { title: "Anatomy of a Loop", href: "/parts/the-shift/anatomy-of-a-loop/" },
    ],
    quizHref: "/parts/the-shift/quiz/",
    flashcardsHref: "/parts/the-shift/flashcards/",
  },
  {
    part: "Part 2",
    title: "Heartbeat",
    folderHref: "/parts/heartbeat/",
    lessons: [
      { title: "In-Session Loops", href: "/parts/heartbeat/in-session-loops/" },
      { title: "Conditional: Run Until Done", href: "/parts/heartbeat/conditional-run-until-done/" },
      { title: "Unattended Schedules", href: "/parts/heartbeat/unattended-schedules/" },
      { title: "Event-Driven", href: "/parts/heartbeat/event-driven/" },
    ],
    quizHref: "/parts/heartbeat/quiz/",
    flashcardsHref: "/parts/heartbeat/flashcards/",
  },
  {
    part: "Part 3",
    title: "The Body",
    folderHref: "/parts/the-body/",
    lessons: [
      { title: "Worktrees", href: "/parts/the-body/worktrees/" },
      { title: "Skills", href: "/parts/the-body/skills/" },
      { title: "Connectors (MCP)", href: "/parts/the-body/connectors-mcp/" },
      { title: "Maker–Checker", href: "/parts/the-body/maker-checker/" },
    ],
    quizHref: "/parts/the-body/quiz/",
    flashcardsHref: "/parts/the-body/flashcards/",
  },
  {
    part: "Part 4",
    title: "The Spine",
    folderHref: "/parts/the-spine/",
    lessons: [
      { title: "State Between Runs", href: "/parts/the-spine/state-between-runs/" },
    ],
    quizHref: "/parts/the-spine/quiz/",
    flashcardsHref: "/parts/the-spine/flashcards/",
  },
  {
    part: "Part 5",
    title: "Complete Loop",
    folderHref: "/parts/complete-loop/",
    lessons: [
      { title: "Build the Loop Twice", href: "/parts/complete-loop/build-the-loop-twice/" },
      { title: "Claude Code Walkthrough", href: "/parts/complete-loop/claude-code-walkthrough/" },
      { title: "OpenCode Walkthrough", href: "/parts/complete-loop/opencode-walkthrough/" },
    ],
    quizHref: "/parts/complete-loop/quiz/",
    // Part 5 has no flashcards deck in the repo.
  },
  {
    part: "Part 6",
    title: "Human Control",
    folderHref: "/parts/human-control/",
    lessons: [
      { title: "Staying the Engineer", href: "/parts/human-control/staying-the-engineer/" },
      { title: "The Three Nested Loops", href: "/parts/human-control/the-three-nested-loops/" },
      { title: "Verification", href: "/parts/human-control/verification/" },
      { title: "Cost Management", href: "/parts/human-control/cost-management/" },
    ],
    quizHref: "/parts/human-control/quiz/",
    flashcardsHref: "/parts/human-control/flashcards/",
  },
];

/** The operational loop, one beat. Eight stages that run and then run again.
 *  `short` is the ring label; `role` is the one-line job. Every stage maps to a
 *  real concept taught in the course. */
export interface CycleStage {
  short: string;
  name: string;
  role: string;
}

export const loopCycle: CycleStage[] = [
  { short: "Schedule", name: "Schedule", role: "The heartbeat fires — a timer, a condition, or an event." },
  { short: "State", name: "Load state", role: "Read STATE.md and the run log — what survived the last beat." },
  { short: "Triage", name: "Triage", role: "Pick the next unit of work, or stop if there's none." },
  { short: "Worktree", name: "Worktree", role: "Isolate the run in its own checkout so nothing collides." },
  { short: "Implement", name: "Implement", role: "The maker agent does the work inside the worktree." },
  { short: "Verify", name: "Verify", role: "A separate checker grades it — never the maker itself." },
  { short: "Gate", name: "Human gate", role: "A person approves, escalates, or rejects the change." },
  { short: "Commit", name: "Commit", role: "Apply over MCP, append one line to the log — then beat again." },
];

/** The stack, top to bottom — who sits where, and which part of the anatomy it is. */
export interface Layer {
  name: string;
  role: string;
  maps: string;
}

export const layers: Layer[] = [
  { name: "Human", role: "Design the loop, hold the gate, review the diffs.", maps: "The engineer" },
  { name: "Control plane", role: "Scheduling, pattern selection, and budget caps.", maps: "Heartbeat" },
  { name: "Durable memory", role: "STATE.md, LOOP.md, and the run log — carried between beats.", maps: "Spine" },
  { name: "Execution", role: "Worktrees and the maker / checker agents doing the work.", maps: "Body" },
  { name: "Tooling", role: "CLIs and MCP connectors — the hands that touch real systems.", maps: "Hands" },
];

/** The three rungs of autonomy — where each loop in this repo actually sits. */
export interface AutonomyLevel {
  level: string;
  name: string;
  blurb: string;
  example: string;
}

export const autonomyLevels: AutonomyLevel[] = [
  {
    level: "L1",
    name: "Report-only",
    blurb: "The loop looks and tells you. It writes findings; a human makes every change.",
    example: "Where triage-loop runs.",
  },
  {
    level: "L2",
    name: "Assisted",
    blurb: "The loop proposes and drafts — one small change at a time — and waits at the gate.",
    example: "Small auto-wins after week one.",
  },
  {
    level: "L3",
    name: "Unattended",
    blurb: "The loop runs to completion on its own, stopping only when done or stuck.",
    example: "Where build-loop runs — still human-gated on deploy.",
  },
];

export const patterns: PatternCard[] = [
  {
    name: "PR Babysitter",
    blurb: "Shepherds a PR through review, CI, and rebase. The human stays in the merge seat.",
    frequency: "On PR events",
    risk: "medium",
    patternHref: "/patterns/pr-babysitter/",
    starterHref: "/starters/pr-babysitter/",
  },
  {
    name: "Daily Triage",
    blurb: "A morning scan of CI, issues, and commits. Report-only in week one, small auto-wins after.",
    frequency: "Daily",
    risk: "low",
    patternHref: "/patterns/daily-triage/",
    starterHref: "/starters/daily-triage/",
  },
  {
    name: "CI Sweeper",
    blurb: "Reacts to a failing check with the smallest fix that passes it. Escalates after three tries.",
    frequency: "On CI failure",
    risk: "medium",
    patternHref: "/patterns/ci-sweeper/",
    starterHref: "/starters/ci-sweeper/",
  },
  {
    name: "Dependency Sweeper",
    blurb: "Opens one PR per upgrade, reads the changelog, and flags anything that needs a human look.",
    frequency: "Weekly",
    risk: "medium",
    patternHref: "/patterns/dependency-sweeper/",
    starterHref: "/starters/dependency-sweeper/",
  },
  {
    name: "Issue Triage",
    blurb: "Labels, dedupes, and routes a new issue before anyone on the team has seen it.",
    frequency: "On new issue",
    risk: "low",
    patternHref: "/patterns/issue-triage/",
    starterHref: "/starters/issue-triage/",
  },
  {
    name: "Changelog Drafter",
    blurb: "Reads the merged commits since last tag and drafts release notes for a human to edit.",
    frequency: "On release",
    risk: "low",
    patternHref: "/patterns/changelog-drafter/",
    starterHref: "/starters/changelog-drafter/",
  },
];

export const getStarted = {
  cloneCommand: `git clone ${links.clone}`,
  /** Folder git drops the clone into — drives the animated transcript. */
  repoDir: "LoopEngineering-CrashCourse",
  /** What lands once the clone finishes — the ✓ line at the end of the transcript. */
  cloneSummary: "6 parts · 20 starters · 11 projects",
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
      href: links.firstProject,
    },
  ] satisfies GetStartedStep[],
};

export const finalCta = {
  headline: "Build a loop that ships while you sleep.",
  cta: { label: "Get the course on GitHub", href: links.repo },
};

/** Footer link groups. Internal anchors start with "#"; everything else is outbound. */
export interface FooterLink {
  label: string;
  href: string;
}
export interface FooterGroup {
  heading: string;
  links: FooterLink[];
}

export const footer = {
  tagline:
    "The GitHub repo is the content — six parts, twenty starter kits, eleven projects. This site is the front door.",
  /** The real scaffolding entry point — copyable, so the footer is also useful. */
  install: "npx @loop-engineering/loop-kit list",
  groups: [
    {
      heading: "Course",
      links: [
        { label: "Start here", href: links.startCourse },
        { label: "Curriculum", href: "#curriculum" },
        { label: "Learning tracks", href: links.learningTracks },
        { label: "Assessments", href: links.certification },
      ],
    },
    {
      heading: "Build",
      links: [
        { label: "Patterns", href: links.patterns },
        { label: "Starter kits", href: links.starters },
        { label: "Projects", href: links.projects },
        { label: "Get started", href: "#start" },
      ],
    },
    {
      heading: "Reference",
      links: [
        { label: "Foundations", href: links.foundations },
        { label: "Repository", href: links.repo },
        { label: "License (MIT)", href: links.license },
      ],
    },
  ] satisfies FooterGroup[],
  meta: {
    copyright: "Loop Engineering — a crash course.",
    attribution: "MIT-licensed. Anatomy after Panaversity; kit shape after cobusgreyling/loop-engineering.",
  },
};
