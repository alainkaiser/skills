const path = require('node:path');
const { providerLabel, skillCalls } = require('./helpers.cjs');

module.exports = function routingIntegrity(_output, context) {
  const baselineLabel = context.config.baselineLabel;
  const skillName = context.config.skillName;
  const isBaseline = providerLabel(context.provider) === baselineLabel;
  const calls = skillCalls(context);
  const withSkillWorkspace = path.resolve(
    context.vars.workspaceRoot,
    context.vars.caseId,
    'with-skill',
  );
  const expectedPath = path.resolve(
    withSkillWorkspace,
    '.agents',
    'skills',
    skillName,
    'SKILL.md',
  );
  const matchingCall = calls.find(
    (call) =>
      call &&
      call.name === skillName &&
      typeof call.path === 'string' &&
      path.resolve(path.isAbsolute(call.path) ? call.path : path.join(withSkillWorkspace, call.path)) ===
        expectedPath,
  );
  const usedFixture = Boolean(matchingCall);
  const shouldUse = isBaseline ? false : context.vars.shouldTrigger !== false;
  const pass = shouldUse ? usedFixture : !calls.some((call) => call?.name === skillName);

  return {
    pass,
    score: pass ? 1 : 0,
    reason: shouldUse
      ? usedFixture
        ? `Codex read the fixture at ${expectedPath}.`
        : `Codex did not read the expected fixture at ${expectedPath}.`
      : calls.some((call) => call?.name === skillName)
        ? `${skillName} was read when it should have stayed inactive.`
        : `${skillName} stayed inactive as expected.`,
  };
};
