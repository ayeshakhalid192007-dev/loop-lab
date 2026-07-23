# LOOP.md — Master Registry (shared)

This is the top-level registry for the **`loop-landing` autonomous build system**.
Three loops run as a **sequenced pipeline**, not concurrently. Each loop has its own
config + state under `loops/<name>/`. Governance (constraints, budget, ledger, run log)
is **shared** and lives at the root — one source of truth for every loop.

> Read order for any run: this file → the active loop's `loops/<name>/LOOP.md`
> → `loops/<name>/runbook.md` → shared `loop-constraints.md` → shared `loop-budget.md`.

---

## The pipeline

```
build-loop  ──(all 10 steps done)──▶  deploy-loop  ──(deployed & verified)──▶  triage-loop
 self-paced                            one-shot + on-demand                    daily, forever
 ✅ DONE (10/10)                       ACTIVE (awaiting human deploy approval)  DORMANT
```

Only **one loop is active at a time.** A loop activates the next one by flipping its
`Status` in this table and in the target loop's `STATE.md`, then stopping itself.

## Loop registry

| Loop | Dir | Cadence | Status | Kickoff command | Reviewer gate |
|------|-----|---------|--------|-----------------|---------------|
| build-loop  | `loops/build-loop`  | Self-paced (~60s) | ✅ **DONE** | `/loop Run loops/build-loop/runbook.md`  | `loop-verifier` sub-agent before every commit |
| deploy-loop | `loops/deploy-loop` | Once, then on-demand | **ACTIVE** | `/loop Run loops/deploy-loop/runbook.md` | `loop-verifier` on the deployed artifact |
| triage-loop | `loops/triage-loop` | `1d` | DORMANT | `/loop 1d Run loops/triage-loop/runbook.md` | report-only (L1) |

## Human gates (apply to every loop)

- **Autonomy:** build-loop runs to completion unattended. It stops ONLY on: all steps
  done, or a step stuck past the attempt limit (see `loop-constraints.md`).
- **No push:** local commits only. No remote exists; never add one or push without asking.
- **Deploy is gated:** `deploy-loop` may build a static export freely, but a *public
  deploy* (e.g. `vercel --prod`) requires human approval — see `loops/deploy-loop/LOOP.md`.
- **Escalations** land in the shared `STATE.md` → High Priority, and pause the pipeline.

## Shared scaffold files (root)

| File | Purpose |
|------|---------|
| `STATE.md`            | Global orchestration state — which loop is live, overall phase, escalations |
| `loop-constraints.md` | Binding rules for **all** loops (the `loop-constraints` skill reads this) |
| `loop-budget.md`      | Token / iteration caps, global + per-loop |
| `loop-run-log.md`     | Consolidated run log — every loop appends one JSON entry per iteration |
| `loop-ledger.json`    | Machine attempt-tracking, keyed by `loop/step`, enforces the max-attempt rule |
| `AGENTS.md`           | Build / test / verify commands |
| `loop-landing-plan.md`| **The source of truth for WHAT to build.** Unchanged by the loops. |

## Kicking it off

Start the pipeline by launching the active loop:

```
/loop Run loops/build-loop/runbook.md
```

It self-paces via `ScheduleWakeup`, one build step per iteration, until the site is
built — then it hands off to `deploy-loop`.
