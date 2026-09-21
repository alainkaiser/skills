---
type: llm
focus: last_message
weight: 1
---
The user has Base UI tooltips that each wait before appearing and wants the rest to appear instantly once one is already open.

Ground truth — Tooltip.Provider shares delay state across the tooltips inside it. Its props are `delay` (how long before opening on hover), `closeDelay` (how long before closing) and `timeout` (default 400), documented as: "Another tooltip will open instantly if the previous tooltip is closed within this timeout." `timeout` is therefore the prop that directly answers this question, and naming it is correct — it is NOT an invented prop. Tooltip.Root's own default hover delay is 600ms. Base UI Tooltip's parts are exactly: Tooltip.Provider, Tooltip.Root, Tooltip.Trigger, Tooltip.Portal, Tooltip.Positioner, Tooltip.Popup, Tooltip.Arrow, Tooltip.Viewport. There is no Tooltip.Content — that is a Radix UI part.

Score the answer against each claim:
1. It identifies Tooltip.Provider as the solution, wrapping the multiple Tooltip.Root elements.
2. It explains the grouping behaviour the user asked about: once one tooltip is visible, adjacent ones open instantly instead of waiting out the delay again. Naming the `timeout` prop as the window that governs this is the ideal answer and passes this claim. An answer that only shows how to set or shorten `delay`, with no mention of the instant-adjacent grouping behaviour, fails this claim.
3. Props it names are attributed correctly: `delay` for opening, `closeDelay` for closing, `timeout` for the grouping window. If it states Base UI's default hover delay, 600ms is correct; if it states the default timeout, 400ms is correct.
4. Every Tooltip part it USES IN THE CODE appears in the ground-truth parts list above, and it does not use Radix's Tooltip.Content or Radix's delayDuration prop. Judge PART NAMES ONLY for this claim — other props, CSS class names and plain HTML elements are out of scope and can never fail it.

Score down once for each claim that fails.
