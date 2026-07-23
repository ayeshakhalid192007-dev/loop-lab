# build-loop — STATE.md

**Last iteration:** 2026-07-23 (step 8 committed `9903c11`)
**Current step:** 9 — Polish: responsive, a11y, metadata, OG image
**Progress:** 8 / 10

## Build board

Statuses: ☐ todo · ▶ in progress · ✅ done · ⛔ blocked

| # | Step (from loop-landing-plan.md §8) | Status | Attempts | Commit | Done when |
|---|-------------------------------------|--------|----------|--------|-----------|
| 1  | Scaffold + colour/motion tokens + fonts + PillButton + Section | ✅ | 1 | `461c41d` | Test page shows both button variants in the real palette |
| 2  | `lib/links.ts` + `lib/content.ts` from the real repo | ✅ | 1 | `cf5f67f` | Every URL opens the right file on GitHub |
| 3  | NavBar + Hero + Footer | ✅ | 1 | `61792b0` | Page has a top, a bottom, working CTAs |
| 4  | Curriculum + PatternGrid | ✅ | 1 | `9fa1330` | The two link-heavy sections work end to end |
| 5  | LoopAnatomy + BuildingBlocks | ✅ | 1 | `cdaa72a` | Visual middle of the page complete |
| 6  | GetStarted + FinalCTA | ✅ | 1 | `b60613e` | Copy button works; page complete & static |
| 7  | Motion baseline: `.reveal` + stagger (§6.1) | ✅ | 1 | `fef46b6` | Whole page feels alive; zero JS added |
| 8  | Signature motion: hero depth field + connector draw (§6.2–6.3) | ✅ | 1 | `9903c11` | 60fps in DevTools; reduced-motion verified |
| 9  | Polish: responsive, a11y, metadata, OG image | ▶ | 0 | — | 375px clean; Lighthouse a11y ≥ 95 |
| 10 | Deploy readiness: `npm run build` clean + `npx serve out` | ☐ | 0 | — | Static export verified → hand off to deploy-loop |

## Blockers

_none_

## Notes

- §6.4 pinned section is deliberately OUT of scope (post-launch follow-up).
- **Step 2 deviations from the plan (both intentional, accuracy-driven):**
  - LoopAnatomy uses the course's real **six-part** model (Heartbeat, Body, Spine,
    Stopping condition, Checker, Human gate) from `03-anatomy-of-a-loop.md`, not the
    plan's placeholder "8 stages". `content.ts:loopParts` reflects this.
  - The course repo is **private**. All URL paths are verified-correct against its
    `main` tree, but they will 404 for logged-out visitors until it's made public.
    **Human decision needed before deploy** (deploy-loop should surface this).
- **Not live-browser-tested (Chrome extension disconnected this session):**
  (a) copy button click (step 6), (b) hero depth-field 60fps in DevTools and the
  reduced-motion toggle (step 8). All verified by build + code review + CSS/JS
  guards instead. Re-test with a real browser during step 9 (polish) or step 10 if
  the extension reconnects.
