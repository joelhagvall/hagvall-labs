<!-- intent-skills:start -->
# TanStack Intent - before editing files, run the matching guidance command.
tanstackIntent:
  - id: "@tanstack/devtools#devtools-app-setup"
    run: "npx @tanstack/intent@latest load @tanstack/devtools#devtools-app-setup"
    for: "Install TanStack Devtools, pick framework adapter (React/Vue/Solid/Preact), register plugins via plugins prop, configure shell (position, hotkeys, theme, hideUntilHover, requireUrlFlag, eventBusConfig). TanStackDevtools component, defaultOpen, localStorage persistence."
  - id: "@tanstack/devtools#devtools-marketplace"
    run: "npx @tanstack/intent@latest load @tanstack/devtools#devtools-marketplace"
    for: "Publish plugin to npm and submit to TanStack Devtools Marketplace. PluginMetadata registry format, plugin-registry.ts, pluginImport (importName, type), requires (packageName, minVersion), framework tagging, multi-framework submissions, featured plugins."
  - id: "@tanstack/devtools#devtools-plugin-panel"
    run: "npx @tanstack/intent@latest load @tanstack/devtools#devtools-plugin-panel"
    for: "Build devtools panel components that display emitted event data. Listen via EventClient.on(), handle theme (light/dark), use @tanstack/devtools-ui components. Plugin registration (name, render, id, defaultOpen), lifecycle (mount, activate, destroy), max 3 active plugins. Two paths: Solid.js core with devtools-ui for multi-framework support, or framework-specific panels."
  - id: "@tanstack/devtools#devtools-production"
    run: "npx @tanstack/intent@latest load @tanstack/devtools#devtools-production"
    for: "Handle devtools in production vs development. removeDevtoolsOnBuild, devDependency vs regular dependency, conditional imports, NoOp plugin variants for tree-shaking, non-Vite production exclusion patterns."
  - id: "@tanstack/devtools-event-client#devtools-bidirectional"
    run: "npx @tanstack/intent@latest load @tanstack/devtools-event-client#devtools-bidirectional"
    for: "Two-way event patterns between devtools panel and application. App-to-devtools observation, devtools-to-app commands, time-travel debugging with snapshots and revert. structuredClone for snapshot safety, distinct event suffixes for observation vs commands, serializable payloads only."
  - id: "@tanstack/devtools-event-client#devtools-event-client"
    run: "npx @tanstack/intent@latest load @tanstack/devtools-event-client#devtools-event-client"
    for: "Create typed EventClient for a library. Define event maps with typed payloads, pluginId auto-prepend namespacing, emit()/on()/onAll()/onAllPluginEvents() API. Connection lifecycle (5 retries, 300ms), event queuing, enabled/disabled state, SSR fallbacks, singleton pattern. Unique pluginId requirement to avoid event collisions."
  - id: "@tanstack/devtools-event-client#devtools-instrumentation"
    run: "npx @tanstack/intent@latest load @tanstack/devtools-event-client#devtools-instrumentation"
    for: "Analyze library codebase for critical architecture and debugging points, add strategic event emissions. Identify middleware boundaries, state transitions, lifecycle hooks. Consolidate events (1 not 15), debounce high-frequency updates, DRY shared payload fields, guard emit() for production. Transparent server/client event bridging."
  - id: "@tanstack/devtools-vite#devtools-vite-plugin"
    run: "npx @tanstack/intent@latest load @tanstack/devtools-vite#devtools-vite-plugin"
    for: "Configure @tanstack/devtools-vite for source inspection (data-tsd-source, inspectHotkey, ignore patterns), console piping (client-to-server, server-to-client, levels), enhanced logging, server event bus (port, host, HTTPS), production stripping (removeDevtoolsOnBuild), editor integration (launch-editor, custom editor.open). Must be FIRST plugin in Vite config. Vite ^6 || ^7 only."
  - id: "@tanstack/react-start#lifecycle/migrate-from-nextjs"
    run: "npx @tanstack/intent@latest load @tanstack/react-start#lifecycle/migrate-from-nextjs"
    for: "Step-by-step migration from Next.js App Router to TanStack Start: route definition conversion, API mapping, server function conversion from Server Actions, middleware conversion, data fetching pattern changes."
  - id: "@tanstack/react-start#react-start"
    run: "npx @tanstack/intent@latest load @tanstack/react-start#react-start"
    for: "React bindings for TanStack Start: createStart, StartClient, StartServer, React-specific imports, re-exports from @tanstack/react-router, full project setup with React, useServerFn hook."
  - id: "@tanstack/react-start#react-start/server-components"
    run: "npx @tanstack/intent@latest load @tanstack/react-start#react-start/server-components"
    for: "Implement, review, debug, and refactor TanStack Start React Server Components in React 19 apps. Use when tasks mention @tanstack/react-start/rsc, renderServerComponent, createCompositeComponent, CompositeComponent, renderToReadableStream, createFromReadableStream, createFromFetch, Composite Components, React Flight streams, loader or query owned RSC caching, router.invalidate, structuralSharing: false, selective SSR, stale names like renderRsc or .validator, or migration from Next App Router RSC patterns. Do not use for generic SSR or non-TanStack RSC frameworks except brief comparison."
  - id: "@tanstack/router-core#router-core"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core"
    for: "Framework-agnostic core concepts for TanStack Router: route trees, createRouter, createRoute, createRootRoute, createRootRouteWithContext, addChildren, Register type declaration, route matching, route sorting, file naming conventions. Entry point for all router skills."
  - id: "@tanstack/router-core#router-core/auth-and-guards"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/auth-and-guards"
    for: "Route protection with beforeLoad, redirect()/throw redirect(), isRedirect helper, authenticated layout routes (_authenticated), non-redirect auth (inline login), RBAC with roles and permissions, auth provider integration (Auth0, Clerk, Supabase), router context for auth state."
  - id: "@tanstack/router-core#router-core/code-splitting"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/code-splitting"
    for: "Automatic code splitting (autoCodeSplitting), .lazy.tsx convention, createLazyFileRoute, createLazyRoute, lazyRouteComponent, getRouteApi for typed hooks in split files, codeSplitGroupings per-route override, splitBehavior programmatic config, critical vs non-critical properties."
  - id: "@tanstack/router-core#router-core/data-loading"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/data-loading"
    for: "Route loader option, loaderDeps for cache keys, staleTime/gcTime/ defaultPreloadStaleTime SWR caching, pendingComponent/pendingMs/ pendingMinMs, errorComponent/onError/onCatch, beforeLoad, router context and createRootRouteWithContext DI pattern, router.invalidate, Await component, deferred data loading with unawaited promises."
  - id: "@tanstack/router-core#router-core/navigation"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/navigation"
    for: "Link component, useNavigate, Navigate component, router.navigate, ToOptions/NavigateOptions/LinkOptions, from/to relative navigation, activeOptions/activeProps, preloading (intent/viewport/render), preloadDelay, navigation blocking (useBlocker, Block), createLink, linkOptions helper, scroll restoration, MatchRoute."
  - id: "@tanstack/router-core#router-core/not-found-and-errors"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/not-found-and-errors"
    for: "notFound() function, notFoundComponent, defaultNotFoundComponent, notFoundMode (fuzzy/root), errorComponent, CatchBoundary, CatchNotFound, isNotFound, NotFoundRoute (deprecated), route masking (mask option, createRouteMask, unmaskOnReload)."
  - id: "@tanstack/router-core#router-core/path-params"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/path-params"
    for: "Dynamic path segments ($paramName), splat routes ($ / _splat), optional params ({-$paramName}), prefix/suffix patterns ({$param}.ext), useParams, params.parse/stringify, pathParamsAllowedCharacters, i18n locale patterns."
  - id: "@tanstack/router-core#router-core/search-params"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/search-params"
    for: "validateSearch, search param validation with Zod/Valibot/ArkType adapters, fallback(), search middlewares (retainSearchParams, stripSearchParams), custom serialization (parseSearch, stringifySearch), search param inheritance, loaderDeps for cache keys, reading and writing search params."
  - id: "@tanstack/router-core#router-core/ssr"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/ssr"
    for: "Non-streaming and streaming SSR, RouterClient/RouterServer, renderRouterToString/renderRouterToStream, createRequestHandler, defaultRenderHandler/defaultStreamHandler, HeadContent/Scripts components, head route option (meta/links/styles/scripts), ScriptOnce, automatic loader dehydration/hydration, memory history on server, data serialization, document head management."
  - id: "@tanstack/router-core#router-core/type-safety"
    run: "npx @tanstack/intent@latest load @tanstack/router-core#router-core/type-safety"
    for: "Full type inference philosophy (never cast, never annotate inferred values), Register module declaration, from narrowing on hooks and Link, strict:false for shared components, getRouteApi for code-split typed access, addChildren with object syntax for TS perf, LinkProps and ValidateLinkOptions type utilities, as const satisfies pattern."
  - id: "@tanstack/router-plugin#router-plugin"
    run: "npx @tanstack/intent@latest load @tanstack/router-plugin#router-plugin"
    for: "TanStack Router bundler plugin for route generation and automatic code splitting. Supports Vite, Webpack, Rspack, and esbuild. Configures autoCodeSplitting, routesDirectory, target framework, and code split groupings."
  - id: "@tanstack/start-client-core#start-core"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core"
    for: "Core overview for TanStack Start: tanstackStart() Vite plugin, getRouter() factory, root route document shell (HeadContent, Scripts, Outlet), client/server entry points, routeTree.gen.ts, tsconfig configuration. Entry point for all Start skills."
  - id: "@tanstack/start-client-core#start-core/auth-server-primitives"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/auth-server-primitives"
    for: "Server-side authentication primitives for TanStack Start: session cookies (HttpOnly, Secure, SameSite, __Host- prefix), session read/issue/destroy via createServerFn and middleware, OAuth authorization-code flow with state and PKCE, password-reset enumeration defense, CSRF for non-GET RPCs, rate limiting auth endpoints, session rotation on privilege change. Pairs with router-core/auth-and-guards for the routing side."
  - id: "@tanstack/start-client-core#start-core/deployment"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/deployment"
    for: "Deploy to Cloudflare Workers, Netlify, Vercel, Node.js/Docker, Bun, Railway. Selective SSR (ssr option per route), SPA mode, static prerendering, ISR with Cache-Control headers, SEO and head management."
  - id: "@tanstack/start-client-core#start-core/execution-model"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/execution-model"
    for: "Isomorphic-by-default principle, environment boundary functions (createServerFn, createServerOnlyFn, createClientOnlyFn, createIsomorphicFn), ClientOnly component, useHydrated hook, import protection, dead code elimination, environment variable safety (VITE_ prefix, process.env)."
  - id: "@tanstack/start-client-core#start-core/middleware"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/middleware"
    for: "createMiddleware, request middleware (.server only), server function middleware (.client + .server), context passing via next({ context }), sendContext for client-server transfer, global middleware via createStart in src/start.ts, middleware factories, method order enforcement, fetch override precedence."
  - id: "@tanstack/start-client-core#start-core/server-functions"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/server-functions"
    for: "createServerFn (GET/POST), validator (Zod or function), useServerFn hook, server context utilities (getRequest, getRequestHeader, setResponseHeader, setResponseStatus), error handling (throw errors, redirect, notFound), streaming, FormData handling, file organization (.functions.ts, .server.ts)."
  - id: "@tanstack/start-client-core#start-core/server-routes"
    run: "npx @tanstack/intent@latest load @tanstack/start-client-core#start-core/server-routes"
    for: "Server-side API endpoints using the server property on createFileRoute, HTTP method handlers (GET, POST, PUT, DELETE), createHandlers for per-handler middleware, handler context (request, params, context), request body parsing, response helpers, file naming for API routes."
  - id: "@tanstack/start-server-core#start-server-core"
    run: "npx @tanstack/intent@latest load @tanstack/start-server-core#start-server-core"
    for: "Server-side runtime for TanStack Start: createStartHandler, request/response utilities (getRequest, setResponseHeader, setCookie, getCookie, useSession), three-phase request handling, AsyncLocalStorage context."
  - id: "@tanstack/virtual-file-routes#virtual-file-routes"
    run: "npx @tanstack/intent@latest load @tanstack/virtual-file-routes#virtual-file-routes"
    for: "Programmatic route tree building as an alternative to filesystem conventions: rootRoute, index, route, layout, physical, defineVirtualSubtreeConfig. Use with TanStack Router plugin's virtualRouteConfig option."
