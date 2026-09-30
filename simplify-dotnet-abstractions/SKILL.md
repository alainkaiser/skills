---
name: simplify-dotnet-abstractions
description: "Review and simplify unnecessary indirection in existing C# and .NET code while preserving real architectural boundaries and behavior. Use when asked to assess over-abstraction or over-engineering; justify, narrow, or remove interfaces, repositories, units of work, service or provider layers, factories, handlers, mediators, strategies, generic base classes, redundant DTO or mapping chains, Clean Architecture projects, or dependency-injection ceremony; flatten pass-through code; or decide whether a .NET abstraction earns its cost. Don't use for generic style cleanup, speculative greenfield architecture, or performance tuning without measurements."
---

# Simplify .NET Abstractions

Evaluate abstractions by the job they perform today and the evidence in the repository. Preserve boundaries that carry policy, variability, lifecycle, or external risk; simplify indirection that only forwards, renames, or anticipates hypothetical needs.

After identifying the candidate types, read the matching sections of `references/dotnet-abstraction-guide.md`. Cite its primary references when the answer needs source-backed justification.

## Trace Before Judging

Read the architecture tests and design records that constrain the surface, then trace every candidate beyond its declaration:

1. Consumers, implementations, inheritance, extension methods, tests, mocks, and `InternalsVisibleTo` friend-assembly access.
2. DI registrations: keyed or collection registrations, decorators, factories, lifetimes, assembly scanning, and runtime selection.
3. The end-to-end call path, noting where validation, authorization, transactions, mapping, retries, caching, telemetry, and domain rules actually occur.
4. Project and package boundaries, public API exposure, multiple hosts, plugins, reflection, source-generated registration, and dynamic loading.

When several abstractions interact, keep a compact evidence map:

| Candidate | Consumers and implementations | Added behavior | Boundary or lifecycle | Cost |
| --- | --- | --- | --- | --- |
| `IOrderService` | controller; one runtime implementation | forwards only | scoped, internal | extra hop and registration |

One implementation, a familiar pattern name, a file count, or mock usage is a signal to investigate, not a verdict.

## Name the Job

An abstraction earns its place by performing at least one current or committed job:

- select among genuine runtime implementations or algorithms;
- isolate an external, volatile, nondeterministic, or separately owned dependency behind domain language;
- own application policy, domain invariants, orchestration, or a transaction boundary;
- control creation, disposal, scope, concurrency, or another lifecycle concern;
- compose decorators, pipeline behaviors, plugins, or an extension surface;
- provide a consumed public contract, reusable library boundary, multiple-host boundary, or enforced dependency direction;
- provide a deliberate test seam for a real boundary when a framework seam or focused integration test is not the better fit.

A hypothetical implementation, a one-to-one mock created for convenience, or a layer name without a distinct responsibility is not a job.

## Classify

Assign one verdict per candidate:

- **Keep:** a clear job whose benefit is proportional to its cost.
- **Narrow:** the boundary stays, with less surface, leakage, mapping, or responsibility.
- **Collapse:** pure forwarding or duplication with no demonstrated job.
- **Investigate:** dynamic use, public compatibility, lifetime, transaction, or authorization ownership is unresolved after tracing. Leave the boundary in place.

For each finding, name the concrete cost: change amplification, navigation burden, duplicated models, lost framework capability, hidden lifetime, misleading substitutability, or a correctness risk. Cite runtime performance as a reason only with a profile, benchmark, or hot-path evidence. Report the findings that survive classification, preferring a few high-confidence call chains over a catalog of possible smells.

## Simplify Safely

When implementation is authorized:

1. Pin behavior with existing tests, or with a focused characterization test when the path is risky.
2. Collapse the outermost or leaf-most pass-through seam first, one boundary at a time.
3. Move real behavior to its clearest existing owner, keeping domain rules out of controllers and infrastructure.
4. Where DI is still useful but substitution is not, register the concrete service directly and keep construction visible rather than moving to service location.
5. Prefer an existing .NET or framework abstraction when its semantics fit; keep a domain-specific port when it adds vocabulary or policy.
6. Update callers, DI registrations, decorators, factories, tests, mocks, project references, architecture rules, and documentation that describe the removed seam. Re-run the evidence-map searches to confirm nothing still points at it.
7. Keep published or externally consumed contracts compatible, or propose an explicit migration.

Express the simplified path as direct code rather than a new wrapper, helper layer, or generic base class.

## Report

Lead with the outcome and scope. For non-trivial reviews, use:

| Location or chain | Verdict | Evidence and present job | Change or recommendation | Risk |
| --- | --- | --- | --- | --- |

Include justified abstractions when they answer the user's question, with the reason they stay. For implemented changes, summarize the collapsed path, the preserved boundaries, and the verification results.
