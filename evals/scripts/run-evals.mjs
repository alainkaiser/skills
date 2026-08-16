import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { repositoryRoot, skillNames } from './catalog.mjs';
import { prepareSkill } from './prepare-fixtures.mjs';
import { summarizeResults } from './summarize-results.mjs';

const requested = process.argv[2];
const skills = !requested || requested === 'all' ? skillNames() : [requested];
const routingOnly = process.argv.includes('--routing-only');
const knownSkills = new Set(skillNames());

for (const skillName of skills) {
  if (!knownSkills.has(skillName)) {
    console.error(`Unknown skill: ${skillName}`);
    process.exit(1);
  }
}

const promptfooBinary = path.join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'promptfoo.cmd' : 'promptfoo',
);

if (!fs.existsSync(promptfooBinary)) {
  console.error('Install dependencies with pnpm install before running evaluations.');
  process.exit(1);
}

const hasApiKey = Boolean(process.env.OPENAI_API_KEY || process.env.CODEX_API_KEY);
if (!hasApiKey && !routingOnly) {
  console.error(
    'Full effect evaluations require OPENAI_API_KEY or CODEX_API_KEY so user-installed skills can be isolated from the baseline. Use --routing-only for a signed-in CLI smoke run.',
  );
  process.exit(1);
}

const codexHome = process.env.SKILL_EVAL_CODEX_HOME || (routingOnly ? path.join(os.homedir(), '.codex') : undefined);
const repeat = process.env.SKILL_EVAL_REPEAT || '1';
const resultsRoot = path.join(repositoryRoot, 'evals', 'results');
fs.mkdirSync(resultsRoot, { recursive: true });

let finalStatus = 0;

for (const skillName of skills) {
  prepareSkill(skillName);
  const resultPath = path.join(
    resultsRoot,
    `${skillName}${routingOnly ? '-routing' : ''}.json`,
  );
  console.log(
    `Running ${skillName}${routingOnly ? ' routing smoke' : ''} (${repeat} repeat${repeat === '1' ? '' : 's'})...`,
  );

  const filterArguments = routingOnly ? ['--filter-metadata', 'kind=routing'] : [];

  const child = spawnSync(
    promptfooBinary,
    [
      'eval',
      '-c',
      path.join(repositoryRoot, 'promptfooconfig.js'),
      '--repeat',
      repeat,
      '--no-cache',
      ...filterArguments,
      '--output',
      resultPath,
    ],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      stdio: 'inherit',
      env: {
        ...process.env,
        PATH: [path.dirname(process.execPath), process.env.PATH].filter(Boolean).join(path.delimiter),
        ...(codexHome ? { SKILL_EVAL_CODEX_HOME: codexHome } : {}),
        SKILL_EVAL_USE_SHARED_HOME: routingOnly ? '1' : '0',
        SKILL_EVAL_SKILL: skillName,
        PROMPTFOO_CONFIG_DIR: path.join(repositoryRoot, '.eval-cache', 'promptfoo'),
        PROMPTFOO_DISABLE_TELEMETRY: '1',
      },
    },
  );

  if (fs.existsSync(resultPath)) {
    summarizeResults(resultPath);
  }

  if (child.status !== 0) {
    finalStatus = child.status ?? 1;
  }
}

process.exit(finalStatus);
