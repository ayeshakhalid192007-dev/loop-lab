# deploy-loop — STATE.md

**Last iteration:** never
**Status:** ⛔ DORMANT — waiting for build-loop to reach 10/10.

## Deploy checklist (runs on activation)

Statuses: ☐ todo · ▶ in progress · ✅ done · ⛔ blocked

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | `npm run build` clean, zero warnings | ☐ | static export → `out/` |
| 2 | `npx serve out` — real export renders | ☐ | not just `npm run dev` |
| 3 | Every outbound GitHub link resolves (no 404s) | ☐ | the site's whole job |
| 4 | 375px mobile layout clean | ☐ | 8-stage strip, pattern grid, hero field |
| 5 | `prefers-reduced-motion` — page readable & static | ☐ | accessibility non-negotiable |
| 6 | Lighthouse a11y ≥ 95 | ☐ | |
| 7 | `loop-verifier` ACCEPT on artifact | ☐ | independent gate |
| 8 | Public deploy | ☐ | **HUMAN APPROVAL REQUIRED before running** |

## Blockers

_none_
