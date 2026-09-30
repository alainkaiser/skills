# Baseline

Reference scores for the `implement-figma-component` eval suite. Raw run output (`results/`) is gitignored; this file is the durable record.

## Reference run

```
PATH=<node and git outside $HOME>:$PATH claude plugin eval . --ablation with-without --scaffold \
  --allow-tools Bash Edit Write --judge-model sonnet --trust-plugin --no-publish -j 4
```

The eval sandbox cannot execute binaries under the real `$HOME` (fnm or nvm installs) or the `/usr/bin/git` shim. The reference run put an APFS clone of the node install and a link to `/Library/Developer/CommandLineTools/usr/bin/git` first on `PATH`. Both arms get the same tools.

| | |
|---|---|
| Date | 2026-09-30 |
| Agent model | opus |
| Judge and mock model | sonnet |
| Claude Code | 2.1.285 |
| Runs | 5 per arm for cases 01–03, 3 for 04–05 (42 runs) |
| Duration | 1324s |
| Cost | $40.68 |

| case | with | without | Δ |
|---|---|---|---|
| 01-button-states | 1.00 | 0.95 | +0.05 |
| 02-plan-card | 1.00 | 0.95 | +0.05 |
| 03-member-list | 0.80 | 0.56 | +0.24 |
| 04-neg-figma-write | 1.00 | 1.00 | 0.00 |
| 05-neg-no-design | 1.00 | 1.00 | 0.00 |

## Where the skill makes the difference

- **Strokes outside layout.** Figma draws the Secondary button's stroke and the member rows' bottom divider over the padding; the reference code emits `border` plus the same padding. Without the skill, the Secondary button rendered 42 × 95 instead of 40 × 93 in 3 of 5 runs and every member row rendered 61px instead of 60px in 5 of 5 runs. With the skill: 0 of 10.
- **Reliability of the inventory.** One of five no-skill plan-card runs never looked for the dark-mode frame and shipped the wrong dark brand colors.

Without the skill, the model already finds the component set and the dark frame in this small file, keeps exact letter spacing, restores the dropped 2-line clamp, and loads missing font weights. The skill costs about 10 more turns and 60–100s per run.

## Known gaps

- **Outside stroke on the avatar** (`03-member-list/avatar-stroke`) failed in both arms in the reference run: the reference code and metadata do not state stroke alignment. The screenshot-size rule was added to `references/fidelity-traps.md` after this run. Cases 01–02 have not been re-run with the final trap file.
- **Case-03 rerun is invalid.** The later case-03-only run ($7.26) scored with 0.80 and without 0.04, but its retained `aggregate-result.json` records `exit 1: You've hit your session limit` for six of ten runs: one with the skill and all five without. The four completed with-skill runs scored 1.00, including the avatar-stroke grader. No without-skill run completed, so this rerun cannot establish a with/without difference.
- **No browser in the sandbox.** Chromium cannot launch and no dev server can listen, so the measurement step (`scripts/measure.js`) is not exercised; graders read the final code.
- **Figma's own skills are absent in both arms.** The harness loads only the plugin under test, and Figma's skill repository has no license to copy it.
- **Mocks** are `type: agent` mocks that return recorded responses verbatim; fixed mocks reject colon node IDs. `get_screenshot` returns a local path instead of a URL.

## Fixture

Figma file `yZ4Q6tNYd3fjtkdiHjLn0u` (private drafts) holds a 10-variant Button set, a Plan card with a Dark-mode frame, and a Member list, bound to a Light/Dark variable collection. `mocks/figma/fixtures/` holds its `get_design_context`, `get_metadata`, `get_variable_defs`, and `get_screenshot` output, recorded on 2026-09-30. `fixture-app/` is a Vite, React 19, and Tailwind v4 app that imports only Inter 400 and 700.
