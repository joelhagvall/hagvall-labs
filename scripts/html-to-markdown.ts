// Turns a server-rendered page into Markdown for `Accept: text/markdown`
// clients (acceptmarkdown.com). The SSR output is well-formed React HTML, so
// a small tree parser is enough: no dependency, nothing extra in the runtime
// image. Only <main> and <footer> are converted; the header/nav is chrome.
//
// Used by scripts/serve-prod.ts. Copied into the production image alongside
// it (see Dockerfile).

type Element = {
  type: 'element'
  tag: string
  attrs: Record<string, string>
  children: Node[]
}
type Text = { type: 'text'; text: string }
type Node = Element | Text

const VOID_TAGS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'param', 'source', 'track', 'wbr',
])
const RAW_TEXT_TAGS = new Set(['script', 'style'])
const SKIP_TAGS = new Set([
  'svg', 'script', 'style', 'template', 'noscript', 'button', 'input',
  'select', 'textarea', 'canvas', 'iframe', 'video', 'audio', 'picture',
])
const INLINE_TAGS = new Set([
  'a', 'abbr', 'b', 'bdi', 'bdo', 'br', 'cite', 'code', 'data', 'del', 'dfn',
  'em', 'i', 'img', 'ins', 'kbd', 'label', 'mark', 'q', 's', 'samp', 'small',
  'span', 'strong', 'sub', 'sup', 'time', 'u', 'var', 'wbr',
])

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  copy: '©', reg: '®', hellip: '…', mdash: '-', ndash: '-',
  laquo: '«', raquo: '»', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
}

export function decodeEntities(text: string): string {
  return text.replace(
    /&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi,
    (match, hex, dec, name) => {
      if (hex) return String.fromCodePoint(parseInt(hex, 16))
      if (dec) return String.fromCodePoint(parseInt(dec, 10))
      const named = NAMED_ENTITIES[name.toLowerCase()]
      return named ?? match
    },
  )
}

const ATTR_RE = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

function parseAttrs(source: string): Record<string, string> {
  const attrs: Record<string, string> = {}
  for (const m of source.matchAll(ATTR_RE)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? '')
  }
  return attrs
}

/** Parses an HTML document into a tree. Tolerant of stray close tags. */
export function parseHtml(html: string): Node[] {
  const root: Element = { type: 'element', tag: '#root', attrs: {}, children: [] }
  const stack: Element[] = [root]
  let i = 0

  const append = (node: Node) => stack[stack.length - 1].children.push(node)

  while (i < html.length) {
    const lt = html.indexOf('<', i)
    if (lt === -1) {
      append({ type: 'text', text: decodeEntities(html.slice(i)) })
      break
    }
    if (lt > i) append({ type: 'text', text: decodeEntities(html.slice(i, lt)) })

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt + 4)
      i = end === -1 ? html.length : end + 3
      continue
    }
    if (html.startsWith('<!', lt) || html.startsWith('<?', lt)) {
      const end = html.indexOf('>', lt)
      i = end === -1 ? html.length : end + 1
      continue
    }
    if (html.startsWith('</', lt)) {
      const end = html.indexOf('>', lt)
      const name = html.slice(lt + 2, end === -1 ? html.length : end).trim().toLowerCase()
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].tag === name) {
          stack.length = s
          break
        }
      }
      i = end === -1 ? html.length : end + 1
      continue
    }

    // Open tag. Find its end, skipping '>' inside quoted attribute values.
    let j = lt + 1
    let quote: string | null = null
    while (j < html.length) {
      const c = html[j]
      if (quote) {
        if (c === quote) quote = null
      } else if (c === '"' || c === "'") {
        quote = c
      } else if (c === '>') {
        break
      }
      j++
    }
    const rawTag = html.slice(lt + 1, j)
    const selfClosing = rawTag.endsWith('/')
    const body = selfClosing ? rawTag.slice(0, -1) : rawTag
    const nameMatch = /^([a-zA-Z][^\s/>]*)/.exec(body)
    if (!nameMatch) {
      append({ type: 'text', text: '<' })
      i = lt + 1
      continue
    }
    const tag = nameMatch[1].toLowerCase()
    const el: Element = {
      type: 'element',
      tag,
      attrs: parseAttrs(body.slice(nameMatch[0].length)),
      children: [],
    }
    append(el)
    i = j + 1

    if (selfClosing || VOID_TAGS.has(tag)) continue
    if (RAW_TEXT_TAGS.has(tag)) {
      const close = html.toLowerCase().indexOf(`</${tag}`, i)
      const end = close === -1 ? html.length : close
      el.children.push({ type: 'text', text: html.slice(i, end) })
      const gt = html.indexOf('>', end)
      i = gt === -1 ? html.length : gt + 1
      continue
    }
    stack.push(el)
  }
  return root.children
}

