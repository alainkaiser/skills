---
tags: [skill-creator]
max_turns: 40
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, Bash, WebFetch]
---

ok go ahead and fix the exposed tools on my mac: homebrew python and its pip, node via fnm (26 and 24 lines), and go. the downloads have to go through a corrected CA bundle, and verify the node tarballs before switching to them. afterwards verify every client again and report fixed and still-exposed tools separately. leave my project repos alone, that's a separate task.
