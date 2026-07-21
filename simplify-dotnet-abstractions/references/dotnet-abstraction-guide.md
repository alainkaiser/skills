# .NET Abstraction Decision Guide

Use this guide after tracing the concrete code. Apply the relevant section; do not turn every signal into a finding.

## Contents

- Evidence standard
- Interfaces and dependency injection
- EF Core repositories and units of work
- Service layers and mapping chains
- Handlers, mediators, and CQRS
- Factories, strategies, and base classes
- Projects and Clean Architecture
- Framework-provided seams
- Primary references

## Evidence Standard

Apply the jobs defined in `SKILL.md` only when current consumers, configuration, runtime behavior, public contracts, or committed requirements support them. Evaluate that evidence against cost in the actual change path:

- Require synchronized edits across layers for one behavior change.
- Navigate multiple files that add no decision, translation, or policy.
- Duplicate DTOs and mapping with identical semantics and ownership.
- Hide DI scope, disposal, transactions, retries, exceptions, or cancellation.
- Reduce useful framework capabilities, such as wrapping EF Core with generic CRUD or leaking `IQueryable` through a supposed test seam.
- Grow flags, hooks, type parameters, or base-class overrides to serve unrelated cases.
- Expose a public abstraction whose promised substitutability is not real.

Do not use raw counts of projects, interfaces, handlers, or files as proof. A small harmful seam can cost more than a large justified boundary.

## Interfaces and Dependency Injection

Register concrete services directly when DI supplies useful construction and lifetime management but no substitution boundary exists. Current .NET DI supports concrete registrations; constructor injection does not require an `IFoo`/`Foo` pair.

Keep or narrow an interface when it supports:

- genuine production implementations or runtime selection;
- a decorator or capability shared across otherwise unrelated types;
- a domain-specific port around storage, messaging, payment, time, or another external effect;
- a public extension point or consumer-facing library contract;
- enforced inward dependency direction across an assembly boundary.

Question an interface when it mirrors one internal sealed class, has no semantic vocabulary, and is consumed only by adjacent application code. Treat testing as a reason only when the seam isolates a real boundary. Prefer testing deterministic domain logic through concrete types and use focused integration tests where behavior depends on the real framework.

Inspect service lifetime before collapsing anything. Preserve a boundary that intentionally controls scoped work, disposal, or concurrency. Report captive dependencies, hidden `IServiceProvider` lookup, runtime-resolving factories, or repeated `BuildServiceProvider` calls as correctness problems rather than aesthetic smells.

## EF Core Repositories and Units of Work

Recognize that `DbContext` already models a short-lived unit of work: it tracks changes and commits them with `SaveChanges` or `SaveChangesAsync`. Direct context use can therefore be the simplest appropriate choice.

Treat these as strong collapse signals when no other job exists:

- `IUnitOfWork.SaveChangesAsync` only forwards to the context;
- a generic repository mirrors `DbSet` operations such as add, find, list, update, and remove;
- every entity receives the same CRUD surface regardless of aggregate rules;
- the wrapper leaks `IQueryable`, so callers still depend on EF query behavior while the seam cannot stub query outputs reliably.

Keep or narrow a repository when it expresses aggregate-specific operations, centralizes deliberate query policy, supports a required provider variation, or provides a consciously chosen test-double seam. Account for its documented implementation and maintenance cost, and retain real-database tests for database behavior.

Do not claim that repositories are categorically wrong with EF Core. Do not turn direct `DbContext` access into permission for transport code to own domain rules or transactions accidentally.

## Service Layers and Mapping Chains

Keep a layer when it owns a distinct responsibility:

- transport parsing and response semantics;
- use-case coordination, authorization, idempotency, or transaction policy;
- domain invariants and business decisions;
- infrastructure integration and failure translation.

Collapse a controller → service → repository chain only where intermediate methods forward the same arguments and result without policy, translation, or lifecycle behavior. Move retained behavior to the nearest existing owner.

Keep DTO mapping when it protects a versioned or externally owned contract, controls serialization or over-posting, translates between genuinely different models, or separates ownership. Question repeated internal models whose fields and change reasons are identical.

## Handlers, Mediators, and CQRS

Keep mediator or handler indirection when it provides an intentional command/query boundary, independently dispatchable modules, or used pipeline behaviors such as validation, authorization, transactions, retries, or telemetry.

Question request/handler pairs that are created for every endpoint but only call one service, especially when no pipeline behavior or independent dispatch exists. Simplify basic CRUD paths without applying the same decision to complex domains.

