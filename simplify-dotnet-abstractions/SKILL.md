---
name: simplify-dotnet-abstractions
description: "Review and simplify unnecessary indirection in existing C# and .NET code while preserving real architectural boundaries and behavior. Use when Codex is asked to assess over-abstraction or over-engineering; justify, narrow, or remove interfaces, repositories, units of work, service or provider layers, factories, handlers, mediators, strategies, generic base classes, redundant DTO or mapping chains, Clean Architecture projects, or dependency-injection ceremony; flatten pass-through code; or decide whether a .NET abstraction earns its cost. Support review-only analysis and authorized behavior-preserving refactoring in concrete repositories. Do not use for generic style cleanup, speculative greenfield architecture, or performance tuning without measurements."
---

# Simplify .NET Abstractions

Evaluate abstractions by the present job they perform and the evidence in the repository. Preserve boundaries that carry policy, variability, lifecycle, or external risk; simplify indirection that only forwards, renames, or anticipates hypothetical needs.

After identifying the candidate types, read only the relevant pattern sections in `references/dotnet-abstraction-guide.md`. Use its primary references when the answer needs source-backed justification.

## Set the Mode and Scope

- Honor review-only, design-assessment, or implementation intent. Do not edit during a review-only request.
- Define the concrete surface under review: feature, call path, project set, pull-request diff, or named abstraction.
- Read repository instructions, target frameworks, project references, architecture tests, and relevant design records before applying a general rule.
- Treat generated code, public packages, reflection, source-generated registration, and externally consumed contracts as high-risk until their usage is resolved.
- Exclude adjacent style cleanup, broad redesign, dependency changes, and performance claims unless the user placed them in scope.

## Trace Before Judging

For every candidate, search beyond its declaration:

1. Find all consumers, implementations, inheritance, extension methods, tests, mocks, `InternalsVisibleTo` friend-assembly access, and documentation.
2. Trace DI registrations, keyed or collection registrations, decorators, factories, lifetimes, assembly scanning, and runtime selection.
3. Trace the end-to-end call path and note where validation, authorization, transactions, mapping, retries, caching, telemetry, and domain rules actually occur.
4. Check project and package boundaries, public API exposure, multiple hosts, plugins, and dynamic loading.
5. Record what changes together when the behavior changes.

Use a compact evidence map when several abstractions interact:

| Candidate | Consumers and implementations | Added behavior | Boundary or lifecycle | Cost |
| --- | --- | --- | --- | --- |
| `IOrderService` | controller; one runtime implementation | forwards only | scoped, internal | extra hop and registration |

Treat one implementation, a familiar pattern name, file count, or mock usage as a signal to investigate—not a verdict.

## Name the Job

Require each abstraction to perform at least one current or committed job:

- select among genuine runtime implementations or algorithms;
- isolate an external, volatile, nondeterministic, or separately owned dependency behind domain language;
- own application policy, domain invariants, orchestration, or a transaction boundary;
- control creation, disposal, scope, concurrency, or another lifecycle concern;
- compose decorators, pipeline behaviors, plugins, or an extension surface;
- provide a consumed public contract, reusable library boundary, multiple-host boundary, or enforced dependency direction;
- provide a deliberate test seam for a real boundary when a framework seam or focused integration test is not the better fit.

Do not count a hypothetical implementation, a one-to-one mock generated for convenience, or a layer name without distinct responsibility as a job.

## Classify With Evidence

Assign one verdict per candidate:

- **Keep:** preserve a clear job whose benefit is proportional to its cost.
- **Narrow:** retain the boundary but reduce its surface, leakage, mapping, or responsibilities.
- **Collapse:** remove a pure forwarding or duplicate abstraction with no demonstrated job.
- **Investigate:** defer change because dynamic use, public compatibility, lifetime, transaction, or behavioral evidence is unresolved.

State the concrete consequence of questionable indirection: change amplification, navigation burden, duplicated models, lost framework capability, hidden lifetime, misleading substitutability, or a correctness risk. Do not report “too many classes” as the consequence.

For review-only work, report only findings that survive this classification. Prefer a few high-confidence call chains over a catalog of possible smells.

## Simplify Safely

When implementation is authorized:

1. Establish behavior with existing tests or a focused characterization test when the path is risky.
2. Collapse the outermost or leaf-most pass-through seam first, one boundary at a time.
3. Move real behavior to its clearest existing owner; do not move domain rules into controllers or infrastructure merely to reduce files.
4. Register a concrete service directly when DI is still useful but substitution is not. Do not replace dependency injection with hidden construction or service location.
5. Prefer an existing .NET or framework abstraction when its semantics fit; preserve a domain-specific port when it adds vocabulary or policy.
6. Update callers, DI registration, decorators, factories, tests, mocks, project references, architecture rules, and documentation that describe the removed seam.
7. Preserve async and cancellation flow, exceptions, authorization, transactions, lifetimes, disposal, serialization contracts, logging, and telemetry.
8. Preserve public compatibility or propose an explicit migration. Do not silently break a published contract to make an internal graph smaller.

Avoid introducing a new wrapper, helper layer, or generic base class solely to make the removal look uniform.

## Verify the Result

- Run the smallest relevant repository-provided tests, build, format, and analyzer commands.
- Exercise the affected behavior through its real entry point when practical.
- Re-run the searches used to build the evidence map and confirm that registrations, mocks, reflection paths, and project references are not stale.
- Compare the before-and-after call path and confirm that responsibility is clearer rather than merely relocated.
- Require a profile, benchmark, analyzer finding, or hot-path evidence before presenting runtime performance as a reason to remove an abstraction.
- Report skipped checks and residual compatibility, runtime-selection, or integration risk explicitly.

## Report

Lead with the outcome and scope. For non-trivial reviews, report:

| Location or chain | Verdict | Evidence and present job | Change or recommendation | Risk |
| --- | --- | --- | --- | --- |

Include justified abstractions when they answer the user’s question; explain why they stay. For implemented changes, summarize the collapsed path, preserved boundary, changed files, verification commands, and results.
