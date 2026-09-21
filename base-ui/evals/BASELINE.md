# Baseline

Reference scores for the `base-ui` eval suite. Compare future runs against these
to tell whether a change to `SKILL.md` helped, hurt, or did nothing.

Raw run output (`results/`) is gitignored — it is ~350KB per run and embeds full
model outputs and sandbox paths. This file is the durable record.

## Reference run

```
claude plugin eval . --ablation with-without --judge-model sonnet --allow-tools WebFetch
```

| | |
|---|---|
| Date | 2026-09-21 |
| Agent model | opus |
| Judge model | sonnet |
| Claude Code | 2.1.278 |
| Runs per case | 3 (42 agent runs) |
| Duration | 742s |
| Cost | $14.05 |

| case | with | without | Δ |
|---|---|---|---|
| 01-drawer-snap-points | 1.00 | 0.87 | +0.13 |
| 02-select-grouped | 1.00 | 0.93 | +0.07 |
| 03-aschild-trap | 1.00 | 0.78 | +0.22 |
| 04-tooltip-delay | 1.00 | 0.75 | +0.25 |
| 05-combobox-ids | 1.00 | 0.67 | +0.33 |
| 06-neg-radix | 1.00 | 1.00 | 0.00 |
| 07-neg-shadcn | 0.89 | 1.00 | -0.11 |
| **mean** | **0.98** | **0.86** | **+0.13** |

## Reading a comparison

**Δ is the number that matters**, not the pass rate. A run where both arms score
1.00 means the skill added nothing, however good the output looks.

- **Δ below +0.13** on a case that previously showed uplift — the skill regressed.
- **`skill-fired` missing** on cases 01-05 — the skill stopped triggering.
- **`skill-not-fired` failing** on cases 06-07 — the skill started over-triggering
  on Radix or shadcn/ui work.

Two results are known noise rather than signal:

- **`07-neg-shadcn` scored 0.89 with the plugin, but the skill never fired.** In
  one of three runs the model asked a clarifying question instead of writing
  code, because the eval sandbox starts as an empty directory.
- **The baseline arm is bimodal.** Given `WebFetch`, it sometimes reads the live
  docs and sometimes answers from memory. The same prompt scored 1.00 and 0.20
  on separate single runs. Cases are pinned to `runs: 3` for this reason; compare
  only full runs, and treat small movements in Δ as noise.

## What the baseline gets wrong

The gap this suite measures is API currency, not knowledge. Unassisted runs
produced:

- the retired `@base-ui-components/react` import instead of `@base-ui/react`
- "Base UI doesn't ship a bottom-sheet or drawer component, and none of its
  primitives have snap points or drag support", followed by ~200 lines of
  hand-rolled drag math — `Drawer` with `snapPoints` has shipped

## Caveats

- `--allow-tools WebFetch` is required. The skill's first step is fetching
  `base-ui.com/llms.txt`, but eval cases start from a read-only tool set. The
  flag grants the capability to **both** arms, which keeps the comparison honest.
- With the skill at 1.00 across every case, this suite is a regression guard, not
  an improvement tool. Measuring future gains needs harder cases: prompts that
  never name Base UI, or a fixture repo pinning an older version so the
  reconciliation step is actually exercised.
- Base UI moves fast. These cases assert against v1.8.0 (Sep 2026). If a case
  starts failing in **both** arms, check whether the API changed before assuming
  the skill broke.
