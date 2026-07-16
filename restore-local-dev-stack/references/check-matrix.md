# Local Development Check Matrix

Use repository-provided commands first. The probes below are examples for selecting a decisive check, not a checklist to run in full. Avoid commands that expose environment values, credentials, or credential-bearing remote URLs.

## Contents

- General service boundaries
- macOS and Xcode
- .NET and ASP.NET Core
- Node, React, and Vite
- Docker Compose
- Expo, simulators, and physical devices
- Git and execution context
- Cause classification

## General Service Boundaries

| Boundary | Inspect | Decisive evidence | Common fault |
| --- | --- | --- | --- |
| Command | `command -v <tool>` plus the tool's version command | Resolved path and version match repo pins | Another installation wins `PATH` |
| Startup | Repo start command, focused logs, process list | Process remains alive without a fatal startup error | Wrong profile, missing dependency, port collision |
| Listener | `lsof -nP -iTCP:<port> -sTCP:LISTEN` | Expected process owns the port on the required address | Unrelated macOS service owns port; loopback-only bind |
| Direct HTTP | `curl -i http://127.0.0.1:<port>/<proof>` | Expected service identity, status, and content type | Port is open but serves the wrong application |
| Consumer | Effective non-secret URL, proxy, or launch config | Consumer address exactly matches the proven listener | Stale override or wrong precedence |
| LAN route | Host LAN address plus a request from the target | Target reaches the same proof endpoint | `localhost` used from device; firewall; isolated network |
| User flow | Real browser/app action | Requested behavior succeeds | Application bug remains after infrastructure passes |

Use `lsof` output to identify the owner before stopping a port. Probe a specific health, version, or API route when `/` could legitimately return `404`.

## macOS and Xcode

| Question | Checks | Interpretation |
| --- | --- | --- |
| Which developer directory is active? | `xcode-select -p`; `xcodebuild -version` | A path under Command Line Tools cannot provide the full Xcode toolchain |
| Is the requested platform visible? | `xcrun simctl list`; inspect the project's deployment target | Separate a missing runtime/device from a build failure |
| Is the intended architecture/tool selected? | `uname -m`; `command -v <tool>`; tool version | Detect Rosetta or duplicate Homebrew/runtime installations only when evidence points there |
| Is a permission blocking the flow? | Inspect the relevant macOS Privacy & Security entry and app permission state | A granted build/signing state does not imply camera, local-network, or file permission |

Change `xcode-select`, licenses, global PATH files, or system permissions only with the required user authorization.

## .NET and ASP.NET Core

| Question | Checks | Interpretation |
| --- | --- | --- |
| Which SDK is selected? | Inspect `global.json`; run `dotnet --info` and `dotnet --list-sdks` | Installation is insufficient if selection differs from the repo pin |
| Which launch profile and URLs apply? | Inspect `Properties/launchSettings.json`, repo scripts, and named profile | The port printed by a different profile is not proof for the requested profile |
| What owns the configured port? | `lsof`, then direct `curl` to a known API route | Identify unrelated services and distinguish `401`/`403` from wrong-service responses |
| Can another device reach Kestrel? | Compare the listener address with the LAN URL | Loopback binding works locally but cannot serve a physical device |

Trace endpoint configuration through the actual startup path, including environment-specific app settings and non-secret URL variables.

## Node, React, and Vite

| Question | Checks | Interpretation |
| --- | --- | --- |
| Which runtime/package manager applies? | Inspect `package.json`, lockfile, `.nvmrc`, `.node-version`, or `packageManager`; run versions | Use the repo's package manager and pinned runtime |
| Which command starts the app? | Inspect package scripts and repo docs | Do not substitute a generic framework command when a wrapper script supplies configuration |
| Which API URL is effective? | Inspect relevant non-secret config keys and framework precedence | A correctly running backend is irrelevant if the bundle points elsewhere |
| Is the dev server reachable off-host? | Inspect host/bind configuration and listener | `localhost` or `127.0.0.1` is insufficient for a physical device |

Treat browser console/network evidence as consumer evidence, then confirm the called URL directly.

## Docker Compose

| Question | Checks | Interpretation |
| --- | --- | --- |
| Is the daemon/context available? | `docker context show`; `docker info` | Distinguish daemon/context failure from application failure |
| What configuration is effective? | Repo compose command; `docker compose config` | Resolve merged files, variables, ports, and profiles without guessing |
| Are containers healthy and published? | `docker compose ps`; focused service logs; host `lsof` | Container-internal listening does not prove host publication |
| Can dependencies resolve? | Inspect service names and network configuration | Inside Compose, `localhost` refers to the current container |

Do not delete volumes, images, or caches unless the user explicitly authorizes destructive cleanup.

## Expo, Simulators, and Physical Devices

| Boundary | Checks | Interpretation |
| --- | --- | --- |
| Bundler | Repo Expo start command, focused Metro output, listener | Confirm LAN/tunnel/localhost mode and the advertised address |
| App configuration | Inspect public Expo config and non-secret endpoint selection | The JavaScript bundle may use a different URL than the native project |
| Simulator route | Open the exact proof URL from the simulator when practical | Simulator success is intermediate evidence only |
| Physical-device route | Open the host LAN proof URL on the device; confirm same network | Establish reachability before debugging app fetch logic |
| Native permission | Follow unknown/loading, denied, and granted states | Mount hardware-dependent UI only after permission is granted |
| Native build | Use repo build/run action and inspect signing/device selection | Separate compile/signing failures from runtime connectivity |

Verify camera, local-network, push, Bluetooth, or hardware behavior on the real device when the requested outcome depends on it.

## Git and Execution Context

| Question | Checks | Interpretation |
| --- | --- | --- |
| Is the failure repository-local? | `git status --short --branch`; inspect scoped Git config without printing secrets | Keep dirty user changes separate from environment diagnosis |
| Is the SSH agent holding the intended key? | `ssh-add -l`; inspect host aliases and `core.sshCommand` only when relevant | Successful one-off auth can still leave repeated passphrase prompts |
| Does it fail only inside the agent? | Compare the same non-destructive check in the user's terminal and agent shell | Classify network, keychain, GUI, or sandbox limitations as execution-context issues |

Do not rewrite remotes, credentials, SSH config, or global Git config without explicit authorization.

## Cause Classification

| Evidence | Classify as |
| --- | --- |
| Wrong executable, SDK, developer directory, or shell path before repo startup | Machine/toolchain selection |
| Checked-in or local launch/profile/config mismatch | Repository configuration |
| Intended command starts but crashes or never listens | Service runtime |
| Service passes direct proof but consumer calls a different address | Consumer wiring |
| Host succeeds but simulator/device cannot reach the listener | Network binding or target route |
| Network succeeds but OS/app denies capability | Permission or device state |
| All infrastructure boundaries pass but the real flow fails | Application behavior |
| Check succeeds in the user's terminal but fails only in the agent | Agent/sandbox execution context |
