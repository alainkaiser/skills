#!/usr/bin/env bash
# verify-tls.sh: which TLS clients on this Mac still trust a compromised CA chain?
#
# Read-only. Performs TLS handshakes (HEAD requests or ls-remote at most); sends no credentials.
#
# Usage: verify-tls.sh [-c CONTROL_HOST] [-s] [-E] [-n NODE_BIN]... HOST [HOST...]
#   HOST          a test server that presents a certificate from the compromised CA
#                 (incident trackers publish direct, cross-signed and no-CT variants)
#   -c HOST       control host that must stay ACCEPTED (default pypi.org)
#   -s            also test Apple's URLSession (compiles a Swift snippet, ~20 s per host)
#   -E            skip Electron apps (their Node side is run with ELECTRON_RUN_AS_NODE, no UI)
#   -n NODE_BIN   extra Node binary to test (bundled runtimes); may repeat
#
# Per client x host: ACCEPTED (exposed), CERT-REJECTED: <error> (protected),
# NETWORK-ERROR: <error> (inconclusive). Never read an error as "blocked" without the class.
set -u
CONTROL=pypi.org; SWIFT=0; ELECTRON=1; EXTRA_NODES=()
while getopts "c:sEn:" o; do
  case $o in
    c) CONTROL=$OPTARG ;;
    s) SWIFT=1 ;;
    E) ELECTRON=0 ;;
    n) EXTRA_NODES+=("$OPTARG") ;;
    *) exit 2 ;;
  esac
done
shift $((OPTIND - 1))
[ $# -ge 1 ] || { echo "usage: $0 [-c control_host] [-s] [-E] [-n node_bin] host..." >&2; exit 2; }
HOSTS=("$@")
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT

row() { printf '%-56s %-44s %s\n' "$1" "$2" "$3"; }

py_test() { # interpreter host [cafile]
  "$1" -I - "$2" "${3:-}" <<'PY'
import socket, ssl, sys
host, cafile = sys.argv[1], (sys.argv[2] or None)
ctx = ssl.create_default_context(cafile=cafile)
try:
    with socket.create_connection((host, 443), timeout=15) as s:
        with ctx.wrap_socket(s, server_hostname=host):
            print("ACCEPTED")
except ssl.SSLCertVerificationError as e:
    print("CERT-REJECTED:", e.verify_message)
except ssl.SSLError as e:
    print("TLS-ERROR:", e)
except OSError as e:
    print("NETWORK-ERROR:", e)
PY
}

NODE_JS='
const https = require("https"); const host = process.argv[1];
const req = https.request({host, port: 443, path: "/", method: "HEAD", timeout: 15000},
  r => { console.log("ACCEPTED HTTP " + r.statusCode); process.exit(0); });
req.on("error", e => {
  const c = String(e.code || "");
  const cert = /CERT|UNABLE_TO_|SELF_SIGNED|DEPTH_ZERO|ERR_TLS|ALTNAME|REVOKED/i.test(c + e.message);
  console.log((cert ? "CERT-REJECTED: " : "NETWORK-ERROR: ") + c + " " + e.message.split("\n")[0]);
  process.exit(0);
});
req.on("timeout", () => { console.log("NETWORK-ERROR: timeout"); req.destroy(); process.exit(0); });
req.end();'

node_test() { # node_bin host   (NODE_USE_SYSTEM_CA unset: measure the binary's own store, as a normal shell does)
  env -u NODE_USE_SYSTEM_CA "$1" -e "$NODE_JS" "$2" 2>&1 | grep -E 'ACCEPTED|REJECTED|ERROR' | tail -1
}

electron_test() { # app_exe host
  ELECTRON_RUN_AS_NODE=1 "$1" -e "$NODE_JS" "$2" 2>/dev/null | grep -E 'ACCEPTED|REJECTED|ERROR' | tail -1
}

bun_test() { # host
  H="$1" bun -e '
const host = process.env.H;
fetch("https://" + host + "/", {method: "HEAD"})
  .then(r => console.log("ACCEPTED HTTP " + r.status))
  .catch(e => { const c = String(e.code || "") + " " + String(e.message || "");
    const cert = /CERT|UNABLE_TO_|SELF_SIGNED|DEPTH_ZERO|certificate|REVOKED/i.test(c);
    console.log((cert ? "CERT-REJECTED: " : "NETWORK-ERROR: ") + c.trim()); });' 2>&1 | tail -1
}

deno_test() { # host
  H="$1" deno eval --quiet '
const host = Deno.env.get("H");
try { const r = await fetch("https://" + host + "/", {method: "HEAD"}); console.log("ACCEPTED HTTP " + r.status); }
catch (e) { const c = String(e.message || e); const cert = /cert|UnknownIssuer|invalid peer|revoked/i.test(c);
  console.log((cert ? "CERT-REJECTED: " : "NETWORK-ERROR: ") + c.split("\n")[0]); }' --allow-net --allow-env 2>&1 | tail -1
}

go_test() { # host
  local d; d=$(mktemp -d "$TMP/go.XXXXXX")
  cat > "$d/main.go" <<'GO'
package main
import ("crypto/tls"; "fmt"; "net"; "os"; "strings"; "time")
func main() {
  h := os.Args[1]; d := net.Dialer{Timeout: 15 * time.Second}
  c, err := tls.DialWithDialer(&d, "tcp", h+":443", &tls.Config{ServerName: h})
  if err != nil {
    if strings.Contains(err.Error(), "x509") || strings.Contains(err.Error(), "certificate") { fmt.Println("CERT-REJECTED:", err) } else { fmt.Println("NETWORK-ERROR:", err) }
    return
  }
  c.Close(); fmt.Println("ACCEPTED")
}
GO
  (cd "$d" && GOFLAGS=-mod=mod go run main.go "$1" 2>&1 | tail -1)
}

curl_test() { # curl_bin host [backend]
  local code rc
  if [ -n "${3:-}" ]; then code=$(CURL_SSL_BACKEND="$3" "$1" -sS -o /dev/null --max-time 15 -w '%{http_code}' "https://$2/" 2>/dev/null); rc=$?
  else code=$("$1" -sS -o /dev/null --max-time 15 -w '%{http_code}' "https://$2/" 2>/dev/null); rc=$?; fi
  case $rc in
    0) echo "ACCEPTED HTTP $code" ;;
    35|51|60) echo "CERT-REJECTED: curl exit $rc" ;;
    *) echo "NETWORK-ERROR: curl exit $rc" ;;
  esac
}

