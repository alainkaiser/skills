# Mobile Web Platform Guidance

Read only the sections relevant to the interaction under review. Recheck the linked primary sources when exact current browser or standards behavior matters.

## Tap Feedback and Selection

- Safari on iOS uses a translucent highlight to acknowledge taps on links and clickable elements. `-webkit-tap-highlight-color` can recolor or hide it, but it is a non-standard, inherited WebKit extension. Keep it unless the control supplies equally immediate pressed feedback.
- `user-select: none` is intended for UI text whose accidental selection interferes with the likely action. It is not copy protection and should not be used broadly. The CSS UI specification already proposes `user-select: none` in the user-agent stylesheet for several native controls, including `button`; reproduce the problem before adding author CSS.
- `touch-action` controls browser panning and zooming behavior. It does not control text selection, highlighting, or control activation. Prefer the default mobile viewport behavior and preserve pinch zoom.

Sources:

- [Apple Safari Web Content Guide: Highlighting Elements](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html)
- [W3C CSS Basic User Interface Module Level 4: `user-select`](https://www.w3.org/TR/css-ui-4/#content-selection)
- [W3C Pointer Events: `touch-action`](https://www.w3.org/TR/pointerevents/#the-touch-action-css-property)

## Form-Control Focus Zoom

- iOS-family WebKit can automatically scale the page when a focused form control's text is too small. WebKit's focus-zoom implementation has historically computed a target scale that makes the control's effective font size 16.
- Keep the computed `font-size` of text-entry `input`, `textarea`, and `select` controls at least `16px` on affected mobile experiences. `1rem` is sufficient only when its computed value remains at least `16px`.
- Treat `16px` as a platform-behavior threshold, not a WCAG typography minimum and not a guarantee for every device setting or page scale.
- Preserve browser zoom. Do not add `user-scalable=no`, and do not set `maximum-scale` below `2`; preventing user zoom can fail WCAG Resize Text expectations.
- Verify the result on a real iPhone or iPad. Responsive browser emulation does not reproduce every software-keyboard, visual-viewport, or focus-zoom behavior.

Sources:

- [WebKit focus-zoom change history](https://trac.webkit.org/timeline?from=2018-04-06T11%3A11%3A25-07%3A00&precision=second)
- [W3C ACT Rule: Meta viewport allows for zoom](https://www.w3.org/WAI/standards-guidelines/act/rules/b4f0c3/)

## Target Size and Spacing

- Use CSS pixels for web measurements. Apple's platform design guidance says native touch controls should measure at least 44 by 44 points; do not rewrite that unit as physical pixels.
- WCAG 2.2 Success Criterion 2.5.8 requires a pointer target of at least 24 by 24 CSS pixels at Level AA, subject to spacing, equivalent-control, inline, user-agent-control, and essential exceptions.
- WCAG Success Criterion 2.5.5 uses 44 by 44 CSS pixels at Level AAA. Use that as the preferred mobile-web target when the design allows it, especially for frequent or consequential actions.
- An invisible hit region counts only where it actually accepts the pointer action. Exclude overlap with a different target from both controls' usable measurement.

Sources:

- [Apple UI Design Dos and Don'ts: Touch Controls](https://developer.apple.com/design/tips/)
- [W3C WCAG 2.2: Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum)
- [W3C WCAG 2.2: Target Size (Enhanced)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced)

## Pointer Capability Queries

- `pointer` and `hover` describe the primary input mechanism.
- `any-pointer` and `any-hover` describe all detected pointing mechanisms and can match more than one value on hybrid hardware.
- These media features do not reveal keyboard availability. Preserve keyboard behavior regardless of their values.

Source:

- [W3C Media Queries Level 5: Interaction Media Features](https://www.w3.org/TR/mediaqueries-5/#mf-interaction)
