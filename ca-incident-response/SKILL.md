---
name: ca-incident-response
description: "Respond to a certificate-authority compromise, root-store distrust, or any security incident that reaches developer toolchains on a Mac: inventory every TLS client that carries its own trust store (pip/certifi, Python, Node, Bun, Deno, Go, .NET, Electron apps, Docker Desktop, Homebrew), scan for a campaign's indicators of compromise, measure which clients still accept the bad chain against the incident's test hosts, apply updates behind a corrected CA bundle with download-integrity checks, then verify again and report fixed vs still-exposed tools separately. Use this whenever the user mentions a CA or certificate incident (eMudhra, emSign, a compromised or mis-issued intermediate, a distrusted root), certifi, pip, Node or Bun CA-store updates, a pwn.watch or discuss.python.org security notice, 'is my machine affected', 'check my computer for this', trust stores, or wants a second AI's security advice validated, even when nobody says 'incident response'."
---

# CA incident response for a developer Mac

A compromised CA is not fixed by one OS update. Every runtime that ships its own root
store keeps trusting the bad chain until it is updated separately: pip's vendored certifi,
each Python's ssl bundle, every Node version, Bun, Go, Java, Electron apps, Docker Desktop,
Homebrew's ca-certificates, plus runtimes bundled inside other tools (Codex, debuggers).
Clients that use Apple's verifier are protected only when revocation or a pushed block
applies, and Apple's own `curl` and `python3` do neither. The work is therefore: measure
each client, fix each client, measure again. Nothing here is "install a patch and done".

Three rules shape every step:

1. Measure, don't infer. A client is fixed only when a handshake with the incident's test
   host fails with a certificate error. "Version X is listed as fixed" is a hypothesis.
2. Distinguish outcomes. ACCEPTED (exposed), CERT-REJECTED (protected, quote the error),
   NETWORK-ERROR (inconclusive). A handler that treats any error as "blocked" produces
   false reassurance; this exact mistake was caught by a reviewer once.
3. Claim only what was checked. "No indicators of campaign X found" is true; "no malware"
   is not. "Browsers are fine" needs a measurement of the browser's trust path.

## Phase 0: ground truth (10 min)

Read the primary sources before touching the machine: the incident tracker (for the 2026
eMudhra case, `emudhra.we-have-a-problem.com`), the vendor advisories, the Python
discuss thread, the pwn.watch item. Extract into a scratch note:

- Affected intermediates and the roots they chain to, and any cross-signs. A cross-signed
  intermediate (eMudhra's were cross-signed by Sectigo's AAA root) means removing the
  obvious root from a bundle is not enough; the bundle must also drop the cross-signer or
  the client must block by key.
- Test hosts: direct chain, cross-signed chain, and no-CT variants if published. A correct
  result is a certificate error on all of them and success on a control host.
- Fixed versions per client, from the advisory, not from memory or from another AI.
- Whether the incident has a malware component (backdoored packages, stolen tokens) that
  needs an IOC scan as well.

Secondary summaries get details wrong under time pressure: a wrong GHSA id, a report
"updated to say X" that says no such thing, a Docker workaround that does not change the
code path. Verify any claim you will act on against the page that makes it.

## Phase 1: inventory (5 min, read-only)

Run `scripts/inventory.sh` (add `-k <CA name>` to search the keychains, `-e <fixed Electron
versions>` to classify Electron apps). It lists every Python with its pip and certifi
versions, every standalone certifi copy, venvs, ensurepip wheels, Node versions from
fnm/nvm/volta plus runtimes bundled in other tools, Bun, Deno, Go, Java, .NET, Docker
Desktop, Electron apps, Homebrew's ca-certificates and curl path, and Apple's curl.

Read `references/clients.md` for what each client trusts and how it gets fixed. The table
is the map for Phases 3 and 4.

## Phase 2: IOC scan, only when the incident has a malware component (5 min)

