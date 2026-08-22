#!/bin/bash
# Agent-readiness gate for the production server (scripts/serve-prod.ts):
# Markdown content negotiation per acceptmarkdown.com (Accept: text/markdown
# gets text/markdown with Vary: Accept, q=0 is honored, unsatisfiable Accept
# gets 406), real 404s with a recoverable body, the English trust-anchor
# aliases, and the contactPoint in the Organization JSON-LD.
# Usage: bun run build && bun run serve:prod &  then  bash scripts/agent-checks.sh
set -u
BASE="${BASE:-http://localhost:4173}"
FAIL=0

pass() { echo "  ok   $1"; }
fail() { echo "  FAIL $1"; FAIL=1; }

# status_of <path> [curl args...]
status_of() { curl -s -o /dev/null -w '%{http_code}' "$@"; }
# header_of <name> <path> [curl args...]
header_of() {
  local name="$1"; shift
  curl -s -D - -o /dev/null "$@" | tr -d '\r' | awk -v n="$name" 'tolower($1)==tolower(n)":" {sub(/^[^:]*: */, ""); print}'
}

for path in / /en /maskera /kontakt /integritet /en/privacy; do
  echo "== $path"
  ct=$(header_of content-type "$BASE$path" -H 'Accept: text/markdown')
  vary=$(header_of vary "$BASE$path" -H 'Accept: text/markdown')
  body=$(curl -s -H 'Accept: text/markdown' "$BASE$path")
  case "$ct" in text/markdown*) pass "Accept: text/markdown -> $ct" ;; *) fail "Accept: text/markdown -> '$ct'" ;; esac
  case "$vary" in *Accept*) pass "Vary: $vary" ;; *) fail "Vary missing Accept (got '$vary')" ;; esac
  case "$body" in *'# '*) pass "markdown body has a heading" ;; *) fail "markdown body has no heading" ;; esac
  [ "${#body}" -ge 500 ] && pass "markdown body ${#body} chars" || fail "markdown body only ${#body} chars"

  ct=$(header_of content-type "$BASE$path" -H 'Accept: text/html')
  vary=$(header_of vary "$BASE$path" -H 'Accept: text/html')
  case "$ct" in text/html*) pass "Accept: text/html -> $ct" ;; *) fail "Accept: text/html -> '$ct'" ;; esac
  case "$vary" in *Accept*) pass "HTML Vary: $vary" ;; *) fail "HTML Vary missing Accept (got '$vary')" ;; esac
done

echo "== Accept edge cases on /"
ct=$(header_of content-type "$BASE/" -H 'Accept: text/markdown, text/html;q=0.8')
case "$ct" in text/markdown*) pass "q-values: markdown preferred -> markdown" ;; *) fail "q-values: expected markdown, got '$ct'" ;; esac
ct=$(header_of content-type "$BASE/" -H 'Accept: text/markdown;q=0, text/html')
case "$ct" in text/html*) pass "text/markdown;q=0 -> html" ;; *) fail "text/markdown;q=0 -> '$ct'" ;; esac
ct=$(header_of content-type "$BASE/" -H 'Accept: */*')
case "$ct" in text/html*) pass "*/* -> html (default)" ;; *) fail "*/* -> '$ct'" ;; esac
ct=$(header_of content-type "$BASE/" -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8')
case "$ct" in text/html*) pass "browser Accept -> html" ;; *) fail "browser Accept -> '$ct'" ;; esac
code=$(status_of "$BASE/" -H 'Accept: application/json')
[ "$code" = 406 ] && pass "Accept: application/json -> 406" || fail "Accept: application/json -> $code (want 406)"
code=$(status_of "$BASE/" -H 'Accept:')
[ "$code" = 200 ] && pass "no Accept header -> 200" || fail "no Accept header -> $code"

echo "== 404"
for path in /this-path-does-not-exist /en/this-path-does-not-exist; do
  code=$(status_of "$BASE$path")
  [ "$code" = 404 ] && pass "$path -> 404" || fail "$path -> $code (want 404)"
  code=$(status_of "$BASE$path" -H 'Accept: text/markdown')
  ct=$(header_of content-type "$BASE$path" -H 'Accept: text/markdown')
  body=$(curl -s -H 'Accept: text/markdown' "$BASE$path")
  [ "$code" = 404 ] && pass "markdown $path -> 404" || fail "markdown $path -> $code (want 404)"
  case "$ct" in text/markdown*) pass "markdown 404 content-type" ;; *) fail "markdown 404 content-type '$ct'" ;; esac
  case "$body" in *sitemap.xml*llms.txt*) pass "404 body points at sitemap.xml and llms.txt" ;; *) fail "404 body lacks sitemap/llms.txt links" ;; esac
  html=$(curl -s "$BASE$path")
  case "$html" in *'href="/sitemap.xml"'*'href="/llms.txt"'*) pass "HTML 404 links sitemap.xml and llms.txt" ;; *) fail "HTML 404 lacks sitemap/llms.txt links" ;; esac
done

echo "== trust-anchor aliases"
for entry in "/about:/en" "/contact:/en/contact" "/privacy:/en/privacy"; do
  path="${entry%%:*}"; target="${entry#*:}"
  code=$(status_of "$BASE$path")
  loc=$(header_of location "$BASE$path")
  [ "$code" = 301 ] && [ "$loc" = "$target" ] && pass "$path -> 301 $loc" || fail "$path -> $code $loc (want 301 $target)"
  final=$(curl -sL -o /dev/null -w '%{http_code}' "$BASE$path")
  [ "$final" = 200 ] && pass "$path follows to 200" || fail "$path follows to $final"
done

echo "== Organization JSON-LD"
home=$(curl -s "$BASE/")
case "$home" in *'"@type":"ContactPoint"'*'"contactType"'*) pass "contactPoint present" ;; *) fail "contactPoint missing" ;; esac
case "$home" in *'"@type":"PostalAddress"'*) pass "PostalAddress present" ;; *) fail "PostalAddress missing" ;; esac

echo "== static files"
ct=$(header_of content-type "$BASE/llms.txt")
code=$(status_of "$BASE/llms.txt")
[ "$code" = 200 ] && pass "/llms.txt -> 200 ($ct)" || fail "/llms.txt -> $code"
code=$(status_of "$BASE/sitemap.xml")
[ "$code" = 200 ] && pass "/sitemap.xml -> 200" || fail "/sitemap.xml -> $code"

exit $FAIL
