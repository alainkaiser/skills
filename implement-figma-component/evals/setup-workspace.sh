#!/bin/bash
# Scaffold shared by every case: the fixture app as a git repository with installed
# dependencies. The recorded Figma screenshots go next to the workspace, where the
# get_screenshot mock says it downloaded them, under names that reveal no node IDs.
set -euo pipefail
EVALS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cp -R "$EVALS/fixture-app/." .
pnpm install --frozen-lockfile --prefer-offline --silent
git init -q
git add -A
git -c user.name=eval -c user.email=eval@example.com commit -qm "Initial commit"
mkdir -p ../.figma-mcp
cp "$EVALS/mocks/figma/fixtures/screenshots/"*.png ../.figma-mcp/
