#!/usr/bin/env bash
# inventory.sh: read-only inventory of every TLS client on this Mac that carries its own trust store.
#
# Usage: inventory.sh [-k CA_NAME]... [-e FIXED_ELECTRON_VERSIONS]
#   -k NAME     search the system and login keychains for certificates whose name contains NAME (repeatable)
#   -e LIST     comma-separated fixed Electron versions per major, e.g. "44.9.1,43.8.1,42.11.16";
#               apps below the fixed version of their major are marked old
# Versions are read from files where possible so that no untrusted interpreter runs.
set -u
KEYS=(); FIXED_ELECTRON=""
while getopts "k:e:" o; do
  case $o in k) KEYS+=("$OPTARG") ;; e) FIXED_ELECTRON=$OPTARG ;; *) exit 2 ;; esac
done

ver_of() { grep -m1 '__version__' "$1" 2>/dev/null | sed 's/.*= *//; s/["'"'"']//g'; }

echo "== macOS =="
sw_vers | tr '\n' ' '; echo
printf 'trust store asset: '; /usr/libexec/PlistBuddy -c "Print VersionNumber" /System/Library/Security/Certificates.bundle/Contents/Resources/AssetVersion.plist 2>/dev/null || echo "?"
for k in ${KEYS[@]+"${KEYS[@]}"}; do
  echo "-- keychain certificates matching '$k':"
  for kc in /System/Library/Keychains/SystemRootCertificates.keychain /Library/Keychains/System.keychain "$HOME/Library/Keychains/login.keychain-db"; do
    security find-certificate -a -c "$k" "$kc" 2>/dev/null | grep '"labl"' | sed "s|.*=|   $(basename "$kc"): |"
  done
  echo "-- trust overrides mentioning '$k':"; security dump-trust-settings -d 2>&1 | grep -i "$k" | head -3; security dump-trust-settings 2>&1 | grep -i "$k" | head -3
done
echo "Apple curl: $(/usr/bin/curl --version | head -1)"

echo; echo "== Python interpreters =="
for p in /opt/homebrew/bin/python3.[0-9]* /Library/Frameworks/Python.framework/Versions/*/bin/python3 /Library/Frameworks/PythonT.framework/Versions/*/bin/python3t /usr/bin/python3 "$HOME"/.pyenv/versions/*/bin/python3 "$HOME"/.local/share/uv/python/*/bin/python3 "$HOME"/miniconda3/bin/python "$HOME"/anaconda3/bin/python "$HOME"/miniforge3/bin/python; do
  [ -x "$p" ] || continue
  case "$(basename "$p")" in *-config) continue ;; esac
  printf '%-70s %s\n' "$p" "$("$p" -I -c 'import sys, ssl; print(".".join(map(str, sys.version_info[:3])), "| ssl cafile:", ssl.get_default_verify_paths().cafile)' 2>/dev/null)"
done
echo "-- which python3/pip3 in the user's shell: $(zsh -ic 'command -v python3; command -v pip3' 2>/dev/null | tr '\n' ' ')"
for b in uv pipx conda pixi poetry pdm; do command -v "$b" >/dev/null && printf '%-8s %s\n' "$b" "$("$b" --version 2>&1 | head -1)"; done

echo; echo "== pip / certifi copies (read from files) =="
find "$HOME" /Library/Frameworks /opt/homebrew /usr/local /Applications/Xcode.app/Contents/Developer/Library/Frameworks -xdev \
  \( -path "$HOME/Library/Caches" -o -path "$HOME/Library/Containers" -o -path "$HOME/.Trash" -o -path "*/node_modules" \) -prune -o \
  \( -path "*/site-packages/pip/__init__.py" -o -path "*/certifi/__init__.py" -o -path "*/ensurepip/_bundled/pip-*.whl" \) -print 2>/dev/null | sort | while read -r f; do
  case "$f" in
    */pip/_vendor/certifi/__init__.py) printf '  vendored certifi %-12s %s\n' "$(ver_of "$f")" "$f" ;;
    */certifi/__init__.py)             printf 'certifi            %-12s %s\n' "$(ver_of "$f")" "$f" ;;
    */pip/__init__.py)                 printf 'pip                %-12s %s\n' "$(ver_of "$f")" "$f" ;;
    *.whl)                             printf 'ensurepip wheel    %-12s %s\n' "$(basename "$f" | sed 's/pip-//; s/-py3.*//')" "$f" ;;
  esac
