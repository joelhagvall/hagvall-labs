#!/usr/bin/env bash
# Tells IndexNow (Bing, Yandex, Seznam, Naver; Bing also feeds Copilot and
# ChatGPT search) that every page in the live sitemap may have changed. Run
# by the Deploy workflow after a release is live; safe to run by hand.
#
#   bash scripts/indexnow.sh [https://hagvall-labs.com]
#
# The key is public by design: IndexNow verifies ownership by fetching
# /<key>.txt from the site, which lives in public/.
set -euo pipefail

site="${1:-https://hagvall-labs.com}"
site="${site%/}"
key="fe557c9b5cddc7d0d25d294380965b92"
host="${site#https://}"

urls="$(curl -fsS "$site/sitemap.xml" | grep -o '<loc>[^<]*</loc>' | sed -e 's/<loc>//' -e 's/<\/loc>//')"
if [[ -z $urls ]]; then
  echo "no URLs found in $site/sitemap.xml" >&2
  exit 1
fi

body="$(jq -n \
  --arg host "$host" \
  --arg key "$key" \
  --arg keyLocation "$site/$key.txt" \
  --arg urls "$urls" \
  '{host: $host, key: $key, keyLocation: $keyLocation, urlList: ($urls | split("\n"))}')"

# 200 (accepted) and 202 (accepted, key validation pending) are both fine.
status="$(curl -sS -o /dev/null -w '%{http_code}' \
  -X POST 'https://api.indexnow.org/indexnow' \
  -H 'content-type: application/json; charset=utf-8' \
  --data "$body")"
echo "IndexNow: $(wc -l <<<"$urls" | tr -d ' ') URLs, HTTP $status"
[[ $status == 200 || $status == 202 ]]
