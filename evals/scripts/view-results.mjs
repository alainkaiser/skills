import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot } from './catalog.mjs';

const promptfooBinary = path.join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'promptfoo.cmd' : 'promptfoo',
);

if (!fs.existsSync(promptfooBinary)) {
  console.error('Install dependencies with pnpm install before opening results.');
  process.exit(1);
}

const child = spawnSync(promptfooBinary, ['view'], {
  // Start outside the repository so Promptfoo does not auto-load the
  // skill-specific evaluation config, which requires SKILL_EVAL_SKILL.
  cwd: os.tmpdir(),
  stdio: 'inherit',
  env: {
    ...process.env,
    PATH: [path.dirname(process.execPath), process.env.PATH].filter(Boolean).join(path.delimiter),
    PROMPTFOO_CONFIG_DIR: path.join(repositoryRoot, '.eval-cache', 'promptfoo'),
    PROMPTFOO_DISABLE_TELEMETRY: '1',
  },
});

process.exit(child.status ?? 1);
