# Loop Run Log — consolidated (shared)

Every loop appends **one JSON entry per iteration** below the marker line. The
`loop-budget` skill sums `tokens_estimate` here to enforce the daily cap. Prune entries
older than 30 days.

## Format

```json
{
  "run_id": "2026-07-23T09:15:00Z",
  "loop": "build-loop | deploy-loop | triage-loop",
  "step": "step 3: NavBar + Hero + Footer",
  "attempt": 1,
  "duration_s": 45,
  "verifier": "ACCEPT | REJECT | n/a",
  "committed": true,
  "escalations": 0,
  "tokens_estimate": 52000,
  "outcome": "step-done | retry | escalated | no-op | handoff | budget-exceeded"
}
```

## Recent Runs

<!-- Loops append below this line -->
```json
{"run_id":"2026-07-23T00:00:01Z","loop":"build-loop","step":"step 1: scaffold + tokens + fonts + PillButton + Section","attempt":1,"duration_s":210,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":95000,"outcome":"step-done"}
{"run_id":"2026-07-23T12:00:00Z","loop":"build-loop","step":"step 2: lib/links.ts + lib/content.ts from the real repo","attempt":1,"duration_s":190,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":78000,"outcome":"step-done"}
{"run_id":"2026-07-23T12:05:00Z","loop":"build-loop","step":"step 3: NavBar + Hero + Footer","attempt":1,"duration_s":150,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":72000,"outcome":"step-done"}
{"run_id":"2026-07-23T12:10:00Z","loop":"build-loop","step":"step 4: Curriculum + PatternGrid","attempt":1,"duration_s":165,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":80000,"outcome":"step-done"}
{"run_id":"2026-07-23T12:20:00Z","loop":"build-loop","step":"step 5: LoopAnatomy + BuildingBlocks","attempt":1,"duration_s":170,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":82000,"outcome":"step-done"}
{"run_id":"2026-07-23T12:30:00Z","loop":"build-loop","step":"step 6: GetStarted + FinalCTA","attempt":1,"duration_s":240,"verifier":"ACCEPT","committed":true,"escalations":0,"tokens_estimate":98000,"outcome":"step-done"}
```
