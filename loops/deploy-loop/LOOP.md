# deploy-loop — LOOP.md

**Role:** Once the site is built, produce a clean static export, verify the deployed
artifact, and (with human approval) publish it.
**Status:** DORMANT — activates when `build-loop` reports 10/10 done.
**Cadence:** one-shot on activation, then on-demand for redeploys.
**Autonomy:** builds/verifies freely; **a public deploy needs human approval.**

## Kickoff (auto-flipped by build-loop; or manually)
```
/loop Run loops/deploy-loop/runbook.md
```

## Inputs
- The built site (all 10 build steps committed).
- Shared: `loop-constraints.md`, `loop-budget.md`, `AGENTS.md`.

## Reviewer gate
- Spawn **`loop-verifier`** on the **deployed artifact** (the `out/` export and, if
  published, the live URL) — build clean, links resolve, a11y ≥ target.

## Budget
- ≤ 6 iterations/day, ≤ 150k tokens/day.

## Human gate (hard)
- `npm run build` / `npx serve out` — allowed.
- `vercel`, `vercel --prod`, any push to a host — **STOP and ask the human first.**

## Exit conditions
- Static export verified (and, if approved, deployed & live) → append `handoff`,
  flip `triage-loop` to ACTIVE, `ScheduleWakeup stop:true`.
- Verification fails 3× → blocker to root `STATE.md` High Priority, stop.
