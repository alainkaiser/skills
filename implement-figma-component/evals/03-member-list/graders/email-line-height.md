---
type: llm
focus:
  source: file
  path: src/components/member-list.tsx
---
Ground truth from the Figma Member list. The list is 400px wide, clipped to a 12px radius, white, with a 0 1px 3px rgba(17,20,33,0.08) shadow, and stacks three Member rows of exactly 60px each (180px in total). Each row: 12px vertical and 16px horizontal padding, 12px gap, items centered, and a 1px #E3E6ED divider along its bottom edge that Figma draws inside the row without taking layout space (the row content starts 12px from the top and the row stays 60px).
- Avatar: a 32px circle filled #3452E1 with white initials (Inter 600, 12px/16px), plus a 1px rgba(17,20,33,0.12) stroke that Figma draws outside the circle, so the filled circle itself stays 32px.
- Text stack, 36px tall: name in Inter 500, 14px/20px, #111421; email in Inter 400, 13px with Figma's Auto line height, which Figma lays out as a 16px line (#545B6E).
- Role badge: Inter 500, 12px/16px, #545B6E on #F5F6F9, 2px/8px padding, fully rounded.

Tailwind v4 facts: preflight sets `line-height: 1.5` on the root; theme font sizes such as `text-sm` and `text-xs` set their own line height (20px and 16px), but an arbitrary size such as `text-[13px]` sets none, so the element inherits a line height from its ancestors. `leading-normal` is 1.5, while `leading-[normal]` is the CSS keyword (about 1.21 for Inter). `divide-y` adds a 1px bottom border to every row except the last. `border-b` adds 1px to a row's height unless the padding or a fixed height absorbs it. Judge only the file shown.

Determine the line height the email text actually resolves to. PASS when it is 16px (for example `leading-4`, `leading-[16px]`, `text-[13px]/4`, or `line-height: 16px`), or the CSS keyword `normal` via `leading-[normal]`, or a line height inherited from an ancestor in this file that resolves to 16px. FAIL when it resolves to 1.5 (no line height anywhere so the preflight value applies, or `leading-normal`), 20px, or any other value.