<!-- intent-skills:end -->

# Hägvall Labs: project guidance

Marketing site for Hägvall Labs AB (hagvall-labs.com), built with TanStack Start + React 19 + Tailwind CSS v4.

## Package manager

This project uses **bun**, never npm, yarn or pnpm.

```bash
bun install
bun run dev        # dev server on http://localhost:3000
bun run build      # production build
bun run generate-routes
```

## Quality gates (SUPER IMPORTANT: run before every commit)

After ANY change to pages, styles, meta tags or layout, you MUST verify with Lighthouse CLI and pa11y against the running site. Non-negotiable targets:

- **Lighthouse Performance: at least 95**
- **Lighthouse SEO: 100**
- **Lighthouse Accessibility: 100**
- **pa11y: 0 errors** on every route

Always audit the **production build served with gzip**: NOT the dev server. The dev server fails the targets for reasons that don't exist in production (the TanStack Devtools overlay triggers pa11y errors, and uncompressed responses drag Performance to ~90):

```bash
bun run build
bun run serve:prod &   # serves dist/ with gzip on http://localhost:4173 (scripts/serve-prod.ts)
bash scripts/audit.sh  # Lighthouse + pa11y on every route; exits non-zero on any failure
```

`scripts/audit.sh` holds the route list: add any new route to it, AND to the `route:` matrix in `.github/workflows/ci.yml` (CI runs the same gates on Node 24 + bun, sharded one route per job; `audit.sh <name>` filters to those routes). If Performance is below 95, SEO or Accessibility is below 100, or pa11y reports errors, fix the issues and re-run until clean.