function find(nodes: Node[], test: (el: Element) => boolean): Element | null {
  for (const node of nodes) {
    if (node.type !== 'element') continue
    if (test(node)) return node
    const hit = find(node.children, test)
    if (hit) return hit
  }
  return null
}

function findAll(nodes: Node[], test: (el: Element) => boolean): Element[] {
  const out: Element[] = []
  const walk = (list: Node[]) => {
    for (const node of list) {
      if (node.type !== 'element') continue
      if (test(node)) out.push(node)
      walk(node.children)
    }
  }
  walk(nodes)
  return out
}

function textOf(nodes: Node[]): string {
  let out = ''
  for (const node of nodes) {
    out += node.type === 'text' ? node.text : textOf(node.children)
  }
  return out
}

const collapse = (s: string) => s.replace(/\s+/g, ' ')

function isSkipped(el: Element): boolean {
  return SKIP_TAGS.has(el.tag) || el.attrs['aria-hidden'] === 'true' || 'hidden' in el.attrs
}

type Ctx = { baseUrl: string }

function absolute(href: string, ctx: Ctx): string {
  try {
    return new URL(href, ctx.baseUrl).href
  } catch {
    return href
  }
}

// Adjacent inline elements with no whitespace between them (flex rows of
// buttons, link lists) would otherwise run together as [a](..)[b](..).
function separate(out: string): string {
  return out && !/[\s(\[“"'«]$/.test(out) ? out + ' ' : out
}

function renderInline(nodes: Node[], ctx: Ctx): string {
  let out = ''
  for (const node of nodes) {
    if (node.type === 'text') {
      out += collapse(node.text)
      continue
    }
    if (isSkipped(node)) continue
    const inner = () => renderInline(node.children, ctx)
    if (node.tag === 'a' || node.tag === 'img') out = separate(out)
    switch (node.tag) {
      case 'br':
        out += '\n'
        break
      case 'img': {
        const alt = node.attrs.alt?.trim()
        if (alt && node.attrs.src) out += `![${alt}](${absolute(node.attrs.src, ctx)})`
        break
      }
      case 'a': {
        const text = inner().trim()
        const href = node.attrs.href
        if (!text) break
        if (!href || href.startsWith('#')) {
          out += text
        } else {
          out += `[${text}](${absolute(href, ctx)})`
        }
        break
      }
      case 'strong':
      case 'b': {
        const text = inner().trim()
        if (text) out += `**${text}**`
        break
      }
      case 'em':
      case 'i': {
        const text = inner().trim()
        if (text) out += `*${text}*`
        break
      }
      case 'code':
      case 'kbd':
      case 'samp': {
        const text = inner().trim()
        if (text) out += `\`${text}\``
        break
      }
      default:
        // Block elements nested in inline context: flatten to text.
        out += inner()
    }
  }
  return out
}

function tidyParagraph(text: string): string {
  return text
    .split('\n')
    .map((line) => collapse(line).trim())
    .filter(Boolean)
    .join('\n')
}

function renderList(el: Element, ctx: Ctx, ordered: boolean): string {
  const items: string[] = []
  let n = 0
  for (const child of el.children) {
    if (child.type !== 'element' || child.tag !== 'li' || isSkipped(child)) continue
    n++
    const marker = ordered ? `${n}. ` : '- '
    const blocks = renderBlocks(child.children, ctx)
    if (blocks.length === 0) continue
    const indent = ' '.repeat(marker.length)
    const [first, ...rest] = blocks
    const body = [first, ...rest].join('\n\n').split('\n')
    items.push(
      body.map((line, i) => (i === 0 ? marker + line : indent + line)).join('\n'),
    )
  }
  return items.join('\n')
}

function renderDefinitionList(el: Element, ctx: Ctx): string {
  const lines: string[] = []
  let term: string | null = null
  const walk = (nodes: Node[]) => {
    for (const child of nodes) {
      if (child.type !== 'element' || isSkipped(child)) continue
      if (child.tag === 'dt') {
        term = tidyParagraph(renderInline(child.children, ctx))
      } else if (child.tag === 'dd') {
        const def = tidyParagraph(renderInline(child.children, ctx))
        lines.push(term ? `- **${term}:** ${def}` : `- ${def}`)
        term = null
      } else {
        walk(child.children) // wrapper <div>s inside <dl>
      }
    }
  }
  walk(el.children)
  return lines.join('\n')
}

function renderTable(el: Element, ctx: Ctx): string {
  const rows = findAll(el.children, (e) => e.tag === 'tr').map((tr) =>
    tr.children
      .filter((c): c is Element => c.type === 'element' && (c.tag === 'th' || c.tag === 'td'))
      .map((cell) => collapse(renderInline(cell.children, ctx)).trim().replace(/\|/g, '\\|')),
  )
  if (rows.length === 0) return ''
  const width = Math.max(...rows.map((r) => r.length))
  const line = (cells: string[]) =>
    '| ' + Array.from({ length: width }, (_, i) => cells[i] ?? '').join(' | ') + ' |'
  const [head, ...body] = rows
  return [line(head), '| ' + Array(width).fill('---').join(' | ') + ' |', ...body.map(line)].join('\n')
}

/** Renders a node list into Markdown blocks. Consecutive inline nodes are
    grouped into one paragraph; block elements get their own block. */
function renderBlocks(nodes: Node[], ctx: Ctx): string[] {
  const blocks: string[] = []
  let run: Node[] = []
  const flush = () => {
    if (run.length === 0) return
    const text = tidyParagraph(renderInline(run, ctx))
    if (text) blocks.push(text)
    run = []
  }

  for (const node of nodes) {
    if (node.type === 'text' || INLINE_TAGS.has(node.tag)) {
      run.push(node)
      continue
    }
    flush()
    if (isSkipped(node)) continue
    const heading = /^h([1-6])$/.exec(node.tag)
    if (heading) {
      const text = collapse(renderInline(node.children, ctx)).trim()
      if (text) blocks.push(`${'#'.repeat(Number(heading[1]))} ${text}`)
      continue
    }
    switch (node.tag) {
      case 'p': {
        const text = tidyParagraph(renderInline(node.children, ctx))
        if (text) blocks.push(text)
        break
      }
      case 'ul':
      case 'ol': {
        const list = renderList(node, ctx, node.tag === 'ol')
        if (list) blocks.push(list)
        break
      }
      case 'dl': {
        const list = renderDefinitionList(node, ctx)
        if (list) blocks.push(list)
        break
      }
      case 'table': {
        const table = renderTable(node, ctx)
        if (table) blocks.push(table)
        break
      }
      case 'pre': {
        const code = textOf(node.children).replace(/^\n+|\n+$/g, '')
        if (code) blocks.push('```\n' + code + '\n```')
        break
      }
      case 'blockquote': {
        const inner = renderBlocks(node.children, ctx).join('\n\n')
        if (inner) blocks.push(inner.split('\n').map((l) => `> ${l}`).join('\n'))
        break
      }
      case 'hr':
        blocks.push('---')
        break
      default:
        blocks.push(...renderBlocks(node.children, ctx))
    }
  }
  flush()
  return blocks
}

export type PageMarkdown = {
  title: string
  description: string
  canonical: string | null
  lang: string
  markdown: string
}

/**
 * Converts a server-rendered page into a Markdown document: YAML front
 * matter (title, description, url, lang), the <main> content, then the
 * <footer> and the discovery links agents should know about.
 */
export function htmlToMarkdown(html: string, baseUrl: string): PageMarkdown {
  const ctx: Ctx = { baseUrl }
  const doc = parseHtml(html)

  const htmlEl = find(doc, (e) => e.tag === 'html')
  const lang = htmlEl?.attrs.lang || 'sv'
  const title = collapse(textOf(find(doc, (e) => e.tag === 'title')?.children ?? [])).trim()
  const description =
    find(doc, (e) => e.tag === 'meta' && e.attrs.name === 'description')?.attrs.content?.trim() ?? ''
  const canonical =
    find(doc, (e) => e.tag === 'link' && e.attrs.rel === 'canonical')?.attrs.href ?? null
  const alternates = findAll(
    doc,
    (e) => e.tag === 'link' && e.attrs.rel === 'alternate' && Boolean(e.attrs.hreflang),
  )
    .filter((e) => e.attrs.hreflang !== 'x-default' && e.attrs.hreflang !== lang)
    .map((e) => `${e.attrs.hreflang}: ${e.attrs.href}`)

  const main = find(doc, (e) => e.tag === 'main')
  const footer = find(doc, (e) => e.tag === 'footer')
  const body = renderBlocks(main ? main.children : doc, ctx)
  const footerBlocks = footer ? renderBlocks(footer.children, ctx) : []

  const origin = new URL(baseUrl).origin
  const front = ['---', `title: ${JSON.stringify(title)}`]
  if (description) front.push(`description: ${JSON.stringify(description)}`)
  if (canonical) front.push(`url: ${canonical}`)
  front.push(`lang: ${lang}`)
  if (alternates.length > 0) {
    front.push('alternate:')
    for (const alt of alternates) front.push(`  - ${alt}`)
  }
  front.push('---')

  const tail = [
    '---',
    ...footerBlocks,
    `Sitemap: ${origin}/sitemap.xml · About this site for agents: ${origin}/llms.txt`,
  ]

  const markdown = [front.join('\n'), ...body, tail.join('\n\n')].join('\n\n') + '\n'
  return { title, description, canonical, lang, markdown }
}
