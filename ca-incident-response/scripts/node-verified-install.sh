#!/usr/bin/env bash
# node-verified-install.sh: install Node versions with fnm and prove the binaries match nodejs.org.
#
# fnm downloads tarballs without checking signatures. This script fetches SHASUMS256.txt and the
# tarball through a corrected CA bundle (Apple's curl honors --cacert), verifies the tarball's
# SHA-256, runs `fnm install`, then compares the installed bin/node with the verified tarball's.
# Switch to a version only after it prints MATCH:  fnm default <v> && fnm use <v>
#
# Usage: node-verified-install.sh -b BUNDLE.pem [-n] VERSION [VERSION...]
#   -b BUNDLE   CA bundle that already rejects the compromised chain (required)
#   -n          check only: verify an already-installed version, install nothing
set -u
BUNDLE=""; CHECK_ONLY=0
while getopts "b:n" o; do case $o in b) BUNDLE=$OPTARG ;; n) CHECK_ONLY=1 ;; *) exit 2 ;; esac; done
shift $((OPTIND - 1))
[ -n "$BUNDLE" ] && [ -f "$BUNDLE" ] && [ $# -ge 1 ] || { echo "usage: $0 -b bundle.pem [-n] version..." >&2; exit 2; }
command -v fnm >/dev/null || { echo "fnm is required" >&2; exit 2; }
eval "$(fnm env --shell bash)"
case "$(uname -m)" in arm64) ARCH=darwin-arm64 ;; x86_64) ARCH=darwin-x64 ;; *) echo "unsupported arch" >&2; exit 2 ;; esac
WORK=$(mktemp -d); trap 'rm -rf "$WORK"' EXIT
fail=0
for v in "$@"; do
  v=${v#v}; f="node-v$v-$ARCH.tar.gz"
  CURL_CA_BUNDLE="$BUNDLE" /usr/bin/curl -fsSL --max-time 300 -o "$WORK/SHASUMS256-$v.txt" "https://nodejs.org/dist/v$v/SHASUMS256.txt" || { echo "v$v: SHASUMS256.txt download failed"; fail=1; continue; }
  CURL_CA_BUNDLE="$BUNDLE" /usr/bin/curl -fsSL --max-time 900 -o "$WORK/$f" "https://nodejs.org/dist/v$v/$f" || { echo "v$v: tarball download failed"; fail=1; continue; }
  expected=$(grep " $f\$" "$WORK/SHASUMS256-$v.txt" | awk '{print $1}'); actual=$(shasum -a 256 "$WORK/$f" | awk '{print $1}')
  if [ -z "$expected" ] || [ "$expected" != "$actual" ]; then echo "v$v: tarball SHA-256 MISMATCH (expected ${expected:-?}, got $actual)"; fail=1; continue; fi
  echo "v$v: tarball SHA-256 verified against nodejs.org ($actual)"
  tar -xzf "$WORK/$f" -C "$WORK" "node-v$v-$ARCH/bin/node"
  tarball_sha=$(shasum -a 256 "$WORK/node-v$v-$ARCH/bin/node" | awk '{print $1}')
  installed="$FNM_DIR/node-versions/v$v/installation/bin/node"
  if [ ! -x "$installed" ]; then
    if [ "$CHECK_ONLY" = 1 ]; then echo "v$v: not installed (check-only mode)"; fail=1; continue; fi
    fnm install "$v" >/dev/null 2>&1 || { echo "v$v: fnm install failed"; fail=1; continue; }
  fi
  installed_sha=$(shasum -a 256 "$installed" | awk '{print $1}')
  if [ "$installed_sha" = "$tarball_sha" ]; then echo "v$v: installed bin/node MATCHES verified tarball ($installed_sha)"
  else echo "v$v: installed bin/node DIFFERS from verified tarball (installed $installed_sha, tarball $tarball_sha): remove it with 'fnm uninstall $v' and investigate"; fail=1; fi
done
exit $fail
