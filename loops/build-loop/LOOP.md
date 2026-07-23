# build-loop — LOOP.md

**Role:** Construct the site from zero, one plan step per iteration, until 10/10 done.
**Status:** ACTIVE (stage 1 of the pipeline — see root `LOOP.md`).
**Cadence:** self-paced. Each iteration schedules the next via `ScheduleWakeup` (~60s).
**Autonomy:** runs to completion unattended. Stops only on all-done or a stuck step.

## Kickoff
```
/loop Run loops/build-loop/runbook.md
```

## Inputs
- `loop-landing-plan.md` — what to build (the 10 steps + each step's "done when" gate).
- `loops/build-loop/STATE.md` — which step is current, which are done.
- Shared: `loop-constraints.md`, `loop-budget.md`, `loop-ledger.json`.

## Reviewer gate
- Before EVERY commit, spawn the **`loop-verifier`** sub-agent on the step's diff.
- REJECT → count as a failed attempt (do not commit); ACCEPT → commit.

## Budget (see root loop-budget.md)
- ≤ 40 iterations/day, ≤ 800k tokens/day, 1 sub-agent spawn/iteration.

## Exit conditions
- **All 10 steps done** → append `handoff` to `loop-run-log.md`, flip `deploy-loop` to
  ACTIVE in root `LOOP.md` + root `STATE.md`, then `ScheduleWakeup stop:true`.
- **Step stuck** (3 failed attempts) → blocker to root `STATE.md` High Priority, stop.

## Human gates
- Local commits only, no push. No dependencies added beyond the plan (`motion` is the
  only optional one, and only when §6 needs it).
