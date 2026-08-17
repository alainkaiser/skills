import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

function collectRows(document) {
  if (Array.isArray(document.results)) {
    return document.results;
  }

  if (Array.isArray(document.results?.results)) {
    return document.results.results;
  }

  return [];
}

export function summarizeResults(resultPath) {
  const document = JSON.parse(fs.readFileSync(resultPath, 'utf8'));
  const rows = collectRows(document);
  const byProvider = new Map();

  for (const row of rows) {
    const label =
      row.provider?.label ||
      row.provider?.id ||
      row.provider ||
      row.providerId ||
      'unknown-provider';
    const score = Number(row.score ?? row.gradingResult?.score ?? 0);
    const current = byProvider.get(label) || {
      count: 0,
      score: 0,
      passed: 0,
      outcomeCount: 0,
      outcomeQuality: 0,
      latencyMs: 0,
      tokens: 0,
    };
    current.count += 1;
    current.score += score;
    current.passed += row.success || row.gradingResult?.pass ? 1 : 0;
    current.latencyMs += Number(row.latencyMs || 0);
    current.tokens += Number(row.tokenUsage?.total || 0);

    const kind = row.metadata?.kind || row.testCase?.metadata?.kind;
    const quality = row.namedScores?.['outcome-quality'];
    if (kind === 'outcome' && Number.isFinite(Number(quality))) {
      current.outcomeCount += 1;
      current.outcomeQuality += Number(quality);
    }

    byProvider.set(label, current);
  }

  console.log(`Results: ${resultPath}`);
  for (const [label, values] of byProvider) {
    const average = values.count === 0 ? 0 : values.score / values.count;
    const quality =
      values.outcomeCount === 0 ? null : values.outcomeQuality / values.outcomeCount;
    const latency = values.count === 0 ? 0 : values.latencyMs / values.count;
    console.log(
      `${label}: ${values.passed}/${values.count} rows passed, average score ${average.toFixed(3)}, outcome quality ${quality === null ? 'n/a' : quality.toFixed(3)}, average latency ${Math.round(latency)} ms, ${values.tokens} tokens`,
    );
  }

  const withSkill = [...byProvider.entries()].find(([label]) => label.endsWith('-with-skill'));
  const baseline = [...byProvider.entries()].find(([label]) => label.endsWith('-baseline'));

  if (withSkill && baseline && withSkill[1].outcomeCount > 0 && baseline[1].outcomeCount > 0) {
    const withSkillQuality = withSkill[1].outcomeQuality / withSkill[1].outcomeCount;
    const baselineQuality = baseline[1].outcomeQuality / baseline[1].outcomeCount;
    console.log(`Skill effect delta: ${(withSkillQuality - baselineQuality).toFixed(3)} outcome-quality points.`);
  }
}

const invokedDirectly =
  process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (invokedDirectly && process.argv[2]) {
  summarizeResults(process.argv[2]);
}
