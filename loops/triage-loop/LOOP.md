# triage-loop — LOOP.md

**Role:** Ongoing maintenance once the site is live — watch for dead GitHub links, build
breaks, and dependency bumps. Report only; no auto-fix in week one (L1).
**Status:** DORMANT — activates after `deploy-loop` succeeds.
**Cadence:** `1d` (daily).
**Autonomy:** L1 report-only. No commits, no PRs. Findings → root `STATE.md`.

## Kickoff (auto-flipped by deploy-loop; or manually)
```
/loop 1d Run loops/triage-loop/runbook.md
```

## Inputs
- The live/exported site.
- Shared: `loop-constraints.md`, `loop-budget.md`.

## What it watches
- **Dead links:** every outbound GitHub URL in `lib/links.ts` still resolves (no 404s).
- **Build health:** `npm run build` still clean.
- **Dependencies:** outdated/vulnerable packages (report, don't upgrade at L1).

## Budget
- ≤ 2 runs/day, ≤ 100k tokens/day, 0 sub-agent spawns (L1).

## Escalation to L2 (auto-fix) — requires human opt-in
- Only after a week of clean L1 reports and explicit approval. Then: draft-PR-style
  fixes via a worktree, one fix per run, `loop-verifier` gate, max 3 attempts.
