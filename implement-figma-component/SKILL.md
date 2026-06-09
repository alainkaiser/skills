---
name: implement-figma-component
description: Implement or refine UI components from Figma designs in an existing frontend codebase. Use when the user provides Figma component links, asks for a component to match a design, asks to evaluate a component or library as a base instead of building from scratch, asks for visual iteration, or asks for browser screenshot validation of spacing, sizing, typography, states, and interactions.
---

# Implement Figma Component

## Purpose

Turn Figma component designs into production code that fits the current codebase and is validated against the real design. The global defaults (read-before-write, match local conventions, simple/readable code, surgical edits, verify-against-goal) and the React standards (component/state/accessibility rules) already apply; the steps below add only the Figma-specific tradecraft.

## Workflow

Confirm up front that you have a Figma node/link, know which component to build, and know where it lives in the repo. If any is missing, ask before proceeding.

1. Gather design evidence.
   - Read the linked Figma nodes with the available Figma tools: lead with the design-context tool (reference code + screenshot + hints), pull exact dimensions, spacing, and typography from the metadata tool, and capture a node screenshot as the visual baseline. If Figma tools are unavailable, work from the provided link or screenshot.
   - Capture the relevant frames, variants, states, dimensions, spacing, typography, colors, and interactions.
   - Inspect any linked Jira, Storybook, or docs, plus the local UI primitives, component folders, and styling system, to decide behavior and placement.

2. Choose a base before implementing.
   - Prefer, in order: an existing local component or primitive, an installed headless/component library already used by the repo, then a small custom wrapper around simple primitives.
   - Compare the realistic options against the Figma behavior and styling needs. For non-trivial components, state the selected base and tradeoff before the first code edit.
   - If the best base cannot exactly match Figma, make the smallest design adjustment that preserves the intended look, states, and functionality.

3. Implement to the design.
   - Model only the variants and states required by Figma, the linked issue, or existing product behavior, including theme/dark-mode variants when the repo supports them.
   - Use existing tokens, primitives, icons, transitions, and form patterns whenever they fit.

4. Validate in the browser.
   - Run the usual static checks first (typecheck, lint, tests, component/story checks), then start the app or story environment using repo scripts.
   - Render the component with browser automation: navigate to it, then capture screenshots for the key states and responsive breakpoints.
   - Compare directly against the Figma node screenshot, and check values side by side: read computed styles from the DOM and compare them to the Figma metadata for spacing, sizing, typography, color, radius, borders, shadows, alignment, focus/hover/selected/disabled states, and overflow.
   - Iterate until the remaining differences are either fixed or explicitly explained as intentional constraints.

5. Validate behavior.
   - Exercise the real user interactions, keyboard behavior, focus management, and loading/empty/error states.
   - For business filters or workflow components, verify the linked issue or docs and test the real data flow where practical.

6. Finish with design evidence.
   - State the base component/library chosen and why, and attach the browser screenshots plus any remaining mismatch against Figma.

## Defaults

- Keep iterating within the current turn until visual and behavioral evidence says the component is done or a concrete blocker remains.
- If Figma or Jira access is blocked, continue from available local evidence only when the risk is low; otherwise ask for the missing artifact or a screenshot.
