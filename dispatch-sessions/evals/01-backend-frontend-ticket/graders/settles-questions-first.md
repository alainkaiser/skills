---
type: llm
focus: last_message
weight: 1
---
The ticket leaves questions open that both sessions depend on. Examples: whether the 30-minute window starts at order creation or at payment, which statuses count as shipped, and what happens if a cancel races with shipping.

Passing if the answer raises at least one such cross-repository question with the user before dispatching, or states an explicit assumption and names the one session that must confirm it. Failing if it dispatches both sessions and leaves each one to settle these questions on its own.
