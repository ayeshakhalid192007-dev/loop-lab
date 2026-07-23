# STATE.md — Global Orchestration (shared)

The single board that answers: **which loop is live, what phase are we in, is anything
blocked?** Each loop keeps its own detailed board in `loops/<name>/STATE.md`; this file
is the pipeline-level view.

**Last run:** 2026-07-23 (build-loop iter 10 — step 10 verified; build COMPLETE, handed off)
**Active loop:** `deploy-loop`
**Pipeline phase:** 2 / 3 — Deploy (awaiting human deploy approval)

## Pipeline status

| Stage | Loop | Status | Detail |
|-------|------|--------|--------|
| 1. Build   | build-loop  | ✅ done       | 10 / 10 plan steps — see `loops/build-loop/STATE.md` |
| 2. Deploy  | deploy-loop | ▶ active      | export deploy-ready; public deploy needs human approval — see `loops/deploy-loop/STATE.md` |
| 3. Triage  | triage-loop | ⛔ dormant     | waits for successful deploy |

## High Priority (loop is acting or waiting on a human)

- **✅ build-loop COMPLETE (10/10). deploy-loop QA done — parked at the human deploy gate.**
  Live browser QA (Playwright + axe-core) is complete: 375px clean (0 overflow),
  **a11y 0 violations / 21 passes** (~100, after one contrast fix `a697628`), copy
  button works, 0 console errors. Checks 1–7 all green. **Only the human-gated public
  deploy (check 8) remains**, plus these decisions before deploying:
  (1) make the course repo **public** — confirmed: links 404 for logged-out visitors
  until then; (2) set `NEXT_PUBLIC_SITE_URL` for absolute OG/metadata URLs.
  When ready: `/loop Run loops/deploy-loop/runbook.md`, then approve the deploy.
  Details in `loops/deploy-loop/STATE.md`.

_(Cleared 2026-07-23: the budget pause — human raised caps to 1.1M/1.3M; see
`loop-budget.md` → Alerts.)_

## Watch List

- **Course repo is private.** Every outbound link is path-correct but will 404 for
  logged-out visitors. A human must make `ayeshakhalid192007-dev/LoopEngineering-CrashCourse`
  public (or accept the limitation) before deploy-loop ships this. Not a build blocker.

## Recent Noise (ignored this run)

_none_

---
Consolidated run log: `loop-run-log.md`
Attempt ledger: `loop-ledger.json`
