---
type: llm
focus: last_message
weight: 1
---
The user wants a Base UI Combobox whose selected value is a user id while the list displays user names and typeahead filters on the name.

Ground truth — the current API for this is Combobox.createItems(items, { getValue, getLabel }). Its result is passed to the `items` prop on Combobox.Root. Selection props and events then use the derived ids, while list rendering still receives the original item objects: Combobox.List takes a render function whose argument is the original item, and Combobox.Item receives the derived id in its `value` prop. Base UI Combobox's parts include Root, Label, InputGroup, Input, Trigger, Icon, Clear, Value, Chips, Chip, ChipRemove, Portal, Backdrop, Positioner, Popup, Arrow, Status, Empty, List, Row, Item, ItemIndicator, Separator, Group, GroupLabel and Collection.

Score the answer against each claim:
1. It uses Combobox.createItems with a getValue that returns the user's id and a getLabel that returns the user's name.
2. The result of createItems is passed to the `items` prop on Combobox.Root.
3. The items are rendered such that Combobox.Item receives the id as its `value` while the visible text is the name.
4. It does not hand-roll this — mapping the users into {value,label} objects and maintaining a separate id lookup table instead of using createItems fails this claim, as does telling the user Base UI cannot separate the stored value from the displayed label.

Judge claims 1-4 on substance only. Props, CSS class names and plain HTML elements are never grounds for failure, and naming a part that does not exist in order to warn the user about it is correct behaviour.

Score down once for each claim that fails.
