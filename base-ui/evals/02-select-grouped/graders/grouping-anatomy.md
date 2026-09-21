---
type: llm
focus: last_message
weight: 1
---
The user asked for a Base UI Select with grouped, labelled options and a checkmark on the selected option.

Ground truth — Base UI Select's parts are exactly: Select.Root, Select.Label, Select.Trigger, Select.Value, Select.Icon, Select.Portal, Select.Backdrop, Select.Positioner, Select.Popup, Select.ScrollUpArrow, Select.Arrow, Select.List, Select.Item, Select.ItemText, Select.ItemIndicator, Select.Separator, Select.Group, Select.GroupLabel, Select.ScrollDownArrow. There is no Select.Viewport and no Select.Content — those are Radix UI parts.

Score the answer against each claim:
1. The popup is nested Select.Portal > Select.Positioner > Select.Popup, with Select.List inside the Popup holding the items.
2. Each category is a Select.Group containing a Select.GroupLabel for the visible category name.
3. The checkmark is a Select.ItemIndicator rendered inside Select.Item, and the option's text uses Select.ItemText.
4. Every Select part it USES IN THE CODE appears in the ground-truth list above.
   - Judge PART NAMES ONLY. Props (className, sideOffset, value, items, key, aria-*), CSS class names and plain HTML elements are out of scope for this claim and can never fail it. The ground-truth list deliberately contains no props, so absence of a prop from it means nothing.
   - Naming a part that does not exist in order to tell the user it does not exist is CORRECT behaviour and must be scored as a PASS for this claim.

Score down once for each claim that fails.
