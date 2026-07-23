# STATE.md — Global Orchestration (shared)

The single board that answers: **which loop is live, what phase are we in, is anything
blocked?** Each loop keeps its own detailed board in `loops/<name>/STATE.md`; this file
is the pipeline-level view.

**Last run:** 2026-07-23 (build-loop iter 8 — step 8 done, signature motion in)
**Active loop:** `build-loop`
**Pipeline phase:** 1 / 3 — Build

## Pipeline status

| Stage | Loop | Status | Detail |
|-------|------|--------|--------|
| 1. Build   | build-loop  | ▶ in progress | 8 / 10 plan steps (signature motion in) — see `loops/build-loop/STATE.md` |
| 2. Deploy  | deploy-loop | ⛔ dormant     | waits for build 10/10 |
| 3. Triage  | triage-loop | ⛔ dormant     | waits for successful deploy |

## High Priority (loop is acting or waiting on a human)

- **⏸ build-loop paused on budget — human decision needed.** Logged spend hit ~697k,
  past 80% of the build-loop daily cap (640k of 800k) → report-only mode. Steps 9
  (polish: responsive/a11y/metadata/OG) and 10 (deploy readiness) each require a
  `loop-verifier` sub-agent + commit, which report-only forbids; step 9 would also
  cross the global 800k line mid-step. **Loop stopped after step 8 (8/10).** The
  site is fully built, link-verified, and motion-complete. To continue: raise the
  cap in `loop-budget.md` (or wait for the daily reset), then re-run `/loop`.

## Watch List

- **Course repo is private.** Every outbound link is path-correct but will 404 for
  logged-out visitors. A human must make `ayeshakhalid192007-dev/LoopEngineering-CrashCourse`
  public (or accept the limitation) before deploy-loop ships this. Not a build blocker.

## Recent Noise (ignored this run)

_none_

---
Consolidated run log: `loop-run-log.md`
Attempt ledger: `loop-ledger.json`
