---
name: implement-figma-component
description: "Pixel-exact Figma-to-code for components and frames in an existing frontend codebase: collects every variant, interaction state, theme mode, and breakpoint from the Figma file, corrects values the Figma MCP reference code drops or distorts, and measures the rendered result against Figma metadata. Use alongside figma-design-to-code when implementing, updating, or fixing UI to match a Figma design or design export. Not for creating or editing designs inside Figma."
---

# Implement Figma Component

Figma's `figma-design-to-code` skill owns the MCP call protocol: the first `get_design_context` call and its screenshot, sparse responses, asset downloads, Code Connect, and component reuse. Load it first when it is available. This skill covers what it leaves out and what decides pixel fidelity: evidence beyond the selected node, values the reference code gets wrong, and measurement.

A `get_design_context` response renders one node, in one theme mode, at one size. Treat it as one sample of the design, not its specification.

Without Figma MCP access, work from supplied exports, specs, or screenshots; a URL alone is not evidence. Apply the same steps to whatever the evidence contains.

## 1. Inventory the design

1. Call `get_metadata` on the selected node. Its root tag classifies it: `<symbol>` is a component, and a variant when its name reads `Property=Value, …`; `<instance>` is a placed copy of a component; `<frame>` and `<section>` are layout.
2. Call `get_metadata` on the enclosing section or page (without `nodeId` it lists the pages). Find:
   - the **component set**: the `<frame>` whose children are the variant `<symbol>`s. A variant's design context contains that variant alone, and its prop types list one value per property. The set's design context contains every variant. The "Component descriptions" block of a response names the set's node ID when the component has a description.
   - **sibling frames** that show the component in another theme mode, breakpoint, or state, such as frames named "Dark", "Mobile", or "Error".
3. Fetch the design context of the component set (or of each variant in scope) and of every sibling frame in scope. `get_variable_defs` and the `var()` fallbacks resolve in the queried node's mode, so query a node rendered in each mode the app supports.
4. Map the variant and component properties to the code API:
   - Interaction states (Hover, Pressed, Focus, Disabled) become `:hover`, `:active`, `:focus-visible`, and `:disabled` or ARIA state styles. The reference code models them as a `state` prop; keep states out of the public API.
   - Other variant properties (variant, size, tone) become props. TEXT properties become text props or children, BOOLEAN properties optional parts, INSTANCE_SWAP properties slots.

Done when every variant, interaction state, theme mode, and breakpoint the component supports is listed with the node ID it came from, or recorded as absent from the file. Ask about an absent state only when the implementation depends on it; otherwise report it.

## 2. Write the spec

Read [references/fidelity-traps.md](references/fidelity-traps.md) and check every entry against the evidence. Then write the spec: for each node you will render, the box from metadata and the style values from the design context, per state and mode. Style values are padding, gap, radius, stroke, fill, effects, font family, weight, size, line height, letter spacing, text case, and truncation.

Match each design value to a project token by name and value:

- A bound variable (`var(--color\/…, fallback)`) maps to the project token for the same concept when the values are equal. If the concept matches but the value differs, keep the project token and report the drift with both values. If the project has no such token, add one through the project's token convention or use the exact value, and report it.
- A literal value (no `var()`) is unbound in Figma. Use the exact value, never the nearest token, and report it.
- Scale names do not transfer between systems: Figma `radius/md` = 8px is Tailwind `rounded-lg`, while Tailwind `rounded-md` is 6px. Compare values, not names.

Done when every trap is checked and every spec value traces to a design context, metadata, or variable definition response.

## 3. Implement

- Confirm the app loads every font family, weight, and style in the spec. A missing weight renders as the nearest loaded weight or a synthesized bold. Add missing faces through the project's font setup.
- Implement every state and mode in the inventory with its spec values, including theme values the project's tokens do not define yet.
- When rewriting reference classes into project conventions, keep their sizing semantics: `shrink-0`, fill (`w-full`, `self-stretch`, `flex-[1_0_0] min-w-px`), fixed sizes, `whitespace-nowrap`, and `items-baseline`.

## 4. Measure

Run a box check against the spec before rendering. For every auto-layout frame, content plus padding plus any CSS border must equal the Figma width and height. For every text node, metadata height divided by line height is the line count the design allows. Most layout defects show up here.

Then render each state and mode at the design's width with fonts loaded, and measure:

- **Geometry**: load [scripts/measure.js](scripts/measure.js) into the page and call `measureAgainstFigma` with the root selector, the `get_metadata` XML, and a node ID → selector map. It returns each node's root-relative box delta, typography and line counts for text nodes, and the loaded font faces. Each delta must be within 0.5px. The exception is text width: Figma and the browser rasterize text differently, so a text node's width and its hugging parents' widths can differ by up to about 1px. Positions, heights, and line counts carry no such allowance.
- **Style**: compare computed colors, borders, radii, shadows, and font properties with the spec.
- **Pixels**: capture the element at the Figma screenshot's scale (`width ÷ original_width`) and compare it with the screenshot, aligned on the node box.

Render interaction states with the browser's state emulation (for example, forced `:hover` or `:focus-visible`) or through each variant. Fix a difference at its cause and recheck what the fix can affect. If a mismatch survives two fixes, re-read the node's design context and metadata before a third.

If no browser is available, report visual parity as unverified and state what the box check covered. A passing build or type check is not visual evidence.

## 5. Report

Report the inventory with node IDs, token drifts and literal values, deviations with reasons, and the measurements per state, mode, and viewport. List what is unverified or absent from the design. Claim parity only for what you measured.
