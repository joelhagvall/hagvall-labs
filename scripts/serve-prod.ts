// Serves the production build (dist/) with gzip on :4173, matching how a real
// deployment serves the site. Used for Lighthouse/pa11y audits, see AGENTS.md.
//
// This is also the production origin server (see Dockerfile), so it sets the
// HTTP security headers itself: they must not depend on the edge proxy config.
import { join, resolve, sep } from 'node:path'
import { existsSync, statSync } from 'node:fs'

const root = join(import.meta.dir, '..')
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

async function respond(res: Response, req: Request): Promise<Response> {
  const headers = new Headers(res.headers)
  for (const [name, value] of Object.entries(securityHeaders)) {
    headers.set(name, value)
  }
  const accept = req.headers.get('accept-encoding') ?? ''
  const type = res.headers.get('content-type') ?? ''
  if (!accept.includes('gzip') || !compressible.test(type)) {
    return new Response(res.body, { status: res.status, headers })
  }
  const body = Bun.gzipSync(new Uint8Array(await res.arrayBuffer()))
  headers.set('content-encoding', 'gzip')
  headers.delete('content-length')
  return new Response(body, { status: res.status, headers })
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
    const res = typeof handler === 'function' ? await handler(req) : await handler.fetch(req)
    return respond(res, req)
  },
})

console.log('prod server (gzip) on http://localhost:4173')
