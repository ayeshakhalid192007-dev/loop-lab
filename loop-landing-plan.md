# Plan — Loop Engineering Crash Course landing page (Next.js)

**Goal:** one marketing page, styled like `cobusgreyling.github.io/loop-engineering`,
where every button/card links out to
`https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse`.

**Not in scope:** rendering lesson content, MDX, submodules, auth, progress tracking.
The GitHub repo *is* the content. The site is the front door.

---

## 1. The one idea that makes this easy

Every link on the page is a plain `<a href>` to a GitHub URL. No routing, no data
fetching, no CMS. So the whole site is:

- one route (`/`)
- one links config file
- ~8 presentational section components

Link shapes you need:

| Target | URL |
| --- | --- |
| Repo root | `https://github.com/ayeshakhalid192007-dev/LoopEngineering-CrashCourse` |
| A doc page | `…/blob/main/docs/03-part-1-the-shift/01-from-prompting-to-looping.md` |
| A folder | `…/tree/main/docs/03-part-1-the-shift` |
| A starter kit | `…/tree/main/starters/pr-babysitter` |
| A pattern | `…/blob/main/patterns/pr-babysitter.md` |

**Rule:** every URL lives in `lib/links.ts`. No hardcoded hrefs inside components.
If you rename a folder in the course repo, you fix one file.

---

## 2. Setup

```bash
npx create-next-app@latest loop-landing --ts --tailwind --app --eslint --no-src-dir
cd loop-landing
```

Next 16 + React 19 + Tailwind v4. No mermaid, no markdown parser, no UI kit —
everything below is hand-written components.

**One optional dependency, for motion only:**

```bash
npm i motion          # ~18kb gzipped, the successor to framer-motion
```

Add it only when you reach §6 and hit something CSS genuinely can't do (the
pinned scroll section). Roughly 70% of the motion in this plan is pure CSS.

`next.config.ts`:

```ts
const nextConfig = { output: "export" };  // fully static — deploy anywhere
```

---

## 3. File layout

```
app/
  layout.tsx          fonts, metadata, <html> theme class
  page.tsx            composes the sections, nothing else
  globals.css         Tailwind import + design tokens
lib/
  links.ts            EVERY external URL, one object
  content.ts          section copy as typed data (headings, cards, steps)
components/
  NavBar.tsx
  Hero.tsx
  LoopAnatomy.tsx     the 8-stage cycle strip
  BuildingBlocks.tsx  primitive cards
  PatternGrid.tsx     pattern cards → GitHub
  Curriculum.tsx      the 6 parts → GitHub folders
  GetStarted.tsx      terminal block + copy button
  FinalCTA.tsx
  Footer.tsx
  ui/PillButton.tsx   the one shared primitive
  ui/Section.tsx      consistent vertical rhythm + heading slot
```

Two files hold all the words and all the URLs. Components stay dumb.

---

## 4. Design system (do this before any section)

In `globals.css`, define CSS custom properties, then use them via Tailwind
arbitrary values or `@theme`. Tokens, never raw hex in components.

