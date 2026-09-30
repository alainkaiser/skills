---
type: llm
focus: last_message
weight: 1
---
The frontend has to hide the cancel button exactly when the backend would reject a cancel, so both sides depend on one shared API contract.

Score the answer against each claim:
1. It spells out the contract concretely: the cancel endpoint (method and path) and how the frontend learns whether an order can still be cancelled (for example a field on the order response), or it asks the user to decide these.
2. It makes one session, normally the backend, the owner of that contract, and tells the other to build against it rather than invent its own.
3. It keeps the eligibility rules in one place. Having the frontend re-implement the 30-minute and shipped checks as its own source of truth fails this claim; a frontend that only displays what the backend reports passes.

Score down once for each claim that fails.