done
echo "-- venvs:"
find "$HOME" -xdev \( -path "$HOME/Library/Caches" -o -path "$HOME/Library/Containers" -o -path "$HOME/.Trash" -o -path "*/node_modules" \) -prune -o -name pyvenv.cfg -print 2>/dev/null | while read -r cfg; do
  d=$(dirname "$cfg"); pipf=$(find "$d/lib" -maxdepth 4 -path "*/site-packages/pip/__init__.py" 2>/dev/null | head -1)
  printf '  %-70s python %-8s pip %s\n' "${d/#$HOME/~}" "$(grep -m1 -E '^version' "$cfg" | sed 's/.*= *//')" "$( [ -n "$pipf" ] && ver_of "$pipf" || echo none)"
done

echo; echo "== Node =="
command -v fnm >/dev/null && { eval "$(fnm env --shell bash)" 2>/dev/null; echo "fnm: $(fnm ls 2>/dev/null | tr '\n' ' ')"; }
[ -d "$HOME/.nvm/versions/node" ] && echo "nvm: $(ls "$HOME/.nvm/versions/node" | tr '\n' ' ')"
[ -d "$HOME/.volta/tools/image/node" ] && echo "volta: $(ls "$HOME/.volta/tools/image/node" | tr '\n' ' ')"
command -v node >/dev/null && echo "active node: $(node --version) at $(command -v node)"
for n in "$HOME"/.cache/codex-runtimes/*/dependencies/node/bin/node /opt/homebrew/opt/node*/bin/node; do [ -x "$n" ] && echo "bundled/other node: $("$n" --version) at $n"; done
for b in bun deno; do command -v "$b" >/dev/null && echo "$b: $("$b" --version 2>&1 | head -1)"; done

echo; echo "== Other runtimes =="
command -v go >/dev/null && go version
if /usr/libexec/java_home >/dev/null 2>&1; then java -version 2>&1 | head -1; else echo "java: not installed"; fi
command -v dotnet >/dev/null && echo "dotnet sdks: $(dotnet --list-sdks 2>/dev/null | awk '{print $1}' | tr '\n' ' ')"
command -v cargo >/dev/null && cargo --version
dv=$(docker version --format '{{.Server.Version}}' 2>/dev/null | tr -d '\n')
echo "Docker Desktop: $(/usr/libexec/PlistBuddy -c 'Print CFBundleShortVersionString' /Applications/Docker.app/Contents/Info.plist 2>/dev/null || echo 'not installed')  daemon: ${dv:-not running}"

echo; echo "== Homebrew =="
echo "ca-certificates: $(ls /opt/homebrew/Cellar/ca-certificates 2>/dev/null | tr '\n' ' ')  cert.pem -> $(readlink /opt/homebrew/etc/openssl@3/cert.pem 2>/dev/null)"
brew config 2>/dev/null | grep -E '^(Curl|Git):'
echo "taps fetched over git: $(brew tap 2>/dev/null | tr '\n' ' ')"
echo "HOMEBREW_FORCE_BREWED_CA_CERTIFICATES=${HOMEBREW_FORCE_BREWED_CA_CERTIFICATES:-<unset>}"

echo; echo "== Electron apps (CFBundleVersion of Electron Framework) =="
for app in /Applications/*.app "$HOME"/Applications/*.app; do
  fw="$app/Contents/Frameworks/Electron Framework.framework"; [ -d "$fw" ] || continue
  ev=$(/usr/libexec/PlistBuddy -c "Print CFBundleVersion" "$fw/Resources/Info.plist" 2>/dev/null)
  av=$(/usr/libexec/PlistBuddy -c "Print CFBundleShortVersionString" "$app/Contents/Info.plist" 2>/dev/null)
  status=""
  if [ -n "$FIXED_ELECTRON" ]; then
    # fixed when the app's major has a fixed line and the app is at or above it,
    # or when the major is newer than every listed line; older majors have no fix
    status="old"; maj=${ev%%.*}; maxmaj=0
    for fx in ${FIXED_ELECTRON//,/ }; do
      fmaj=${fx%%.*}; [ "$fmaj" -gt "$maxmaj" ] && maxmaj=$fmaj
      [ "$fmaj" = "$maj" ] && [ "$(printf '%s\n%s\n' "$fx" "$ev" | sort -V | head -1)" = "$fx" ] && status="fixed"
    done
    [ "$maj" -gt "$maxmaj" ] 2>/dev/null && status="fixed"
  fi
  printf '%-32s app %-16s electron %-10s %s\n' "$(basename "$app" .app)" "$av" "$ev" "$status"
done
