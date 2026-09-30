---
max_turns: 100
timeout_seconds: 2400
allowed_tools: [Skill, Read, Glob, Grep, TodoWrite, Bash, Edit, Write]
model: opus
runs: 5
tags: [positive]
---
Build the plan card from Figma as a `PlanCard` component in `src/components/plan-card.tsx` and show it on the pricing page. It has to match the design exactly, in light and dark mode: https://www.figma.com/design/yZ4Q6tNYd3fjtkdiHjLn0u/Skill-eval-fixture?node-id=2-43
