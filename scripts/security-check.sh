#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

expected_revision="${1:-}"
container_id="$(docker compose ps -q web)"
[[ -n $container_id ]] || {
  echo "security check FAILED: web container is not running" >&2
  exit 1
}

assert_equal() {
  local name="$1"
  local actual="$2"
  local expected="$3"
  [[ $actual == "$expected" ]] || {
    echo "security check FAILED: $name is $actual, expected $expected" >&2
    exit 1
  }
}

assert_equal "runtime user" "$(docker inspect --format '{{.Config.User}}' "$container_id")" "65532:65532"
assert_equal "read-only root filesystem" "$(docker inspect --format '{{.HostConfig.ReadonlyRootfs}}' "$container_id")" "true"
assert_equal "PID limit" "$(docker inspect --format '{{.HostConfig.PidsLimit}}' "$container_id")" "128"

security_options="$(docker inspect --format '{{json .HostConfig.SecurityOpt}}' "$container_id")"
[[ $security_options == *no-new-privileges* ]] || {
  echo "security check FAILED: no-new-privileges is missing" >&2
  exit 1
}

cap_drop="$(docker inspect --format '{{json .HostConfig.CapDrop}}' "$container_id")"
[[ $cap_drop == *ALL* ]] || {
  echo "security check FAILED: capabilities are not dropped" >&2
  exit 1
}

port_bindings="$(docker inspect --format '{{json .HostConfig.PortBindings}}' "$container_id")"
[[ $port_bindings == "{}" || $port_bindings == "null" ]] || {
  echo "security check FAILED: the web container publishes host ports" >&2
  exit 1
}

if [[ -n $expected_revision ]]; then
  revision="$(docker inspect --format '{{index .Config.Labels "org.opencontainers.image.revision"}}' "$container_id")"
  assert_equal "image revision" "$revision" "$expected_revision"
fi

echo "security check passed"
