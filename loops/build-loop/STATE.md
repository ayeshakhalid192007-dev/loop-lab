# build-loop — STATE.md

**Last iteration:** 2026-07-23 (step 1 committed `461c41d`)
**Current step:** 2 — lib/links.ts + lib/content.ts from the real repo
**Progress:** 1 / 10

## Build board

Statuses: ☐ todo · ▶ in progress · ✅ done · ⛔ blocked

| # | Step (from loop-landing-plan.md §8) | Status | Attempts | Commit | Done when |
|---|-------------------------------------|--------|----------|--------|-----------|
| 1  | Scaffold + colour/motion tokens + fonts + PillButton + Section | ✅ | 1 | `461c41d` | Test page shows both button variants in the real palette |
| 2  | `lib/links.ts` + `lib/content.ts` from the real repo | ▶ | 0 | — | Every URL opens the right file on GitHub |
| 3  | NavBar + Hero + Footer | ☐ | 0 | — | Page has a top, a bottom, working CTAs |
| 4  | Curriculum + PatternGrid | ☐ | 0 | — | The two link-heavy sections work end to end |
| 5  | LoopAnatomy + BuildingBlocks | ☐ | 0 | — | Visual middle of the page complete |
| 6  | GetStarted + FinalCTA | ☐ | 0 | — | Copy button works; page complete & static |
| 7  | Motion baseline: `.reveal` + stagger (§6.1) | ☐ | 0 | — | Whole page feels alive; zero JS added |
| 8  | Signature motion: hero depth field + connector draw (§6.2–6.3) | ☐ | 0 | — | 60fps in DevTools; reduced-motion verified |
| 9  | Polish: responsive, a11y, metadata, OG image | ☐ | 0 | — | 375px clean; Lighthouse a11y ≥ 95 |
| 10 | Deploy readiness: `npm run build` clean + `npx serve out` | ☐ | 0 | — | Static export verified → hand off to deploy-loop |

## Blockers

_none_

## Notes

- §6.4 pinned section is deliberately OUT of scope (post-launch follow-up).
