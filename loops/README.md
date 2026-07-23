# loops/ — the autonomous build system

Three loops build, ship, and maintain the `loop-landing` site as a **sequenced
pipeline** (not concurrent — concurrent loops on a shared working tree race).

```
build-loop ──▶ deploy-loop ──▶ triage-loop
  ACTIVE        dormant          dormant
```

## Layout

```
loop-landing/
├── LOOP.md               shared: master registry (which loop is active + pipeline)
├── STATE.md              shared: global orchestration state
├── loop-constraints.md   shared: binding rules for all loops
├── loop-budget.md        shared: token / iteration caps
├── loop-run-log.md       shared: consolidated per-iteration log
├── loop-ledger.json      shared: attempt tracking (enforces max-3)
├── AGENTS.md             shared: build / verify commands
├── loop-landing-plan.md  the WHAT (unchanged by loops)
└── loops/
    ├── build-loop/   { LOOP.md, STATE.md, runbook.md }
    ├── deploy-loop/  { LOOP.md, STATE.md, runbook.md }
    └── triage-loop/  { LOOP.md, STATE.md, runbook.md }
```

Each loop owns its **identity** files (`LOOP.md`, `STATE.md`, `runbook.md`).
**Governance** (constraints, budget, run log, ledger) is shared at the root so there's
one source of truth for guardrails and spend.

## The reviewer

Not a loop — a **gate**. Every build/deploy iteration spawns the `loop-verifier`
sub-agent to independently accept/reject the change before it's committed or shipped.

## Run it

```
/loop Run loops/build-loop/runbook.md
```

The build loop self-paces (one plan step per iteration) until the site is done, then
flips `deploy-loop` to ACTIVE. Deploy verifies the artifact (public deploy needs your
approval) and flips `triage-loop` to ACTIVE for ongoing maintenance.
