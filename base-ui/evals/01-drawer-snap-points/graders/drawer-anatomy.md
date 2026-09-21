---
type: llm
focus: last_message
weight: 1
---
The user asked for a draggable bottom sheet in a Base UI app. The correct answer uses Base UI's Drawer component.

Ground truth — Base UI Drawer's parts are exactly: Drawer.Provider, Drawer.IndentBackground, Drawer.Indent, Drawer.Root, Drawer.Trigger, Drawer.SwipeArea, Drawer.Portal, Drawer.Backdrop, Drawer.Viewport, Drawer.Popup, Drawer.Content, Drawer.Title, Drawer.Description, Drawer.Close, Drawer.VirtualKeyboardProvider. Drawer.Root accepts snapPoints, snapPoint, onSnapPointChange, swipeDirection, modal and disablePointerDismissal.

Score the answer against each claim:
1. It builds the sheet from Base UI's Drawer, nested Drawer.Root > Drawer.Portal > Drawer.Popup with Drawer.Content inside the Popup. A Drawer.Viewport between Portal and Popup is also correct, as is a Drawer.Backdrop.
2. Two or more snap points are configured through the snapPoints prop on Drawer.Root, which is what answers the "half-open and fully-open" request.
3. Every Drawer part it USES IN THE CODE appears in the ground-truth list above.
   - Judge PART NAMES ONLY. Props, CSS class names, style objects and plain HTML elements are out of scope for this claim and can never fail it. A plain `<div className={styles.Handle} />` is an ordinary div, NOT a "Drawer.Handle", and must not be penalised.
   - Naming a part that does not exist in order to tell the user it does not exist — for example "Drawer.Handle isn't a part, use a plain div" — is CORRECT behaviour and must be scored as a PASS for this claim, not a failure.
4. It does not hand-roll the dragging with a gesture or animation library (framer-motion, react-spring, react-use-gesture) instead of using Drawer's built-in swipe and snapping.

Score down once for each claim that fails.
