#!/usr/bin/env sh
set -eu

# Resolve repository root (directory of this script)
ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"

# Load environment variables from .env if present
if [ -f "$ROOT_DIR/.env" ]; then
  # Export all variables defined while sourcing
  set -a
  . "$ROOT_DIR/.env"
  set +a
fi

# Basic validation for required environment variables
if [ -z "${SLACK_AUTH_USER_TOKEN:-}" ]; then
  echo "Error: SLACK_AUTH_USER_TOKEN is not set (set it in .env or your shell)." >&2
  exit 1
fi
if [ -z "${SLACK_SEARCH_CHANNELS:-}" ]; then
  echo "Error: SLACK_SEARCH_CHANNELS is not set (set it in .env or your shell)." >&2
  exit 1
fi

# Build only if the compiled test file is missing
if [ ! -f "$ROOT_DIR/build/test.js" ]; then
  if command -v npm >/dev/null 2>&1; then
    (cd "$ROOT_DIR" && npm run build --silent)
  else
    echo "Warning: npm not found and build/test.js missing. Skipping build." >&2
  fi
fi

exec node "$ROOT_DIR/build/test.js" "$@"


