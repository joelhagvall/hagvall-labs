#!/usr/bin/env bash
# Visitor stats from the edge Caddy access log (IP-anonymized JSON, written
# by the log directive in deploy/caddy.hagvall-labs.caddy). Runs GoAccess in
# a throwaway container, so nothing needs to be installed on the VM.
#
# Usage (on the VM):
#   scripts/analytics.sh              interactive terminal dashboard
#   scripts/analytics.sh report.html  self-contained HTML report
set -euo pipefail

log_dir="${HAGVALL_LABS_CADDY_LOG_DIR:-/var/log/caddy}"
log_name="hagvall-labs.access.log"
goaccess_image="allinurl/goaccess@sha256:b3e36425e47a53907d8d337989fa8a822adcad4e3be8c4920735fa5a5602746d"

[[ -r "$log_dir/$log_name" ]] || {
  echo "no readable log at $log_dir/$log_name" >&2
  echo "run this on the VM, or point HAGVALL_LABS_CADDY_LOG_DIR at the log directory" >&2
  exit 1
}

goaccess_args=(
  --log-format=CADDY
  --tz=Europe/Stockholm
  --ignore-crawlers
  --unknowns-as-crawlers
)

if [[ $# -gt 0 ]]; then
  # HTML report: read the log on stdin, write the report where asked.
  out="$1"
  docker run --rm -i "$goaccess_image" \
    "${goaccess_args[@]}" --output=html - <"$log_dir/$log_name" >"$out"
  echo "report written to $out"
else
  # Interactive ncurses dashboard.
  docker run --rm -it -v "$log_dir:/logs:ro" "$goaccess_image" \
    "${goaccess_args[@]}" "/logs/$log_name"
fi
