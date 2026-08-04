# Hägvall Labs (hagvall-labs.com)

Marketing site for **Hägvall Labs AB**, built with [TanStack Start](https://tanstack.com/start) (React 19) and Tailwind CSS v4.

Hägvall Labs develops, licenses and sells software for information security, privacy protection and AI. First product: **Maskera**: identifies and masks personal data in text before it reaches AI systems, logs or analytics tools.

## Development

```bash
bun install
bun run dev      # http://localhost:3000
bun run build    # production build
```

Quality gates: every change must hit Lighthouse 100 for Performance, SEO and Accessibility, and pass pa11y with 0 errors: see `AGENTS.md`.

## Structure

Bilingual: Swedish (default, `/` and `/maskera`) and English (`/en`, `/en/maskera`), with hreflang and a language switcher.

- `src/routes/__root.tsx`: document shell, layout (header/footer/switcher), 404, global meta + Organization JSON-LD
- `src/components/`: shared page components with sv/en copy dicts
- `src/routes/*`: thin per-language route wrappers with meta, canonical/hreflang and JSON-LD
- `public/llms.txt`: company summary for LLM crawlers
- `public/robots.txt`, `public/sitemap.xml`: crawler config (sitemap includes hreflang alternates)

See `AGENTS.md` for conventions and the mandatory Lighthouse/pa11y quality gates.
