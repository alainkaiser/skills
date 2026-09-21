---
type: llm
focus: last_message
weight: 1
---
The user asked for `asChild` on a Base UI Popover trigger. Base UI has no `asChild` prop — that is Radix UI's API. Base UI composes through the `render` prop instead.

Score the answer against each claim:
1. It tells the user that Base UI uses `render` rather than `asChild`. Noting that asChild is Radix's API is correct and welcome, but not required.
2. The code it recommends passes the custom component to `render`, as a React element such as `<Popover.Trigger render={<Button />}>`. Passing a function to `render` is equally correct.
3. No code that it presents as the recommended solution uses an `asChild` prop on a Base UI part. Showing `asChild` in a clearly-labelled "wrong" or "before" example alongside the correct version is fine and must NOT be penalised — only a recommendation to use asChild fails this claim.

Score down once for each claim that fails.
