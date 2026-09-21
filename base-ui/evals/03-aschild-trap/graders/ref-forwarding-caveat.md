---
type: llm
focus: last_message
weight: 0.5
---
Base UI's documentation states that a custom component passed to `render` "must forward the `ref`, and spread all the received props on its underlying DOM node."

Does the answer tell the user about this requirement — that their own Button component has to forward its ref and spread the props it receives onto the underlying DOM element? Passing if it states both requirements in some form; partial credit if it states only one; failing if it omits the point entirely.
