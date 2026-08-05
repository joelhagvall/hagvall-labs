#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."

default_name="backups/umami-$(date -u +%Y%m%dT%H%M%SZ).dump"
output="${1:-$default_name}"
backup_retention_days="${UMAMI_BACKUP_RETENTION_DAYS:-7}"
[[ $backup_retention_days =~ ^[1-9][0-9]*$ ]] || {
  echo "UMAMI_BACKUP_RETENTION_DAYS must be a positive integer" >&2
  exit 1
}

mkdir -p "$(dirname "$output")"
output_tmp="${output}.tmp"
cleanup() {
  rm -f -- "$output_tmp"
}
trap cleanup EXIT

docker compose exec -T umami-db \
  pg_dump --format=custom --no-owner --username=umami umami >"$output_tmp"
chmod 600 "$output_tmp"
mv -- "$output_tmp" "$output"

find backups -maxdepth 1 -type f -name 'umami-*.dump' \
  -mmin "+$((backup_retention_days * 1440))" -delete

echo "Umami backup written to $output"
