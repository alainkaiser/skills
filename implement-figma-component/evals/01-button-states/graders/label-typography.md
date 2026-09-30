---
type: llm
focus:
  source: file
  path: src/components/ui/button.tsx
---
Ground truth from the Figma component set (2 variants × 5 states). Every button is 40px tall and hugs its label: padding 10px vertical and 16px horizontal, 8px corner radius, label Inter Semi Bold (weight 600) 14px with 20px line height and -0.14px letter spacing.
- Primary: Default background #3452E1, label #FFFFFF, shadow 0 1px 2px rgba(17,20,33,0.08). Hover background #2B44C0 with shadow 0 2px 6px rgba(52,82,225,0.28). Pressed background #22369A, no shadow. Focus background #3452E1 with box-shadow 0 0 0 2px #FFFFFF, 0 0 0 4px #9DB0FF. Disabled background #E6E8EF, label #9AA1B4, no shadow.
- Secondary: Default background #FFFFFF, 1px stroke #E3E6ED that Figma draws inside the 40px box without taking layout space, label #111421, shadow 0 1px 2px rgba(17,20,33,0.08). Hover background #F5F6F9. Pressed background #E9EBF1. Focus background #FFFFFF with the same two-layer ring as Primary. Disabled background #E6E8EF, label #9AA1B4.

Project theme tokens that existed before the run (Tailwind v4, usable as `bg-brand`, `text-fg`, and so on): surface #ffffff, surface-subtle #f5f6f9, fg #111421, fg-muted #545b6e, border #e4e7ec, brand #3452e1, brand-fg #ffffff. Tailwind facts: `bg-brand/90` is #3452e1 at 90% opacity, not #2B44C0. `rounded-md` is 6px and `rounded-lg` is 8px. `text-sm` is 14px with a 20px line height. `ring-2 ring-offset-2` draws a 2px offset (white by default, or the `ring-offset-*` color, and `ring-offset-surface` is #ffffff) plus a 2px ring, the same as `0 0 0 2px <offset color>, 0 0 0 4px <ring color>`. In Tailwind v4 rings, inset rings, and `shadow-*` are separate layers of one box-shadow, so `shadow-none` does not remove a ring, and `inset-ring` draws a stroke inside the box without taking layout space.

A color counts as correct when it is written literally (any letter case, hex or equivalent rgb), comes from a pre-existing token with that exact value, or comes from a token that did not exist before the run and whose name clearly denotes that role (such as `brand-hover`); a separate grader checks the values of new tokens. Judge only the file shown.

PASS when the label renders at 14px with a 20px line height, weight 600 (`font-semibold`), and -0.14px letter spacing (or the equivalent -0.01em). FAIL when the weight is 500 (`font-medium`) or any other value, or when letter spacing is missing or another value such as `tracking-tight` (-0.025em).
