---
max_turns: 20
timeout_seconds: 420
allowed_tools: [Skill, WebFetch]
model: opus
runs: 3
---
I have a list of users shaped like { id, name }. I need a Base UI Combobox where the value stored in my form state is the user's id, but the list shows the user's name and typeahead filters on the name. What's the current way to do this?
