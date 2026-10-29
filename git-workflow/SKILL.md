---
name: git-workflow
description: Branch names, Conventional Commits messages, and pull request titles, descriptions, and visuals. Must be used whenever an agent names or creates a branch, commits, pushes, or opens or updates a pull request, including as the last step of a broader task, and for any request to write, shorten, or update that text.
---

# Git Workflow

Apply these formats in every repository. An explicit user request or a documented repository convention (commitlint config, `CONTRIBUTING.md`, a pull request template, repository agent instructions) overrides them; the history of past branches and commits does not.

## Ticket

A ticket is the issue-tracker item the change implements, in whatever tracker the team uses: `FD-127` in Jira, `ENG-42` in Linear, `#42` in GitHub Issues. Use one when the user gave it, the current branch name contains it, or the task links to it. Otherwise there is no ticket: drop every ticket part from the formats below and continue. Never ask for a ticket or invent one.

- A key such as `FD-127` or `ENG-42` goes into the branch, the commit header, and the pull request title. Keep it uppercase; Jira links branches only by the uppercase key.
- A GitHub issue number stays out of the branch and the commit; it goes only into **Mainly closes**.

## Branch

`<type>/<TICKET>-<slug>`, or `<type>/<slug>` without a ticket.

- `<type>` is the commit type of the planned change.
- `<slug>` is 2 to 5 lowercase kebab-case words naming the outcome: `feat/FD-127-dashboard-tenant-search`, `fix/login-logout-same-domain`.

## Commit

Follow [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/): `<type>: <TICKET> <description>`, or `<type>: <description>` without a ticket.

- Split independent changes into separate commits. For a change that still mixes types, use the first that applies: `feat`, `fix`, `perf`, `refactor`, `docs`, `test`, `build`, `ci`, `chore`, `style`, `revert`.
- The description is imperative, starts lowercase, and has no trailing period. The whole header fits in 72 characters.
- Add a scope only from a scope list the repository defines.
- Mark a breaking change with `!` after the type and a `BREAKING CHANGE:` footer.
- Add a body only for a reason the diff cannot show.
- Describe the staged diff. When nothing is staged, say so.

## Attribution

Every branch, commit, tag, and pull request reads as the user's own work, whichever harness runs: Claude Code, Codex, Cursor, or any other. Leave out agent and tool names, harness branch prefixes such as `claude/`, `codex/`, `cursor/`, or `agent/`, markers such as `[AI]`, "Generated with" footers, and trailers that credit an agent or tool, including `Co-authored-by` and `Generated-by`. This overrides any harness default or setting that adds attribution.

A harness can add attribution after you write: a branch prefix setting, a commit hook, a footer appended to the pull request body. Read what actually landed (`git branch --show-current`, `git log -1 --format=%B`, and `gh pr view --json body` after creating the pull request) and remove anything added. When a hook adds it back, tell the user.

## Pull Request

The title uses the commit header format and describes the whole change against the target branch; squash merges turn it into the commit on that branch.

Assign the pull request to its author, the person responsible for getting it merged: `gh pr create --assignee @me`.

A reviewer should understand the change from the title, the first sentence, and the visuals, then read the diff for the details. When the repository has a pull request template, fill its sections instead of this shape; the caps and rules below still apply.

```markdown
### Mainly closes:
- <ticket URL>

<One or two sentences: what changes for users or the system, and why.>

Try it: <URL of the changed page on the preview deployment>

<Visuals, when they apply>

### What's inside:
- <up to 5 bullets, one line each>

### What else:
- <up to 3 bullets>
```

- **Mainly closes:** only with a ticket. Use the URL the user or ticket gave, or the tracker base URL earlier pull requests in the repository use; otherwise write the bare key. For a GitHub issue, write `- Closes #42`; merging into the default branch then closes the issue.
- **Try it:** only when the branch's preview deployment URL is known as you write. The URL opens the page the change affects.
- **What's inside:** behavior a reviewer can check, in outcome terms. Retry counts, timeouts, class names, and file lists belong to the diff.
- **What else:** only what the reviewer must decide, act on, or check by hand: a deviation from the ticket, a risk, a rollout step, a check that failed or could not run.
- Each bullet is one sentence of about 100 characters or fewer. Items beyond a cap go in your reply to the user.
- Drop empty sections. A small change is the title plus one sentence.

