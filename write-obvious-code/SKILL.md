---
name: write-obvious-code
description: "Write and refactor code for local comprehensibility through explicit control flow, meaningful names, visible state and side effects, and only justified indirection. Use when Codex is asked for simple, readable, maintainable, junior-friendly, unsurprising, non-clever, or non-over-engineered code; to clarify dense expressions, nested conditions, opaque chains, premature generic helpers, or fragmented pass-through functions; or when clarity is preferred over brevity. Apply across languages as a readability lens and use framework-specific guidance when available. Do not use for formatting-only work, broad architecture review, or unmeasured performance work."
---

# Write Obvious Code

Optimize for the time a teammate needs to understand and safely change the code, not for the fewest lines. Add detail only when it reveals intent or behavior.

## Set the Boundary

- Honor implementation, refactoring, or review-only intent. Do not edit during a review-only request.
- Read repository instructions and inspect surrounding code, tests, language, and framework conventions first.
- Keep the change within the requested flow or diff. Do not clean up adjacent code.
- Preserve behavior outside the requested change, including public contracts, validation, authorization, transactions, errors, ordering, async and cancellation flow, lifetimes, and side effects.
- Treat established idioms as readable unless the concrete use obscures behavior.
- For targeted .NET abstraction decisions, use `simplify-dotnet-abstractions` when available. Otherwise, limit this skill to readability and do not remove abstractions without repository evidence.

## Clarify With Evidence

1. Trace the inputs, decisions, state changes, side effects, failures, and output.
2. Name the exact reading cost: decoding syntax, retaining distant context, following needless indirection, or inferring hidden behavior.
3. Make the smallest change that removes that cost.
4. Run the smallest relevant repository-provided checks.
5. Re-read from the entry point. Confirm a teammate can identify the inputs, main path, branches, failures, state changes, and result in one pass.

Do not use line count, function count, nesting depth, or a pattern name as a verdict by itself.

## Prefer

- Meaningful intermediate names for domain values, decisions, and transformation stages.
- Direct `if`, `switch`, loop, or standard library operations when they scan more clearly than nested ternaries, dense chains, clever reductions, or custom mechanisms.
- Guard clauses when they expose the normal path without scattering a coherent lifecycle across many returns.
- One visible flow when steps form one story. Extract a function only when its name hides a lower-level detail, it changes independently, or genuine reuse exists.
- Direct calls over pass-through wrappers. Preserve indirection that owns policy, variability, lifecycle, an external boundary, or a public contract.
- Names that explain what; comments that explain why, constraints, or non-obvious risk.
- Focused types for real domain concepts and valid states. Avoid flags or primitives that hide meaning or permit invalid combinations.

Keep a short expression or familiar pipeline when it is already obvious. Use verbosity only to expose information. Avoid extra layers, narrated comments, needless variables, and many one-line helpers.

## Report

For reviews, report only concrete reading costs, the simpler shape, and behavior risk. Distinguish repository-rule violations from judgment calls.

For implementations, summarize the clearer implementation or path, preserved behavior outside the request, verification results, and skipped checks or residual risk.
