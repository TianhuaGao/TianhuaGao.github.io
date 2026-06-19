#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

pagefind --site public --output-subdir pagefind
pagefind --site public --output-path static/pagefind --quiet
