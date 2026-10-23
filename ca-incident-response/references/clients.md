# Which client trusts what, and how each one gets fixed

Read this during Phase 1 and Phase 4. "Own store" means the client ignores the macOS
keychain and OS updates do nothing for it. Verification is always a handshake with the
incident's test hosts (direct chain, cross-signed chain, no-CT variants) plus a control host.

| Client | Trust source | Fix | Verify |
|---|---|---|---|
| Homebrew Python (`python3.x`) | OpenSSL with `/opt/homebrew/etc/openssl@N/cert.pem`, a symlink to the `ca-certificates` formula | `brew update && brew upgrade ca-certificates python@3.x` (a new Python also brings its bundled pip) | `verify-tls.sh` row "python ssl default" |
| python.org Python | Its own certifi copy, installed by "Install Certificates.command" | Upgrade to the fixed release, then `python3.x -m pip install --upgrade certifi` | same |
| Apple `/usr/bin/python3` (Xcode) | `/etc/ssl/cert.pem`, no revocation; pip 21 with 2021 certifi | Apple only. Never use it or `/usr/bin/pip3` for installs | same, stays exposed |
| pip (every interpreter, every venv) | Its vendored `pip/_vendor/certifi/cacert.pem`, loaded in addition to the system store (`truststore`) with no supported way off; a fixed pip on macOS reports "certificate is revoked" from the system side and "unable to get local issuer" from the bundle side | Upgrade pip itself to the fixed release with the advisory's hash-pinned wheel URL, per interpreter and per venv; then `pip install --upgrade certifi` for projects that import certifi | row "pip vendored certifi" and the venv rows |
| `certifi` package | Mozilla bundle snapshot | `pip install --upgrade certifi` after pip is fixed | test with `cafile=certifi.where()` |
| uv | Bundled webpki-roots (rustls) | `uv self update` to the fixed release; interim `UV_SYSTEM_CERTS=true` with a fixed OS store | `UV_SYSTEM_CERTS` test against the hosts |
| conda, pixi, pipx, poetry | Their own Python and certifi | Upgrade the tool to its fixed release; pipx venvs need their pip upgraded like any venv | venv rows |
| Node (fnm, nvm, volta, Homebrew) | Bundled root store compiled in; `--use-system-ca` adds the keychain but validation stays OpenSSL's | Install the fixed release of each line in use; `fnm default <v>` for new shells, `fnm use <v>` for the current one; bump `.nvmrc`, `.node-version`, `engines`, Dockerfiles, CI containers; EOL lines get no fix | row "node vX" |
| npm, npx, yarn, pnpm, corepack | Node's TLS | Fixed with Node | same |
| Node bundled in other tools (Codex runtime, debugger extensions, Electron apps' helpers) | Their own copy | Wait for that vendor; list as exposed with the owner named | `-n <path>` rows |
| Bun | Own store plus revocation list in fixed releases | Upgrade through Homebrew tap or `bun upgrade` once the fixed version is offered; taps lag by a day or two | row "bun" |
| Deno | Bundled webpki-roots | `deno upgrade` to the fixed release | row "deno" |
| Go | On macOS the platform verifier with revocation (rejects revoked intermediates); fixed releases add key blocking for custom pools and Linux | `brew upgrade go`; rebuild shipped binaries | row "go" |
| Rust binaries | rustls with webpki-roots, or native-tls (Apple verifier) | Rebuild with webpki-roots at the fixed version | per binary |
| .NET on macOS | Apple verifier without revocation checking by default: accepts; `HttpClientHandler.CheckCertificateRevocationList = true` rejects | Framework-level fix pending; set revocation checking in apps you run locally | `snippets.md` program |
| .NET in Linux containers | OpenSSL with the distro `ca-certificates` package | Rebuild images from fresh bases; Alpine 20261020 and current Ubuntu/Debian images reject the chain | `openssl s_client` inside the image |
| Java | JDK `cacerts` | Upgrade the JDK to the fixed update | `keytool` or a JSSE connect |
| Apple `/usr/bin/curl` | Default backend LibreSSL with `/etc/ssl/cert.pem`, no revocation; `CURL_SSL_BACKEND=secure-transport` switches to Apple's trust engine | Apple only for the file; per call `--cacert <bundle>`, `CURL_CA_BUNDLE`, or the backend switch; `SSL_CERT_FILE` is ignored | rows "curl" (both backends) |
| Apple `/usr/bin/openssl`, `ruby`, `perl` and anything else reading `/etc/ssl/cert.pem` | Same file, no revocation | Apple only; avoid for downloads | `openssl s_client` verify return code |
| git (Apple's and Homebrew's) | Both link Apple's libcurl, so the curl row above applies | `GIT_SSL_CAINFO=<bundle>` for the session, or `git config http.sslCAInfo`; also the transport for third-party Homebrew taps | row "git": TLS must fail, not reach an HTTP error |
| cargo | Built on the system libcurl; crate and sparse-index downloads ride the curl path | `CARGO_HTTP_CAINFO=<bundle>`; `CARGO_HTTP_CHECK_REVOKE` does not help on macOS | row "cargo sparse index probe" |
| Homebrew itself | `/usr/bin/curl` for API and bottles; API JSON is signed and bottles are SHA-256 checked; third-party taps are plain git | `brew-tap-verify.sh` after `brew update`; keep `HOMEBREW_FORCE_BREWED_CA_CERTIFICATES` unset so it does not replace your bundle with its own | `brew config` shows the curl in use |
| Docker Desktop | Own trust for the daemon and CLI pulls | Update the app (signed updater) | release notes name the removal |
| Container images | Each image's distro store, pip, Node, Java | `docker pull` fresh bases; rebuild project images with `--pull`; official `python:3.x-slim` keeps old pip on end-of-life lines, so upgrade pip in the Dockerfile; digest-pinned `FROM` lines need the digest edited | run the check inside the image |
| Electron apps | Two stacks: Chromium's verifier with a built-in blocklist, and Node's bundled store for `https` from the main process | Each app updates on its own schedule; compare `Contents/Frameworks/Electron Framework.framework` `CFBundleVersion` with the fixed lines | Node side: `ELECTRON_RUN_AS_NODE=1` when the `runAsNode` fuse is on (the script checks the fuse first); Chromium side: version only |
| Safari, Mail, URLSession apps | Apple trustd with CT and revocation (Valid database); the roots stay installed, the block is a revocation | Apple pushes blocks | `security verify-cert` row (CSSMERR_TP_CERT_REVOKED), or `-s` for a live URLSession |
| Chrome, Brave, Firefox, Edge | Own root programs with CRLSet / OneCRL pushed out of band as component updates | Nothing; open the tracker's check hosts in the real profile | a fresh headless profile has no component updates yet and understates the block; CT-only rejections (`ERR_CERTIFICATE_TRANSPARENCY_REQUIRED`) do not prove the root is distrusted |
| CEF apps (Spotify and similar) | Embedded Chromium without a component updater or CT enforcement | Vendor update | treat as exposed until updated |
| Claude Code, Cursor, VS Code extensions | Bundled runtimes vary; incident trackers list fixed versions for some | Update the tool; test bundled Node binaries with `-n` | `-n <path>` rows |
