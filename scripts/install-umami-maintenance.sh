#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."

command -v crontab >/dev/null
command -v flock >/dev/null

repo_dir="$(pwd -P)"
marker="hagvall-labs-umami-maintenance"
cron_line="17 3 * * * cd $repo_dir && /usr/bin/flock -n /tmp/$marker.lock /usr/bin/bash scripts/umami-maintenance.sh # $marker"
cron_tmp="$(mktemp /tmp/hagvall-labs-cron.XXXXXX)"

cleanup() {
  rm -f -- "$cron_tmp"
}
trap cleanup EXIT

(crontab -l 2>/dev/null || true) |
  grep -Fv "# $marker" >"$cron_tmp" || true
printf '%s\n' "$cron_line" >>"$cron_tmp"
crontab "$cron_tmp"

echo "Umami maintenance scheduled daily at 03:17 UTC"
