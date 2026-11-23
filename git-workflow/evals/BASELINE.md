# Baseline

Reference scores for the `git-workflow` eval suite. Compare future runs against
these to tell whether a change to `SKILL.md` or `references/capture.md` helped,
hurt, or did nothing.

Raw run output (`results/`) is gitignored. This file is the durable record.

## Reference run

```
claude plugin eval . --scaffold --allow-tools Write --judge-model sonnet --concurrency 4 --no-publish
```

| | |
|---|---|
| Date | 2026-11-23 |
| Agent model | opus |
| Judge model | sonnet |
| Claude Code | 2.1.329 |
| Runs per case | 3 per arm (36 agent runs) |
| Cost | $55.56, including the reruns below |

Cases 02, 04 and 05 were rerun on their own after their graders were reworded
with `--case <name>`; a bracket glob such as `0[245]-*` matched no case. The
table uses those reruns.

| case | with | without | Δ |
|---|---|---|---|
| 01-drag-reorder | 1.00 | 0.00 | +1.00 |
| 02-filter-flash-fix | 1.00 | 0.17 | +0.83 |
| 03-settings-restyle | 1.00 | 0.67 | +0.33 |
| 04-signup-error-copy | 1.00 | 0.50 | +0.50 |
| 05-palette-keyboard-nav | 0.83 | 0.00 | +0.83 |
| 06-projects-empty-state | 1.00 | 0.50 | +0.50 |
| **mean** | **0.97** | **0.31** | **+0.67** |

## Reading a comparison

**Δ is the number that matters.** Cases 01, 02 and 05 must get a video; 03, 04
and 06 must stay screenshot-only. Watch for:

- **A `no-video` grader failing** on 03, 04 or 06: the skill started adding
  videos to changes that screenshots show completely.
- **A video grader failing** on 01, 02 or 05: the skill fell back to screenshots
  for behavior.
- **`02-before-shows-flash` failing:** the journey no longer slows the orders
  request, so the loading flash would not show on camera.

Without the skill, the agent planned a video in 1 of 9 runs on the video cases,
so most of their Δ measures the skill's video path.

Two results are known noise:

- **`05-palette-keyboard-nav` journey grader failed 1 of 3 runs with the skill.**
  The video itself passed every run.
- **The baseline arm's screenshot table is bimodal** on 03, 04 and 06: it plans
  one in 0 to 1 of 3 runs.

## Caveats

- `--scaffold` copies each case's `change.diff` into the run, and
  `--allow-tools Write` lets the agent write `pr.md`. Both flags apply to both
  arms.
- These are dry runs: the agent writes `pr.md`, journeys and steps files but
  captures nothing. A journey that fails in a real recording, such as one that
  calls `setTimeout`, which the recording sandbox lacks, still passes here.
- The suite compares the skill with no skill. To compare two versions of the
  skill, run the suite after the change and compare it with this table.
