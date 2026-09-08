---
name: writing-pr
description: Write, shorten, or update pull request titles and descriptions from the final change and available evidence. Use for PR text, including when preparing an authorized PR; not for code review, branch names, or commit messages alone.
---

# Writing Pull Requests

Write for a reviewer who has not seen the conversation. Lead with the concrete problem and resulting behavior. Explicit user requests and repository templates take precedence over these defaults.

## Ground The Description

- Inspect the final diff against the verified target branch, relevant repository instructions, and any supplied ticket or evidence. For a text-only task with supplied artifacts, use those artifacts and identify material gaps instead of inventing repository access or results.
- Describe the aggregate change that will land. Rewrite stale titles and bodies when scope changes; omit abandoned approaches, intermediate commit churn, and local staging or delivery state. Retain a discarded approach only when it explains a material tradeoff in the final design.
- A request for draft text does not authorize publishing PR changes or uploading media. Use any authorization already granted for delivery.

## Title And Body

Follow the repository's title convention. Otherwise use a short title naming the resulting behavior:

- With a known ticket: `<Ticket> - <Short title>`.
- Without a ticket: `<Short title>`.
- Prepend `<type> | ` only when that is the repository's established convention. Never invent a type, ticket, or ticket URL.

For a small change, a sentence or a few outcome-focused bullets are enough. Use a concrete before/after example when it clarifies the fix. Describe files, internals, or code references only when they help assess the behavior or a design decision.

When sections help, use the existing personal format selectively:

- `### Mainly closes:` for a known ticket URL.
- `### What's inside:` for the smallest set of meaningful changes.
- `### What else:` for material compatibility notes, tradeoffs, rollout needs, follow-ups, or risks.

Omit empty sections, generic summaries, exhaustive file inventories, and boilerplate. Add deeper context, diagrams, or code samples for changes whose complexity or risk requires them; change size alone does not justify an essay.

## Evidence That Helps Review

- Omit routine statements such as "tests passed" or "I ran the build." Include a short `### Verification:` section when a template or the user requires it, or when a concrete result, skipped check, or limitation materially affects confidence in the change. Report only observed results. This writing preference does not remove implementation verification requirements.
- For visual changes, show a before/after table with available images or recordings of the affected state, including indirect visual effects. Keep the comparison at matching viewports and states. If evidence is missing, flag the material gap without inventing attachments or putting unusable local paths in the PR.
- For performance claims, show measured before/after results in a table: baseline from the verified target branch and candidate from the PR, with units, metric, and enough workload/environment context to make the comparison meaningful. If comparable measurements are absent, state the limit and avoid a quantified improvement claim.
- Use a small Mermaid diagram for relationships or flow, or a short code example for API usage, when it explains the change more directly than prose. Do not add decorative diagrams or repeat what the text already makes clear.

## Return The Requested Text

For a title-only or body-only request, return only that part. When both are requested, output the title as the first plain line followed by the body. Do not add `Title` or `Body` labels, introductory commentary, outer code fences, or a repeated title. Fences for actual diagrams and code examples are appropriate inside the body.