Suggested (your own, not the reference site's mint/navy):

```css
:root {
  --bg:        #0B0E14;   /* near-black base */
  --surface:   #141821;   /* cards */
  --border:    #242B38;
  --text:      #E8E6E1;
  --muted:     #9AA3B2;
  --accent:    #99744A;   /* brass — the ONLY accent */
  --accent-fg: #0B0E14;
  --paper:     #F5F3EE;   /* the one cream band */

  /* motion tokens — see §6 */
  --ease-out:  cubic-bezier(0.22, 1, 0.36, 1);   /* the house curve */
  --dur-fast:  180ms;
  --dur-base:  520ms;
  --dur-slow:  900ms;
  --lift:      24px;      /* how far reveal elements travel */
}
```

Motion uses tokens too. One easing curve across the whole site is what makes
animation read as designed rather than assembled.

Typography: one display face for headlines (Inter Tight 800 or similar), system
sans for body, monospace for the terminal block. Load with `next/font`.

**Two rules that keep it from looking templated:**
1. One accent color, used sparingly — CTAs and active states only.
2. One cream/light band in the middle of an otherwise dark page. That single
   inversion is what gives the page rhythm.

---

## 5. Sections, in build order

Build top to bottom. Each is one component, one commit, verified in the browser
before moving on.

**1. NavBar** — sticky, translucent-on-scroll. Left: wordmark. Center: anchor
links to sections on this page (`#patterns`, `#curriculum`, `#start`). Right:
a solid pill "View on GitHub" → repo root.

**2. Hero** — oversized headline, one-sentence lede, two pill CTAs
("Start the course" → `docs/00-start-here/README.md`, "Browse the repo" → root),
and a small feature line (`MIT · 101 lessons · 6 parts · 20 starter kits`).
Right side or background: an SVG loop motif — a circle of connected nodes,
optionally with a slow CSS `@keyframes` dash animation. Pure SVG, no library.

**3. LoopAnatomy** — the 8 stages of a loop as a horizontal strip of numbered
chips with connecting lines, wrapping to a vertical stack on mobile. CSS grid +
pseudo-element connectors. No diagram library.

**4. BuildingBlocks** — 6 primitive cards (Scheduling, Worktrees, Skills,
Connectors, Sub-agents, State). Each: icon (inline SVG), title, one line, and a
link to the matching doc in `docs/02-foundations/`.

**5. Curriculum** — the spine of your site. Six cards for the six parts, from
your repo's structure:

| Part | Folder |
| --- | --- |
| The Shift | `docs/03-part-1-the-shift` |
| Heartbeat | `docs/04-part-2-heartbeat` |
| The Body | `docs/05-part-3-the-body` |
| The Spine | `docs/06-part-4-the-spine` |
| Complete Loop | `docs/07-part-5-complete-loop` |
| Human Control | `docs/08-part-6-human-control` |

Each card lists its lesson titles as individual links to the `.md` files, plus
"Quiz" and "Flashcards" links. This is where most of your outbound links live.

**6. PatternGrid** — cards for the production patterns you actually have
(`pr-babysitter`, `daily-triage`, `ci-sweeper`, `dependency-sweeper`,
`issue-triage`, `changelog-drafter`, …). Each card: name, frequency, risk badge,
and two links — "Pattern" (→ `patterns/x.md`) and "Starter kit" (→ `starters/x/`).

**7. GetStarted** (cream band) — a terminal-styled block with the clone command
and a working copy-to-clipboard button (`navigator.clipboard.writeText`, with a
"Copied" state). Beside it, 3 numbered steps, each ending in a repo link.

**8. FinalCTA + Footer** — dark, big headline, one pill to the repo. Footer:
column grid of links (Course, Patterns, Starters, Projects, Assessments,
License), each → GitHub.

---

## 6. Motion & parallax

Three reference sites, and what to take from each:

| Reference | What it does | Take |
| --- | --- | --- |
| **Atlassian Teamwork Graph** | Dark field of floating app icons at different depths — near ones blurred, far ones sharp — drifting on scroll and mouse | The **depth field** behind the hero |
| **Cantor8** | Deep blue; SVG line paths that draw themselves; headlines sliding in from the side; full-bleed image reveals | The **self-drawing connector lines** |
| **Antimetal** | Warm light grey, serif headline, animated node constellation; a **sticky-pinned** two-column section where the left column scrolls through items and the right panel stays fixed and swaps; corner-bracket markers | The **pinned scroll section** and the **constellation** |

**Do not use all three at once.** Combining a depth field, drawing lines, and a
pinned section in one page is how a site starts feeling like a demo reel. Pick
one signature moment (I recommend the hero depth field, since a loop is the
subject) and let everything else be quiet reveals.

### 6.1 The baseline: scroll reveals (pure CSS, no JS)

Every section fades up as it enters the viewport. Modern CSS does this natively
with scroll-driven animations — no IntersectionObserver, no library, no
hydration cost, and it runs on the compositor:

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: reveal-up linear both;
    animation-timeline: view();
    animation-range: entry 10% cover 32%;
  }
}
@keyframes reveal-up {
  from { opacity: 0; transform: translateY(var(--lift)); }
  to   { opacity: 1; transform: none; }
}
```

Supported in Chrome/Edge; Safari and Firefox simply show the content with no
animation, which is a perfectly good fallback. **Only animate `opacity` and
`transform`** — animating `top`, `height`, or `filter` on scroll will drop frames.

For staggered children (the pattern cards, the curriculum grid), set
`animation-delay` from an index via a CSS variable:

```tsx
<li style={{ "--i": i } as React.CSSProperties} className="reveal-stagger">
```
```css
.reveal-stagger { animation-delay: calc(var(--i) * 60ms); }
```

Cap the stagger at ~6 items. Beyond that the last card arrives late enough to
feel broken.

### 6.2 The hero depth field (the signature moment)

A `<div>` of absolutely-positioned nodes — small circles and rounded squares in
your accent and muted tones — assigned to **three depth layers**:

| Layer | Scale | Blur | Opacity | Scroll speed |
| --- | --- | --- | --- | --- |
| Far | 0.6 | 2px | 0.35 | 0.15× |
| Mid | 1.0 | 0 | 0.7 | 0.4× |
| Near | 1.5 | 6px | 0.5 | 0.8× |

Two motions, composed:

1. **Scroll parallax** — each layer translates at its own rate. Do it with
   `animation-timeline: scroll()` in CSS, not a scroll event listener.
2. **Mouse drift** — on pointer move, offset each layer by a few px opposite the
   cursor. This one needs JS, but write it correctly: listen on the *container*,
   store the position in a ref, and apply it inside a `requestAnimationFrame`
   loop that writes a CSS variable (`--mx`, `--my`). **Never call `setState` on
   mousemove** — that re-renders React on every pointer event and will visibly
   stutter.

```tsx
"use client";
// container.style.setProperty("--mx", String(x)) inside rAF — no React state
```

Blur is expensive. Pre-blur via a static CSS `filter` on the layer (set once,
never animated) so the compositor caches it.

Gate the whole thing: skip mouse drift on touch devices (`(pointer: coarse)`)
and when the tab is hidden.

### 6.3 The connector lines (LoopAnatomy section)

The 8-stage strip draws its connecting line as you scroll to it — the Cantor8
move, and 6 lines of CSS on an SVG `<path>`:

```css
.connector {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: draw linear both;
  animation-timeline: view();
  animation-range: entry 20% cover 50%;
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```

Set `pathLength="1"` as an **attribute on the `<path>` element** — that's the
trick. It normalizes any path length to 1, so `dasharray`/`dashoffset` of 1
means "the whole line" and you never have to measure the path in JS.

Since the subject is a *loop*, run one continuous slow dash animation around the
hero's loop motif as well (`animation: dash 8s linear infinite`) — a constant,
subtle signal that something is cycling.

### 6.4 The pinned section (optional — highest cost)

The Antimetal move: left column scrolls through Patrol/Triage/World Model while
the right panel stays fixed and swaps its visual. Use it for your six course
parts — a genuinely good fit.

- The pinned panel is just `position: sticky; top: 20vh` on the right column
  inside a tall grid. **No library needed for the pinning itself.**
- Swapping the panel as each item becomes active *does* need JS: one
  `IntersectionObserver` with `rootMargin: "-45% 0px -45% 0px"` (a thin band
  through the viewport middle), setting active index in state. That's ~15 lines.
- Cross-fade the panel with `motion`'s `AnimatePresence`, or a CSS
  `@starting-style` transition if you want to stay dependency-free.
- **Below `md`, disable pinning entirely** — `position: static`, panel above the
  list. Sticky-scroll storytelling does not work on a phone.

### 6.5 Non-negotiables

**Respect reduced motion.** This is an accessibility requirement, not a nicety —
parallax triggers nausea in people with vestibular disorders:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Then verify it: GNOME → Settings → Accessibility → Reduce Animation, reload, and
confirm the page is fully readable and static.

**Content must never depend on motion.** With JS disabled or an unsupported
browser, every section is visible at full opacity. Build each section
*visible-by-default* and let the animation subtract from that — never start an
element at `opacity: 0` in inline styles, or a fallback browser shows a blank page.

**Budget:** hero field ≤ 30 nodes; ≤ 3 parallax layers; nothing animating below
the fold that isn't in view. Check in DevTools → Performance: scrolling should
hold 60fps with no purple "Layout" bars — if you see layout thrash, something is
animating a non-composited property.

---

## 7. Small things that matter

- **External links:** every outbound `<a>` gets `target="_blank"` and
  `rel="noopener noreferrer"`. Write one `<ExternalLink>` wrapper so you can't
  forget.
- **Anchor scrolling:** `html { scroll-behavior: smooth; scroll-padding-top: 5rem }`
  so the sticky nav doesn't cover section headings.
- **Client components:** only the copy button and the nav's scroll listener need
  `"use client"`. Everything else stays a Server Component.
- **Metadata:** set `title`, `description`, and `openGraph` in `layout.tsx`, plus
  an OG image — the link gets shared, and a blank preview costs you clicks.
- **Responsive:** mobile-first. Test the 8-stage strip and the pattern grid at
  375px — those two break first.
- **A11y:** real heading order (one `h1`), visible focus rings on the pills,
  and check accent-on-dark contrast hits 4.5:1.

---

## 8. Build sequence

**Build the whole page static first, add motion second.** Animating sections
while you're still moving them around means redoing the timing every time. Steps
1–6 produce a complete, correct, motionless site; 7–9 bring it to life.

| Step | Deliverable | Done when |
| --- | --- | --- |
| 1 | Scaffold + tokens (colour **and** motion) + fonts + `PillButton` + `Section` | A test page shows both button variants in the real palette |
| 2 | `lib/links.ts` + `lib/content.ts` filled from the real repo | Every URL opens the right file on GitHub |
| 3 | NavBar + Hero + Footer | Page has a top, a bottom, and working CTAs |
| 4 | Curriculum + PatternGrid | The two link-heavy sections work end to end |
| 5 | LoopAnatomy + BuildingBlocks | Visual middle of the page is complete |
| 6 | GetStarted + FinalCTA | Copy button works; **page is complete and static** |
| 7 | Motion baseline: `.reveal` + stagger on every section (§6.1) | Scrolling the whole page feels alive; zero JS added |
| 8 | Signature motion: hero depth field (§6.2) + connector draw (§6.3) | 60fps in DevTools Performance; reduced-motion verified |
| 9 | Polish: responsive, a11y, metadata, OG image | 375px clean, Lighthouse a11y ≥ 95 |
| 10 | Deploy | `npm run build` clean, live on Vercel |

The pinned section (§6.4) is deliberately **not** in this list — treat it as a
follow-up once the site is live. It's the one piece that costs a dependency and
real mobile-layout work.

---

## 9. Verification before calling it done

```bash
npm run build        # must pass, zero warnings
npx serve out        # check the static export, not just dev
```

Then, manually:

1. **Click every link** and confirm it lands on a real file — GitHub 404s are the
   single most likely defect in a site whose entire job is linking to GitHub. A
   dead link in `links.ts` is invisible until someone clicks it.
2. **Scroll the full page in DevTools → Performance**, recording. Look for a
   steady 60fps and no purple layout bars.
3. **Turn on Reduce Animation** in GNOME accessibility settings, reload, and
   scroll the whole page. Everything readable, nothing moving.
4. **Load it at 375px wide.** The 8-stage strip, the pattern grid, and the hero
   depth field are the three things that break first.

---

## Note

`~/loop-website` already exists — a Next.js 16 app with this brand's design
system (tokens, NavBar, Hero, Footer, PillButton, LoopMotif) plus a much larger
half-finished platform (submodule, 101 rendered lessons, planned auth). This plan
assumes a **fresh minimal app**, which is the fastest path to what you described.
If you'd rather reuse those components, steps 1 and 3 mostly disappear — say the
word and I'll re-cut the plan against that repo instead.
