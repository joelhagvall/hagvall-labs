// Serves the production build (dist/) with gzip on :4173, matching how a real
// deployment serves the site. Used for Lighthouse/pa11y audits, see AGENTS.md.
//
// This is also the production origin server (see Dockerfile), so it sets the
// HTTP security headers itself: they must not depend on the edge proxy config.
import { join, resolve, sep } from 'node:path'
import { existsSync, statSync } from 'node:fs'
import { htmlToMarkdown } from './html-to-markdown'

const root = join(import.meta.dir, '..')
// Public origin, used for the absolute links in the Markdown representation.
const site = process.env.SITE_URL ?? 'https://hagvall-labs.com'
const clientRoot = join(root, 'dist/client')
const mod = await import(join(root, 'dist/server/server.js'))
const handler = mod.default

const compressible = /text|javascript|json|svg|xml/

// script-src/style-src need 'unsafe-inline': TanStack Start hydrates with
// inline scripts and the production CSS is an inline <style> tag.
const securityHeaders: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy':
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
}

// Appends a field name to the Vary header without duplicating it.
function addVary(headers: Headers, field: string) {
  const current = headers.get('vary')
  if (!current) {
    headers.set('vary', field)
    return
  }
  const fields = current.split(',').map((f) => f.trim().toLowerCase())
  if (fields.includes('*') || fields.includes(field.toLowerCase())) return
  headers.set('vary', `${current}, ${field}`)
}

async function respond(res: Response, req: Request): Promise<Response> {
  const headers = new Headers(res.headers)
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value)
  }
  const accept = req.headers.get('accept-encoding') ?? ''
  const type = res.headers.get('content-type') ?? ''
  if (!compressible.test(type)) {
    return new Response(res.body, { status: res.status, headers })
  }
  addVary(headers, 'Accept-Encoding')
  if (!accept.includes('gzip')) {
    return new Response(res.body, { status: res.status, headers })
  }
  const body = Bun.gzipSync(new Uint8Array(await res.arrayBuffer()))
  headers.set('content-encoding', 'gzip')
  headers.delete('content-length')
  return new Response(body, { status: res.status, headers })
}

// Content negotiation (acceptmarkdown.com): every page URL serves HTML by
// default and Markdown when the Accept header prefers text/markdown, with
// Vary: Accept so caches keep the two representations apart. An Accept
// header that rules out both (q=0, or only types we do not produce) gets a
// 406 listing what is available instead of the framework's 500.
type Representation = 'html' | 'markdown'
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
function negotiate(accept: string | null): Representation | null {
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

// Markdown is derived from the rendered page, so the two representations can
// never drift apart. Pages are static: cache the conversion per URL.
const markdownCache = new Map<string, { status: number; body: string }>()
const MARKDOWN_CACHE_MAX = 64

async function renderPage(req: Request): Promise<Response> {
  // The framework only renders documents for HTML requests, so ask it for
  // HTML regardless of what the client negotiated.
  const headers = new Headers(req.headers)
  headers.set('accept', 'text/html')
  const htmlReq = new Request(req.url, { method: req.method, headers })
  return typeof handler === 'function' ? await handler(htmlReq) : await handler.fetch(htmlReq)
}

async function markdownResponse(req: Request): Promise<Response> {
  const url = new URL(req.url)
  const key = url.pathname
  let entry = markdownCache.get(key)
  if (!entry) {
    const res = await renderPage(req)
    const type = res.headers.get('content-type') ?? ''
    if (!type.includes('text/html')) return res
    const page = htmlToMarkdown(await res.text(), site + url.pathname)
    entry = { status: res.status, body: page.markdown }
    if (res.status === 200 && markdownCache.size < MARKDOWN_CACHE_MAX) {
      markdownCache.set(key, entry)
    }
  }
  return new Response(req.method === 'HEAD' ? null : entry.body, {
    status: entry.status,
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      vary: 'Accept',
      // Advertise the HTML representation of the same URL (RFC 8288).
      link: `<${site + url.pathname}>; rel="alternate"; type="text/html"`,
      'cache-control': 'public, max-age=300',
    },
  })
}

function notAcceptable(accept: string): Response {
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

// Conventional English paths agents and people try by hand. Permanent
// redirects to the pages that carry the content (the site is bilingual with
// Swedish URLs by default, see pagePaths in src/seo.ts). /security.txt is
// the RFC 9116 legacy location for the real file under /.well-known/.
const aliases: Record<string, string> = {
  '/about': '/en',
  '/contact': '/en/contact',
  '/privacy': '/en/privacy',
  '/security.txt': '/.well-known/security.txt',
}


// Resolves a request path to a file inside dist/client, or null when the path
// is malformed or escapes the directory (encoded ../ traversal).
function staticFilePath(pathname: string): string | null {
  try {
    const candidate = resolve(clientRoot, '.' + decodeURIComponent(pathname))
    return candidate.startsWith(clientRoot + sep) ? candidate : null
  } catch {
    return null
  }
}

Bun.serve({
  port: 4173,
  async fetch(req) {
    const url = new URL(req.url)
    const filePath = url.pathname === '/' ? null : staticFilePath(url.pathname)
    if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
      return respond(new Response(Bun.file(filePath)), req)
    }

    const pathname = url.pathname.length > 1 ? url.pathname.replace(/\/+$/, '') : url.pathname
    const alias = aliases[pathname]
    if (alias) {
      return respond(
        new Response(null, { status: 301, headers: { location: alias } }),
        req,
      )
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const res = typeof handler === 'function' ? await handler(req) : await handler.fetch(req)
      return respond(res, req)
    }

    const accept = req.headers.get('accept')
    const representation = negotiate(accept)
    if (representation === null) return respond(notAcceptable(accept ?? ''), req)
    if (representation === 'markdown') return respond(await markdownResponse(req), req)

    const res = await renderPage(req)
    const page = new Response(res.body, { status: res.status, headers: res.headers })
    if ((res.headers.get('content-type') ?? '').includes('text/html')) {
      addVary(page.headers, 'Accept')
      // Advertise the Markdown representation of the same URL so agents
      // find the content negotiation without guessing (RFC 8288).
      page.headers.append(
        'link',
        `<${site + pathname}>; rel="alternate"; type="text/markdown"`,
      )
    }
    return respond(page, req)
  },
})

console.log('prod server (gzip) on http://localhost:4173')
