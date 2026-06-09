---
name: implement-cleanly
description: Implement or refactor frontend or backend code in an existing codebase using the user's preferred coding style: simple, maintainable, domain-oriented, evidence-backed, and aligned with local architecture. Use for general feature work, bug fixes, C#/.NET Web API work, React/TypeScript work, API wiring, migrations, generated clients, and focused code cleanup when no more specific skill applies.
---

# Implement Cleanly

## Purpose

Use this skill for implementation tasks where the main risk is code quality and fit: frontend, backend, API, data, generated-client, or test work in an existing repository.

## Operating Style

- Start from evidence: inspect the current branch, relevant files, callers, exports, routes, tests, generated artifacts, and nearby patterns before editing.
- Keep the solution feature-local and boring: smallest complete change, no speculative abstractions, no broad refactors, no dependency or tooling changes without approval.
- Use domain language: name endpoints, services, DTOs, variables, and UI states after the product concept, not implementation trivia.
- Prefer explicit readable flow over cleverness: meaningful lambda and variable names, direct null and error handling, clear control flow, no cast tricks or hidden magic.
- Preserve unrelated user changes; do not format or improve neighboring code unless required by the task.

## Implementation Workflow

1. Define the target behavior from the request, issue, design, current code, and runtime evidence. Ask only when missing information would make the change unsafe.
2. Inspect the existing structure and choose the local pattern to extend. Reuse existing primitives, services, endpoint grouping, validation, mapping, auth, data access, state management, and test style.
3. Implement narrowly. Keep changes traceable to the request, colocate feature code where the repo already puts similar behavior, and keep interfaces aligned across frontend and backend.
4. Treat generated artifacts as generated. Regenerate OpenAPI clients, migrations, SDK files, typed outputs, or snapshots with the repo's documented tools instead of hand-editing them, unless the user explicitly asks otherwise.
5. Verify with repo-native checks: targeted tests first, then typecheck, lint, build, or runtime checks when relevant. For end-to-end confidence, combine UI, API, DB, and log evidence instead of trusting one layer.
6. Finish with a compact summary: changed files, verification run, skipped checks, and residual risk.

## Backend Defaults

- For C#/.NET Web API, follow existing endpoint, service, DTO, mapping, validation, auth, rate limiting, EF, and configuration conventions before introducing a new shape.
- Let domain rules drive API shape. Use singular resources when the domain allows one active item, collection routes when the domain exposes collections, and action endpoints only when the action is the resource behavior.
- Keep security guardrails narrow and explainable: scope auth, token handling, rate limits, secrets, and access checks to the feature's real boundary.
- Use repo-local .NET tools and manifests for EF or code generation; do not hand-write migrations to bypass a tooling problem.

## Frontend Defaults

- Reuse existing UI primitives, state management, data fetching, routing, form, error, loading, empty-state, and accessibility patterns.
- Keep components straightforward: props that match product concepts, visible states modeled deliberately, and no broad design-system rewrites for one feature.
- When backend contracts change, update the generated client first, then wire UI against the generated surface.
- Validate rendered behavior when the task is user-facing, including mutation states, reload behavior, responsive layout, and error paths.

## Finish Criteria

The task is done only when the change is implemented, relevant generated outputs are refreshed, verification supports the requested behavior, and any remaining uncertainty is explicit.
