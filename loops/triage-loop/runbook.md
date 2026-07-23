# triage-loop — runbook (per-run procedure)

Daily maintenance run. L1 = **report only**, no code changes.

---

### 0. Guardrails
1. `loop-constraints` skill → read + obey.
2. `loop-budget` skill → check spend; over cap → note it and exit.

### 1. Confirm the site is live
3. Read root `STATE.md`. If deploy-loop hasn't succeeded, this loop shouldn't be active —
   stop.

### 2. Checks (report, don't fix)
4. **Dead links:** resolve every outbound URL in `lib/links.ts`. Record any 404s.
5. **Build health:** `npm run build` — record pass/fail.
6. **Dependencies:** `npm outdated` / audit — record notable bumps or advisories.

### 3. Report
7. Write findings to `loops/triage-loop/STATE.md` (High Priority for anything broken,
   Watch List for anything to keep an eye on, Recent Noise for ignored items).
8. Summarize the headline in the root `STATE.md`.
9. Append one entry to `loop-run-log.md` (`outcome: report-only` or `escalated`).
10. Do **not** commit, push, or open PRs at L1. Next run fires on the daily schedule.
