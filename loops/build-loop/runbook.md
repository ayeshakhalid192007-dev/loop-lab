# build-loop — runbook (per-iteration procedure)

This is the exact procedure to run **once per iteration**. Do these steps in order and
stop when instructed. One iteration = one plan step.

---

### 0. Guardrails (always first)
1. Invoke the **`loop-constraints`** skill → read `loop-constraints.md`. Obey it.
2. Invoke the **`loop-budget`** skill → check `loop-budget.md` + `loop-run-log.md` spend.
   - Over cap or `loop-pause-all` set → append `budget-exceeded`/`no-op` to the run log,
     `ScheduleWakeup stop:true`, and STOP.

### 1. Pick the step
3. Read `loops/build-loop/STATE.md` → find the step marked ▶ (or the first ☐).
4. Read its attempt count in `loop-ledger.json` under key `build-loop/step-N`.
   - If attempts ≥ 3 → write a blocker to root `STATE.md` High Priority, stop the loop.
5. Read `loop-landing-plan.md` for that step's spec **and** its "done when" gate.

### 2. Implement
6. Implement **only** this step. Follow the plan's file layout (§3) and design tokens
   (§4). Respect the non-negotiables in `loop-constraints.md`.

### 3. Verify (inline)
7. Run the step's gate. At minimum: `npm run lint` and (once the app exists)
   `npm run build` must be clean. Add step-specific checks (e.g. step 2: spot-check that
   each URL in `lib/links.ts` resolves; step 10: `npx serve out`).
8. **Reviewer gate:** spawn the **`loop-verifier`** sub-agent on the diff for this step.
   - REJECT → go to step 10 (failed attempt).

### 4. Commit or retry
9. **Pass + ACCEPT:**
   - `git add -A && git commit -m "step N: <deliverable>"` (local only, no push).
   - Mark step ✅ in `loops/build-loop/STATE.md`, record the commit hash, set next step ▶.
   - Reset `build-loop/step-N` attempts in `loop-ledger.json`.
   - Append a `step-done` entry to `loop-run-log.md`.
10. **Fail or REJECT:**
   - Increment `build-loop/step-N` in `loop-ledger.json`.
   - If now ≥ 3 → blocker to root `STATE.md` High Priority, append `escalated`, STOP.
   - Else → append `retry`, leave the step ▶.

### 5. Continue or hand off
11. If all 10 steps are ✅:
   - Append `handoff` to `loop-run-log.md`.
   - In root `LOOP.md` + root `STATE.md`: set build-loop DONE, **deploy-loop ACTIVE**.
   - In `loops/deploy-loop/STATE.md`: set status to ready/active.
   - `ScheduleWakeup stop:true` (this loop is finished). STOP.
12. Otherwise → `ScheduleWakeup` in ~60s with prompt `Run loops/build-loop/runbook.md`,
   reason "building next plan step". STOP this iteration.
