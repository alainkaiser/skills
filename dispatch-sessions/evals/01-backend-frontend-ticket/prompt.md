---
max_turns: 15
timeout_seconds: 420
allowed_tools: [Skill]
model: opus
runs: 3
---
Next up is ticket SHOP-412: customers can cancel an order within 30 minutes of placing it. The backend (~/work/shop-api, .NET) needs a cancel endpoint and has to reject a cancel after the window or once the order has shipped. The frontend (~/work/shop-web, React) needs a cancel button with a confirm dialog on the order detail page, and the button has to disappear once cancelling isn't allowed anymore. Refunds are out of scope. Spin up two separate sessions, one in each repo, and coordinate them.