Apply CQRS to the bounded area whose read/write asymmetry or domain complexity justifies it. Do not impose it as a solution-wide template, and do not remove it merely because a neighboring subsystem is simple.

## Factories, Strategies, and Base Classes

- Keep a factory for runtime selection, complex construction, limited lifetime, pooling, or creation outside the current DI scope. Collapse a factory that only invokes one ordinary constructor.
- Keep a strategy when algorithms genuinely vary and callers select among them. Prefer direct code when the variation is local, stable, and clearer as a branch.
- Keep a base class when it owns a stable invariant algorithm or shared lifecycle. Prefer composition when subclasses mainly toggle flags, override unrelated hooks, or inherit state they do not need.
- Treat `Manager`, `Provider`, `Facade`, and `Adapter` names as no evidence by themselves. Inspect behavior.
- Reject factories or facades that disguise service location by resolving arbitrary dependencies at runtime.

## Projects and Clean Architecture

Treat Clean Architecture as dependency direction first, not a required project count. Justify physical projects through a concrete boundary such as:

- a published or genuinely reused library;
- multiple hosts that share application or domain behavior;
- framework-independent domain code that needs compile-time isolation;
- independent deployment, ownership, or release cadence;
- infrastructure implementations that actually vary.

For a modest application, start by considering one production assembly plus tests, feature-oriented folders, and `internal` types. Remember that `internal` normally restricts access to the declaring assembly, but `InternalsVisibleTo` can expose internals to named friend assemblies; folders and namespaces do not enforce dependency direction. Use project references or architecture tests when strict direction must be machine-enforced.

Question one-project-per-layer templates, duplicate contracts between adjacent internal projects, and mappings created only because a template prescribes a boundary. Preserve separate projects that carry a real consumer, policy, ownership, or deployment constraint.

## Framework-Provided Seams

Inspect the target framework and installed packages before adding or preserving a custom wrapper. Prefer an existing seam when its semantics fit, for example:

- use `TimeProvider` for controllable time on supported targets instead of a parallel clock abstraction;
- use `ILogger<T>` and configured providers for general logging instead of a forwarding logging facade;
- use `IHttpClientFactory`, typed clients, and delegating handlers for HTTP configuration, handler lifetime, and outgoing middleware;
- use the options pattern for grouped, validated configuration.

Keep a domain-specific wrapper when it translates vocabulary, enforces policy, narrows capability for safety, or bridges a genuine compatibility boundary. “The framework already has an interface” is not enough to erase a domain port.

## Primary References

- [Dependency injection basics](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/basics): demonstrate concrete service registration and state that not all services need interfaces.
- [Dependency injection guidelines](https://learn.microsoft.com/en-us/dotnet/core/extensions/dependency-injection/guidelines): cover lifetimes, factories, scope validation, service location, and container anti-patterns.
- [DbContext lifetime, configuration, and initialization](https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/): define `DbContext` as a short-lived unit of work and document its default request scope.
- [Choosing an EF Core testing strategy](https://learn.microsoft.com/en-us/ef/core/testing/choosing-a-testing-strategy): explain the valid test-double role and significant maintenance cost of repositories.
- [Designing a microservice-oriented application](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/multi-container-microservice-net-applications/microservice-application-design): recommend different internal patterns for different complexity and avoid advanced DDD or solution-wide CQRS by default.
- [CQRS pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/cqrs): document benefits, complexity, and cases where CRUD is sufficient.
- [Common web application architectures](https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures): distinguish a simple all-in-one application, logical layers, physical projects, and inward dependencies.
- [`internal` keyword](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/internal): define assembly-level accessibility and its limits.
- [Friend assemblies](https://learn.microsoft.com/en-us/dotnet/standard/assembly/friend): document how `InternalsVisibleTo` exposes internal types and members to named assemblies.
- [Dates, times, and time zones](https://learn.microsoft.com/en-us/dotnet/standard/datetime/): identify `TimeProvider` as the built-in testable time abstraction.
- [.NET logging and tracing](https://learn.microsoft.com/en-us/dotnet/core/diagnostics/logging-tracing): identify `ILogger` as the general-purpose structured logging abstraction.
- [Options pattern](https://learn.microsoft.com/en-us/dotnet/core/extensions/options): cover grouped, strongly typed, and validated configuration.
- [`IHttpClientFactory` guidance](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/implement-resilient-applications/use-httpclientfactory-to-implement-resilient-http-requests): cover typed clients, outgoing middleware, and handler lifetime management.
