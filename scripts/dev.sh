#!/usr/bin/env bash
set -euo pipefail

git submodule update --init --recursive
zola serve --drafts --open
