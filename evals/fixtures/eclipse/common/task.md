# Requested change

Add input trimming in `src/normalize-name.ts` and a separately testable status formatter in
`src/format-status.ts`. The two files have no shared implementation dependency. Preserve all
existing behavior outside those functions and run the focused tests after the final edits.
