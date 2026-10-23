#!/usr/bin/env bash
# brew-tap-verify.sh: after `brew update`, confirm each git-fetched tap matches GitHub.
#
# Homebrew's core index is signed and bottles are SHA-256 checked, but third-party taps are
# plain git clones fetched over Apple's libcurl, which may still trust a compromised CA.
# This compares every tap's HEAD with GitHub through `gh` (Go's TLS stack, which blocks
# compromised intermediates by key) so a tampered fetch shows up before `brew upgrade`
# evaluates the tap's Ruby.
#
# Usage: brew-tap-verify.sh        (needs `gh auth status` to pass)
set -u
command -v gh >/dev/null || { echo "gh is required" >&2; exit 2; }
echo "Homebrew downloads use: $(brew config 2>/dev/null | grep -E '^Curl:' | sed 's/Curl: //')"
echo "HOMEBREW_FORCE_BREWED_CA_CERTIFICATES=${HOMEBREW_FORCE_BREWED_CA_CERTIFICATES:-<unset>}"
echo
bad=0
for tap in $(brew tap 2>/dev/null); do
  d=$(brew --repo "$tap" 2>/dev/null)
  [ -d "$d/.git" ] || { printf '%-30s API tap, no git checkout\n' "$tap"; continue; }
  url=$(git -C "$d" remote get-url origin); local_sha=$(git -C "$d" rev-parse HEAD); branch=$(git -C "$d" rev-parse --abbrev-ref HEAD)
  slug=$(echo "$url" | sed -E 's#^(https://github\.com/|git@github\.com:)##; s#\.git$##')
  remote_sha=$(gh api "repos/$slug/commits/$branch" --jq .sha 2>/dev/null)
  if [ -n "$remote_sha" ] && [ "$local_sha" = "$remote_sha" ]; then verdict="MATCH"
  elif [ "$(gh api "repos/$slug/commits/$local_sha" --jq .sha 2>/dev/null)" = "$local_sha" ]; then verdict="commit exists on GitHub (branch moved on)"
  else verdict="MISMATCH or unknown commit: do not upgrade from this tap"; bad=1; fi
  printf '%-30s %-48s local %s github %s -> %s\n' "$tap" "$slug@$branch" "${local_sha:0:10}" "${remote_sha:0:10}" "$verdict"
done
exit $bad
