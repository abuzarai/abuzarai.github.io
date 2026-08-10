#!/usr/bin/env bash
# One-time setup: pin Zola 0.22.1 (the version this site's templates are built for)
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="0.22.1"
BIN=".tools/zola"
TARGET="zola-v${VERSION}-x86_64-unknown-linux-gnu"

if [ -x "$BIN" ] && "$BIN" --version 2>/dev/null | grep -q "zola $VERSION"; then
  echo "zola $VERSION already installed at $BIN"
else
  mkdir -p .tools
  echo "downloading zola $VERSION..."
  wget -qO- "https://github.com/getzola/zola/releases/download/v${VERSION}/${TARGET}.tar.gz" | tar xz -C .tools
  echo "zola $VERSION installed at $BIN"
fi