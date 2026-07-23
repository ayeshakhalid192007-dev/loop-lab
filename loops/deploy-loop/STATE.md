# deploy-loop — STATE.md

**Last iteration:** never
**Status:** ▶ ACTIVE — build-loop reached 10/10 on 2026-07-23 and handed off.
Kick off with `/loop Run loops/deploy-loop/runbook.md`. The public deploy (check 8)
is gated on explicit human approval.

## Deploy checklist (runs on activation)

Statuses: ☐ todo · ▶ in progress · ✅ done · ⛔ blocked

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | `npm run build` clean, zero warnings | ✅ | pre-verified at build-loop step 10 (rebuild to confirm) |
| 2 | `npx serve out` — real export renders | ✅ | pre-verified step 10: `/`, assets, 404 all 200 |
| 3 | Every outbound GitHub link resolves (no 404s) | ✅ | 58 unique links, 0 dead vs repo `main` tree |
| 4 | 375px mobile layout clean | ☐ | **needs a real browser** — not testable this session (extension off) |
| 5 | `prefers-reduced-motion` — page readable & static | ☐ | guards verified in code/CSS; confirm with a live toggle |
| 6 | Lighthouse a11y ≥ 95 | ☐ | **needs a real browser** — structural a11y done (1×h1, skip link, focus rings, alt) |
| 7 | `loop-verifier` ACCEPT on artifact | ✅ | ACCEPTed at build-loop step 10 |
| 8 | Public deploy | ☐ | **HUMAN APPROVAL REQUIRED before running** |

## Pre-deploy human decisions (carried over from build-loop)

- **Course repo is PRIVATE** — every outbound link is path-correct but 404s for
  logged-out visitors until the repo is made public. Decide before deploying.
- **Set `NEXT_PUBLIC_SITE_URL`** to the real origin so `metadataBase` / OG-image
  URLs are absolute-correct (currently a `loop-engineering.vercel.app` placeholder).
- **OG image content-type**: host must serve the extension-less `out/opengraph-image`
  as `image/png` (Vercel/Next native; a bare static host needs a rule).
- **Live browser QA still owed**: 375px layout, Lighthouse a11y ≥ 95, copy-button
  click, hero depth-field 60fps + reduced-motion toggle (Chrome extension was
  disconnected throughout the build).

## Blockers

_none_
