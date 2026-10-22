// Prerenders every page for the Cloudflare Worker (worker/index.ts), after
// `vite build`. The site has no per-request data, so the Worker never runs
// React: it serves these files and only negotiates, redirects and sets
// headers. For each URL in public/sitemap.xml, and for the 404 page in both
// languages, it writes the HTML (with the hydration priority rewrite) and
// the Markdown representation to dist/client/_pages/, plus a _headers file
// that gives the static assets the same security headers.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { htmlToMarkdown } from './html-to-markdown'
import { lowerHydrationPriority, pageFile, securityHeaders } from './site-http'

const root = join(import.meta.dir, '..')
const site = 'https://hagvall-labs.com'
const clientRoot = join(root, 'dist/client')
const pagesRoot = join(clientRoot, '_pages')
const mod = await import(join(root, 'dist/server/server.js'))
const handler = mod.default

const sitemap = readFileSync(join(root, 'public/sitemap.xml'), 'utf8')
const pagePaths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  ([, loc]) => new URL(loc).pathname,
)
if (pagePaths.length === 0) throw new Error('public/sitemap.xml lists no pages')

async function render(pathname: string): Promise<Response> {
  const req = new Request(site + pathname, { headers: { accept: 'text/html' } })
  return typeof handler === 'function' ? await handler(req) : await handler.fetch(req)
}

function write(file: string, body: string) {
  const path = join(pagesRoot, file)
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, body)
}

async function prerender(pathname: string, name: string, status: number) {
  const res = await render(pathname)
  if (res.status !== status) {
    throw new Error(`${pathname}: expected ${status}, got ${res.status}`)
  }
  const html = await res.text()
  write(`${name}.html`, lowerHydrationPriority(html))
  write(`${name}.md`, htmlToMarkdown(html, site + pathname).markdown)
}

for (const pathname of pagePaths) {
  await prerender(pathname, pageFile(pathname), 200)
}
// The 404 page renders in the language of the path it was asked for.
await prerender('/this-page-does-not-exist', '404', 404)
await prerender('/en/this-page-does-not-exist', 'en/404', 404)

// Responses the Worker builds get these headers in code. Static assets it
// never sees (run_worker_first excludes /assets/*) get them from _headers;
// the hashed bundles never change, so they are cached for good.
const headerLines = Object.entries(securityHeaders).map(([name, value]) => `  ${name}: ${value}`)
writeFileSync(
  join(clientRoot, '_headers'),
  ['/*', ...headerLines, '/assets/*', '  cache-control: public, max-age=31536000, immutable', ''].join(
    '\n',
  ),
)

// Finder metadata copied from public/ on the Mac is never uploaded.
writeFileSync(join(clientRoot, '.assetsignore'), '.DS_Store\n')

console.log(`prerendered ${pagePaths.length} pages and 2 not-found pages to dist/client/_pages`)
