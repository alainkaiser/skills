# Skill evaluations

This repository evaluates every root skill as an agent workflow, not only as a final-answer
prompt. Promptfoo runs Codex against isolated fixtures and records routing, structured outcomes,
latency, token usage, traces, and a no-skill baseline.

## Why Promptfoo

Promptfoo is the primary runner because its Codex SDK provider now supports the surfaces this
repository needs: per-provider working directories, Codex structured output, streamed tool events,
heuristic `skill-used` and `not-skill-used` assertions, repeated runs, result history, and a local
comparison UI. The small Node layer in `evals/scripts/` only fills repository-specific gaps:

- materialize the current skill under `.agents/skills/<name>` without committing duplicate copies;
- create a matching baseline that contains the same task files but no target skill;
- keep every case in a separate workspace so file-changing cases cannot contaminate one another;
- run deterministic output and file assertions; and
- verify that every root skill has 10-20 cases with the required routing classes.

Evalite would still require a Codex adapter and skill-routing inference. A custom
`codex exec --json` harness would give more control, but would recreate Promptfoo's run matrix,
history, UI, repeat support, and Codex provider integration. Keep custom code here limited to
fixtures and checks that are specific to these skills.

Research basis:

- [OpenAI: Testing Agent Skills Systematically with Evals](https://developers.openai.com/blog/eval-skills)
  recommends 10-20 targeted prompts, JSONL trace checks, deterministic graders first, and a
  structured model-assisted rubric for qualitative checks.
- [OpenAI Codex customization documentation](https://developers.openai.com/codex/concepts/customization#skills) distinguishes
  explicit and implicit activation and makes `description` the implicit-routing surface.
- [Promptfoo: Test Agent Skills](https://www.promptfoo.dev/docs/guides/test-agent-skills/) covers
  side-by-side fixtures, outcome scoring, repeats, routing boundaries, and Codex trace evidence.
- [Promptfoo: OpenAI Codex SDK provider](https://www.promptfoo.dev/docs/providers/openai-codex-sdk/)
  documents the heuristic nature of Codex `skill-used`, structured output, tracing, latency, token
  usage, and authentication/isolation tradeoffs.
- [Evalite](https://www.evalite.dev/) remains a good Vitest-style local runner and UI, but does not
  remove the need for this repository's Codex launch, trace, skill-discovery, and artifact adapter.

## Coverage model

Each skill has exactly 10 initial cases in `evals/cases/<skill>.json`:

1. explicit routing;
2. implicit routing;
3. contextual routing;
4. negative routing; and
5. six procedure, outcome, constraint, or safety cases.

Routing cases run only against the skill workspace. Outcome cases run against both variants:

- `<skill>-with-skill`: the current repository skill is copied into the case's
  `.agents/skills/<skill>` directory;
- `<skill>-baseline`: the same fixture and prompt, without the target skill.

Baseline rows are measurements, so a low baseline quality score does not fail the command. The
with-skill row must route through the target skill and meet the deterministic threshold. The score
delta between the two providers is the measured effect of the skill for that task.

## Install and validate

Requirements: Node.js `^20.20.0` or `>=22.22.0`, pnpm, and an OpenAI API key for clean effect
comparisons. A signed-in Codex CLI is sufficient for the routing-only smoke mode.

```bash
pnpm install
pnpm eval:validate
```

`pnpm-workspace.yaml` explicitly disables optional native/browser package build scripts that the
Codex skill-eval path does not use. Enable a specific build only if a future eval adds a feature
that demonstrably requires it.

Validation does not call a model. It checks the catalog, prepares all isolated workspaces, and asks
Promptfoo to validate every generated config.

## Run one skill

```bash
pnpm eval:skill -- base-ui
```

Set `OPENAI_API_KEY` or `CODEX_API_KEY` for this full run. To verify only explicit, implicit,
contextual, and negative routing with an existing Codex login:

```bash
pnpm eval:skill -- base-ui --routing-only
```

The default model is `gpt-5.6-terra` at `high` reasoning. Override it explicitly when comparing
model behavior:

```bash
SKILL_EVAL_MODEL=gpt-5.6-sol SKILL_EVAL_REASONING=max \
  pnpm eval:skill -- simplify-dotnet-abstractions
```

Agent behavior is nondeterministic. Use at least three fresh repetitions before making a skill
revision decision:

```bash
SKILL_EVAL_REPEAT=3 pnpm eval:skill -- write-obvious-code
```

Run all seven suites sequentially only when the expected model usage is acceptable:

```bash
SKILL_EVAL_REPEAT=3 pnpm eval:all
```

One repeat currently means 16 Codex turns per skill: four routing rows and six outcome prompts
against two providers. A three-repeat full run therefore uses 336 Codex turns.

## Authentication and isolation

For full runs, set `OPENAI_API_KEY` or `CODEX_API_KEY`. Every Codex process then receives an isolated
`HOME` and `CODEX_HOME`, so user-installed copies of these skills cannot leak into the baseline.
The runner intentionally refuses a full baseline comparison without one of those keys.

Routing-only mode can reuse a signed-in Codex home. That mode does not produce a no-skill effect
score, and the exact-path assertion still requires Codex to read the fixture copy rather than a
globally installed skill with the same name. You can select the signed-in Codex home explicitly:

```bash
SKILL_EVAL_CODEX_HOME="$HOME/.codex" \
  pnpm eval:skill -- restore-local-dev-stack --routing-only
```

The runner never copies authentication files into fixtures or results.

## Results and qualitative judging

JSON results are written to `evals/results/<skill>.json` and ignored by Git. Open Promptfoo's local
comparison UI with:

```bash
pnpm eval:view
```

The default gate is deterministic. It checks trace-based routing, structured response fields,
case-specific required and forbidden behavior, question count, blocked state, file contents, and
review-only immutability. Every row also has a five-minute latency ceiling, overridable with
`SKILL_EVAL_MAX_LATENCY_MS` or `maxLatencyMs` on one case. Routing cases use a 0.5 deterministic
quality threshold because their hard gate is exact skill activation or non-activation. Outcome
cases use 0.75 so one wording-level miss does not outweigh otherwise correct behavior; raise
`minimumScore` on a case when every check is a hard invariant. Promptfoo also records latency and
token usage. Cost may be unavailable for models whose Codex usage payload does not expose every
billing component.

Add the optional second-pass model judge only after deterministic checks are useful:

```bash
SKILL_EVAL_JUDGE=1 pnpm eval:skill -- implement-figma-component
```

Override `SKILL_EVAL_JUDGE_PROVIDER` if a different grading model is required. Treat judge scores
as secondary evidence and inspect disagreements in the saved output and trace.

Use deep tracing only for a routing or procedure failure that needs more evidence:

```bash
SKILL_EVAL_DEEP_TRACE=1 pnpm eval:skill -- base-ui
```

## Known boundaries

- `eclipse` outcome cases test routing, planning, thread-count decisions, retry policy, and the
  required refusal when Codex thread tools or exact models are unavailable. A CLI Codex SDK run
  cannot prove a real desktop multi-thread orchestration; retain an app-level forward test for that
  integration boundary.
- `implement-figma-component` cases test evidence gates, base selection, and honest visual-proof
  reporting from local exported context. End-to-end parity still requires an authorized Figma
  connector and browser automation.
- `create-expense-report` starts with conversational and scope-safety cases. Generator correctness
  remains independently testable with deterministic Python tests and representative real PDFs;
  add those artifacts when they can be stored safely.
- Live-documentation cases, currently under `base-ui`, permit network access and can drift when the
  official documentation changes. That drift is intentional evidence that the skill must reconcile
  current docs with the pinned fixture version.

When a real failure appears, add the smallest prompt and fixture that reproduces it. Do not encode
the expected answer in the prompt; keep it in the case expectation and rubric.
