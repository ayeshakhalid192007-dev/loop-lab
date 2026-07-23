# Design — Documentation-Platform Redesign of the Loop Engineering Landing Page

**Date:** 2026-07-23
**Status:** Approved by user, ready for implementation planning

## Context

The site (`loop-landing`) is a single-route (`/`) static marketing "front door" for a
GitHub course repo (`ayeshakhalid192007-dev/LoopEngineering-CrashCourse`). It has no
MDX, no per-lesson routing, no content pipeline — every card/link on the page points
out to a file or folder in that repo (`lib/links.ts`). It already went through one
full design pass (warm olive/brass/sand palette, custom motion tokens, scroll reveals,
card hovers — see commits `6926915`, `a697628`) and is fully QA'd (a11y clean, 0
console errors) and parked at `deploy-loop`'s human deploy-approval gate.

The user asked for a redesign inspired by the UX of
`cobusgreyling.github.io/loop-engineering` (a documentation-style learning platform),
explicitly **not** a visual copy, and matching their own branding. The literal spec
they provided (sidebar with nested lesson levels, per-lesson TOC, breadcrumbs into a
lesson hierarchy, prev/next *lesson* cards, search over lesson content/glossary, a
generic violet/blue dark theme) assumes a multi-page in-app learning platform, which
does not exist and is explicitly out of scope for this project
(`loop-landing-plan.md`: "Not in scope: rendering lesson content, MDX, submodules").

Through discovery, the following scope was agreed:

- Keep the one-page "front door" model. No new routes, no MDX, no content pipeline.
- Adopt the reference site's **UX/interaction patterns** (persistent sidebar + TOC,
  command palette, keyboard shortcuts, section-based navigation) rather than its visuals.
- Keep the existing warm olive/brass/sand brand palette for dark mode; add a real,
  properly-contrasted light theme derived from the same three brand colors, with a
  header toggle (`next-themes`).