git_test() { # git_bin url   (TLS accepted shows up as an HTTP-level error from a non-git server)
  local out; out=$("$1" ls-remote "$2" HEAD 2>&1 | head -2 | tr '\n' ' ')
  if echo "$out" | grep -qiE 'SSL certificate problem|certificate verify|unable to get local issuer|revoked'; then echo "CERT-REJECTED: ${out:0:90}"
  elif echo "$out" | grep -qE '^[0-9a-f]{40}|not valid: is this a git repository|repository .* not found|HTTP|403|404'; then echo "ACCEPTED (TLS passed): ${out:0:70}"
  else echo "NETWORK-ERROR: ${out:0:90}"; fi
}

cargo_test() { # host-or-index   (a sparse-registry probe: cargo fetches <index>/config.json over its libcurl)
  local out cause; out=$(CARGO_HOME="$TMP/cargo" CARGO_REGISTRIES_PROBE_INDEX="sparse+https://$1/" cargo search --registry probe probe 2>&1)
  cause=$(echo "$out" | grep -A1 'Caused by' | tail -1 | sed 's/^ *//'); [ -n "$cause" ] || cause=$(echo "$out" | grep -m1 -E '= "|^error' | sed 's/^ *//')
  if echo "$out" | grep -qiE 'SSL certificate problem|certificate|revoked'; then echo "CERT-REJECTED: ${cause:0:80}"
  elif echo "$out" | grep -qiE 'expected value|failed to parse|invalid|config.json|= "'; then echo "ACCEPTED (TLS passed, then: ${cause:0:60})"
  else echo "NETWORK-ERROR: ${cause:0:80}"; fi
}

apple_test() { # host   (Apple's trust engine, the path Safari/URLSession take, via security verify-cert on the served chain)
  local d; d="$TMP/chain-$1"; mkdir -p "$d"
  echo | openssl s_client -connect "$1:443" -servername "$1" -showcerts 2>/dev/null | awk -v d="$d" '/BEGIN CERT/{n++; f=d"/c"n".pem"} /BEGIN CERT/,/END CERT/{print > f}'
  ls "$d"/c*.pem >/dev/null 2>&1 || { echo "NETWORK-ERROR: no chain fetched"; return; }
  local args=(); for c in "$d"/c*.pem; do args+=(-c "$c"); done
  local out rc; out=$(security verify-cert "${args[@]}" -p ssl -s "$1" 2>&1); rc=$?
  local verdict; verdict=$(echo "$out" | grep -m1 -E 'Cert Verify Result|verification successful')
  if [ $rc -eq 0 ]; then echo "ACCEPTED"
  elif [ -n "$verdict" ]; then echo "CERT-REJECTED: ${verdict:0:80}"
  else echo "NETWORK-ERROR: $(echo "$out" | head -1 | cut -c1-80)"; fi
}

