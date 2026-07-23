# Loop Budget (shared)

> The `loop-budget` skill reads this file + `loop-run-log.md` at the start of every run
> and enforces early exit when over budget.

## Per-loop limits

| Loop | Max iterations/day | Max tokens/day | Max sub-agent spawns/iteration |
|------|--------------------|----------------|--------------------------------|
| build-loop  | 40  | 800k | 1 (`loop-verifier`) |
| deploy-loop | 6   | 150k | 1 (`loop-verifier`) |
| triage-loop | 2   | 100k | 0 (L1 report-only) |

## Global daily cap

- **Total tokens/day across all loops: 1,000,000.** At 80% (800k) → switch to
  report-only and stop starting new build steps.

## On budget exceed

1. Stop scheduling new iterations (`ScheduleWakeup stop:true`).
2. Append a `budget-exceeded` event to `loop-run-log.md`.
3. Write to `STATE.md` → High Priority and wait for a human.

## Kill switch

- Set `loop-pause-all: true` in `STATE.md` High Priority to halt the whole pipeline.
- Loops resume only after a human clears the flag.

## Estimate spend

```bash
npx @cobusgreyling/loop-cost --pattern build-loop
```

## Alerts This Period

- **2026-07-23 — build-loop self-throttled to report-only.** Logged spend reached
  ~697k, past 80% of the build-loop daily cap (640k of 800k). Steps 9–10 each need
  a `loop-verifier` sub-agent + commit, which report-only forbids, and step 9 would
  also cross the global 800k / 80% line mid-step. Loop paused after step 8 (8/10,
  site fully built + animated). Resume next budget period or after a human raises
  the cap. See root `STATE.md` → High Priority.
