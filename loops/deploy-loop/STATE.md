# deploy-loop — STATE.md

**Last iteration:** 2026-07-23 (iter 1 — live browser QA via Playwright; checks 1–7 ✅; one a11y fix landed)
**Status:** ⏸ ACTIVE, parked at the human deploy gate. All automated + browser
checks pass (checks 1–7). The only thing left is the **human-gated public deploy**
(check 8) plus the pre-deploy decisions below. Resume with
`/loop Run loops/deploy-loop/runbook.md` after those are settled.

## Deploy checklist (runs on activation)

Statuses: ☐ todo · ▶ in progress · ✅ done · ⛔ blocked

| # | Check | Status | Notes |
|---|-------|--------|-------|
| 1 | `npm run build` clean, zero warnings | ✅ | rebuilt during QA — clean, zero warnings |
| 2 | `npx serve out` — real export renders | ✅ | Playwright on the real export: `/`, assets, 404 all 200; 0 console errors |
| 3 | Every outbound GitHub link resolves (no 404s) | ✅ | 58 unique links, 0 dead vs repo `main` tree (paths correct; see private-repo note) |
| 4 | 375px mobile layout clean | ✅ | Playwright @360px content width: 0px horizontal overflow, 0 offending elements |
| 5 | `prefers-reduced-motion` — page readable & static | ✅* | *CSS double-guard verified (no-preference + @supports); content opacity 1 by default, axe found nothing hidden. Live OS toggle not exercised (Playwright MCP has no emulateMedia). |
| 6 | Lighthouse a11y ≥ 95 | ✅ | axe-core WCAG 2 A/AA: **0 violations, 21 passes** after fixing one metaphor-label contrast issue (`a697628`) → maps to a11y ~100 |
| 7 | `loop-verifier` ACCEPT on artifact | ✅ | ACCEPTed at build-loop step 10; a11y fix re-verified (`a697628`) |
| 8 | Public deploy | ☐ | **HUMAN APPROVAL REQUIRED before running** |

## Live-QA extras confirmed this iteration
- **Copy button works**: clicking it wrote the exact clone command to the clipboard and flipped the label to "Copied".
- **Private repo confirmed user-facing**: in an unauthenticated browser, the GitHub links render "Page not found" — the paths are correct, but the repo must be public before these work for visitors. (Still item #1 below.)

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
