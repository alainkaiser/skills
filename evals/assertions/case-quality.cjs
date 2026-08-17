const fs = require('node:fs');
const path = require('node:path');
const {
  flattenStrings,
  listFiles,
  matches,
  parseOutput,
  providerLabel,
  variantForContext,
} = require('./helpers.cjs');

function addCheck(checks, name, pass, details) {
  checks.push({ name, pass, details });
}

function inspectFiles(checks, expectation, context, variant) {
  const caseRoot = path.join(context.vars.workspaceRoot, context.vars.caseId);
  const workspace = path.join(caseRoot, variant);
  const initialPath = path.join(caseRoot, 'snapshots', `${variant}.json`);
  const fileRules = expectation.files || {};

  for (const relative of fileRules.exists || []) {
    addCheck(
      checks,
      `file exists: ${relative}`,
      fs.existsSync(path.join(workspace, relative)),
      relative,
    );
  }

  for (const relative of fileRules.missing || []) {
    addCheck(
      checks,
      `file missing: ${relative}`,
      !fs.existsSync(path.join(workspace, relative)),
      relative,
    );
  }

  for (const [relative, patterns] of Object.entries(fileRules.contains || {})) {
    const absolute = path.join(workspace, relative);
    const contents = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : '';
    for (const pattern of patterns) {
      addCheck(
        checks,
        `file contains ${pattern}: ${relative}`,
        matches(contents, pattern),
        relative,
      );
    }
  }

  for (const [relative, patterns] of Object.entries(fileRules.notContains || {})) {
    const absolute = path.join(workspace, relative);
    const contents = fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : '';
    for (const pattern of patterns) {
      addCheck(
        checks,
        `file excludes ${pattern}: ${relative}`,
        !matches(contents, pattern),
        relative,
      );
    }
  }

  if (fileRules.noChanges) {
    const initial = JSON.parse(fs.readFileSync(initialPath, 'utf8'));
    const current = Object.fromEntries(
      Object.entries(listFiles(workspace)).sort(([left], [right]) => left.localeCompare(right)),
    );
    addCheck(
      checks,
      'workspace unchanged',
      JSON.stringify(current) === JSON.stringify(initial),
      'Review-only cases must not change fixture files.',
    );
  }
}

module.exports = function caseQuality(output, context) {
  let parsed;

  try {
    parsed = parseOutput(output);
  } catch (error) {
    return { pass: false, score: 0, reason: error.message };
  }

  const expectation = context.vars.expectation || {};
  const minimumScore = Number(context.vars.minimumScore || 0.8);
  const baselineLabel = context.config.baselineLabel;
  const isBaseline = providerLabel(context.provider) === baselineLabel;
  const variant = variantForContext(context, baselineLabel);
  const text = flattenStrings(parsed).join('\n');
  const checks = [];

  for (const pattern of expectation.required || []) {
    addCheck(checks, `output contains ${pattern}`, matches(text, pattern), pattern);
  }

  for (const group of expectation.anyOf || []) {
    addCheck(
      checks,
      `output contains one of ${group.join(' | ')}`,
      group.some((pattern) => matches(text, pattern)),
      group.join(' | '),
    );
  }

  for (const pattern of expectation.forbidden || []) {
    addCheck(checks, `output excludes ${pattern}`, !matches(text, pattern), pattern);
  }

  if (Number.isInteger(expectation.minQuestions)) {
    addCheck(
      checks,
      `at least ${expectation.minQuestions} question(s)`,
      parsed.questions.length >= expectation.minQuestions,
      `${parsed.questions.length} question(s) returned`,
    );
  }

  if (Number.isInteger(expectation.maxQuestions)) {
    addCheck(
      checks,
      `at most ${expectation.maxQuestions} question(s)`,
      parsed.questions.length <= expectation.maxQuestions,
      `${parsed.questions.length} question(s) returned`,
    );
  }

  if (typeof expectation.blocked === 'boolean') {
    addCheck(
      checks,
      `blocked is ${expectation.blocked}`,
      parsed.blocked === expectation.blocked,
      `blocked=${parsed.blocked}`,
    );
  }

  inspectFiles(checks, expectation, context, variant);

  const passed = checks.filter((check) => check.pass).length;
  const score = checks.length === 0 ? 1 : passed / checks.length;
  const failed = checks.filter((check) => !check.pass).map((check) => check.name);
  const qualityPass = score >= minimumScore;

  return {
    pass: isBaseline ? true : qualityPass,
    score,
    reason: isBaseline
      ? `Baseline measurement: ${passed}/${checks.length} checks passed.`
      : qualityPass
        ? `${passed}/${checks.length} deterministic checks passed.`
        : `${passed}/${checks.length} checks passed; failed: ${failed.join('; ')}`,
  };
};
