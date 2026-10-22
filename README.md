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
- `worker/index.ts` + `wrangler.jsonc`: the production server on Cloudflare Workers; `scripts/build-static.ts` prerenders every page as HTML and as Markdown for `Accept: text/markdown` (acceptmarkdown.com, via `scripts/html-to-markdown.ts`)
- `public/robots.txt`, `public/sitemap.xml`: crawler config (sitemap includes hreflang alternates)

## Hosting and analytics

Production runs on Cloudflare Workers with every page prerendered at build
time; the manual Deploy workflow ships a commit once its CI run has passed.
Visitor analytics is Cloudflare Web Analytics: no cookies or browser storage,
no query strings, unsampled data for 7 days and an aggregated sample for 6
months.

See `AGENTS.md` for conventions and the mandatory Lighthouse/pa11y quality gates.
