#!/usr/bin/env bash
# Build the cached Bun + Chrome audit image and run the same route gates as CI.
# Optional route names are passed through, for example: audit-container.sh home en
set -euo pipefail

cd "$(dirname "$0")/.."

docker compose --profile audit build audit
docker compose --profile audit run --rm audit "$@"
