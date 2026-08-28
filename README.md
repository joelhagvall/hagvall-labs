# Hägvall Labs (hagvall-labs.com)

Marketing site for **Hägvall Labs AB**, built with [TanStack Start](https://tanstack.com/start) (React 19) and Tailwind CSS v4.

Hägvall Labs develops, licenses and sells software for information security, privacy protection and AI. First product: **Maskera**: identifies and masks personal data in text before it reaches AI systems, logs or analytics tools.

## Development

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
```

Quality gates: every change must hit Lighthouse Performance 95+, SEO 100 and Accessibility 100, and pass pa11y with 0 errors: see `AGENTS.md`. `scripts/agent-checks.sh` covers the agent-readiness behaviour of the production server (Markdown content negotiation, real 404s, trust-anchor aliases).

On the production VM, run the same gates in the pinned Bun + Chrome audit
container. The image is cached after the first build:

```bash
bash scripts/audit-container.sh
bash scripts/audit-container.sh home en  # optional route filter
```

## Structure

Bilingual: Swedish (default, `/` and `/maskera`) and English (`/en`, `/en/maskera`), with hreflang and a language switcher.

- `src/routes/__root.tsx`: document shell, layout (header/footer/switcher), 404, global meta + Organization JSON-LD
- `src/components/`: shared page components with sv/en copy dicts
- `src/routes/*`: thin per-language route wrappers with meta, canonical/hreflang and JSON-LD
- `public/llms.txt`: company summary for LLM crawlers
- `scripts/serve-prod.ts` + `scripts/html-to-markdown.ts`: the production server; every page also serves Markdown for `Accept: text/markdown` (acceptmarkdown.com)
- `public/robots.txt`, `public/sitemap.xml`: crawler config (sitemap includes hreflang alternates)

## Analytics

Production runs self-hosted Umami 3.2.0 with a private PostgreSQL database.
The tracker is served same-origin from `/analytics/script.js`, so collection
does not depend on the dashboard hostname. Query strings and URL hashes are
excluded, Do Not Track is respected, and replay, heatmaps and identified users
stay disabled. A daily cron job at 03:17 UTC deletes live analytics data after
90 days, creates an access-controlled PostgreSQL backup and removes backups
after 7 days. The separate IP-masked Caddy operational log retains data for
30 days.

Useful production commands:

```bash
docker compose ps umami umami-db
docker compose --profile bootstrap run --rm --no-deps umami-bootstrap
bash scripts/umami-backup.sh
bash scripts/umami-maintenance.sh
crontab -l
bash scripts/analytics.sh  # low-level masked access-log stats
```

See `AGENTS.md` for conventions and the mandatory Lighthouse/pa11y quality gates.
