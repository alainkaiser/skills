---
name: base-ui
description: "Build, style, and debug React interfaces with Base UI (@base-ui/react), the unstyled headless component library. Use when installing or upgrading @base-ui/react or its former name @base-ui-components/react, assembling component parts such as Dialog, Popover, Menu, Select, Combobox, Autocomplete, Tooltip, Toast, Accordion, Tabs, Field, or Form, composing with the render prop, styling states with data attributes and CSS variables, animating popups, wiring forms and validation, fixing popup stacking or focus issues, or porting Radix UI asChild patterns. Don't use for Material UI (@mui/material), the legacy @mui/base package, or React work that does not involve @base-ui/react."
---

# Base UI

Use Base UI's live documentation index as the source of truth. Do not cache its contents in this skill.

## Procedure

**Step 1: Confirm the Project Context**

1. Read the repository instructions, package manifest, and lockfile.
2. Identify the installed Base UI package and exact version. If the task is an evaluation before installation, note that no installed contract exists yet.
3. Identify the styling stack and its version, especially the installed Tailwind CSS version when Tailwind examples are relevant.

**Step 2: Load the Current Official Documentation**

1. Fetch `https://base-ui.com/llms.txt` at the start of every Base UI task. Do not rely on a remembered or previously fetched copy.
2. Treat `llms.txt` as an index. Open only the linked official Markdown pages needed for the component, utility, handbook topic, or release under review.
3. Read the component page before using its parts, props, state, events, or examples. Read the relevant handbook page when the task involves composition, styling, animation, forms, or TypeScript.

**Step 3: Reconcile the Live Docs With the Installed Package**

1. Compare the live documentation with the installed Base UI package and version before changing code.
2. Inspect the installed package exports and TypeScript declarations when exact API availability or signatures matter.
3. If the live docs describe an API the installed package does not expose, implement against the installed contract unless the user explicitly requests an upgrade. State the mismatch instead of silently adding or upgrading a dependency.
4. Adapt documentation examples to the project's installed styling-tool version without changing the documented Base UI behavior.

**Step 4: Apply the Relevant Guidance**

1. Match the documented component anatomy, composition model, controlled or uncontrolled state, event behavior, and accessibility contract.
2. Preserve project conventions and existing application behavior outside the requested change.
3. Avoid inventing props, parts, CSS variables, data attributes, or interaction behavior that are absent from both the relevant live docs and the installed package contract.

**Step 5: Validate the Result**

1. Run the smallest relevant repository-provided typecheck, lint, tests, and build commands.
2. Exercise affected keyboard, focus, pointer, form, and screen-reader behavior when the component interaction makes those checks relevant.
3. Report the installed Base UI version, the official pages used, the checks run, and any live-doc/version mismatch or skipped interaction coverage.

## Error Handling

* If `https://base-ui.com/llms.txt` is unavailable, use only official pages under `https://base-ui.com/` plus the installed package exports and TypeScript declarations, and state that the current index could not be verified.
* If no installed package contract exists and implementation would require adding `@base-ui/react`, ask before adding the dependency.
* If the live docs and installed package disagree, treat the installed package as authoritative for the current checkout and use the release notes linked from `llms.txt` to explain the drift when possible.
* If neither official documentation nor the installed contract confirms an API, stop and report the uncertainty instead of guessing.
