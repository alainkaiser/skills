#!/usr/bin/env bash
# ioc-scan.sh: read-only search for a campaign's indicators of compromise on this Mac.
#
# Usage: ioc-scan.sh [-p PROCESS_REGEX] NAME [NAME...]
#   NAME            file or directory names planted by the campaign (cook.pth, security-audit.yml, gh-token-monitor ...)
#   -p REGEX        pattern to look for in the process list (default: the names joined with |)
#
# Prints every hit so you can inspect it; look-alikes exist (Homebrew's sitecustomize.py,
# RustCrypto's security-audit.yml). Report the result as "no indicators of <campaign> found in
# <searched locations>", never as "no malware".
set -u
PROC=""
while getopts "p:" o; do case $o in p) PROC=$OPTARG ;; *) exit 2 ;; esac; done
shift $((OPTIND - 1))
[ $# -ge 1 ] || { echo "usage: $0 [-p process_regex] name..." >&2; exit 2; }
[ -n "$PROC" ] || PROC=$(IFS='|'; echo "$*")

echo "== files named like the indicators =="
args=(); for n in "$@"; do args+=(-o -name "$n"); done
find "$HOME" /Library/Frameworks /opt/homebrew /usr/local /private/tmp -xdev \
  \( -path "$HOME/Library/Caches" -o -path "$HOME/Library/Containers" -o -path "$HOME/Library/Group Containers" -o -path "$HOME/.Trash" \) -prune -o \
  \( -false "${args[@]}" \) -print 2>/dev/null
echo "(end of file hits)"

echo; echo "== processes matching /$PROC/ =="
ps aux | grep -iE "$PROC" | grep -vE "grep -iE|ioc-scan"; echo "(end)"

echo; echo "== crontab =="; crontab -l 2>&1 | head -20
echo; echo "== LaunchAgents / LaunchDaemons (inspect unknown vendors) =="
ls -la "$HOME/Library/LaunchAgents" /Library/LaunchAgents /Library/LaunchDaemons 2>/dev/null | grep -v '^total' | awk '{print $NF}' | grep -v '^\.' | sort -u

echo; echo "== non-standard .pth files in site-packages (a planted .pth runs at every Python start) =="
find "$HOME" /Library/Frameworks /opt/homebrew /usr/local -xdev \( -path "$HOME/Library/Caches" -o -path "$HOME/.Trash" -o -path "*/node_modules" \) -prune -o -path "*/site-packages/*.pth" -print 2>/dev/null \
  | grep -vE 'distutils-precedence\.pth|_virtualenv\.pth|easy-install\.pth|homebrew\.pth|__editable__|-nspkg\.pth$|protobuf|zope|ruamel|matplotlib|google'
echo "(end)"
