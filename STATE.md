# STATE.md — Global Orchestration (shared)

The single board that answers: **which loop is live, what phase are we in, is anything
blocked?** Each loop keeps its own detailed board in `loops/<name>/STATE.md`; this file
is the pipeline-level view.

**Last run:** 2026-07-23 (build-loop iter 6 — step 6 done, static page complete)
**Active loop:** `build-loop`
**Pipeline phase:** 1 / 3 — Build

## Pipeline status

| Stage | Loop | Status | Detail |
|-------|------|--------|--------|
| 1. Build   | build-loop  | ▶ in progress | 6 / 10 plan steps (static page done) — see `loops/build-loop/STATE.md` |
| 2. Deploy  | deploy-loop | ⛔ dormant     | waits for build 10/10 |
| 3. Triage  | triage-loop | ⛔ dormant     | waits for successful deploy |

## High Priority (loop is acting or waiting on a human)

_none_

## Watch List

- **Course repo is private.** Every outbound link is path-correct but will 404 for
  logged-out visitors. A human must make `ayeshakhalid192007-dev/LoopEngineering-CrashCourse`
  public (or accept the limitation) before deploy-loop ships this. Not a build blocker.

## Recent Noise (ignored this run)

_none_

---
Consolidated run log: `loop-run-log.md`
Attempt ledger: `loop-ledger.json`
