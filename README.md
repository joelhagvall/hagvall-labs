# Hägvall Labs — hagvall-labs.com

Marketing site for **Hägvall Labs AB**, built with [TanStack Start](https://tanstack.com/start) (React 19) and Tailwind CSS v4.

Hägvall Labs develops, licenses and sells software for information security, privacy protection and AI. First product: **Maskera** — identifies and masks personal data in text before it reaches AI systems, logs or analytics tools.

## Development

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
```

Quality gates: every change must hit Lighthouse 100 for Performance, SEO and Accessibility, and pass pa11y with 0 errors — see `AGENTS.md`.

## Structure

- `src/routes/__root.tsx` — document shell, layout (header/footer), global SEO meta + Organization JSON-LD
- `src/routes/index.tsx` — home page
- `src/routes/maskera.tsx` — Maskera product page (own meta + SoftwareApplication JSON-LD)
- `public/llms.txt` — company summary for LLM crawlers
- `public/robots.txt`, `public/sitemap.xml` — crawler config

## Note

The domain `hagvall-labs.com` and email `hello@hagvall-labs.com` are placeholders used in meta tags, JSON-LD, `llms.txt`, `robots.txt` and `sitemap.xml` — update them if the real domain differs.
