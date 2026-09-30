---
type: llm
focus: last_message
weight: 1
---
The user wants one separate session in ~/work/shop-web to fix two flaky Playwright tests, while this session keeps working on something else.

Score the answer against each claim:
1. It starts, or prepares to start, exactly one separate session for this work, rather than doing the work in the current session or through an in-session subagent.
2. The brief names both specs (checkout.spec.ts and search.spec.ts) and the symptom: about one failure in five on CI, timing out while waiting for network responses.
3. The brief keeps the session to test code only and says the app code stays untouched.
4. The brief asks for verification that fits flakiness, such as running the specs many times or in a loop, and says commits, pushes, or pull requests wait for the user.

Score down once for each claim that fails.
