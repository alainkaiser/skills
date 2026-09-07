# Custom skill review and evaluation — 2026-09-07

After this evaluation, Eclipse and its cases were removed. The results below record the completed evaluation before removal. Five revised skills remain alongside the unchanged Base UI skill. The subsequently integrated upstream changes add the Mobile Web Interactions source and restore the original Promptfoo framework; that framework and the subscription runner are both retained.

The skills do not need a blanket rewrite for a new model generation. The useful changes remove rigid model routing, contradictory stopping rules, unnecessary confirmation turns, and instructions that encourage avoidable work. Six repository skills were initially revised; Base UI was left unchanged.

The direction follows the current [Astra guidance](https://developers.openai.com/api/docs/guides/latest-model), which calls out literal skill following, premature clarification, and excessive testing. [Fable guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) likewise favors brief instructions, bounded scope, and progress grounded in tool results. The skills keep task-specific evidence requirements rather than prescribing a reasoning setting for every model.

## Applied changes

| Skill | Change | Evidence / limit |
| --- | --- | --- |
| Eclipse | Use the active model and available delegation mechanism; preserve explicit user choices. Allow direct implementation of small work. Remove compulsory Sol/Luna/Max routing and separate-task creation. | Original skill blocked Astra on an actionable one-line fix; revised skill completed it. Sol original could complete through a delegated workflow. |
| Implement Figma Component | Discover placement, accept inspected exports, use available tool schemas, reuse screenshots, avoid repository checklist copies, and keep unexplained mismatches classified as unresolved. | Original, revised, and baseline passed the SVG export fixture in Chromium at 360px and 768px. This fixture did not demonstrate an accuracy lift; the contradiction fixes are supported by instruction review. |
| Write Obvious Code | Bound verification and preserve clear immutable value selections instead of introducing assignments merely to avoid ternaries. | A blinded comparison found the initial skill output slightly more cumbersome than baseline. Both targeted reruns removed that extra mutation and preserved all 48 tested combinations. |
| Create Expense Report | Honor already-specified scope; skip redundant confirmations for complete generation requests; resolve installed script paths; reuse working Python dependencies instead of upgrading them automatically. | All three arms preserved the exact receipt set and amounts. A revised-arm manifest also generated a valid workbook and three-page PDF with CHF 79.90 total. Guided intake and scope locking remain intact. |
| Restore Local Dev Stack | Keep service maps proportional, reuse unaffected proof, respect existing authorization, and filter resolved Compose configuration before displaying it. | All three arms repaired the correct consumer endpoint while preserving authentication. No measured accuracy lift in this synthetic case. |
| Simplify .NET Abstractions | Diagnose failed checks before undoing a refactor; preserve user changes and avoid repeating valid checks. | All three arms collapsed the irrelevant interface and retained the authorization boundary. No measured accuracy lift in this case. |
| Base UI | No change. Installed-version reconciliation and official documentation remain useful guidance. | Instruction review only; not benchmarked against a real Base UI project in this run. |

Eclipse and the Figma entrypoint became roughly one-third shorter. The other edits preserve the existing domain workflows rather than replacing them with model-specific prompting tricks.

## Actual comparisons

The suite ran 26 trials: 20 with Astra as coordinator (including two readability reruns), and six with Sol as coordinator. Twenty-five passed their artifact checks; the failure was Astra with the original Eclipse instructions. These counts describe this small synthetic suite, not a general success rate.

| Case | Coordinator | No skill | Original | Revised |
| --- | --- | --- | --- | --- |
| Exact-expiry fix / Eclipse | Astra | Pass | Fail: requested a model/workflow substitution instead of editing | Pass |
| Readable refactor | Astra | Pass | Pass | Pass, plus two passing refined-skill reruns |
| Locked receipt manifest | Astra | Pass | Pass | Pass |
| Consumer endpoint repair | Astra | Pass | Pass | Pass |
| .NET boundary review | Astra | Pass | Pass | Pass |
| Design export implementation | Astra | Pass | Pass | Pass |
| Exact-expiry fix / Eclipse | Sol | Pass | Pass via delegated workflow | Pass |

The initial blinded readability review ranked baseline above revised above original, with baseline and revised close. Its concrete concern was additional mutable initialization/reassignment. The refinement addressed that observation; the two reruns used simple immutable selections. This is one independent model review plus inspected artifacts, not a statistical readability benchmark or proof that the refined skill beats baseline generally.

The Sol comparison was repeated after its original-arm response claimed delegation. The repeated run recorded a collaboration tool call despite delegation-disable flags. It therefore supports the workflow outcome only; neither Sol original arm is used as evidence of isolated Sol-only performance. The runner now records available tool-event metadata and flags observed delegation.

## Reusable evaluation route

Use the [local subscription runner](README.md). It requires no API key, Promptfoo service, or paid model judge. Codex ran through subscription authentication. The runner strips API-key/provider overrides and stops on authentication, quota, runtime, or timeout errors instead of falling back to paid APIs. It consumes subscription allowance.

The Claude subscription probe was unavailable because authentication had expired. No successful Fable or Opus inference was run, so these models remain unverified by this evaluation. A valid `claude auth login` is required to run the documented Claude comparison.

At the time of evaluation, the checkout contained a Promptfoo export with four passing routing results but no completed baseline or outcome comparison, and its runner/assertion sources were absent. Those sources arrived in upstream changes integrated after the evaluation. The export was preserved locally. The subscription suite complements the restored framework; these results do not claim to validate its full routing coverage.

## Validation and limits

- All seven repository skill frontmatters and UI metadata parsed successfully; referenced local resources exist; `git diff --check` passed.
- The bundled skill validator could not be used with the available Python because PyYAML is missing. Ruby YAML parsing and explicit metadata/reference checks supplied structural validation without installing dependencies.
- Each core grader rejected the unfixed/incomplete fixture and accepted a valid outcome. The browser grader likewise rejected wrong geometry/styles and accepted the expected design plus keyboard focus/activation at both viewport sizes.
- JavaScript refactors were executed against 48 input combinations; scope checks covered existing protected files and unexpected new files.
- The expense generator was run on an actual model-produced manifest; XLSX amounts, PDF page count, and the displayed CHF total matched.
- These are synthetic tasks with forced skill loading. Automatic discovery, broad production quality, live Figma connectors, real mobile devices, and Base UI integration remain unmeasured. Most tested baselines already passed, so there is no evidence here for a sweeping skill-driven quality gain across the whole collection.
- Task/skill texts, hashes, commands, final responses, checks, and produced text artifacts are saved in local result files. Raw exports are excluded from source control because they include machine paths and captured model output. Early trials lack tool-event traces. Temporary workspaces were cleaned after inspection; local result artifacts were retained.

Existing evaluation exports, caches, dependency directories, and unrelated files were preserved locally and excluded from the public source changes.