swift_test() { # host
  local f; f="$TMP/urlsession-$RANDOM.swift"
  cat > "$f" <<'SWIFT'
import Foundation
let host = CommandLine.arguments[1]
var req = URLRequest(url: URL(string: "https://\(host)/")!); req.httpMethod = "HEAD"; req.timeoutInterval = 20
let sem = DispatchSemaphore(value: 0)
URLSession.shared.dataTask(with: req) { _, resp, err in
  if let e = err as NSError? {
    let cert = e.code == NSURLErrorServerCertificateUntrusted || e.code == NSURLErrorServerCertificateHasBadDate || e.code == NSURLErrorServerCertificateHasUnknownRoot || e.code == NSURLErrorServerCertificateNotYetValid || e.code == NSURLErrorSecureConnectionFailed
    print((cert ? "CERT-REJECTED: " : "NETWORK-ERROR: ") + "\(e.code) \(e.localizedDescription)")
  } else if let r = resp as? HTTPURLResponse { print("ACCEPTED HTTP \(r.statusCode)") }
  sem.signal()
}.resume()
_ = sem.wait(timeout: .now() + 30)
SWIFT
  xcrun swift "$f" "$1" 2>&1 | grep -E 'ACCEPTED|REJECTED|ERROR' | head -1
}

electron_fuse_on() { # app_path -> exit 0 when the runAsNode fuse is enabled (fuse wire in the Electron Framework binary)
  local fw="$1/Contents/Frameworks/Electron Framework.framework/Electron Framework"
  [ -f "$fw" ] || return 1
  "$BASEPY" -I - "$fw" <<'PY'
import sys
data = open(sys.argv[1], "rb").read()
i = data.find(b"dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX")
if i < 0: sys.exit(2)
i += 32; length = data[i + 1]; states = data[i + 2:i + 2 + length]
sys.exit(0 if states[:1] == b"1" else 1)
PY
}

[ -n "${NODE_USE_SYSTEM_CA:-}" ] && echo "note: NODE_USE_SYSTEM_CA=$NODE_USE_SYSTEM_CA is set in this shell; Node rows below run with it unset"
echo "client                                                   host                                         result"

# Pythons: Homebrew (versioned), python.org frameworks, Apple's, pyenv, uv-managed
PYS=()
for p in /opt/homebrew/bin/python3.[0-9]* /Library/Frameworks/Python.framework/Versions/*/bin/python3 /usr/bin/python3 "$HOME"/.pyenv/versions/*/bin/python3 "$HOME"/.local/share/uv/python/*/bin/python3; do
  [ -x "$p" ] || continue
  case "$(basename "$p")" in python3|python3.[0-9]|python3.[0-9][0-9]) PYS+=("$p") ;; esac
done
BASEPY=${PYS[0]:-/usr/bin/python3}
for py in ${PYS[@]+"${PYS[@]}"}; do
  label="$py ($("$py" -c 'import sys;print(".".join(map(str,sys.version_info[:3])))' 2>/dev/null))"
  for h in "${HOSTS[@]}" "$CONTROL"; do row "python ssl default: $label" "$h" "$(py_test "$py" "$h")"; done
  pipca=$("$py" -I -c 'import pip._vendor.certifi as c; print(c.where())' 2>/dev/null)
  if [ -n "$pipca" ]; then
    pipv=$("$py" -I -c 'import pip; print(pip.__version__)' 2>/dev/null)
    for h in "${HOSTS[@]}" "$CONTROL"; do row "pip $pipv vendored certifi: $py" "$h" "$(py_test "$py" "$h" "$pipca")"; done
  fi
done

# venvs under $HOME: test each one's pip bundle with the first interpreter found
find "$HOME" -xdev \( -path "$HOME/Library/Caches" -o -path "$HOME/Library/Containers" -o -path "$HOME/.Trash" -o -path "*/node_modules" \) -prune -o -name pyvenv.cfg -print 2>/dev/null | while read -r cfg; do
  d=$(dirname "$cfg"); b=$(find "$d/lib" -maxdepth 7 -path "*/pip/_vendor/certifi/cacert.pem" 2>/dev/null | head -1)
  [ -n "$b" ] || continue
  for h in "${HOSTS[@]}"; do row "venv pip bundle: ${d/#$HOME/~}" "$h" "$(py_test "$BASEPY" "$h" "$b")"; done
done

