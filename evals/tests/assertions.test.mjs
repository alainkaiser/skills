import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { createRequire } from 'node:module';
import { prepareSkill } from '../scripts/prepare-fixtures.mjs';
import { workspacesRoot } from '../scripts/catalog.mjs';

const require = createRequire(import.meta.url);
const caseQuality = require('../assertions/case-quality.cjs');
const routingIntegrity = require('../assertions/routing-integrity.cjs');

const validOutput = JSON.stringify({
  summary: 'Installed 1.0.0; official index unavailable.',
  decisions: ['Use the installed contract.'],
  evidence: ['package-lock.json'],
  questions: [],
  changes: [],
  verification: [],
  blocked: false,
});

function context(label, expectation, providerResponse = {}) {
  return {
    config: {
      baselineLabel: 'base-ui-baseline',
      skillName: 'base-ui',
    },
    vars: {
      caseId: 'offline-docs-fallback',
      expectation,
      minimumScore: 0.8,
      shouldTrigger: true,
      workspaceRoot: path.join(workspacesRoot, 'base-ui'),
    },
    provider: { label },
    providerResponse,
  };
}

test.before(() => {
  prepareSkill('base-ui');
});

test('quality assertion scores structured output and unchanged files', () => {
  const result = caseQuality(
    validOutput,
    context('base-ui-with-skill', {
      required: ['1.0.0', 'unavailable'],
      files: { noChanges: true },
    }),
  );

  assert.equal(result.pass, true);
  assert.equal(result.score, 1);
});

test('quality assertion detects review-only workspace changes', () => {
  const workspace = path.join(
    workspacesRoot,
    'base-ui',
    'offline-docs-fallback',
    'with-skill',
  );
  fs.appendFileSync(path.join(workspace, 'package.json'), '\n');

  const result = caseQuality(
    validOutput,
    context('base-ui-with-skill', {
      required: ['1.0.0'],
      files: { noChanges: true },
    }),
  );

  assert.equal(result.pass, false);
  assert.ok(result.score < 0.8);
});

test('baseline quality rows remain measurements even with a low score', () => {
  const result = caseQuality(
    validOutput,
    context('base-ui-baseline', {
      required: ['a phrase that is absent'],
    }),
  );

  assert.equal(result.pass, true);
  assert.equal(result.score, 0);
});

test('routing integrity expects the skill only in the skill variant', () => {
  const withSkill = routingIntegrity(
    validOutput,
    context('base-ui-with-skill', {}, {
      metadata: {
        skillCalls: [
          {
            name: 'base-ui',
            path: path.join(
              workspacesRoot,
              'base-ui',
              'offline-docs-fallback',
              'with-skill',
              '.agents',
              'skills',
              'base-ui',
              'SKILL.md',
            ),
          },
        ],
      },
    }),
  );
  const baseline = routingIntegrity(validOutput, context('base-ui-baseline', {}));

  assert.equal(withSkill.pass, true);
  assert.equal(baseline.pass, true);
});

test('routing integrity resolves relative skill paths from the fixture workspace', () => {
  const result = routingIntegrity(
    validOutput,
    context('base-ui-with-skill', {}, {
      metadata: {
        skillCalls: [
          {
            name: 'base-ui',
            path: '.agents/skills/base-ui/SKILL.md',
          },
        ],
      },
    }),
  );

  assert.equal(result.pass, true);
});
