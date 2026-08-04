#!/bin/bash
# Quality gate: Lighthouse (performance/SEO/accessibility must be 100) and
# pa11y (0 errors) on every route, against the gzip prod server on :4173.
# Usage: bun run build && bun run serve:prod &  then  bash scripts/audit.sh
# Optional args: route names to audit (e.g. "audit.sh home en"), used for CI
# sharding. No args = all routes. The route list below also drives the CI
# matrix in .github/workflows/ci.yml: add new routes in both places.
set -u
S="${TMPDIR:-/tmp}/hagvall-audit"
mkdir -p "$S"
BASE="http://localhost:4173"
FAIL=0

# Lighthouse simulates a mid-tier phone by slowing the host CPU 4x, which
# over-penalizes slow CI runners (a GitHub runner scored 84 where a laptop
# scores 100 on the same build). Calibrate the multiplier from the machine's
# benchmarkIndex using Lighthouse's own guidance table, via a cheap probe run.
bun x lighthouse "$BASE/" --only-categories=seo \
  --chrome-flags="--headless=new" \
  --output=json --output-path="$S/lh-probe.json" --quiet 2>"$S/lh-probe.err" \
  || { echo "calibration probe failed:"; tail -3 "$S/lh-probe.err"; exit 1; }
BI=$(bun -e "console.log(Math.round((await Bun.file('$S/lh-probe.json').json()).environment.benchmarkIndex))")
if   [ "$BI" -ge 1300 ]; then CPU=4
elif [ "$BI" -ge 800 ];  then CPU=3
elif [ "$BI" -ge 500 ];  then CPU=2
else CPU=1; fi
echo "benchmarkIndex $BI -> cpuSlowdownMultiplier $CPU"

for entry in "home:/" "maskera:/maskera" "kontakt:/kontakt" "en:/en" "enmaskera:/en/maskera" "encontact:/en/contact"; do
  name="${entry%%:*}"
  path="${entry#*:}"
  if [ $# -gt 0 ]; then
    case " $* " in *" $name "*) ;; *) continue ;; esac
  fi
  echo "== $path"
  bun x lighthouse "$BASE$path" \
    --only-categories=performance,seo,accessibility \
    --throttling.cpuSlowdownMultiplier="$CPU" \
    --chrome-flags="--headless=new" \
    --output=json --output-path="$S/lh-$name.json" --quiet 2>"$S/lh-$name.err" \
    || { echo "  LIGHTHOUSE FAILED:"; tail -3 "$S/lh-$name.err"; FAIL=1; continue; }
  bun -e "
    const r = await Bun.file('$S/lh-$name.json').json();
    const m = r.audits.metrics.details.items[0];
    let bad = false;
    for (const [k, v] of Object.entries(r.categories)) {
      const s = Math.round(v.score * 100);
      if (s < 100) bad = true;
      console.log('  ' + k + ': ' + s);
    }
    console.log('  FCP ' + m.firstContentfulPaint + '  LCP ' + m.largestContentfulPaint);
    if (bad) process.exit(2);
  " || FAIL=1

  echo "-- pa11y $path"
  bun x pa11y "$BASE$path" > "$S/pa11y-$name.txt" 2>&1 \
    && echo "  0 errors" \
    || { echo "  PA11Y ERRORS:"; tail -20 "$S/pa11y-$name.txt"; FAIL=1; }
done

exit $FAIL
