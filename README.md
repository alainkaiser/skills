# Skills

Personal Codex skills that can be installed into `~/.codex/skills`.

## Install

Install a skill from this repo with the bundled Codex skill installer:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo alainkaiser/skills \
  --path <skill-directory>
```

Example:

```bash
python3 ~/.codex/skills/.system/skill-installer/scripts/install-skill-from-github.py \
  --repo alainkaiser/skills \
  --path implement-figma-component
```

Restart Codex after installing a skill.

## Layout

Each skill lives in its own directory with a `SKILL.md` file.
