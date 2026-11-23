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
- `git-workflow`
- `implement-figma-component`
- `mobile-web-interactions`
- `simplify-dotnet-abstractions`

## Layout

Each skill lives in its own directory with a `SKILL.md` file.

## Local Development

Install selected skills from the local checkout globally for Codex, Cursor, and Claude Code:

```bash
npx skills add "$HOME/Documents/dev/personal/skills" --global --skill git-workflow --agent codex cursor claude-code --yes
```

The CLI copies the current files into the shared global skill folder and links Claude Code to that installation. Rerun this command after local edits. A global local-path install points the skill's entry in the CLI's global lockfile at the local checkout, so `npx skills update -g` follows the checkout. After publishing, reinstall from `alainkaiser/skills` with the same options to track GitHub again.
