# AGENTS.md (shared)

## Build & verify commands
```bash
npm run dev          # local dev server (manual checks)
npm run lint         # eslint — must be clean before a commit
npm run build        # Next.js static export → out/ ; must pass with zero warnings
npx serve out        # serve the real static export (verify the deployed artifact)
```

## Loop conventions
- Three sequenced loops — see `LOOP.md` for the pipeline and which one is active.
- One plan step per build iteration; one commit per verified step.
- Every build step is gated by the `loop-verifier` sub-agent before commit.
- Governance is shared at the root (`loop-constraints.md`, `loop-budget.md`,
  `loop-run-log.md`, `loop-ledger.json`). Per-loop config + state live in `loops/<name>/`.

## The plan
- `loop-landing-plan.md` is the source of truth for **what** to build (10 steps).
