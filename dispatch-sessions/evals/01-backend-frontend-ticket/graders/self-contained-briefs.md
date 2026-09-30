---
type: llm
focus: last_message
weight: 1
---
The user asked for two sessions, one in ~/work/shop-api and one in ~/work/shop-web. Each new session starts with only its brief and never sees this conversation.

Score the answer against each claim:
1. It writes two separate briefs (or prompts), one per repository, or it holds dispatch back to ask the user questions and says the briefs follow once those are answered.
2. Each brief, where written, carries the ticket's rules that session needs: the 30-minute window, shipped orders can't be cancelled, and refunds are out of scope.
3. Each brief tells its session how to finish: at least verification to run, and that commits, pushes, or pull requests wait for the user.
4. Each brief names the other session so the two can reach each other.

Score down once for each claim that fails.
