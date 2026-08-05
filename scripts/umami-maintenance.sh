#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."

retention_days="${UMAMI_RETENTION_DAYS:-90}"
backup_retention_days="${UMAMI_BACKUP_RETENTION_DAYS:-7}"

[[ $retention_days =~ ^[1-9][0-9]*$ ]] || {
  echo "UMAMI_RETENTION_DAYS must be a positive integer" >&2
  exit 1
}
[[ $backup_retention_days =~ ^[1-9][0-9]*$ ]] || {
  echo "UMAMI_BACKUP_RETENTION_DAYS must be a positive integer" >&2
  exit 1
}

docker compose exec -T umami-db \
  psql --username=umami --dbname=umami --no-psqlrc \
    --single-transaction \
    --set="retention_days=$retention_days" \
    --file=- <scripts/prune-umami.sql

UMAMI_BACKUP_RETENTION_DAYS="$backup_retention_days" \
  bash scripts/umami-backup.sh

echo "Umami maintenance complete: live data ${retention_days}d, backups ${backup_retention_days}d"
