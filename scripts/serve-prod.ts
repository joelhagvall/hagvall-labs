// Serves the production build (dist/) with gzip on :4173, matching how a real
// deployment serves the site. Used for Lighthouse/pa11y audits — see AGENTS.md.
import { join } from 'node:path'
import { existsSync, statSync } from 'node:fs'

const root = join(import.meta.dir, '..')
const mod = await import(join(root, 'dist/server/server.js'))
const handler = mod.default

const compressible = /text|javascript|json|svg|xml/

async function compress(res: Response, req: Request): Promise<Response> {
  const accept = req.headers.get('accept-encoding') ?? ''
  const type = res.headers.get('content-type') ?? ''
  if (!accept.includes('gzip') || !compressible.test(type)) return res
  const body = Bun.gzipSync(new Uint8Array(await res.arrayBuffer()))
  const headers = new Headers(res.headers)
  headers.set('content-encoding', 'gzip')
  headers.delete('content-length')
  return new Response(body, { status: res.status, headers })
}

Bun.serve({
  port: 4173,
  async fetch(req) {
    const url = new URL(req.url)
    const filePath = join(root, 'dist/client', decodeURIComponent(url.pathname))
    if (url.pathname !== '/' && existsSync(filePath) && statSync(filePath).isFile()) {
      return compress(new Response(Bun.file(filePath)), req)
    }
    const res = typeof handler === 'function' ? await handler(req) : await handler.fetch(req)
    return compress(res, req)
  },
})

console.log('prod server (gzip) on http://localhost:4173')
