---
max_turns: 15
timeout_seconds: 420
allowed_tools: [Skill]
model: opus
runs: 3
---
While we keep going on the auth refactor here, hand the flaky Playwright tests in ~/work/shop-web off to their own session. It's checkout.spec.ts and search.spec.ts; both fail about one CI run in five with timeouts while waiting for network responses. That session should only touch test code, not the app.
