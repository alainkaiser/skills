import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import {
  casesRoot,
  fixturesRoot,
  readSuite,
  repositoryRoot,
  skillNames,
} from './catalog.mjs';
import { prepareSkill } from './prepare-fixtures.mjs';

const errors = [];
const skills = skillNames();
const caseFiles = fs
  .readdirSync(casesRoot)
  .filter((name) => name.endsWith('.json'))
  .map((name) => name.slice(0, -'.json'.length))
  .sort();

for (const missing of skills.filter((skill) => !caseFiles.includes(skill))) {
  errors.push(`Missing eval suite for ${missing}.`);
}

for (const extra of caseFiles.filter((skill) => !skills.includes(skill))) {
  errors.push(`Eval suite has no matching root skill: ${extra}.`);
}

for (const skillName of skills) {
  const suitePath = path.join(casesRoot, `${skillName}.json`);
  const fixturePath = path.join(fixturesRoot, skillName, 'common');

  if (!fs.existsSync(suitePath)) {
    continue;
  }

  if (!fs.existsSync(fixturePath)) {
    errors.push(`Missing common fixture directory for ${skillName}.`);
  }

  const suite = readSuite(skillName);
  const ids = new Set();
  const routingClasses = new Set();
  let routingCount = 0;
  let outcomeCount = 0;

  if (suite.skill !== skillName) {
    errors.push(`${skillName}: suite.skill must equal the directory name.`);
  }

  if (!Array.isArray(suite.cases) || suite.cases.length < 10 || suite.cases.length > 20) {
    errors.push(`${skillName}: expected 10-20 cases, found ${suite.cases?.length ?? 0}.`);
    continue;
  }

  for (const testCase of suite.cases) {
    if (!testCase.id || ids.has(testCase.id)) {
      errors.push(`${skillName}: duplicate or missing case id ${testCase.id}.`);
    }
    ids.add(testCase.id);

    if (!testCase.prompt || !testCase.description || !testCase.rubric) {
      errors.push(`${skillName}/${testCase.id}: prompt, description, and rubric are required.`);
    }

    if (!testCase.expectation || Object.keys(testCase.expectation).length === 0) {
      errors.push(`${skillName}/${testCase.id}: deterministic expectation is required.`);
    }

    if (testCase.kind === 'routing') {
      routingCount += 1;
      routingClasses.add(testCase.routingClass);
      if (typeof testCase.shouldTrigger !== 'boolean') {
        errors.push(`${skillName}/${testCase.id}: routing case needs shouldTrigger.`);
      }
    } else if (testCase.kind === 'outcome') {
      outcomeCount += 1;
    } else {
      errors.push(`${skillName}/${testCase.id}: kind must be routing or outcome.`);
    }
  }

  for (const requiredClass of ['explicit', 'implicit', 'contextual', 'negative']) {
    if (!routingClasses.has(requiredClass)) {
      errors.push(`${skillName}: missing ${requiredClass} routing coverage.`);
    }
  }

  if (routingCount < 4 || outcomeCount < 6) {
    errors.push(`${skillName}: expected at least 4 routing and 6 outcome cases.`);
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const promptfooBinary = path.join(
  repositoryRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'promptfoo.cmd' : 'promptfoo',
);

if (!fs.existsSync(promptfooBinary)) {
  console.log(`Validated ${skills.length} suites and ${skills.length * 10} cases. Install dependencies to validate Promptfoo configs.`);
  process.exit(0);
}

for (const skillName of skills) {
  prepareSkill(skillName);
  const result = spawnSync(
    promptfooBinary,
    ['validate', '-c', path.join(repositoryRoot, 'promptfooconfig.js')],
    {
      cwd: repositoryRoot,
      encoding: 'utf8',
      env: {
        ...process.env,
        PATH: [path.dirname(process.execPath), process.env.PATH].filter(Boolean).join(path.delimiter),
        SKILL_EVAL_SKILL: skillName,
        PROMPTFOO_CONFIG_DIR: path.join(repositoryRoot, '.eval-cache', 'promptfoo'),
        PROMPTFOO_DISABLE_TELEMETRY: '1',
      },
    },
  );

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(result.status ?? 1);
  }
}

console.log(`Validated ${skills.length} Promptfoo suites and ${skills.length * 10} cases.`);
