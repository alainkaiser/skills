# Skills

Personal agent skills installable with Vercel's official `skills` CLI.

## Install

Install a specific skill from this repo:

```bash
npx skills add alainkaiser/skills --skill <skill-name>
```

## Skills

- `base-ui`
- `create-expense-report`
- `eclipse`
- `implement-figma-component`
- `mobile-web-interactions`
- `restore-local-dev-stack`
- `simplify-dotnet-abstractions`
- `write-obvious-code`

## Layout

Each skill lives in its own directory with a `SKILL.md` file.

## Evaluate

Every skill has an isolated Promptfoo/Codex evaluation with explicit, implicit, contextual,
negative, and outcome cases plus a no-skill baseline. See [evals/README.md](evals/README.md) for the
coverage model, setup, commands, result interpretation, and known integration boundaries.
