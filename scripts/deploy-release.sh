#!/usr/bin/env bash
# Activate one immutable Hägvall Labs image on the production VM. The image
# must already have passed CI, been scanned and been published under its full
# source commit SHA. A failed activation restores the previously running image.
set -Eeuo pipefail
umask 077
cd "$(dirname "$0")/.."

bash scripts/init-umami-secrets.sh

release_sha="${1:-}"
if [[ ! $release_sha =~ ^[0-9a-f]{40}$ ]]; then
  echo "usage: scripts/deploy-release.sh <full-lowercase-git-sha>" >&2
  exit 1
fi

registry="${HAGVALL_LABS_IMAGE_REGISTRY:-ghcr.io/joelhagvall}"
registry="${registry%/}"
tagged_image="${registry}/hagvall-labs:${release_sha}"

current_image() {
  local container_id
  container_id="$(docker compose ps -q web 2>/dev/null || true)"
  [[ -n $container_id ]] || return 0
  docker inspect --format '{{.Config.Image}}' "$container_id"
}

env_value() {
  local key="$1"
  [[ -f .env ]] || return 0
  awk -v key="$key" 'index($0, key "=") == 1 { print substr($0, length(key) + 2); exit }' .env
}

old_image="$(current_image)"
old_image="${old_image:-$(env_value HAGVALL_LABS_IMAGE)}"

env_tmp=""
write_image_reference() {
  local image="$1"
  local source_file="/dev/null"
  [[ -f .env ]] && source_file=".env"
  env_tmp="$(mktemp /tmp/hagvall-labs-env.XXXXXX)"
  awk -v image="$image" '
    BEGIN { written = 0 }
    /^HAGVALL_LABS_IMAGE=/ {
      if (!written) print "HAGVALL_LABS_IMAGE=" image
      written = 1
      next
    }
    { print }
    END {
      if (!written) print "HAGVALL_LABS_IMAGE=" image
    }
  ' "$source_file" >"$env_tmp"
  chmod 600 "$env_tmp"
  mv -- "$env_tmp" .env
  env_tmp=""
}

verify_revision() {
  local image="$1"
  local revision
  revision="$(docker image inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$image")"
  [[ $revision == "$release_sha" ]] || {
    echo "deploy FAILED: $image contains revision $revision, expected $release_sha" >&2
    return 1
  }
}

digest_reference() {
  local image="$1"
  local repository="${image%:*}"
  local reference
  reference="$(
    docker image inspect --format '{{range .RepoDigests}}{{println .}}{{end}}' "$image" |
      awk -v prefix="${repository}@sha256:" 'index($0, prefix) == 1 { print; exit }'
  )"
  [[ -n $reference ]] || {
    echo "deploy FAILED: no pulled digest found for $image" >&2
    return 1
  }
  printf '%s\n' "$reference"
}

wait_for_service() {
  local service="$1"
  local attempt container_id health
  for attempt in $(seq 1 30); do
    container_id="$(docker compose ps -q "$service" 2>/dev/null || true)"
    if [[ -n $container_id ]]; then
      health="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id")"
      [[ $health == "healthy" ]] && return 0
    fi
    sleep 2
  done
  echo "deploy FAILED: $service did not become healthy" >&2
  return 1
}

wait_for_container() {
  wait_for_service web
}

wait_for_edge() {
  local attempt
  for attempt in $(seq 1 30); do
    if curl --fail --silent --show-error --max-time 5 \
      --resolve hagvall-labs.com:443:127.0.0.1 \
      https://hagvall-labs.com/ >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

edge_proxy_container() {
  local caddy_container
  caddy_container="$(
    docker ps \
      --filter label=com.docker.compose.project=maskera-cloud \
      --filter label=com.docker.compose.service=caddy \
      --format '{{.ID}}' |
      head -n 1
  )"
  [[ -n $caddy_container ]] || {
    echo "deploy FAILED: shared Caddy container is not running" >&2
    return 1
  }
  printf '%s\n' "$caddy_container"
}

