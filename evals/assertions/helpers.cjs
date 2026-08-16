const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

function flattenStrings(value, output = []) {
  if (typeof value === 'string') {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      flattenStrings(item, output);
    }
    return output;
  }

  if (value && typeof value === 'object') {
    for (const item of Object.values(value)) {
      flattenStrings(item, output);
    }
  }

  return output;
}

function parseOutput(output) {
  if (typeof output === 'object' && output !== null) {
    return output;
  }

  if (typeof output !== 'string') {
    throw new Error('Provider output is neither JSON text nor an object.');
  }

  return JSON.parse(output);
}

function providerLabel(provider) {
  if (!provider) {
    return '';
  }

  if (typeof provider.label === 'string') {
    return provider.label;
  }

  if (typeof provider.id === 'string') {
    return provider.id;
  }

  if (typeof provider.id === 'function') {
    return provider.id();
  }

  return '';
}

function variantForContext(context, baselineLabel) {
  return providerLabel(context.provider) === baselineLabel ? 'baseline' : 'with-skill';
}

function matches(text, pattern) {
  return text.toLowerCase().includes(String(pattern).toLowerCase());
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function listFiles(root, current = root, result = {}) {
  if (!fs.existsSync(current)) {
    return result;
  }

  for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
    if (entry.name === '.agents' || entry.name === '.eval-home' || entry.name === '.git') {
      continue;
    }

    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      listFiles(root, absolute, result);
      continue;
    }

    const relative = path.relative(root, absolute).split(path.sep).join('/');
    result[relative] = fileHash(absolute);
  }

  return result;
}

function skillCalls(context) {
  const metadata = context.providerResponse?.metadata || {};
  return Array.isArray(metadata.skillCalls) ? metadata.skillCalls : [];
}

module.exports = {
  flattenStrings,
  listFiles,
  matches,
  parseOutput,
  providerLabel,
  skillCalls,
  variantForContext,
};
