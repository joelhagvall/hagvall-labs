#!/bin/bash
# Quality gate: Lighthouse (performance >= 95, SEO/accessibility 100) and
# pa11y (0 errors) on every route, against the gzip prod server on :4173.
# Usage: bun run build && bun run serve:prod &  then  bash scripts/audit.sh
# Optional args: route names to audit (e.g. "audit.sh home en"), used for CI
# sharding. No args = all routes. The route list below also drives the CI
# matrix in .github/workflows/ci.yml: add new routes in both places.
set -u
S="${TMPDIR:-/tmp}/hagvall-audit"
mkdir -p "$S"
BASE="${BASE:-http://localhost:4173}"
FAIL=0
export LH_MIN_PERFORMANCE="${LH_MIN_PERFORMANCE:-95}"
LH_RUNS="${LH_RUNS:-1}"
LH_MAX_ATTEMPTS="${LH_MAX_ATTEMPTS:-2}"

case "$LH_RUNS:$LH_MAX_ATTEMPTS" in
  :*|*:) echo "LH_RUNS and LH_MAX_ATTEMPTS must be positive integers"; exit 1 ;;
  *[!0-9:]*) echo "LH_RUNS and LH_MAX_ATTEMPTS must be positive integers"; exit 1 ;;
esac
if [ "$LH_RUNS" -lt 1 ] || [ $((LH_RUNS % 2)) -eq 0 ] || [ "$LH_MAX_ATTEMPTS" -lt 1 ]; then
  echo "LH_RUNS must be a positive odd integer and LH_MAX_ATTEMPTS must be positive"
  exit 1
fi

CHROME_FLAGS="${CHROME_FLAGS:---headless=new}"

if [[ ${AUDIT_USE_GLOBAL_TOOLS:-false} == true ]]; then
  lighthouse_cmd=(lighthouse)
  pa11y_cmd=(pa11y)
else
  lighthouse_cmd=(bun x lighthouse)
  pa11y_cmd=(bun x pa11y)
fi

pa11y_args=()
if [[ -n ${PA11Y_CONFIG:-} ]]; then
  pa11y_args+=(--config "$PA11Y_CONFIG")
fi

run_lighthouse() {
  local output_path="$1"
  local error_path="$2"
  shift 2

  local attempt=1
  while [ "$attempt" -le "$LH_MAX_ATTEMPTS" ]; do
    if "${lighthouse_cmd[@]}" "$@" \
      --output=json --output-path="$output_path" --quiet 2>"$error_path"; then
      return 0
    fi

    if [ "$attempt" -lt "$LH_MAX_ATTEMPTS" ]; then
      echo "  Lighthouse attempt $attempt failed, retrying"
    fi
    attempt=$((attempt + 1))
  done

  return 1
}

# Lighthouse simulates a mid-tier phone by slowing the host CPU 4x, which
# over-penalizes slow CI runners (a GitHub runner scored 84 where a laptop
# scores 100 on the same build). Calibrate the multiplier from the machine's
# benchmarkIndex using Lighthouse's own guidance table, via a cheap probe run.
run_lighthouse "$S/lh-probe.json" "$S/lh-probe.err" \
  "$BASE/" --only-categories=seo \
  --chrome-flags="$CHROME_FLAGS" \
  || { echo "calibration probe failed:"; tail -3 "$S/lh-probe.err"; exit 1; }
BI=$(bun -e "console.log(Math.round((await Bun.file('$S/lh-probe.json').json()).environment.benchmarkIndex))")
if   [ "$BI" -ge 1300 ]; then CPU=4
elif [ "$BI" -ge 800 ];  then CPU=3
elif [ "$BI" -ge 500 ];  then CPU=2
else CPU=1; fi
echo "benchmarkIndex $BI -> cpuSlowdownMultiplier $CPU"

for entry in "home:/" "maskera:/maskera" "kontakt:/kontakt" "integritet:/integritet" "en:/en" "enmaskera:/en/maskera" "encontact:/en/contact" "enprivacy:/en/privacy"; do
  name="${entry%%:*}"
  path="${entry#*:}"
  if [ $# -gt 0 ]; then
    case " $* " in *" $name "*) ;; *) continue ;; esac
  fi
  echo "== $path"
  lighthouse_ok=true
  for run in $(seq 1 "$LH_RUNS"); do
    if ! run_lighthouse "$S/lh-$name-$run.json" "$S/lh-$name-$run.err" \
      "$BASE$path" \
      --only-categories=performance,seo,accessibility \
      --throttling.cpuSlowdownMultiplier="$CPU" \
      --chrome-flags="$CHROME_FLAGS"; then
      echo "  LIGHTHOUSE FAILED after $LH_MAX_ATTEMPTS attempts:"
      tail -3 "$S/lh-$name-$run.err"
      FAIL=1
      lighthouse_ok=false
      break
    fi
  done

  if [[ $lighthouse_ok == true ]]; then
    AUDIT_DIR="$S" AUDIT_NAME="$name" LH_RUNS="$LH_RUNS" bun -e '
      const runs = await Promise.all(
        Array.from({ length: Number(process.env.LH_RUNS) }, (_, index) =>
          Bun.file(`${process.env.AUDIT_DIR}/lh-${process.env.AUDIT_NAME}-${index + 1}.json`).json(),
        ),
      );
      const performanceFloor = Number(process.env.LH_MIN_PERFORMANCE);
      const performanceScores = [];
      let bad = false;

      for (const [index, result] of runs.entries()) {
        const performance = Math.round(result.categories.performance.score * 100);
        const accessibility = Math.round(result.categories.accessibility.score * 100);
        const seo = Math.round(result.categories.seo.score * 100);
        const metrics = result.audits.metrics.details.items[0];
        performanceScores.push(performance);
        if (accessibility < 100 || seo < 100) bad = true;
        console.log(
          `  run ${index + 1}: performance ${performance}, accessibility ${accessibility}, seo ${seo}`,
        );
        console.log(`    FCP ${metrics.firstContentfulPaint}  LCP ${metrics.largestContentfulPaint}`);
      }

      performanceScores.sort((a, b) => a - b);
      const medianPerformance = performanceScores[Math.floor(performanceScores.length / 2)];
      console.log(`  median performance: ${medianPerformance}`);
      if (medianPerformance < performanceFloor) bad = true;
      if (bad) process.exit(2);
    ' || FAIL=1
  fi

  echo "-- pa11y $path"
  # ${arr[@]+...} guard: macOS bash 3.2 treats an empty array as unset under
  # set -u, so expanding it bare would abort the script.
  "${pa11y_cmd[@]}" ${pa11y_args[@]+"${pa11y_args[@]}"} "$BASE$path" > "$S/pa11y-$name.txt" 2>&1 \
    && echo "  0 errors" \
    || { echo "  PA11Y ERRORS:"; tail -20 "$S/pa11y-$name.txt"; FAIL=1; }
done

exit $FAIL
