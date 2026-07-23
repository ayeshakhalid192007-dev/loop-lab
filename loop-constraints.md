# Loop Constraints (shared — binding for ALL loops)

> The `loop-constraints` skill reads this file at the START of every run, before any
> action. Rules here are **binding** — every loop MUST obey them. Add rules in plain
> English; the loop reads them verbatim.

## Scope & pacing
- **One plan step per build iteration.** Never batch multiple steps into one run.
- Never refactor or touch code unrelated to the current step.
- Follow `loop-landing-plan.md` as the source of truth for *what* to build. Don't invent
  scope not in the plan.

## Git & commits (local only)
- This repo has **no remote**. Never add one, never push, without asking me first.
- One completed+verified step = **one commit**. Message: `step N: <deliverable>`.
- Never commit a step that failed its verification gate.
- Never `git reset --hard`, `git clean`, or delete files outside the current step's scope.

## Reviewer gate
- Before committing any build step, spawn the **`loop-verifier`** sub-agent to
  independently check it. If it REJECTS, do not commit — treat as a failed attempt.
- The verifier never writes fixes; it only accepts or rejects.

## Attempt limit (enforced mechanically)
- **Max 3 attempts per step.** Log each attempt to `loop-ledger.json` and check it
  before retrying.
- On the 3rd failed attempt: write a blocker to `STATE.md` → High Priority, **stop the
  loop**, and escalate to me. Do not keep retrying.

## Paths (never edit)
- Never edit `.env`, `.env.*`, `auth/`, `payments/`, `secrets/`, `credentials/`.
- Never edit infrastructure configs without human approval.

## Deploy
- Building a static export (`npm run build`, `out/`) is allowed freely.
- A **public deploy** (`vercel`, `vercel --prod`, any push to a hosting provider)
  requires explicit human approval. `deploy-loop` must stop and ask.

## Plan non-negotiables (from loop-landing-plan.md §6.5)
- **Content visible by default.** Never ship an element at `opacity: 0` in inline styles
  with no fallback — a browser without scroll-animation support must show a full page.
- **Respect `prefers-reduced-motion`.** Every section must be readable and static with
  reduced motion on. This is an accessibility requirement, not a nicety.
- Only animate `opacity` and `transform`. No animating layout properties on scroll.

## Communication
- Tell me what you're about to do before a public/irreversible action (deploy, remote).
- Never close or delete work without my approval.

## Budget
- If token spend hits 80% of the daily cap (`loop-budget.md`), switch to report-only.
- If the kill switch `loop-pause-all` is set in `STATE.md`, exit immediately.

---
<!-- Add your own rules below in plain English. The loop reads this verbatim. -->
