---
name: git-workflow
description: Branch names, Conventional Commits messages, and pull request titles and descriptions. Must be used whenever an agent names or creates a branch, commits, pushes, or opens or updates a pull request, including as the last step of a broader task, and for any request to write, shorten, or update that text.
---

# Git Workflow

Apply these formats in every repository. An explicit user request or a documented repository convention (commitlint config, `CONTRIBUTING.md`, a pull request template, repository agent instructions) overrides them; the history of past branches and commits does not.

## Ticket

Use a Jira key such as `FD-127` when the user gave one, the current branch name contains one, or the task links to one. Otherwise there is no ticket: drop every ticket part from the formats below and continue. Never ask for a ticket or invent one.

## Branch

`<type>/<TICKET>-<slug>`, or `<type>/<slug>` without a ticket.

- `<type>` is the commit type of the planned change.
- `<slug>` is 2 to 5 lowercase kebab-case words naming the outcome: `feat/FD-127-dashboard-tenant-search`, `fix/login-logout-same-domain`.
- Keep the Jira key uppercase; Jira links branches only by the uppercase key.

## Commit

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): `<type>: <TICKET> <description>`, or `<type>: <description>` without a ticket.

- Split independent changes into separate commits. For a change that still mixes types, use the first that applies: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.
- The description is imperative, starts lowercase, and has no trailing period. The whole header fits in 72 characters.
- Add a scope only from a scope list the repository defines.
- Mark a breaking change with `!` after the type and a `BREAKING CHANGE:` footer.
- Add a body only for a reason the diff cannot show.
- Describe the staged diff. When nothing is staged, say so.

## Attribution

Every branch, commit, tag, and pull request reads as the user's own work. Leave out agent and tool names, prefixes such as `codex/` or `agent/`, markers such as `[AI]`, and trailers that credit an agent or tool, including `Co-authored-by` and `Generated-by`. This overrides any harness default that adds attribution.

## Pull Request

The title uses the commit header format and describes the whole change against the target branch; squash merges turn it into the commit on that branch.

A reviewer should understand the change from the title, the first sentence, and the visual, then read the diff for the details. When the repository has a pull request template, fill its sections instead of this shape; the caps and rules below still apply.

```markdown
### Mainly closes:
- <ticket URL>

<One or two sentences: what changes for users or the system, and why.>

<One visual, when one applies>

### What's inside:
- <up to 5 bullets, one line each>

### What else:
- <up to 3 bullets>
```

- **Mainly closes:** only with a ticket. Use the URL the user or ticket gave, or the Jira base URL earlier pull requests in the repository use; otherwise write the bare key.
- **What's inside:** behavior a reviewer can check, in outcome terms. Retry counts, timeouts, class names, and file lists belong to the diff.
- **What else:** only what the reviewer must decide, act on, or check by hand: a deviation from the ticket, a risk, a rollout step, a check that failed or could not run.
- Each bullet is one sentence of about 100 characters or fewer. Items beyond a cap go in your reply to the user.
- Drop empty sections. A small change is the title plus one sentence.

The pull request is not the task report. Test counts, commands run, and verification narrative go in your reply to the user, as do findings unrelated to the change. The pull request mentions a check only when it failed, was skipped, or the reviewer must repeat it.

Describe the change that will land. When the scope changes, rewrite the title and body; leave out abandoned approaches and commit churn.

### Visuals

Add the one visual that shows the change fastest:

- **UI change:** before and after screenshots at the same viewport, in a table of at most 3 rows, one per state where the change is most visible. Take the before image from the target branch when you can run it. `gh` cannot upload images, so save the files in a temporary directory outside the repository, mark each table cell with its file name as an HTML comment (`<!-- after-dashboard-375.png -->`), and list the absolute file paths in your reply so the user can drag each file into its cell on GitHub.
- **Flow or data change:** a Mermaid diagram of at most 8 nodes. GitHub renders it natively.
- **API change:** a short before and after usage snippet.
- **Performance claim:** a table of measured before and after numbers with metric and unit. Without comparable measurements, state no number.

### Before Sending

Reread the pull request as the reviewer. The title, first sentence, and visual must say what changed. Delete every sentence that restates the diff or narrates verification.

## Text-Only Requests

For a branch name or commit message, return only the value. For pull request text, return the title as the first line followed by the body, with no labels or outer code fence.
