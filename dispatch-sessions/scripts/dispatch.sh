#!/usr/bin/env bash
# Start a background Claude Code session in its own worktree of a repository,
# with a brief file as the session's first prompt.
set -euo pipefail

if [[ $# -lt 3 || $# -gt 4 ]]; then
  echo "usage: dispatch.sh <repo-path> <session-name> <brief-file> [permission-mode]" >&2
  exit 2
fi

repo=$1
name=$2
brief=$3
mode=${4:-auto}

if ! git -C "$repo" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "not a git repository: $repo" >&2
  exit 1
fi

if [[ ! -s $brief ]]; then
  echo "brief file is missing or empty: $brief" >&2
  exit 1
fi

if ! claude auth status 2>/dev/null | grep -q '"loggedIn": true'; then
  echo "The Claude Code CLI is not logged in. Ask the user to run: claude auth login" >&2
  exit 1
fi

# Worktree and branch names must be valid git refs; session names may contain spaces.
slug=$(printf '%s' "$name" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-' | sed 's/^-//; s/-$//')
prompt=$(cat "$brief")

cd "$repo"
exec claude --bg -n "$name" -w "$slug" --permission-mode "$mode" "$prompt"
