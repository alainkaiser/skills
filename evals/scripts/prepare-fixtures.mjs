import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  fixturesRoot,
  readSuite,
  repositoryRoot,
  skillNames,
  workspacesRoot,
} from './catalog.mjs';

function copyDirectory(source, destination) {
  if (!fs.existsSync(source)) {
    return;
  }

  fs.mkdirSync(destination, { recursive: true });
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    const sourcePath = path.join(source, entry.name);
    const destinationPath = path.join(destination, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(sourcePath, destinationPath);
    } else {
      fs.copyFileSync(sourcePath, destinationPath);
    }
  }
}

function hash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function snapshot(root, current = root, result = {}) {
  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (entry.name === '.agents' || entry.name === '.eval-home' || entry.name === '.git') {
      continue;
    }

    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      snapshot(root, absolute, result);
      continue;
    }

    const relative = path.relative(root, absolute).split(path.sep).join('/');
    result[relative] = hash(absolute);
  }

  return result;
}

function writeSnapshot(caseRoot, variant) {
  const snapshotRoot = path.join(caseRoot, 'snapshots');
  fs.mkdirSync(snapshotRoot, { recursive: true });
  const values = snapshot(path.join(caseRoot, variant));
  const sorted = Object.fromEntries(Object.entries(values).sort(([left], [right]) => left.localeCompare(right)));
  fs.writeFileSync(
    path.join(snapshotRoot, `${variant}.json`),
    `${JSON.stringify(sorted, null, 2)}\n`,
    'utf8',
  );
}

export function prepareSkill(skillName) {
  if (!skillNames().includes(skillName)) {
    throw new Error(`Unknown skill: ${skillName}`);
  }

  const suite = readSuite(skillName);
  const skillWorkspaceRoot = path.resolve(workspacesRoot, skillName);
  const expectedParent = `${path.resolve(workspacesRoot)}${path.sep}`;

  if (!skillWorkspaceRoot.startsWith(expectedParent)) {
    throw new Error(`Refusing to clean unexpected path: ${skillWorkspaceRoot}`);
  }

  fs.rmSync(skillWorkspaceRoot, { recursive: true, force: true });

  for (const testCase of suite.cases) {
    const caseRoot = path.join(skillWorkspaceRoot, testCase.id);
    const commonFixture = path.join(fixturesRoot, skillName, 'common');
    const caseFixture = path.join(fixturesRoot, skillName, 'cases', testCase.id);

    for (const variant of ['with-skill', 'baseline']) {
      const workspace = path.join(caseRoot, variant);
      fs.mkdirSync(workspace, { recursive: true });
      copyDirectory(commonFixture, workspace);
      copyDirectory(caseFixture, workspace);
      fs.mkdirSync(path.join(workspace, '.eval-home', '.codex'), { recursive: true });
    }

    copyDirectory(
      path.join(repositoryRoot, skillName),
      path.join(caseRoot, 'with-skill', '.agents', 'skills', skillName),
    );

    writeSnapshot(caseRoot, 'with-skill');
    writeSnapshot(caseRoot, 'baseline');
  }

  return skillWorkspaceRoot;
}

const invokedDirectly = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (invokedDirectly) {
  const requested = process.argv[2];
  const selected = !requested || requested === 'all' ? skillNames() : [requested];
  for (const skillName of selected) {
    console.log(`Prepared ${prepareSkill(skillName)}`);
  }
}
