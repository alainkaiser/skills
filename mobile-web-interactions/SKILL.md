---
name: mobile-web-interactions
description: "Improves touch ergonomics in HTML/CSS websites. Use when web controls have unwanted tap highlights, accidental long-press selection, undersized or overlapping hit areas, coarse-pointer adaptations, form controls that zoom on focus, or other mobile-browser interaction bugs. Don't use for native iOS or Android UI, general responsive layout, or broad accessibility audits."
---

# Mobile Web Interactions

Improve touch ergonomics without removing useful browser behavior or weakening keyboard, zoom, mouse, pen, or assistive-technology access.

Apply this skill only to websites rendered by a browser. Use native-platform guidance for SwiftUI, UIKit, Jetpack Compose, or Android Views.

## Procedure

**Step 1: Establish the Interaction Boundary**

1. Read the repository instructions and inspect the rendered control, its semantic element, surrounding targets, layout containers, and existing pressed, focus, hover, disabled, and loading states.
2. Confirm whether the issue is tap feedback, accidental selection, target size or spacing, form-control focus zoom, gesture handling, or an interaction that depends incorrectly on hover.
3. Use a native `button`, link, or form control when its semantics fit. Do not repair a generic clickable element with CSS alone.
4. Keep general responsive layout and broad accessibility work outside this skill. Use the relevant companion skill when those concerns dominate.

**Step 2: Preserve or Replace Browser Feedback Deliberately**

1. Keep the browser tap highlight by default.
2. Set `-webkit-tap-highlight-color: transparent` only on a specific control that already provides immediate, visible pressed feedback. Treat the property as a non-standard, inherited WebKit extension and never apply it globally by default.
3. Set `user-select: none` only on a short, non-copyable control label when accidental selection demonstrably interferes with activation. Do not apply it to page content, error messages, values, inputs, textareas, editable content, or a broad ancestor.
4. Preserve a visible `:focus-visible` indicator. Do not use a pressed state as the only focus or activation signal.
5. Read `references/platform-guidance.md` when changing tap highlighting, text selection, viewport zoom, or gesture behavior.

**Step 3: Prevent Unintended Form-Control Zoom**

1. Inspect the computed `font-size` of each text-entry `input`, `textarea`, and `select` at the affected viewport. Do not rely only on a token name, utility class, or authored `rem` value.
2. Keep the computed font size at least `16px` for form controls used in mobile Safari and other WebKit-based iOS browsers. Treat this as a WebKit focus-zoom heuristic, not a general CSS or WCAG minimum.
3. Prefer an actual readable `16px` font size. If the desktop design deliberately uses smaller control text, apply the `16px` minimum where a coarse pointer is available and verify hybrid devices; do not infer iOS from viewport width alone.
4. Do not prevent the zoom by setting `user-scalable=no` or `maximum-scale=1` in the viewport metadata. Preserve user-controlled pinch zoom and text resizing.
5. Avoid transform-based shrinking that visually disguises a `16px` control unless rendered layout, legibility, hit testing, and focus behavior prove that it creates no new problem.
6. Read `references/platform-guidance.md` when diagnosing form-control focus zoom or changing viewport metadata.

**Step 4: Size the Active Target**

1. Measure the active hit region, not only the visible icon or label.
2. Prefer a target of at least 44 by 44 CSS pixels for frequently used controls. Treat 24 by 24 CSS pixels or the WCAG spacing exception as the Level AA floor, not the preferred mobile target.
3. Prefer `min-width`, `min-height`, or padding on the interactive element. Keep the visual glyph small inside the larger control when the design needs compact visuals.
4. If changing layout is unacceptable, expand the hit region with a positioned pseudo-element:

   ```css
   .control {
     position: relative;
   }

   .control::after {
     content: "";
     position: absolute;
     inset: -8px;
   }
   ```

5. Use the pseudo-element technique only after confirming that no ancestor clips it, no neighboring interactive target overlaps it, and stacking order does not make another control win hit testing. Do not count overlapping regions toward either target's usable size.
6. Keep inline links in prose readable and selectable; apply the relevant WCAG inline exception rather than turning each sentence link into a large invisible rectangle.

**Step 5: Adapt to Capabilities, Not Device Labels**

1. Make controls usable by keyboard and without hover before adding pointer-specific refinements.
2. Use `(pointer: coarse)` for the primary pointer and `(any-pointer: coarse)` only when the presence of any coarse pointer should affect the design. Account for hybrid devices that expose both touch and a mouse or trackpad.
3. Do not infer touch capability from viewport width or a mobile user agent string.
4. Use `touch-action` only when the component has a concrete panning or zooming conflict. Do not use it to control selection or tap highlighting, and do not disable pinch zoom.

**Step 6: Validate the Real Interaction**

1. Run the smallest relevant repository-provided static checks.
2. Inspect target geometry and spacing at the affected viewport sizes. For pseudo-element targets, verify actual hit testing outside the visible box because `getBoundingClientRect()` does not include the pseudo-element.
3. Exercise tap, repeated tap, long press, scroll initiation, pinch zoom, form-control focus, keyboard focus and activation, mouse click, and disabled behavior as applicable.
4. On iOS Safari, compare the page scale before and after focusing each text-entry control. Distinguish automatic page zoom from the normal scroll or viewport repositioning needed to reveal a field above the software keyboard.
5. Test platform-specific behavior in Safari on iOS and Chrome on Android when the change depends on browser chrome, tap highlighting, selection, long press, or focus zoom. Use a real device when emulation cannot prove the behavior.
6. Recheck nearby controls after target expansion to catch ambiguous or overlapping activation areas.

**Step 7: Report the Evidence**

1. State the interaction problem, the browser behavior preserved or replaced, and the smallest change made.
2. Report target dimensions, spacing or overlap checks, platforms exercised, and any real-device validation that remains unverified.

## Error Handling

* If the issue cannot be reproduced, preserve the browser default and report the missing evidence instead of applying a global reset.
* If a larger invisible hit region overlaps another target or is clipped, enlarge the real control or revise the layout instead of forcing the pseudo-element technique.
* If removing selection or browser feedback makes the control's state ambiguous, restore the default behavior or add an equally immediate visible signal.
* If a `16px` form control still appears to zoom, verify the computed size, initial page scale, Safari page-zoom setting, viewport metadata, and whether the observed movement is scrolling rather than scaling before changing CSS again.
* If device testing is unavailable, report desktop or emulator evidence separately and leave the platform-specific outcome unconfirmed.
