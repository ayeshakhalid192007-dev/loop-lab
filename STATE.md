# STATE.md — Global Orchestration (shared)

The single board that answers: **which loop is live, what phase are we in, is anything
blocked?** Each loop keeps its own detailed board in `loops/<name>/STATE.md`; this file
is the pipeline-level view.

**Last run:** 2026-07-23 (build-loop iter 9 — step 9 done, polish in; one step left)
**Active loop:** `build-loop`
**Pipeline phase:** 1 / 3 — Build

## Pipeline status

| Stage | Loop | Status | Detail |
|-------|------|--------|--------|
| 1. Build   | build-loop  | ▶ in progress | 9 / 10 plan steps (polish in) — see `loops/build-loop/STATE.md` |
| 2. Deploy  | deploy-loop | ⛔ dormant     | waits for build 10/10 |
| 3. Triage  | triage-loop | ⛔ dormant     | waits for successful deploy |

## High Priority (loop is acting or waiting on a human)

_none_ — the 2026-07-23 budget pause was cleared: the human raised the caps
(build-loop → 1.1M, global → 1.3M) and the loop resumed at step 9. See
`loop-budget.md` → Alerts This Period.

## Watch List

- **Course repo is private.** Every outbound link is path-correct but will 404 for
  logged-out visitors. A human must make `ayeshakhalid192007-dev/LoopEngineering-CrashCourse`
  public (or accept the limitation) before deploy-loop ships this. Not a build blocker.

## Recent Noise (ignored this run)

_none_

---
Consolidated run log: `loop-run-log.md`
Attempt ledger: `loop-ledger.json`
