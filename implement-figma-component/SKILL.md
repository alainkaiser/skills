---
name: implement-figma-component
description: Implement or refine UI components from Figma designs in an existing frontend codebase, validated in the browser against the real design. Use when the user provides a figma.com link or node, asks for a component to match a design, asks for pixel-perfect or design-to-code work, asks to evaluate a component or library as a base instead of building from scratch, asks for visual iteration, or asks for browser screenshot validation of spacing, sizing, typography, colors, states, and interactions. Not for creating or editing designs inside Figma (code-to-design).
---

# Implement Figma Component

Turn Figma component designs into production code that fits the current codebase and is proven against the real design with browser evidence. The global defaults (read-before-write, match local conventions, surgical edits, verify-against-goal) and the React standards already apply; this skill adds only the Figma-specific tradecraft.

Confirm up front that you have a Figma node/link, know which component to build, and know where it lives in the repo. If any is missing, ask before proceeding.

Copy this checklist and check off steps as you complete them:

```
Figma Implementation Progress:
- [ ] 1. Design evidence gathered (context + screenshot + metadata)
- [ ] 2. Base chosen and stated
- [ ] 3. Implemented to the design
- [ ] 4. Visual parity validated in browser
- [ ] 5. Behavior validated
- [ ] 6. Evidence reported
```

## 1. Gather design evidence

Parse the Figma URL: the file key is the segment after `/design/`, the node ID is the `node-id` query parameter (convert `42-15` to `42:15` if a tool requires colon form).

Fetch with the available Figma tools — never implement from the URL alone or from memory:

- `get_design_context` (or equivalent) first: reference code, screenshot, and hints for the node.
- `get_screenshot` for the node: this is the visual baseline for all later comparison.
- `get_metadata` for exact dimensions, spacing, and typography — and whenever the design context is too large or truncated: read the node map, then fetch the needed child nodes individually with `get_design_context`.
- `get_variable_defs` when you need the tokens (color, spacing, typography) used in the selection.

Honor the design-context hints in this priority order:

1. Code Connect mappings → use the mapped codebase component directly.
2. Component documentation links → follow for usage and constraints.
3. Design annotations → treat as designer requirements.
4. Design tokens / variables → map to the project's token system.
5. Raw hex / absolute positions → lowest confidence; lean on the screenshot.

Treat returned reference code (typically React + Tailwind) as a representation of design and behavior, not as final code style.

Capture the relevant frames, variants, states, dimensions, spacing, typography, colors, and interactions. Inspect any linked Jira, Storybook, or docs, plus the local UI primitives, component folders, and styling system, to decide behavior and placement. If Figma tools are unavailable, work from the provided link or screenshot.

## 2. Choose a base before implementing

- Prefer, in order: an existing local component or primitive, an installed headless/component library already used by the repo, then a small custom wrapper around simple primitives.
- Compare the realistic options against the Figma behavior and styling needs. For non-trivial components, state the selected base and tradeoff before the first code edit.
- If the best base cannot exactly match Figma, make the smallest design adjustment that preserves the intended look, states, and functionality.

## 3. Implement to the design

- Model only the variants and states required by Figma, the linked issue, or existing product behavior, including theme/dark-mode variants when the repo supports them.
- Use existing tokens, primitives, icons, transitions, and form patterns whenever they fit.
- When project tokens differ from raw Figma values, prefer the project tokens and adjust spacing or sizing minimally to preserve the intended visuals; note the substitution.
- Assets (images, icons, SVGs): use the sources served by the Figma tools directly. Do not add new icon or asset packages, and do not substitute placeholders when a real asset is provided.

## 4. Validate visual parity in the browser

Run the usual static checks first (typecheck, lint, tests, component/story checks), then start the app or story environment using repo scripts. Then loop:

1. Render the component with browser automation and capture screenshots for the key states and responsive breakpoints.
2. Compare directly against the Figma node screenshot from step 1.
3. Read computed styles from the DOM and check them against the Figma metadata: spacing, sizing, typography, color, radius, borders, shadows, alignment, focus/hover/selected/disabled states, and overflow.
4. Fix differences and repeat.

Exit the loop only when every remaining difference is either fixed or explicitly explained as an intentional constraint. Eyeballing the code does not count as validation; only screenshot comparison plus computed-style checks do.

## 5. Validate behavior

- Exercise the real user interactions, keyboard behavior, focus management, and loading/empty/error states.
- For business filters or workflow components, verify the linked issue or docs and test the real data flow where practical.

## 6. Report design evidence

State the base component/library chosen and why, attach the browser screenshots, and list any remaining mismatch against Figma with its justification (including token substitutions and accessibility-driven deviations).

## Common mistakes

- Implementing from the Figma URL or a verbal description without fetching the design context and node screenshot first.
- Declaring a match by reading the code; visual parity is only proven by browser screenshots and computed styles.
- Rebuilding a component that already exists locally or in an installed library because checking felt slower than writing.
- Hardcoding hex/px values when matching tokens exist in Figma variables or the project's design system.
- Validating only the default state and skipping hover, focus, disabled, dark-mode, and responsive variants shown in Figma.
- Fetching one giant node, getting truncated output, and guessing at the missing parts instead of walking child nodes via metadata.

## Defaults

- Keep iterating within the current turn until visual and behavioral evidence says the component is done or a concrete blocker remains.
- If Figma or Jira access is blocked, continue from available local evidence only when the risk is low; otherwise ask for the missing artifact or a screenshot.