Run `scripts/ioc-scan.sh <file names...>` with the campaign's indicators (planted files,
workflow names, package names, lock files). It searches the home folder and tool prefixes,
lists processes, crontab, LaunchAgents and non-standard `.pth` files. Then inspect each hit
yourself: Homebrew's `sitecustomize.py` and RustCrypto's `security-audit.yml` are benign
look-alikes. Check remote repositories separately (a GitHub account compromise shows up
there, not on disk), with exit codes rather than parsed JSON: a 404 piped through `jq
'.name'` prints `null`, which reads as a hit.

Report this phase as "no indicators of <campaign> found in <what was searched>", and say
what was not searched (other accounts, enterprise hosts, images not on disk).

## Phase 3: measure exposure (5 min, read-only)

Run `scripts/verify-tls.sh <test hosts...>` (`-c` sets the control host, `-s` adds a Swift
URLSession check, `-E` skips Electron apps). It tests, per host: each Python's default ssl
context, each pip's vendored certifi bundle, each venv's pip bundle, every installed Node
version (fnm, nvm, volta, Homebrew) plus bundled runtimes, Bun, Deno, Go, Apple's curl with
its default LibreSSL backend and with `CURL_SSL_BACKEND=secure-transport`, Apple's and
Homebrew's git, cargo's sparse-index fetch, Apple's trust engine through `security
verify-cert` on the served chain (the path Safari and URLSession take), and the Node side of
each Electron app whose `runAsNode` fuse is on. Every installed Node version matters, not only
the default: project pins (`.nvmrc`, `.node-version`) select old ones.

Add by hand what the script cannot do: .NET (accepts by default, rejects only with
`CheckCertificateRevocationList = true`; snippet in `references/snippets.md`), the Chromium
side of Electron apps, and browsers. Do not describe a browser as safe without a result for
its trust path; a fresh headless Chrome profile lacks the component-updated CRLSet, so it
understates what the user's real profile blocks.

Keep the output as the "before" file. The same run after the fixes is the evidence.

## Phase 4: fix, behind a corrected bundle (20 min)

Confirm the plan with the user before changing anything, and keep project repositories out
of it; dependency bumps are a separate task with their own review.

**Corrected bundle.** Pick a CA bundle that already excludes the bad roots and cross-signers:
a fixed certifi found on disk by the inventory (another tool's runtime often updates first),
or Homebrew's `ca-certificates` right after `brew update && brew upgrade ca-certificates`.
Verify it: the bad names are absent, Apple's `curl --cacert <bundle>` fails on every test
host and succeeds on github.com, ghcr.io, formulae.brew.sh and nodejs.org. Record its SHA-256.

**Environment for every download step:**

```bash
export SSL_CERT_FILE=<bundle> CURL_CA_BUNDLE=<bundle> GIT_SSL_CAINFO=<bundle> GIT_SSL_CAPATH=<bundle dir>
unset HOMEBREW_FORCE_BREWED_CA_CERTIFICATES   # otherwise brew swaps in its own, possibly old, bundle
```

Apple's curl defaults to its LibreSSL backend with `/etc/ssl/cert.pem` and no revocation
checking; it ignores `SSL_CERT_FILE` but honors `CURL_CA_BUNDLE` and `--cacert`, and
`CURL_SSL_BACKEND=secure-transport` switches it to Apple's trust engine. Both Apple's and
Homebrew's git link Apple's libcurl, so `GIT_SSL_CAINFO` is what matters for git; cargo is
built on the same libcurl (`CARGO_HTTP_CAINFO`). A VPN moves the attacker's position; it does
not change what the client trusts.

**Integrity checks, because a bundle only protects the transport:**

- Homebrew core: the JSON API is signed and bottles are SHA-256 checked, so `brew upgrade`
  is safe even over a bad channel. Third-party taps are fetched over plain git: run
  `scripts/brew-tap-verify.sh` after `brew update`; it compares each tap's HEAD with GitHub
  through `gh`, whose Go TLS stack rejects the bad chain.
- Node: `scripts/node-verified-install.sh -b <bundle> <versions...>` downloads the tarball
  and `SHASUMS256.txt` through the bundle, verifies the hash, runs `fnm install`, then
  compares the installed binary with the verified tarball before you switch to it. Finish
  with `fnm default <v>` and `fnm use <v>`; `default` affects new shells only, and project
  pins (`.nvmrc`, `.node-version`, `engines`) will select old versions again until bumped.
- pip: upgrade with the hash-pinned wheel URL from the advisory (`pip install "pip @
  <url>#sha256=<hash>"`), per interpreter and per venv; pip loads its vendored certifi in
  addition to the system store, with no supported way off.
