# Subscription skill evaluations

Run actual repository tasks through the installed Codex or Claude Code CLI using your existing subscription login. No API key, Promptfoo service, paid model judge, or new npm dependency is needed. Runs consume your subscription allowance; this runner does not buy credits or fall back to API billing.

From the repository root:

```sh
python3 evals/subscription/run.py --models astra sol --output evals/subscription/results/codex.json
python3 evals/subscription/run.py --models fable opus --output evals/subscription/results/claude.json
```

Use `--cases consumer-wiring` for a small first run. Authentication uses `codex login` or `claude auth login`; an expired cached login can pass the local status check but still fail on the first request. Authentication, quota, runtime, or timeout failures interrupt the run and are recorded separately from failed skill outcomes. The runner never logs credentials. In a sandboxed parent session, the CLI may need normal host access to its Keychain and local runtime; Codex workers still use a workspace sandbox.

The receipt fixture uses the expense generator's existing `pypdf` dependency. Use the Python environment that already supports that generator. The other cases use Python's standard library and Node.js.

## What the comparison measures

Each case starts in a fresh temporary directory and runs in three arms:

- `baseline`: the task without skill instructions. The receipt case retains the original generator and manifest template as necessary task contracts.
- `original`: the skill and supporting resources at `--original-ref` (defaults to the current commit, recorded as its immutable SHA).
- `revised`: the working-tree skill and supporting resources.

Global skill discovery and personal customization are excluded from the controlled comparison. Skills are loaded explicitly, so this suite measures behavior after activation, not whether the host picks the right skill automatically. Coordinator effort is fixed to `medium`. The runner requests delegation to be disabled, but this host still exposed a collaboration tool in a historical Sol test. Such runs are marked `delegation_observed`; treat them as workflow results, not proof about a single model. Do not compare provider token counts as billing costs. Missing trace coverage is not proof that no delegation occurred.

The runner checks resulting artifacts, preserved files, and scope. It executes the JavaScript outputs against behavior cases, checks exact receipt sets and amounts, verifies service wiring and authentication, and checks abstraction verdicts against the fixture's actual responsibilities. A passing refactor preserves behavior; readability still needs a separate blinded review of the code.

Results include the task and skill text, input-file hashes, the skill hash, original revision, commands, available tool-event metadata, final responses, outcome checks, elapsed time, usage, and produced text artifacts. Temporary workspaces are retained for inspection; remove only the directory named by the result's `workspace` after reviewing it. Existing `.eval-workspaces`, `.eval-cache`, and historical exports are untouched.

Result directories are ignored by Git. Keep raw exports local: they contain machine paths, full model responses, and tool metadata. Publish a reviewed summary such as [the evaluation report](REPORT.md) instead of committing raw run output.

## How to improve a skill from a run

1. Inspect failures and actual artifacts. Separate an incorrect skill decision from a missing tool, login, dependency, or incomplete grader.
2. Change only the instruction responsible for an observed failure.
3. Rerun the affected case and adjacent cases that the edit could change. Use `--repeats 3` when a single outcome could be noise.
4. Keep the baseline and original results. Report improvement only for completed, matched comparisons; do not count missing runs as passes or generalize one fixture into a model-wide claim.

These are synthetic regression cases, not full production benchmarks. Live Figma parity, mobile device behavior, automatic routing, and broad code quality remain separate evidence requirements.

The optional `--cases design-export` case uses an inspected SVG design export and checks rendered geometry, styles, keyboard focus, and activation in Chromium at two viewport sizes. It requires an existing Playwright installation and browser; set `SKILL_EVAL_PLAYWRIGHT_MODULE` to the module path if the host supplies a bundled runtime. It does not install browsers or packages. This tests the export workflow, not live Figma authentication or connector behavior.