# Node: every installed version (project pins select old ones), the active one, bundled runtimes
command -v fnm >/dev/null && eval "$(fnm env --shell bash)" 2>/dev/null
NODES=()
add_node() { local r; r=$(cd "$(dirname "$1")" 2>/dev/null && pwd -P)/$(basename "$1"); [ -x "$r" ] || return; for x in ${NODES[@]+"${NODES[@]}"}; do [ "$x" = "$r" ] && return; done; NODES+=("$r"); }
command -v node >/dev/null && add_node "$(command -v node)"
for n in "${FNM_DIR:-$HOME/.local/share/fnm}"/node-versions/*/installation/bin/node "$HOME"/.nvm/versions/node/*/bin/node "$HOME"/.volta/tools/image/node/*/bin/node /opt/homebrew/opt/node*/bin/node "$HOME"/.cache/codex-runtimes/*/dependencies/node/bin/node ${EXTRA_NODES[@]+"${EXTRA_NODES[@]}"}; do add_node "$n"; done
for n in ${NODES[@]+"${NODES[@]}"}; do
  for h in "${HOSTS[@]}" "$CONTROL"; do row "node $("$n" --version 2>/dev/null): ${n/#$HOME/~}" "$h" "$(node_test "$n" "$h")"; done
done

command -v bun >/dev/null && for h in "${HOSTS[@]}" "$CONTROL"; do row "bun $(bun --version)" "$h" "$(bun_test "$h")"; done
command -v deno >/dev/null && for h in "${HOSTS[@]}" "$CONTROL"; do row "deno $(deno --version | head -1 | awk '{print $2}')" "$h" "$(deno_test "$h")"; done
command -v go >/dev/null && for h in "${HOSTS[@]}" "$CONTROL"; do row "go $(go version | awk '{print $3}')" "$h" "$(go_test "$h")"; done

# curl: Apple's defaults to its LibreSSL backend and /etc/ssl/cert.pem; CURL_SSL_BACKEND=secure-transport switches it to Apple's trust engine
for h in "${HOSTS[@]}" "$CONTROL"; do row "curl: /usr/bin/curl (default backend)" "$h" "$(curl_test /usr/bin/curl "$h")"; done
for h in "${HOSTS[@]}" "$CONTROL"; do row "curl: /usr/bin/curl CURL_SSL_BACKEND=secure-transport" "$h" "$(curl_test /usr/bin/curl "$h" secure-transport)"; done
[ -x /opt/homebrew/opt/curl/bin/curl ] && for h in "${HOSTS[@]}" "$CONTROL"; do row "curl: /opt/homebrew/opt/curl/bin/curl" "$h" "$(curl_test /opt/homebrew/opt/curl/bin/curl "$h")"; done

# git: Apple's and Homebrew's both link Apple's libcurl unless built against brewed curl
for g in /usr/bin/git /opt/homebrew/bin/git; do
  [ -x "$g" ] || continue
  for h in "${HOSTS[@]}"; do row "git $("$g" --version | awk '{print $3}'): $g" "$h" "$(git_test "$g" "https://$h/x.git")"; done
  row "git $("$g" --version | awk '{print $3}'): $g" "control:github.com" "$(git_test "$g" https://github.com/Homebrew/brew.git)"
done

# cargo: built on the system libcurl, so crate and index downloads ride the curl path above
if command -v cargo >/dev/null; then
  for h in "${HOSTS[@]}"; do row "cargo $(cargo --version | awk '{print $2}') sparse index probe" "$h" "$(cargo_test "$h")"; done
  row "cargo $(cargo --version | awk '{print $2}') sparse index probe" "control:index.crates.io" "$(cargo_test index.crates.io)"
fi

# Apple's trust engine (Safari, URLSession, Security.framework users) without compiling anything
for h in "${HOSTS[@]}" "$CONTROL"; do row "Apple trust engine (security verify-cert, served chain)" "$h" "$(apple_test "$h")"; done
if [ "$SWIFT" = 1 ] && command -v xcrun >/dev/null; then
  for h in "${HOSTS[@]}" "$CONTROL"; do row "Apple URLSession (Swift)" "$h" "$(swift_test "$h")"; done
fi

# Electron apps, Node side only (ELECTRON_RUN_AS_NODE; needs the runAsNode fuse; the Chromium side is not measured)
if [ "$ELECTRON" = 1 ]; then
  for app in /Applications/*.app "$HOME"/Applications/*.app; do
    [ -d "$app/Contents/Frameworks/Electron Framework.framework" ] || continue
    ev=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "$app/Contents/Frameworks/Electron Framework.framework/Resources/Info.plist" 2>/dev/null)
    exe="$app/Contents/MacOS/$(/usr/libexec/PlistBuddy -c "Print CFBundleExecutable" "$app/Contents/Info.plist" 2>/dev/null)"
    name="$(basename "$app" .app) (electron $ev) node side"
    if electron_fuse_on "$app" && [ -x "$exe" ]; then
      for h in "${HOSTS[@]}" "$CONTROL"; do row "$name" "$h" "$(electron_test "$exe" "$h")"; done
    else
      row "$name" "-" "NOT-MEASURED: runAsNode fuse off, compare electron $ev with the fixed lines"
    fi
  done
fi
