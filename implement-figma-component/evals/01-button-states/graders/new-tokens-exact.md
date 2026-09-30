---
type: llm
focus:
  source: file
  path: src/styles.css
---
Before the run, the `@theme` block defined exactly these color tokens: surface #ffffff, surface-subtle #f5f6f9, fg #111421, fg-muted #545b6e, border #e4e7ec, brand #3452e1, brand-fg #ffffff. The `.dark` block overrode surface, surface-subtle, fg, fg-muted, and border.

The Figma Button values for the roles a new token might name: brand hover #2B44C0, brand pressed #22369A, focus ring #9DB0FF, disabled background #E6E8EF, disabled foreground #9AA1B4, secondary pressed background #E9EBF1, border #E3E6ED, button shadow rgba(17,20,33,0.08), hover shadow rgba(52,82,225,0.28).

PASS when every light-mode token added or changed during the run holds the Figma value for the role its name describes. Changing `--color-border` to #e3e6ed and leaving it at #e4e7ec both pass. PASS when no tokens were added. Dark-mode values in `.dark` are out of scope. FAIL when any added or changed light-mode token holds a value that differs from the Figma value for its role.