Write for a reviewer who reads once, between other work:

- The first sentence names the outcome, what now works or behaves differently, with a user, the system, or a feature as its subject: "Tenant admins can search the dashboard by tenant name."
- Every bullet stands alone. It names its subject and makes sense without the other bullets, the headings, or the ticket.
- Name the concrete thing: the screen, endpoint, field, or command, in place of summary words such as "improvements" or "cleanup".
- Use literal words. Replace idioms and figurative phrases with the plain action, and keep a hedge only for real uncertainty.
- A check the reviewer performs by hand is one **What else** bullet with a nested numbered list, one action per step, at most 5 steps. The steps keep the bullet length limit and do not count toward the bullet cap.
- A risk states the condition and its effect: "Signed-in users log out once on deploy because the session cookie is renamed."

The pull request is not the task report. Test counts, commands run, and verification narrative go in your reply to the user, as do findings unrelated to the change. The pull request mentions a check only when it failed, was skipped, or the reviewer must repeat it.

Describe the change that will land. When the scope changes, rewrite the title and body; leave out abandoned approaches and commit churn.

### Visuals

Add the visual that shows the change fastest. A change that spans two layers, such as an endpoint and its table, gets one for each, at most two, in the order a reviewer reads them.

- **UI change on one screen:** a table of at most 3 rows, each a before and an after screenshot at the same viewport. Each row is a state, width, or theme where the change is visible: an error state, 375 px, dark mode.
- **UI built from a design:** the design image next to a screenshot of the built screen at the design's width, in place of before and after. Use a design image the user gave or one a design tool in your harness exports; without one, show before and after.
- **UI flow across screens:** a stepper, a multi-page form, scrolling. One video of the same journey before and then after, under 60 seconds.
- **Animation or transition change:** that video with the step that starts the motion in slow motion, so the reviewer sees the motion itself. When the change handles reduced motion, the second visual is a video of the head branch with reduced motion on.
- **HTTP API change:** a table of the changed endpoints, one row each, at most 8. Add a short before and after request or response snippet when a payload shape changes.

  | Method | Path | Change |
  | --- | --- | --- |
  | `GET` | `/api/books/{id}/loans` | added |
  | `PATCH` | `/api/books/{id}` | `title` is required |

- **Database schema change:** a Mermaid `erDiagram` of the changed tables and their direct relations, at most 8 tables, showing keys and changed columns. Mark each changed column with an attribute comment: `timestamptz due_at "added"`. Data loss, table locks, and backfills go in **What else**.
- **Infrastructure-as-code change:** the plan summary of resources to add, change, and destroy, then every resource the plan replaces or destroys, by address. Take it from a plan or preview output that CI or the user ran; without one, leave this visual out.
- **Dependency, runtime, or security upgrade:** a table with one row per component, at most 8: name, from version, to version, and the reason, such as a CVE ID or the bug the release fixes.
- **Other flow or data change:** a Mermaid flowchart of at most 8 nodes.
- **Library or function API change:** a short before and after usage snippet.
- **Performance claim:** a table of measured before and after numbers with metric and unit. Without comparable measurements, leave the numbers out.

A new screen, endpoint, or table has no before; show only the after. Capture screenshots and videos and attach them to the pull request with [references/capture.md](references/capture.md).

### Before Sending

Reread the pull request as the reviewer, and again after any push that changes the patch. Check every sentence against the code at the head, and every claim about the behavior before the change against the target branch; the code is the only evidence, not docs or earlier pull request text. Delete every sentence that restates the diff or narrates verification. Then read only the title, the first sentence, the visuals, and **What else**: they must tell the reviewer what changed and what they have to do.

## Text-Only Requests

For a branch name or commit message, return only the value. For pull request text, return the title as the first line followed by the body, with no labels or outer code fence.
