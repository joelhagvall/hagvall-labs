#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."

default_name="backups/umami-$(date -u +%Y%m%dT%H%M%SZ).dump"
output="${1:-$default_name}"
mkdir -p "$(dirname "$output")"

docker compose exec -T umami-db \
  pg_dump --format=custom --no-owner --username=umami umami >"$output"
chmod 600 "$output"

echo "Umami backup written to $output"
