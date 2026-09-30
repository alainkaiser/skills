---
type: llm
focus:
  source: file
  path: src/components/plan-card.tsx
---
Ground truth from the Figma Plan card. The card is 360px wide, with a 1px #E3E6ED border that Figma includes in layout plus 24px padding (content starts 25px from the outer edge), 16px corner radius, a white surface, 20px gap between sections, and two shadows: 0 8px 24px -4px rgba(17,20,33,0.1) and 0 1px 2px 0 rgba(17,20,33,0.06).
- Header, 8px gap: eyebrow "Pro" rendered uppercase, Inter 600, 12px/16px, letter spacing 0.72px, color #3452E1. Title "Team workspace", Inter 600, 20px/28px, letter spacing -0.4px, #111421. Description, Inter 400, 14px/20px, #545B6E, truncated with an ellipsis after 2 lines.
- Price row, baseline-aligned, 4px gap: "$24" Inter 700, 36px/40px, letter spacing -0.72px, #111421; "per seat / month" Inter 400, 14px/20px, #545B6E.
- Billing note, Inter 400, 13px/18px, literal color #6B6B76 that is not bound to any variable.
- 1px divider in #E3E6ED. Feature list with 12px gap; each row has an 8px gap, a 16px bullet circle filled rgba(52,82,225,0.12) holding a 6px #3452E1 dot, and a label in Inter 500, 14px/20px, #111421.
- Full-width primary button "Start free trial".
Dark mode (from the frame that applies the Dark variable mode): surface #15171E, border #2A2E3A, text #F2F4F8, secondary text #A3A9B8, brand #6F86FF, text on brand #0B0D14. The billing note stays #6B6B76 and the bullet fill stays rgba(52,82,225,0.12).

Project theme tokens that existed before the run (Tailwind v4): surface #ffffff (dark #15171e), surface-subtle #f5f6f9 (dark #1d2029), fg #111421 (dark #f2f4f8), fg-muted #545b6e (dark #a3a9b8), border #e4e7ec (dark #2a2e3a), brand #3452e1 (no dark override), brand-fg #ffffff (no dark override). Tailwind facts: `tracking-tight` is -0.025em, `tracking-wide` is 0.025em, `tracking-wider` is 0.05em, `rounded-2xl` is 16px, `p-6` is 24px.

PASS when the card reproduces all three non-zero letter spacings exactly: the title at -0.4px (or -0.02em), the eyebrow at 0.72px (or 0.06em), and the amount at -0.72px (or -0.02em). FAIL when any of them is missing or replaced by a Tailwind step such as `tracking-tight`, `tracking-wide`, or `tracking-wider`, which are different values.
