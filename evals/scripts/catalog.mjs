import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const evalsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const repositoryRoot = path.resolve(evalsRoot, '..');
export const casesRoot = path.join(evalsRoot, 'cases');
export const fixturesRoot = path.join(evalsRoot, 'fixtures');
export const workspacesRoot = path.join(repositoryRoot, '.eval-workspaces');

export function skillNames() {
  return fs
    .readdirSync(repositoryRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(repositoryRoot, entry.name, 'SKILL.md')))
    .map((entry) => entry.name)
    .sort();
}

export function readSuite(skillName) {
  const suitePath = path.join(casesRoot, `${skillName}.json`);
  return JSON.parse(fs.readFileSync(suitePath, 'utf8'));
}
