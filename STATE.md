# STATE.md — Global Orchestration (shared)

The single board that answers: **which loop is live, what phase are we in, is anything
blocked?** Each loop keeps its own detailed board in `loops/<name>/STATE.md`; this file
is the pipeline-level view.

**Last run:** never
**Active loop:** `build-loop`
**Pipeline phase:** 1 / 3 — Build

## Pipeline status

| Stage | Loop | Status | Detail |
|-------|------|--------|--------|
| 1. Build   | build-loop  | ⏳ not started | 0 / 10 plan steps — see `loops/build-loop/STATE.md` |
| 2. Deploy  | deploy-loop | ⛔ dormant     | waits for build 10/10 |
| 3. Triage  | triage-loop | ⛔ dormant     | waits for successful deploy |

## High Priority (loop is acting or waiting on a human)

_none_

## Watch List

_none_

## Recent Noise (ignored this run)

_none_

---
Consolidated run log: `loop-run-log.md`
Attempt ledger: `loop-ledger.json`
