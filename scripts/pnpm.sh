#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_NODE_BIN="$ROOT_DIR/.tools/node/bin"

if [ -d "$LOCAL_NODE_BIN" ]; then
  export PATH="$LOCAL_NODE_BIN:$PATH"
fi

exec pnpm "$@"
