#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

ZOLA="${ZOLA:-"$REPO_ROOT/.tools/zola-0.22.1/zola"}"
if [ ! -x "$ZOLA" ]; then
  ZOLA="$(command -v zola)"
fi

git submodule update --init --recursive
"$ZOLA" serve --drafts --open
