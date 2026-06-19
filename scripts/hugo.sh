#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LOCAL_HUGO="$ROOT_DIR/.tools/hugo/hugo"
LOCAL_GO_BIN="$ROOT_DIR/.tools/go/bin"

if [ -d "$LOCAL_GO_BIN" ]; then
  export PATH="$LOCAL_GO_BIN:$PATH"
  export GOPATH="$ROOT_DIR/.tools/go-work"
  export GOMODCACHE="$ROOT_DIR/.tools/go-work/pkg/mod"
  export GOCACHE="$ROOT_DIR/.tools/go-build-cache"
fi

if [ -x "$LOCAL_HUGO" ]; then
  exec "$LOCAL_HUGO" "$@"
fi

exec hugo "$@"
