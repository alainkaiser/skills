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
- `implement-figma-component`
- `mobile-web-interactions`
- `restore-local-dev-stack`
- `simplify-dotnet-abstractions`
- `write-obvious-code`

## Layout

Each skill lives in its own directory with a `SKILL.md` file.

## Evaluate

[Subscription evaluations](evals/subscription/README.md) compare the original and
working-tree skills with a no-skill baseline using your signed-in Codex or Claude
Code CLI. Start with one case:

```bash
python3 evals/subscription/run.py --models astra --cases consumer-wiring --output evals/subscription/results/consumer-wiring.json
```

Every skill also has a [Promptfoo/Codex evaluation](evals/README.md) with explicit,
implicit, contextual, negative, and outcome cases plus a no-skill baseline. Use it
for broader routing coverage, structured outcomes, and result comparison.
