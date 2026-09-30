# Fidelity traps

Places where the `get_design_context` reference code, the screenshot, or a direct translation diverge from what Figma renders. Each entry says how to detect the trap in the evidence and what to write instead.

## Response scope

- **One variant.** A variant's response holds only that variant; its prop types list a single value per property. Other states come from the component set's response.
- **One mode.** `var(--name, fallback)` fallbacks and `get_variable_defs` values are resolved in the queried node's mode. Values for another mode come from a node rendered in that mode. Query the frame that applies the mode: the design context of a child instance can fall back to the default mode even when `get_variable_defs` on that instance returns the switched values.
- **Literal values ignore modes.** A literal color such as `text-[#6b6b76]` or `bg-[rgba(52,82,225,0.12)]` is unbound in Figma and stays the same in every mode, including on a dark surface. Keep the exact value and report it as unthemed.

## Strokes

A Figma stroke never changes a node's width or height, and metadata sizes exclude it. A CSS border takes space in the box. The reference code emits every stroke as a border (`border`, `border-2`, or one side such as `border-b` for a divider) next to the frame's padding, whatever the stroke's alignment and layout setting.

Detect the stroke's layout effect from metadata offsets:

- **First child offset = padding + stroke width**: Figma includes the stroke in layout. `border` plus padding reproduces the box.
- **First child offset = padding**: the stroke overlaps the padding. `border` plus padding makes the box larger by twice the stroke width and shifts the content. Draw the stroke with an inset box-shadow, or an outline with a negative offset. Alternatively, subtract the stroke width from the padding.
- **Outside or center stroke**: the stroke extends past the box. Draw it with an outline or a spread shadow, never with a border.

Neither the reference code nor the metadata states a stroke's alignment. Call `get_screenshot` on the stroked node itself: on a node without shadows or blurs, an image larger than the metadata box by twice the stroke width means an outside stroke, larger by the stroke width means a center stroke, and an image at the box size means an inside stroke. A 32 × 32 avatar with a 1px outside stroke returns a 34 × 34 image.

## Text

- **Truncation is dropped.** A text node truncated to N lines with an ellipsis comes out as `overflow-hidden text-ellipsis` without a line limit, so it renders every line. N = metadata height ÷ line height. Implement `line-clamp-N`, or `truncate` for one line.
- **Auto-width text** carries `whitespace-nowrap`. Keep it, or the text wraps where Figma does not.
- **Fixed-width text** can come out as `w-[min-content] min-w-full`. Give it the width its parent provides, usually `w-full`.
- **Letter spacing** arrives in px, converted from Figma's percentage at that font size: −2% at 20px becomes `-0.4px`. Use that value or its em equivalent (`-0.02em`). Tailwind's `tracking-*` steps are other values.
- **Line height** arrives in px. Keep it exact, including when a font-size utility would set its own line height. `leading-[normal]` is Figma's Auto line height: take the value from the metadata text height, because CSS `normal` follows the font's metrics. Tailwind's `leading-normal` is 1.5, and an arbitrary size such as `text-[13px]` sets no line height, so dropping the class inherits Tailwind's root 1.5.
- **Font** arrives as `font-['Inter:Semi_Bold'] font-semibold`: family Inter, style Semi Bold. Style names map to weights: Thin 100, Extra Light 200, Light 300, Regular 400, Medium 500, Semi Bold 600, Bold 700, Extra Bold 800, Black 900. Confirm the app loads that face.
- **Text case** comes out as `uppercase` (or `lowercase`, `capitalize`), with the content in its original case. Keep both.

## Layout

- Metadata `x` and `y` are relative to the parent, and the root's own position is canvas placement. Sizes are layout boxes without effects or outside strokes.
- Sizing classes carry Figma's resize modes: `shrink-0` marks fixed or hug children, `w-full` and `self-stretch` fill the cross axis, `flex-[1_0_0] min-w-px` fills the main axis, and `size-[N]` or `w-[N]` is fixed.
- `items-baseline` is Figma's text baseline alignment.
- Variant positions inside a component set are canvas arrangement, not spacing between components.

## Effects

- Shadow lists arrive in CSS stacking order, with spread and `var()` colors. Copy the whole list for each state.
- Focus rings are often two spread shadows, such as `0 0 0 2px <surface>, 0 0 0 4px <ring>`. Tailwind's `ring-*` and `ring-offset-*` defaults produce different widths and colors.

## Screenshots

- `get_screenshot` bounds include effect overflow: a 360 × 433 card with a 24px shadow blur returns a 400 × 473 image. Compare on the node box.
- The image scale is `width ÷ original_width` from the response. Render the browser at that device scale factor for pixel comparison.