remount_edge_proxy_config_if_needed() {
  local caddy_container host_hash mounted_hash working_dir config_files
  local -a compose_args=()
  local -a files=()
  caddy_container="$(edge_proxy_container)"
  host_hash="$(sha256sum deploy/caddy.hagvall-labs.caddy | awk '{ print $1 }')"
  mounted_hash="$(
    docker exec "$caddy_container" \
      sha256sum /etc/caddy/sites/hagvall-labs.caddy |
      awk '{ print $1 }'
  )"
  [[ $host_hash != "$mounted_hash" ]] || return 0

  working_dir="$(
    docker inspect --format \
      '{{index .Config.Labels "com.docker.compose.project.working_dir"}}' \
      "$caddy_container"
  )"
  config_files="$(
    docker inspect --format \
      '{{index .Config.Labels "com.docker.compose.project.config_files"}}' \
      "$caddy_container"
  )"
  IFS=',' read -r -a files <<<"$config_files"
  for file in "${files[@]}"; do
    compose_args+=(-f "$file")
  done

  docker compose --project-directory "$working_dir" "${compose_args[@]}" \
    up -d --no-deps --force-recreate caddy
}

reload_edge_proxy() {
  local caddy_container
  remount_edge_proxy_config_if_needed
  caddy_container="$(edge_proxy_container)"
  docker exec "$caddy_container" caddy reload \
    --config /etc/caddy/Caddyfile --adapter caddyfile
}

image_id() {
  docker image inspect --format '{{.Id}}' "$1" 2>/dev/null || true
}

prune_release_repository() {
  local repository="$1"
  local current_reference="$2"
  local previous_reference="$3"
  local current_id previous_id candidate_id candidate_reference
  current_id="$(image_id "$current_reference")"
  previous_id="$(image_id "$previous_reference")"
  [[ -n $current_id ]] || return 0

  while read -r candidate_id candidate_reference; do
    [[ -n $candidate_id && -n $candidate_reference ]] || continue
    [[ $candidate_reference != *":<none>" ]] || continue
    if [[ $candidate_id == "$current_id" ||
      (-n $previous_id && $candidate_id == "$previous_id") ]]; then
      continue
    fi
    docker image rm "$candidate_reference" >/dev/null 2>&1 || true
  done < <(docker image ls --no-trunc "$repository" --format '{{.ID}} {{.Repository}}:{{.Tag}}')
}

rollback_armed=0
deployment_succeeded=0
cleanup() {
  local status=$?
  trap - EXIT
  [[ -z $env_tmp ]] || rm -f -- "$env_tmp"

  if [[ $rollback_armed -eq 1 && $deployment_succeeded -ne 1 ]]; then
    echo "deploy failed; restoring previous Hägvall Labs image" >&2
    set +e
    if [[ -n $old_image ]]; then
      write_image_reference "$old_image"
      export HAGVALL_LABS_IMAGE="$old_image"
      docker compose up -d --no-build
      wait_for_container && wait_for_edge
    else
      docker compose down
    fi
    set -e
  fi
  exit "$status"
}
trap cleanup EXIT

export HAGVALL_LABS_IMAGE="$tagged_image"
docker compose pull web umami umami-db
verify_revision "$tagged_image"
new_image="$(digest_reference "$tagged_image")"

rollback_armed=1
write_image_reference "$new_image"
export HAGVALL_LABS_IMAGE="$new_image"
docker compose up -d --no-build
wait_for_container
wait_for_service umami
docker compose --profile bootstrap run --rm --no-deps umami-bootstrap
reload_edge_proxy
wait_for_edge
bash scripts/install-umami-maintenance.sh
bash scripts/security-check.sh "$release_sha"

deployment_succeeded=1
rollback_armed=0
prune_release_repository "${tagged_image%:*}" "$new_image" "$old_image"
docker compose ps
echo "deploy healthy: $release_sha"