Known pitfalls that break the 100s (learned the hard way: don't reintroduce):

- **Duplicate canonical tags fail Lighthouse SEO.** Canonical links live in each route's `head`, never in `__root.tsx` (route heads merge with the root, producing conflicting canonicals).
- **A render-blocking stylesheet costs ~8 Performance points.** The Tailwind CSS is inlined in `<head>` in production (`styles.css?inline` in `__root.tsx`); dev uses a normal `?url` stylesheet link for HMR. Keep it that way.
- **Any above-fold image request costs ~1 Performance point.** Lighthouse's simulated (lantern) LCP pessimistically adds a network round-trip for image requests near the LCP paint, even when the LCP element is text. That is why the logo is an inline SVG component (`src/components/BrandSymbol.tsx`, not `<img>`) and the favicon is a data URI in `__root.tsx`. Real `<img>` content is fine below the fold with `loading="lazy"`.
- **The same RTT penalty applies to an extra JS chunk near the paint.** A module shared only by two page components (icons, the MaskingDemo) gets split into its own chunk and requested after the page chunk: that alone drops Performance to 99. Shared code goes in a module that `__root.tsx` statically imports (`ui.tsx`, `seo.ts`): it is bundled into the always-loaded root chunk, so pages reference it without an extra request. Heavy page-specific pieces (MaskPreview, the icons) stay duplicated per page instead, so they do not bloat the root chunk.
- **Large `blur()` filters cost first-paint time.** The hero glows are radial-gradient divs (`glow-cobalt`/`glow-teal` in `styles.css`), not `blur-3xl` elements.
- The devtools overlay must stay wrapped in `import.meta.env.DEV` in `__root.tsx`.

## Site structure

The site is bilingual: **Swedish is the default** (`/`, `/maskera`), English lives under `/en` (`/en`, `/en/maskera`).

- `src/routes/__root.tsx`: document shell (dynamic `<html lang>`), header/footer with language switcher, 404 page, global meta + Organization JSON-LD
- `src/components/HomePage.tsx`, `MaskeraPage.tsx`: shared page components with a `sv`/`en` copy dict; ALL page copy lives here, edit both languages together. The masking preview (MaskPreview: tinted source highlights + placeholder pills, ported one-to-one from maskera-cloud's `lib/labels.ts` and HeroMaskPreview, including its label colors and the "Anna Lindqvist" example) and the icons are intentionally duplicated inline in each page: a module shared by two page chunks gets split into its own chunk, and that extra request costs a Performance point (see pitfalls). The staggered pill entrance is scroll-triggered: an IntersectionObserver adds `mask-in` when the card is 25% visible (pills stay `opacity-0` below the fold; SSR/no-JS renders the final state). The icons are custom solid SVGs in the brand's folded geometry (isometric faces shaded with `fillOpacity`, no icon library)
- `src/components/ui.tsx`: shared class recipes (buttons with explicit transition properties and transforms disabled under reduced motion, inline links, the section `container`) and the small shared components `HeroGlows` (hero background) and `Cards` (icon/number card grids). Statically imported by `__root.tsx`, so it lives in the always-loaded root chunk and never costs a separate request; keep it small
- `src/seo.ts`: `pagePaths` (the sv/en URL map; every internal link, the language switcher and the head links read from it), `pageHead()` (per-route title, description, OG tags, canonical + full hreflang set, optional JSON-LD) and the JSON-LD builders shared by both language variants
- `src/routes/index.tsx`, `maskera.tsx`, `en/index.tsx`, `en/maskera.tsx`: thin route wrappers, each just `pageHead()` with per-language strings plus the page component
- `public/llms.txt`: company summary for LLM crawlers; keep in sync when company/product copy changes
- `public/robots.txt`, `public/sitemap.xml`: sitemap carries hreflang alternates; add new routes (both languages) here and in llms.txt

## Design (ALWAYS follow Vercel's Web Interface Guidelines)

All UI work MUST comply with Vercel's Web Interface Guidelines. Fetch the latest ruleset before any UI change and review your changes against it (the `web-design-guidelines` skill does this):

- Source: https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
- Repo: https://github.com/vercel-labs/web-interface-guidelines

Rules already applied here: keep them intact: skip link ("Hoppa till innehållet"/"Skip to Content") targeting `#main`; global `:focus-visible` outline and `touch-action: manipulation` in `styles.css`; `theme-color` meta; explicit `width`/`height` on every `<img>` (`alt=""` on decorative ones); `translate="no"` on brand names; curly apostrophes (’) and `text-balance`/`text-pretty` on headings/paragraphs; Title Case for English headings and buttons (Swedish keeps sentence case); visible `hover:` states on all interactive elements.

### Brand

`public/brand/` holds only what the site references: `hagvall-labs-symbol.svg` (the JSON-LD logo) and `og-image.png`. The symbol geometry lives as `BRAND_PATHS`/`BRAND_VIEWBOX` in `src/components/BrandSymbol.tsx`: both the rendered component and the data-URI favicon in `__root.tsx` are built from it, so the only copy outside code is the public SVG (regenerate it if the paths change). The wordmark is letterspaced uppercase Avenir Next Medium, "HÄGVALL" in ink and "LABS" in cobalt; the site header renders it as system-font text (`uppercase tracking-[0.12em] font-medium` in `__root.tsx`) and the OG image carries the same treatment. There are no standalone logo lockup files; if one is needed, outline the wordmark from Avenir Next Medium (0.15em tracking) next to the symbol paths. Social cards use `public/brand/og-image.png` (1200x630, symbol + wordmark + tagline, referenced in `__root.tsx` with `summary_large_image`); regenerate it if the brand changes. Brand colors are Tailwind theme tokens in `src/styles.css`: `cobalt` #1748d4 (primary/CTAs), `cobalt-deep` (hover), `teal-brand` #14b8a6 (decorative only: insufficient contrast for white text; use `teal-deep` #0f766e behind white text), `ink` #20272d (text).

## Conventions

- **Security headers live in the origin server** (`scripts/serve-prod.ts`, which is also the production server in the Dockerfile): CSP, HSTS, nosniff, frame-ancestors, Referrer-Policy, Permissions-Policy, COOP/CORP. Keep them there so local audits cover them and they never depend on the edge Caddy config. Static file resolution must stay confined to `dist/client` (see `staticFilePath`: encoded `../` traversal returns 404).
- **NO EM-DASHES (—), EVER.** Forbidden in all copy, meta tags, docs and code comments. Rewrite with a comma, colon or period instead; page titles use `|` as separator. Grep for `—` before committing.
- **First-person copy**: Hägvall Labs AB is a one-person company (Joel Hägvall, joelhagvall.com); write "I", never "we", in both languages. Write like Joel talks: direct, plain, personal. No corporate stiffness ("enmansbolag", "utvecklar, licensierar och säljer") in visible copy.
- **Client-side navigation only**: use TanStack Router `Link` for every internal link (including the SV/EN switcher) so navigation never causes a full-page flash; plain `<a>` is only for external links and mailto
- Maskera links out to its product site **maskera.dev**
- Keep the design minimal: white background, ink text, cobalt accents, generous whitespace
- **Animations are CSS-only and compositor-safe** (transform/opacity), defined in `styles.css` and always gated behind `prefers-reduced-motion: no-preference`. `.reveal` is a scroll-driven entrance (`animation-timeline: view()` behind `@supports`, so unsupported browsers render statically). Never animate the hero headline/body: the LCP paint must not wait on an animation. Decorative SVG animation (`brand-path` in `BrandSymbol`, `glow` blobs) is fine since SVG/divs are not LCP candidates
- Every new page needs: sv + en variants, an entry in `pagePaths` in `src/seo.ts`, a `pageHead()` call per language (gives meta title + description, OG tags and the canonical + full hreflang set), entries in `sitemap.xml` and `llms.txt`
- **Analytics is server-side only.** The footer promises "no cookies, no tracking" and that must stay literally true: no client-side analytics scripts, ever, without revisiting the footer copy, the CSP and the Lighthouse gates. Visitor stats come from the edge Caddy access log (the `log` directive in `deploy/caddy.hagvall-labs.caddy`: IPs truncated before hitting disk, cookie/auth headers never written, 30 day retention), read with `scripts/analytics.sh` (GoAccess in docker) on the VM. The Caddy container must bind-mount `/var/log/caddy` to the host.
- Contact email is `work@joelhagvall.com` for now (temporary until `hello@hagvall-labs.com` is live). In code it lives ONLY in `contactEmail` in `src/seo.ts` (ContactPage, the footer and JSON-LD in `__root.tsx` and both contact route descriptions read it from there); `llms.txt` carries it as prose. Switch the constant and llms.txt together.

## TypeScript diagnostics

- Treat Cursor/tsserver diagnostics as real work and reproduce them from the terminal with the narrowest project-provided command.
- Relevant TypeScript diagnostics pass, especially for files touched in Cursor.
- In this repo the whole project is small and must stay at zero errors, so the narrowest command is simply `bun x tsc --noEmit`. Run it after every touched TS/TSX file; do not commit with diagnostics outstanding.

## Commits

- Never write `Co-Authored-By: Anthropic` (or any other co-author/attribution trailer) in commit messages. Not one line, not ever.
