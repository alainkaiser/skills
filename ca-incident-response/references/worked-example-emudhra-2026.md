# Worked example: eMudhra / emSign intermediate CA compromise, October 2026

A complete run of this skill on a developer Mac (macOS 27.0.1, Apple Silicon), 22 and
23 October 2026. Use it as a template for the next incident; the numbers are not current.

## Incident facts (from the tracker and advisories, verified)

- Eight eMudhra Global TLS intermediates (`EM DV/OV/EV TLS CA - G3B` and `- G3C`, plus two
  code-signing CAs) had weak EC private keys (private scalar below 256, one was 4).
  Disclosed 18 October, revoked 18 and 19 October.
- They chain to `emSign Root TLS CA - G3` under `emSign ECC Root CA - G3` and are
  cross-signed by Sectigo's `AAA Certificate Services`. A bundle that drops only the emSign
  roots still accepts the cross-signed chain; certifi 2026.10.19 and Mozilla's 2026-10-20
  bundle drop AAA as well, which is why they reject both.
- Test hosts: `dv-g3b-emudhra.we-have-a-problem.com` (direct), `dv-g3b-aaa-emudhra…`
  (cross-signed), and `-noct-` variants of each. A certificate error is the good result.
- Fixed versions: certifi 2026.10.19, pip 26.2.2, CPython 3.15.1 / 3.14.9 / 3.13.17 (3.11
  and 3.12 got no installer, pip must be upgraded by hand), uv 0.13.4, conda 26.9.4, pixi
  0.82.1, Node 26.12.1 / 24.22.1 / 22.23.4, Bun 1.4.4, Deno 2.9.8, Go 1.27.3 / 1.26.10,
  Electron 44.9.1 / 43.8.1 / 42.11.16, Docker Desktop 4.96.2, Homebrew ca-certificates
  2026-10-20, Claude Code 2.1.303.
- Related live items that week, for the project side: Next.js RCEs GHSA-2464-fhr4-w9xw
  and GHSA-673q-mjm6-r5xr (fixed 15.5.28 / 16.4.1, sharp 0.35.5), Storybook
  GHSA-f2ph-cmg5-wxc8 (fixed 8.6.19 / 9.1.21 / 10.6.2), Node October security releases
  (CVE-2026-111497 Brotli RCE), LiteLLM 1.107.0 backdoor, GhostAction GitHub workflow
  campaign, tensorlake 0.5.144 npm worm.

## What the measurements showed before any fix

| Client | Direct | Cross-signed (AAA) |
|---|---|---|
| Apple `/usr/bin/curl` | accepted | accepted |
| Apple URLSession (Safari's path) | rejected (-1202) | rejected |
| Go 1.27.2 (platform verifier) | rejected, "certificate is revoked" | rejected |
| .NET 10 HttpClient default | accepted | accepted |
| .NET 10 with revocation checking | rejected, Revoked | rejected |
| Homebrew Python 3.14.8 (ca-certificates 2026-09-25) | accepted | accepted |
| pip 26.2.1 vendored certifi 2026.06.17 | accepted | accepted |
| certifi 2026.10.19 bundle | rejected | rejected |
| Node 26.5.0 | accepted | rejected (no AAA in Node's store) |
| Bun 1.4.2 | accepted | accepted |

Lesson: on this Mac only revocation checking stood between the clients and the chain, and
most non-browser clients skip it. Apple's trust store asset was still dated 2026-07-30.

## What was done

1. Primary sources read; a second AI's summary was checked and had two errors (a wrong
   advisory id, a misquoted tracker statement) and three valid critiques (overclaimed "no
   malware", untested "browsers are fine", a verification one-liner that counted any error
   as blocked).
2. Inventory: Homebrew python@3.14 only (no python.org, uv, conda), fnm with four Node
   versions, Bun from a Homebrew tap, Go, .NET 9/10, Docker Desktop 4.95.0, 14 Electron
   apps, Node and Python runtimes bundled in the Codex CLI, one stray venv.
3. IOC scan for LiteLLM (`cook.pth`, `cook.py`, `sitecustomize.py`, lock file), GhostAction
   (`security-audit.yml`, `github_actions_security.yml`, `.vscode/tasks.json`,
   `public/fonts/fa-solid-400.woff2`), tensorlake: nothing on disk, nothing in 218 github.com
   and 463 GitHub Enterprise repositories. Look-alikes found and dismissed: Homebrew's and
   LM Studio's `sitecustomize.py`, RustCrypto's `security-audit.yml` in the cargo registry.
4. Fixes with the certifi 2026.10.19 bundle (found inside the Codex runtime) exported as
   `SSL_CERT_FILE`, `CURL_CA_BUNDLE`, `GIT_SSL_CAINFO`: `brew update` with all four taps'
   HEADs matched against GitHub; `brew upgrade python@3.14 ca-certificates go`; Node 26.12.1,
   24.22.1 and 22.23.4 via fnm with tarballs verified against `SHASUMS256.txt` and installed
   binaries compared byte for byte; Bun the next day when the tap reached 1.4.4; Docker
   Desktop by the user; the venv's pip by the user; 22 public base images re-pulled.
5. Re-measurement: Homebrew Python, pip 26.2.2, Node 26.12.1 (`CERT_REVOKED`), Go 1.27.3,
   Bun 1.4.4 and the venv reject all four hosts. Still exposed and vendor-owned: Apple's
   curl and `python3`, Codex's bundled Node 24.19.0, .NET's default, six Electron apps.

## What a second, independent run added (eval of this skill, 23 October)

A run without the skill reached the same verdicts in 39 minutes instead of 24 and found
clients the skill's first version skipped: Apple's git and Homebrew's git both ride Apple's
libcurl (TLS passed, failure only at the HTTP level), cargo's sparse-index fetch rides the
same libcurl, Apple's ruby and perl read `/etc/ssl/cert.pem`, four Electron apps were
measurable on their Node side with `ELECTRON_RUN_AS_NODE` (Arduino IDE, LM Studio, NuPhyIO,
Paper accepted; Cursor, OpenCode, T3 Code rejected with `CERT_REVOKED`), `security
verify-cert` showed Apple's block as `CSSMERR_TP_CERT_REVOKED` with both roots still
installed, and Apple's curl turned out to default to LibreSSL with `/etc/ssl/cert.pem`
(`CURL_SSL_BACKEND=secure-transport` makes it reject). The skill's run found azure-cli's
certifi 2024.07.04, Codex's Python default context, LM Studio's certifi, two debugger pips
and the Docker daemon's own pulls, which the other run skipped. Both sets went into the
script in iteration 2.

## Side effects and mistakes worth remembering

- Homebrew moved the unversioned `python3` alias to python@3.15, so after the upgrade
  `python3` resolved to Apple's 3.9 with pip 21. Fixed by adding
  `/opt/homebrew/opt/python@3.14/libexec/bin` to PATH.
- The agent's shell kept its old PATH; `zsh -ic` showed the user's real resolution.
- A zsh `for` loop over an unquoted space-separated list pulled one giant image name.
- `gh api ... --jq '.name'` on 404 printed `null` and produced 218 false tasks.json hits.
- `python:3.12-slim`, freshly pulled, still ships pip 25.0.1 with certifi 2024.08.30.
- The Bun tap offered 1.4.3 while the fixed release was 1.4.4; waiting was the right call.
- Scratch files vanished when the session changed folders; keep the bundle's SHA-256 in
  the report so it can be re-staged and re-verified.
