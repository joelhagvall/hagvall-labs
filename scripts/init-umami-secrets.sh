#!/usr/bin/env bash
set -euo pipefail
umask 077
cd "$(dirname "$0")/.."

env_file=".env"
if [[ ! -e $env_file ]]; then
  : >"$env_file"
fi
chmod 600 "$env_file"

has_key() {
  local key="$1"
  grep -q "^${key}=" "$env_file"
}

append_secret() {
  local key="$1"
  local bytes="$2"
  if ! has_key "$key"; then
    printf '%s=%s\n' "$key" "$(openssl rand -hex "$bytes")" >>"$env_file"
  fi
}

append_secret UMAMI_DB_PASSWORD 32
append_secret UMAMI_APP_SECRET 32
append_secret UMAMI_ADMIN_PASSWORD 24

echo "Umami secrets are present in $env_file"
