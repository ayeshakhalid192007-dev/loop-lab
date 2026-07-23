# deploy-loop — runbook (per-iteration procedure)

Runs after `build-loop` hands off. One iteration = advance the deploy checklist.

---

### 0. Guardrails
1. `loop-constraints` skill → read + obey `loop-constraints.md`.
2. `loop-budget` skill → check spend; over cap → stop + escalate.

### 1. Confirm readiness
3. Verify build-loop is DONE (root `STATE.md`). If not, stop — this loop shouldn't run.

### 2. Build & verify the artifact
4. `npm run build` — must be clean, zero warnings. Fail → log `retry`, increment
   `deploy-loop/deploy` in `loop-ledger.json`; ≥ 3 → escalate + stop.
5. `npx serve out` and verify the **static export** (not dev): render, then walk the
   checklist in `loops/deploy-loop/STATE.md` — links resolve, 375px, reduced-motion,
   Lighthouse a11y.
6. **Reviewer gate:** spawn `loop-verifier` on the artifact. REJECT → failed attempt.

### 3. Publish (gated)
7. If checklist 1–7 are ✅ and a public deploy is wanted:
   - **STOP and ask the human for approval.** Do not run `vercel` / `vercel --prod`
     or any host push without an explicit yes (see `loop-constraints.md`).
   - On approval → deploy, then verify the live URL.

### 4. Hand off
8. Static export verified (and deploy done if approved):
   - Append `handoff` to `loop-run-log.md`.
   - Root `LOOP.md` + `STATE.md`: deploy-loop DONE, **triage-loop ACTIVE**.
   - `loops/triage-loop/STATE.md`: set active, record the live URL if any.
   - `ScheduleWakeup stop:true`. STOP.
9. Else if not finished → `ScheduleWakeup` ~120s, `Run loops/deploy-loop/runbook.md`.