- Docker Desktop: its updater is signed; update it from the app. Then re-pull public base
  images (`docker pull`); project images need a rebuild, which is project work.
- Bun, Deno, Go, Java: upgrade through their package manager once it offers the fixed
  version. Taps lag releases by a day or two; a version below the advisory's is not a fix.

Upgrades change defaults. Homebrew moving the unversioned `python3` to a newer major
leaves `python3` pointing at Apple's old interpreter; check `which -a python3` afterwards.

## Phase 5: verify again and report (5 min)

Re-run `scripts/verify-tls.sh` with the same hosts, re-select the Node version first, and
diff against the "before" file. Then report with this structure:

```
## Fixed (reject every test host, control host works)
- client, version, error text

## Still exposed
- client, version, who can fix it (vendor), interim option if any

## Not measured
- what and why (browser not driven, image not on disk, enterprise host not scanned)

## Side effects of the fixes
- e.g. python3 now resolves elsewhere, old Node still pinned by 17 repos
```

Vendor-owned items stay listed until the vendor ships: Apple's `curl` and `python3`,
runtimes bundled inside other apps, Electron apps below the fixed lines (compare each app's
`Electron Framework.framework` `CFBundleVersion` with the fixed versions), .NET's default
revocation setting, container images that still ship old pip or Node.

## Working with a second reviewer

A second AI or colleague reviewing the plan is useful exactly where this work fails:
overclaims and untested verification. Validate each of their points against primary
sources, concede the valid ones in writing, correct the wrong citations with the right ones,
and keep the measured results as the shared ground. Their "go" is not the user's; wait for
the user before changing the machine.

## Gotchas collected in practice

- `brew outdated` reads a cached index; without `brew update` it lies about versions.
- Apple's trust store asset date is in
  `/System/Library/Security/Certificates.bundle/Contents/Resources/AssetVersion.plist`;
  revocation data arrives separately, which is why Go rejects a chain that Apple's curl accepts.
- A forged certificate can carry valid SCTs, so CT alone does not protect; revocation
  checking does, and most non-browser clients skip it.
- `timeout` does not exist on macOS; zsh does not word-split unquoted variables, so a
  space-separated list in a `for` loop becomes one argument; an agent's shell keeps the
  PATH it started with, so check the user's real resolution with `zsh -ic 'which python3'`.
- Agent environments may set `NODE_USE_SYSTEM_CA=1`, which the user's shell does not; the
  script unsets it for the Node rows so they show what the user's shell gets.
- Apple blocks by revocation (the roots stay in the keychain, `security verify-cert` says
  `CSSMERR_TP_CERT_REVOKED`), which is exactly why revocation-off clients such as .NET's
  default, Apple's curl, git and cargo slip through.
- Official `python:3.x-slim` images keep an old pip until CPython 3.x itself gets a release,
  which end-of-life lines never do; a Dockerfile must upgrade pip explicitly.
- `FROM image@sha256:...` pins ignore a fresh pull until the digest is edited.

Read `references/worked-example-emudhra-2026.md` for a complete run of this skill, with
the measurements and the mistakes.
