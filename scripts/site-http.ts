// HTTP behaviour of the production server, shared by the Cloudflare Worker
// (worker/index.ts) and the prerender step (scripts/build-static.ts):
// security headers, redirects, Markdown content negotiation and the
// hydration priority rewrite. Plain web APIs only, so it runs on Bun and on
// workerd alike.

// script-src/style-src need 'unsafe-inline': TanStack Start hydrates with
// inline scripts and the production CSS is an inline <style> tag. The
// Cloudflare Web Analytics beacon loads from static.cloudflareinsights.com
// and reports to cloudflareinsights.com (see __root.tsx).
export const securityHeaders: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://cloudflareinsights.com; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
}

export function withSecurityHeaders(headers: Headers): Headers {
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value)
  }
  return headers
}

// Appends a field name to the Vary header without duplicating it.
export function addVary(headers: Headers, field: string) {
  const current = headers.get('vary')
  if (!current) {
    headers.set('vary', field)
    return
  }
  const fields = current.split(',').map((f) => f.trim().toLowerCase())
  if (fields.includes('*') || fields.includes(field.toLowerCase())) return
  headers.set('vary', `${current}, ${field}`)
}

// Content negotiation (acceptmarkdown.com): every page URL serves HTML by
// default and Markdown when the Accept header prefers text/markdown, with
// Vary: Accept so caches keep the two representations apart. An Accept
// header that rules out both (q=0, or only types we do not produce) gets a
// 406 listing what is available instead of the framework's 500.
export type Representation = 'html' | 'markdown'
const representations: Array<[Representation, string]> = [
  ['html', 'text/html'],
  ['markdown', 'text/markdown'],
]

type AcceptEntry = { type: string; subtype: string; q: number; index: number }

function parseAccept(accept: string): AcceptEntry[] {
  return accept
    .split(',')
    .map((part, index): AcceptEntry | null => {
      const [media, ...params] = part.trim().split(';')
      if (!media) return null
      const [type = '*', subtype = '*'] = media.trim().toLowerCase().split('/')
      let q = 1
      for (const param of params) {
        const [key, value] = param.split('=').map((s) => s.trim().toLowerCase())
        if (key === 'q') {
          const parsed = Number(value)
          q = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : 0
        }
      }
      return { type, subtype: subtype === '' ? '*' : subtype, q, index }
    })
    .filter((e): e is AcceptEntry => e !== null)
}

/** Picks the representation to serve, or null when nothing acceptable
    (406). Missing or empty Accept means no preference: HTML. */
export function negotiate(accept: string | null): Representation | null {
  if (accept === null || accept.trim() === '') return 'html'
  const entries = parseAccept(accept)
  if (entries.length === 0) return 'html'

  let best: { repr: Representation; q: number; specificity: number; index: number } | null = null
  for (const [repr, mediaType] of representations) {
    const [type, subtype] = mediaType.split('/')
    // Most specific matching entry wins for this media type (RFC 9110 12.5.1).
    let match: { q: number; specificity: number; index: number } | null = null
    for (const e of entries) {
      let specificity: number
      if (e.type === type && e.subtype === subtype) specificity = 3
      else if (e.type === type && e.subtype === '*') specificity = 2
      else if (e.type === '*' && e.subtype === '*') specificity = 1
      else continue
      if (!match || specificity > match.specificity) {
        match = { q: e.q, specificity, index: e.index }
      }
    }
    if (!match || match.q === 0) continue
    if (
      !best ||
      match.q > best.q ||
      (match.q === best.q && match.specificity > best.specificity) ||
      (match.q === best.q && match.specificity === best.specificity && match.index < best.index)
    ) {
      best = { repr, ...match }
    }
  }
  return best?.repr ?? null
}

export function notAcceptable(accept: string): Response {
  const body =
    'This resource is available as:\n' +
    representations.map(([, mediaType]) => `- ${mediaType}\n`).join('') +
    `\nYou requested: ${accept}\n`
  return new Response(body, {
    status: 406,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      vary: 'Accept',
      'cache-control': 'no-store',
    },
  })
}

// Headers for the Markdown representation of a page.
export function markdownHeaders(site: string, pathname: string): Record<string, string> {
  return {
    'content-type': 'text/markdown; charset=utf-8',
    vary: 'Accept',
    // Advertise the HTML representation of the same URL (RFC 8288).
    link: `<${site + pathname}>; rel="alternate"; type="text/html"`,
    'cache-control': 'public, max-age=300',
  }
}

// Marks an HTML page response as one of two representations and advertises
// the Markdown one, so agents find the negotiation without guessing.
export function markHtmlPage(headers: Headers, site: string, pathname: string) {
  headers.delete('content-length')
  addVary(headers, 'Accept')
  headers.append('link', `<${site + pathname}>; rel="alternate"; type="text/markdown"`)
}

// Conventional English paths agents and people try by hand. Permanent
// redirects to the pages that carry the content (the site is bilingual with
// Swedish URLs by default, see pagePaths in src/seo.ts). /security.txt is
// the RFC 9116 legacy location for the real file under /.well-known/.
const aliases: Record<string, string> = {
  '/about': '/en/about',
  '/contact': '/en/contact',
  '/privacy': '/en/privacy',
  '/security.txt': '/.well-known/security.txt',
}

/** The permanent redirect for a page path, if any: the trust-anchor aliases,
    and trailing-slash variants to the canonical slashless URL (the router
    alone would answer with a temporary 307). */
export function permanentRedirect(url: URL): string | null {
  const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
  const alias = aliases[pathname]
  if (alias) return alias
  if (pathname !== url.pathname) return pathname + url.search
  return null
}

export function redirect(location: string): Response {
  return new Response(null, { status: 301, headers: { location } })
}

// The name a prerendered page is stored under in dist/client/_pages (see
// build-static.ts): / is index, /en/maskera is en/maskera.
export function pageFile(pathname: string): string {
  return pathname === '/' ? 'index' : pathname.slice(1)
}

// Every page is server-rendered, so the hydration JavaScript is not needed
// for the first paint. The framework preloads and loads it at high
// priority, which lets a fast connection run it before the first frame and
// makes Lighthouse's simulation count every chunk as render-blocking (about
// 150 ms of simulated FCP). Low priority tells the browser, and Lighthouse,
// that the document and the paint come first.
export function lowerHydrationPriority(html: string): string {
  return html
    .replaceAll('<link rel="modulepreload"', '<link rel="modulepreload" fetchpriority="low"')
    .replaceAll('<script type="module" async=""', '<script type="module" async="" fetchpriority="low"')
}
