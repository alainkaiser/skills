const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const repositoryRoot = __dirname;
const skillName = process.env.SKILL_EVAL_SKILL;

if (!skillName) {
  throw new Error('Set SKILL_EVAL_SKILL to one skill name before loading this config.');
}

const suitePath = path.join(repositoryRoot, 'evals', 'cases', `${skillName}.json`);

if (!fs.existsSync(suitePath)) {
  throw new Error(`No evaluation suite exists for ${skillName}.`);
}

const suite = JSON.parse(fs.readFileSync(suitePath, 'utf8'));
const workspaceRoot = path.join(repositoryRoot, '.eval-workspaces', skillName);
const withSkillLabel = `${skillName}-with-skill`;
const baselineLabel = `${skillName}-baseline`;
const model = process.env.SKILL_EVAL_MODEL || 'gpt-5.6-terra';
const reasoningEffort = process.env.SKILL_EVAL_REASONING || 'high';
const sharedCodexHome = process.env.SKILL_EVAL_CODEX_HOME;
const useSharedHome = process.env.SKILL_EVAL_USE_SHARED_HOME === '1';
const enableJudge = process.env.SKILL_EVAL_JUDGE === '1';
const defaultMaxLatencyMs = Number(process.env.SKILL_EVAL_MAX_LATENCY_MS || 300000);

const outputSchema = {
  type: 'object',
  required: [
    'summary',
    'decisions',
    'evidence',
    'questions',
    'changes',
    'verification',
    'blocked',
  ],
  additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    decisions: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'array', items: { type: 'string' } },
    questions: { type: 'array', items: { type: 'string' } },
    changes: { type: 'array', items: { type: 'string' } },
    verification: { type: 'array', items: { type: 'string' } },
    blocked: { type: 'boolean' },
  },
};

function provider(label, variant) {
  const workspace = path.join(workspaceRoot, '{{caseId}}', variant);
  const isolatedHome = path.join(workspace, '.eval-home');
  const isolatedCodexHome = path.join(isolatedHome, '.codex');
  const home = useSharedHome ? os.homedir() : isolatedHome;
  const codexHome = sharedCodexHome || (useSharedHome ? path.join(home, '.codex') : isolatedCodexHome);

  return {
    id: 'openai:codex-sdk',
    label,
    config: {
      model,
      model_reasoning_effort: reasoningEffort,
      working_dir: workspace,
      skip_git_repo_check: true,
      sandbox_mode: 'read-only',
      approval_policy: 'never',
      network_access_enabled: false,
      web_search_enabled: false,
      enable_streaming: true,
      deep_tracing: process.env.SKILL_EVAL_DEEP_TRACE === '1',
      output_schema: outputSchema,
      cli_env: {
        HOME: home,
        CODEX_HOME: codexHome,
      },
    },
  };
}

function caseAssertions(testCase) {
  const assertions = [
    { type: 'is-json', metric: 'structured-output' },
    {
      type: 'javascript',
      value: 'file://evals/assertions/case-quality.cjs',
      metric: 'outcome-quality',
      config: {
        baselineLabel,
        skillName,
      },
    },
  ];

  if (testCase.kind === 'routing') {
    assertions.unshift({
      type: testCase.shouldTrigger ? 'skill-used' : 'not-skill-used',
      value: skillName,
      metric: 'routing',
    });
  }

  assertions.unshift({
    type: 'javascript',
    value: 'file://evals/assertions/routing-integrity.cjs',
    metric: 'routing-integrity',
    config: {
      baselineLabel,
      skillName,
    },
  });

  assertions.push({
    type: 'latency',
    threshold: testCase.maxLatencyMs || defaultMaxLatencyMs,
    metric: 'latency-budget',
    weight: 0.25,
  });

  if (enableJudge && testCase.rubric) {
    assertions.push({
      type: 'llm-rubric',
      value: testCase.rubric,
      provider:
        process.env.SKILL_EVAL_JUDGE_PROVIDER || 'openai:codex-sdk:gpt-5.6-luna',
      metric: 'qualitative-judge',
      weight: 0.5,
    });
  }

  return assertions;
}

module.exports = {
  description: `${skillName}: routing, procedure, outcome, constraint, and effect evaluation`,
  tags: {
    skill: skillName,
    model,
    purpose: 'agent-skill-eval',
  },
  prompts: ['{{request}}'],
  providers: [provider(withSkillLabel, 'with-skill'), provider(baselineLabel, 'baseline')],
  defaultTest: {
    options: {
      disableVarExpansion: true,
    },
  },
  tests: suite.cases.map((testCase) => ({
    description: `${testCase.id}: ${testCase.description}`,
    providers: testCase.kind === 'routing' ? [withSkillLabel] : undefined,
    vars: {
      caseId: testCase.id,
      request: testCase.prompt,
      expectation: testCase.expectation,
      minimumScore: testCase.minimumScore ?? (testCase.kind === 'routing' ? 0.5 : 0.75),
      shouldTrigger: testCase.kind === 'routing' ? testCase.shouldTrigger : true,
      workspaceRoot,
    },
    metadata: {
      skill: skillName,
      caseId: testCase.id,
      kind: testCase.kind,
      routingClass: testCase.routingClass,
    },
    options: {
      sandbox_mode: testCase.sandboxMode || 'read-only',
      network_access_enabled: testCase.networkAccess === true,
      web_search_enabled: testCase.networkAccess === true,
    },
    assert: caseAssertions(testCase),
  })),
  commandLineOptions: {
    maxConcurrency: Number(process.env.SKILL_EVAL_CONCURRENCY || 2),
    cache: false,
    share: false,
  },
};