- Remove the `LoopMotif` SVG (the animated ring/circle in the Hero's right column)
  entirely. Hero becomes single-column; `DepthField` (the background particle layer)
  stays.
- Adapt spec concepts that assume multi-page hierarchy: no breadcrumbs (no page
  hierarchy exists), "lesson" prev/next becomes **section** prev/next, sidebar nesting
  maps onto real page anchors + real GitHub leaf links instead of fictional lesson
  pages, callouts are dropped entirely (no lesson prose to annotate).
- Add one new content unit: a short Glossary section (new copy, ~8–15 terms already
  used elsewhere in the course/page — not invented).

## Goals

1. Give the page a persistent, premium documentation-platform *feel* (sidebar, TOC,
   command palette, keyboard shortcuts, reading progress) without pretending it's a
   multi-page product it isn't.
2. Preserve all existing content, all existing outbound links, the current dark brand
   identity, and the accessibility bar already cleared.
3. Add a real, accessible light theme.
4. Stay dependency-light: add only what's functionally needed
   (`framer-motion`, `lucide-react`, `cmdk`, `react-hotkeys-hook`, `next-themes`, and
   1–2 primitives copied in via the shadcn CLI as owned code — not the full shadcn/ui
   library).
5. Zero regression on the a11y/perf bar already achieved (0 axe violations, 0 console
   errors, clean at 375px).

## Non-Goals

- No MDX, no new routes, no rendering of lesson content inside the app.
- No breadcrumbs (nothing to show a hierarchy of).
- No callout components (Info/Tip/Warning/etc.) — no instructional prose exists to
  annotate.
- No auth, no progress tracking, no server-side search index — everything is static,
  client-side, in-memory search over data already in `lib/content.ts` plus the new
  glossary data.

## Architecture

### Layout

`Hero` stays full-bleed, single-column after removing `LoopMotif` (see "Hero" below).
Below it, the rest of the page is wrapped in a new `DocsShell` layout:

```
Header (sticky, full width)
──────────────────────────────────────────────
Sidebar | Content (750-850px) | TOC
(≥1024px persistent      (≥1280px persistent,
 sidebar; slide-over       hidden 1024-1280px)
 below 1024px)
```

`DocsShell` wraps: `LoopAnatomy`, `BuildingBlocks`, `Curriculum`, `PatternGrid`,
`GetStarted`, and the new `Glossary`. `Hero` and `Footer` remain outside the shell
(full-bleed, as today).

### Sidebar

A real nested tree, built from data that already exists in `lib/content.ts` —
no fictional pages:

- **Loop Anatomy** → anchor to `#loop-anatomy`
- **Building Blocks** → anchor to `#blocks`; children = the 6 primitives
  (Scheduling, Worktrees, Skills, Connectors, Sub-agents, State), each an anchor
  within that section
- **Curriculum** → anchor to `#curriculum`; children = Part 1–6 (from `curriculum[]`),
  each expandable to its real lesson titles, which link straight to GitHub — this is
  the genuine 3-level nesting the reference site has, built from real data
- **Patterns** → anchor to `#patterns`; children = the 6 pattern names, each linking
  to its GitHub pattern doc
- **Glossary** → anchor to `#glossary` (new)
- **Get Started** → anchor to `#start`

Current section highlighted via `IntersectionObserver` scroll-spy (same technique
`ScrollAnimator` already uses). Expand/collapse state persists in `localStorage`.
Expand/collapse and slide-over animate with Framer Motion (150–250ms, house
`--ease-out` curve).

### Table of Contents (TOC)

Auto-generated from the section headings inside the current `DocsShell` scroll
position; sticky; smooth-scrolls to a heading on click; highlights the active
heading via the same scroll-spy mechanism as the sidebar.

### Header

Extends the existing `NavBar.tsx` (sticky, backdrop-blur once scrolled — already
implemented) rather than rewriting it:

- Wordmark (existing)
- Sidebar toggle (visible <1024px)
- Search button → opens command palette
- Theme toggle (`next-themes`)
- "View on GitHub" pill (existing `nav.cta`)
- Thin reading-progress bar pinned to the very top edge, animates with scroll

### Command Palette (Search)

`cmdk`-based, opened by `Cmd/Ctrl+K` or the header search button. Indexes, in one
flat searchable list built at build time from existing + new data:

- Section headings (Loop Anatomy, Building Blocks, Curriculum, Patterns, Glossary,
  Get Started)
- Curriculum parts + individual lesson titles (from `curriculum[]`)
- Pattern names (from `patterns[]`)
- Glossary terms (from new `glossary[]`)

Fuzzy match, matching substring highlighted in results. Selecting a same-page
heading/section scrolls to it and closes the palette; selecting a lesson/pattern/
glossary-linked item that only exists on GitHub opens it in a new tab via the same
external-link convention used everywhere else on the site (`ExternalLink`).

### Keyboard Shortcuts

Via `react-hotkeys-hook`, disabled while focus is inside a text input:

| Key | Action |
|---|---|
| `Cmd/Ctrl+K` | Open command palette |
| `←` | Scroll to previous section |
| `→` | Scroll to next section |
| `?` | Open shortcuts modal |
| `Esc` | Close whichever overlay is open (palette, modal, mobile sidebar) |

Section order for `←`/`→`: Hero → Loop Anatomy → Building Blocks → Curriculum →
Patterns → Glossary → Get Started.

### Section Prev/Next Cards

Replaces the spec's "lesson nav." A two-card row at the bottom of every `DocsShell`
section: "← Previous: *X*" / "Next: *Y* →", using the same card visual language
(rounded, bordered, `.card` hover lift) as `Curriculum`/`PatternGrid`, animated in
with Framer Motion.

### Glossary (new content)

New section, `#glossary`, inside `DocsShell`, after Patterns and before Get Started.
~8–15 terms already used elsewhere in the course/page (Loop, Heartbeat, Body, Spine,
Checker, Human gate, Agent, MCP, Skill, Worktree, Sub-agent, Stopping condition — no
invented terminology). Rendered as a clean two-column definition list. Each entry is
also indexed by the command palette.

### Hero

Remove `LoopMotif` (the gradient ring/pulsing-node SVG in the right column) from
`components/Hero.tsx` entirely. The grid layout (`lg:grid-cols-[1.1fr_0.9fr]`)
collapses to a single centered column. `DepthField` (the background particle/parallax
layer) is unaffected — it's a separate full-bleed background effect, not the removed
element.

### Theme

- **Dark** (default): unchanged. Every token in `app/globals.css`
  (`--bg`, `--surface`, `--border`, `--text`, `--muted`, `--accent`, `--accent-2`,
  `--paper`, `--paper-ink`, etc.) stays exactly as-is.
- **Light** (new): a full variant derived from the same three brand colors —
  sand/paper as the background, dark olive as body text, brass kept as the accent
  but contrast-checked for AA on a light surface. Needs its own contrast pass before
  ship, mirroring the care taken in the existing dark-theme a11y fix (`a697628`).
- `next-themes` added for persistence + `prefers-color-scheme` default; toggle lives
  in the header. No flash-of-wrong-theme (inline script, same pattern as the existing
  `revealInit` no-flash script in `app/layout.tsx`).

### Code Block

The one existing code block (`GetStarted.tsx`'s terminal block) is redesigned per the
callout for "completely redesigned code blocks": language/`bash` badge, working copy
button (reuse existing `CopyButton`), better spacing/rounding. No syntax highlighter
dependency — it's a single shell command, not multi-line source, so Shiki/Prism would
be an unjustified dependency.

### Animations

Framer Motion handles the *new* interactive chrome: sidebar expand/collapse and
slide-over, TOC active-state transitions, command palette open/close, shortcuts
modal open/close, section prev/next card hover-lift. The existing `ScrollAnimator`
(`IntersectionObserver`-driven reveal-on-scroll for section entrances) is untouched —
Framer Motion supplements it, it doesn't replace it. All motion 150–250ms, using the
existing `--ease-out` house curve, and gated behind `prefers-reduced-motion` exactly
like the current implementation.

## Dependencies

Add: `framer-motion`, `lucide-react`, `cmdk`, `react-hotkeys-hook`, `next-themes`.

Explicitly **not** adopting shadcn/ui as an installed library. Where a primitive is
genuinely needed (e.g. a `Dialog` wrapper behind the command palette and the
shortcuts modal), copy it in via the shadcn CLI as owned code in `components/ui/`,
consistent with the existing pattern of small, owned UI primitives
(`PillButton`, `Section`, `ExternalLink`, `CopyButton`) rather than pulling in a
component library wholesale.

## Accessibility

- All new interactive elements (sidebar toggle, search button, theme toggle, command
  palette, shortcuts modal) get proper ARIA roles/labels and are fully keyboard
  operable.
- Command palette and shortcuts modal trap focus while open and restore focus on close.
- New light theme gets its own AA contrast check before ship (text, muted text,
  accent-on-surface, accent-on-paper).
- Reduced-motion respected throughout, matching the existing global rule in
  `app/globals.css`.
- No regression on the existing a11y baseline (0 axe violations, 0 console errors,
  clean layout at 375px) — re-verified after implementation via the same QA pass
  `deploy-loop` already ran.

## Testing / Verification

- `npm run lint` and `npm run build` clean (per `AGENTS.md`).
- Manual QA: keyboard-only pass (search, shortcuts, sidebar, TOC, theme toggle), a11y
  check (axe or equivalent), 375px viewport check, light + dark theme contrast check.
- Verify every existing outbound GitHub link still resolves to the same target after
  the sidebar/search restructuring (no link should change destination, only how it's
  discovered).

## Open Items for Implementation Planning

- Exact `DocsShell` component boundaries and where scroll-spy state lives (context vs.
  a single hook shared by sidebar + TOC).
- Whether the shortcuts modal and command palette share one `Dialog` primitive or use
  two lighter-weight overlays.
- Final light-theme token values (needs a contrast-check pass, not just a color pick).
