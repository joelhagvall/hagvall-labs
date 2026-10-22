// Production server on Cloudflare Workers (wrangler.jsonc). Every page is
// prerendered at build time (scripts/build-static.ts), so this never runs
// React: it redirects, negotiates HTML or Markdown, serves the prerendered
// file from the static assets and sets the security headers (the policy
// itself lives in scripts/site-http.ts). `bun run serve:prod` runs this same
// Worker locally in workerd for the audits.
import {
  markdownHeaders,
  markHtmlPage,
  negotiate,
  notAcceptable,
  pageFile,
  permanentRedirect,
  redirect,
  type Representation,
  withSecurityHeaders,
} from '../scripts/site-http'

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> }
}

const site = 'https://hagvall-labs.com'

// Page paths are lowercase segments; anything else is not a page.
const pagePath = /^\/(?:[a-z0-9-]+(?:\/[a-z0-9-]+)*)?$/

function finish(res: Response, method: string): Response {
  const headers = withSecurityHeaders(new Headers(res.headers))
  const body = method === 'HEAD' ? null : res.body
  return new Response(body, { status: res.status, headers })
}

async function prerendered(
  env: Env,
  url: URL,
  file: string,
  representation: Representation,
  status: number,
): Promise<Response | null> {
  const extension = representation === 'markdown' ? 'md' : 'html'
  const res = await env.ASSETS.fetch(new Request(new URL(`/_pages/${file}.${extension}`, url)))
  if (!res.ok) return null
  if (representation === 'markdown') {
    return new Response(res.body, { status, headers: markdownHeaders(site, url.pathname) })
  }
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8' })
  markHtmlPage(headers, site, url.pathname)
  return new Response(res.body, { status, headers })
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url)
    if (url.hostname === 'www.hagvall-labs.com') {
      return finish(redirect(site + url.pathname + url.search), req.method)
    }

    // Static files first, as public/ and the build put them. The prerendered
    // pages are only reachable through their page URLs.
    if (url.pathname !== '/' && !url.pathname.startsWith('/_pages/')) {
      const asset = await env.ASSETS.fetch(req)
      if (asset.status !== 404) return finish(asset, req.method)
    }

    const location = permanentRedirect(url)
    if (location) return finish(redirect(location), req.method)

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return finish(new Response(null, { status: 405, headers: { allow: 'GET, HEAD' } }), req.method)
    }

    const accept = req.headers.get('accept')
    const representation = negotiate(accept)
    if (representation === null) return finish(notAcceptable(accept ?? ''), req.method)

    const page = pagePath.test(url.pathname)
      ? await prerendered(env, url, pageFile(url.pathname), representation, 200)
      : null
    if (page) return finish(page, req.method)

    // The 404 page in the language of the path that was asked for.
    const english = url.pathname === '/en' || url.pathname.startsWith('/en/')
    const missing = await prerendered(env, url, english ? 'en/404' : '404', representation, 404)
    return finish(missing ?? new Response('Not found\n', { status: 404 }), req.method)
  },
}
