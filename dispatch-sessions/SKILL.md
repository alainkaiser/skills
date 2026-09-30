---
name: dispatch-sessions
description: Dispatch work into separate background Claude Code sessions, one per repository or workstream, each started with a self-contained brief. Use when the user asks to spin up, start, or hand off sessions, threads, or agents in other repositories or projects, such as the backend and frontend parts of one ticket, or to run a cross-repository feature in parallel. Not for subagents inside the current session or for cloud sessions.
compatibility: Designed for Claude Code. Requires the claude CLI (background sessions, worktrees, claude agents) and the ListAgents and SendMessage tools.
---

# Dispatch Sessions

You are the coordinator. Each dispatched session starts with nothing but its brief, works in its own git worktree, and never sees this conversation. The quality of the brief decides the quality of its work, and the decisions you settle before dispatching decide whether the sessions agree with each other.

## 1. Settle the work

- Read the source of truth in full: the ticket with its subtasks and comments, linked designs (note file keys and node ids), and linked docs.
- Inspect each target repository: default branch and current commit, the code the work builds on, and repository instructions (`AGENTS.md`, `CLAUDE.md`, README). Briefs state verified facts with file paths, so each session starts from evidence instead of rediscovering it.
- Split the work by repository and name what crosses the boundary: API shapes, shared names, ordering. Give each contract exactly one owning session.
- Ask the user about every open question that more than one session depends on, with the structured question tool when available. Two sessions resolving the same ambiguity separately will diverge.

Done when every cross-session question is either answered by the user or assigned to one session as a stated assumption to confirm.

## 2. Write one brief per session

Write each brief to its own file in the scratchpad (or a temp directory). Every brief carries:

- **Goal and sources**: ticket and subtask keys with URLs, design links with node ids.
- **Starting point**: the verified commit and the files, types, and functions to build on.
- **Rules**: the behavior to implement, with the user's decisions marked as decided.
- **Contract**: exact names and shapes, which session owns them, and when to tell the sibling. Siblings reach each other by session name with `ListAgents` and `SendMessage`, so give every brief its siblings' exact names.
- **Open questions**: what this session must investigate or confirm with the user before relying on it.
- **Delivery**: the worktree starts on a branch named `worktree-<slug>`, so tell the session to rename it to the repository's branch convention before committing; no commit, push, or PR until the user asks; the verification commands to run.

Done when a reader with only the brief and the repository could do the work.

## 3. Dispatch

Run the bundled script once per session:

```bash
scripts/dispatch.sh <repo-path> "<session name>" <brief-file> [permission-mode]
```

It checks that the CLI is logged in, then runs `claude --bg -n "<session name>" -w <slug> --permission-mode <mode>` from the repository with the brief as the first prompt, and prints the session's short id. The permission mode defaults to `auto`: a background session stops at every permission prompt until someone attaches to it. Pass another mode when the user asks for one; use `bypassPermissions` only on the user's explicit request.

When dispatch fails, hand the fix to the user, because both need an interactive terminal:

- **Not logged in**: the CLI signs in separately from the desktop app. Ask the user to run `claude auth login`.
- **Workspace not trusted**: every repository folder needs its own trust, and a trusted parent folder does not count. Ask the user to run `claude` once in that folder and accept the prompt. Leave the trust check in place.

Done when every session appears in `claude agents --json` with its id.

## 4. Report and follow up

Tell the user, per session: name, short id, repository, and worktree path (`<repo>/.claude/worktrees/<slug>`). Dispatched sessions do not appear in the Claude desktop app's sidebar, so include how to follow them:

- `claude agents` shows every session; `claude agents --json` marks one that needs input with `"status": "waiting"`.
- `claude attach <id>` opens a session to answer its questions; `claude logs <id>` prints its recent output.
- `claude stop <id>` stops it and keeps the worktree; `claude rm <id>` removes the session and deletes its worktree when that is safe; the transcript stays available through `claude --resume`. Run `rm` only when the user asks.

To check on the sessions later, read `claude agents --json` and `claude logs <id>`, and relay questions that are waiting for the user.

## Worktree behavior

With the default `worktree.baseRef` setting (`"fresh"`), `-w` bases the worktree on the remote default branch, not on the branch checked out in the main folder. When the work must start from another branch, say so in the brief and have the session switch to it first.
