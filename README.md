# Skills

Personal agent skills installable with Vercel's official `skills` CLI.

## Install

Install a specific skill from this repo:

```bash
npx skills add alainkaiser/skills --skill <skill-name>
```

## Skills

- `base-ui`
- `branch-review` (adapted from [Matt Pocock's code-review](https://github.com/mattpocock/skills/tree/main/skills/engineering/code-review); MIT license included)
- `create-expense-report`
- `dispatch-sessions` (Claude Code only; install with `--agent claude-code --copy`, which keeps it out of the shared `.agents/skills` folder that Codex and Cursor read)
- `git-workflow`
- `implement-figma-component`
- `mobile-web-interactions`
- `simplify-dotnet-abstractions`
- `write-plainly`

## Layout

Each skill lives in its own directory with a `SKILL.md` file.

## Local Development

Install selected skills from the local checkout globally for Codex, Cursor, and Claude Code:

```bash
npx skills add "$HOME/Documents/dev/personal/skills" --global --skill git-workflow --agent codex cursor claude-code --yes
```

The CLI copies the current files into the shared global skill folder and links Claude Code to that installation. Rerun this command after local edits. Global local-path installs are not recorded in the CLI's global lockfile. After publishing, reinstall from `alainkaiser/skills` with the same options to enable GitHub source tracking and `npx skills update -g`.
