---
max_turns: 10
timeout_seconds: 300
allowed_tools: [Skill]
model: opus
runs: 3
---
Use a subagent to find every place in this repo that reads the STRIPE_SECRET_KEY environment variable, and summarize how each one handles a missing value.
