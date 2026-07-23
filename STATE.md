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

- **✅ build-loop COMPLETE (10/10). deploy-loop is now ACTIVE and waiting on you.**
  The static export is deploy-ready (clean build, serves correctly, 58 links, zero
  dead). Before a public deploy — which **requires your explicit approval** — decide:
  (1) make the course repo **public** (or accept 404s for logged-out visitors);
  (2) set `NEXT_PUBLIC_SITE_URL`; (3) live browser QA still owed (375px, Lighthouse
  a11y, copy button, hero 60fps + reduced-motion) since the Chrome extension was off
  all build. Kick off with `/loop Run loops/deploy-loop/runbook.md`.
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
