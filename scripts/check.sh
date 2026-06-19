#!/usr/bin/env bash
# Pre-push sanity check. Runs the same things the Cloud Run image would do
# on cold start, plus a frontend build. Catches issues that would otherwise
# only show up in the deploy pipeline.
#
# Usage:
#   ./scripts/check.sh           # backend tests + frontend build
#   ./scripts/check.sh backend   # just backend
#   ./scripts/check.sh frontend  # just frontend
#
# First run will need:
#   pip install -r backend/requirements-dev.txt
#   cd frontend && npm install

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-all}"

run_backend() {
    echo "==> Backend: pytest"
    cd "$ROOT/backend"
    python3 -m pytest tests/ -q
}

run_frontend() {
    echo "==> Frontend: build (ts-ignored, same as cloudbuild.yaml)"
    cd "$ROOT/frontend"
    npm run build:ignore-ts >/dev/null
}

case "$TARGET" in
    backend)  run_backend ;;
    frontend) run_frontend ;;
    all)      run_backend && run_frontend ;;
    *)
        echo "Unknown target: $TARGET. Use: backend | frontend | all" >&2
        exit 2
        ;;
esac

echo "==> OK - safe to push."
