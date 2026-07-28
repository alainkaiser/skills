---
name: restore-local-dev-stack
description: "Restore and verify local development environments on macOS across single- or multi-repository .NET, Node/React, Expo/React Native, Docker, Xcode, and physical-device workflows. Use when a project previously worked but no longer starts, the user asks whether a machine is ready, multiple local services must be brought up, or failures may involve PATH or SDK selection, ports, launch profiles, environment wiring, containers, listeners, health endpoints, localhost versus LAN access, permissions, simulator or physical-device reachability, or differences between the user's shell and the agent execution context. Don't use for greenfield project setup, production or cloud deployments, CI-only failures without a local reproduction, or speculative reinstalls when the stack already starts."
---

# Restore Local Dev Stack

Find the first broken boundary in the real local workflow, apply the smallest authorized fix, and verify the user's actual target. Prefer observed state over setup assumptions: an installed tool, running process, or successful login does not prove that the consuming application is using it.

Read `references/check-matrix.md` after identifying the stack and target. Use only the relevant sections and prefer repository-provided commands over the illustrative probes.

## Set the Mode and Target

- Honor the requested mode: readiness audit, diagnosis, guided restoration, or implementation. For diagnosis-only requests, report the cause and evidence without changing configuration.
- Define success in one sentence: name the user flow, the target surface (browser, simulator, physical device, or hardware), and the required repositories or services.
- Resolve unknowns from repository instructions, version pins, launch profiles, and local configuration before asking the user. Ask one blocking question only when the answer materially changes the safe path.
- For guided sessions, give one next action at a time. When the user asks "where?", name the exact application, screen, field, file, or command and explain the immediate cause and effect.
- Continue through safe read-only checks without waiting for generic permission to proceed.

## Build the Service Map

Record the intended and observed values before changing anything:

| Component | Repository | Start command or profile | Expected port and bind address | Consumer | Health or proof endpoint | Observed state |
| --- | --- | --- | --- | --- | --- | --- |
| Example API | `api/` | repo-provided profile | `0.0.0.0:5001` | mobile app | `/health` | unknown |

Include databases, emulators, containers, proxies, and live-data services only when they are on the required path. For multi-repository stacks, derive startup order from dependencies rather than folder order.

## Inspect Actual State

1. Read the most specific repository instructions and documented startup commands.
2. Inspect the working directory, Git state, version pins, package-manager files, launch settings, and relevant environment keys. Never print secret values; report only whether a required key is present and which non-sensitive endpoint or port it selects.
3. Verify the active executable and selected toolchain, not merely installation: executable path, version, SDK/runtime selection, and shell context.
4. Verify process state, the owning process for each port, listener address, and startup logs.
5. Probe the service directly from the same machine before testing it through a consuming application.
6. Compare the consumer's effective endpoint with the proven listener. Trace overrides in precedence order rather than assuming the nearest `.env` file wins.
7. If the target is a simulator or physical device, test the network route and permission state from that target. Treat `localhost` as target-relative.

Do not start with reinstalls, cache deletion, broad rebuilds, or speculative code changes. First establish which boundary fails.

## Isolate the First Broken Boundary

Test in this order and stop at the first failure:

1. **Command:** the intended executable resolves and the selected version is correct.
2. **Startup:** the documented command or profile creates a stable process.
3. **Listener:** the expected process owns the expected port and bind address.
4. **Direct service:** a local health or proof request returns the expected protocol and status.
5. **Consumer wiring:** the frontend, app, proxy, or dependent service uses that proven address.
6. **Target route:** the browser, simulator, device, or hardware can reach it.
7. **User flow:** the real end-to-end action succeeds.

For each failed boundary, state one evidence-backed hypothesis and run the shortest check that can disprove it. Change one variable at a time. If the same unexplained failure repeats, inspect new evidence and change the hypothesis instead of rerunning the same action.

## Apply the Smallest Fix

- Classify the cause before editing: machine/toolchain selection, repository configuration, service runtime, consumer wiring, network binding, permission/device state, application code, or agent/sandbox execution context.
- Prefer a repository-local or session-local correction when it restores the intended documented setup.
- Preserve unrelated user changes and existing ports. Confirm ownership before terminating or reconfiguring a process.
- Ask before global configuration edits, installs, dependency changes, destructive actions, or any scope expansion not authorized by the request.
- Do not convert an environment problem into an application-code workaround unless the infrastructure boundaries are proven correct.

## Verify the Real Outcome

Repeat the exact check that originally failed, then verify every downstream boundary through the real user flow. A local `curl`, successful build, simulator result, or login is only intermediate evidence when the requested target is a physical device or complete application flow.

Report:

- the restored outcome;
- the root cause and broken boundary;
- the minimal change made;
- the decisive commands or actions and their results;
- any skipped real-device, permission, external-service, or sandbox-dependent verification and its residual risk.

## Error Handling

* If a check fails in the agent sandbox but may succeed in the user's shell, re-run the same probe outside the sandbox or report the execution-context difference before changing configuration.
* If a port is occupied, identify the owning process before terminating or rebinding; ask before stopping a process that may belong to unrelated work.
* If a required secret or environment key is missing, report only presence and the non-sensitive endpoint or port it selects; ask the user to supply the value rather than inventing one.
* If simulator or physical-device reachability cannot be tested from the current session, record the skipped target-route check and residual risk instead of claiming end-to-end success.
* If the same unexplained failure repeats after one variable change, gather new evidence and revise the hypothesis; do not loop the same action.
