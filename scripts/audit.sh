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

for entry in "home:/" "maskera:/maskera" "kontakt:/kontakt" "en:/en" "enmaskera:/en/maskera" "encontact:/en/contact"; do
  name="${entry%%:*}"
  path="${entry#*:}"
  if [ $# -gt 0 ]; then
    case " $* " in *" $name "*) ;; *) continue ;; esac
  fi
  echo "== $path"
  bun x lighthouse "$BASE$path" \
    --only-categories=performance,seo,accessibility \
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
