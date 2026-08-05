export const site = 'https://hagvall-labs.com'

// Temporary until hello@hagvall-labs.com is live. Referenced everywhere the
// address appears in code; llms.txt carries it as prose, switch both together.
export const contactEmail = 'work@joelhagvall.com'

export type Lang = 'sv' | 'en'

// Every page exists in both languages. This map is the single source of
// truth for the URL pairs: canonical/hreflang links, the language switcher
// and every internal link read from it.
export const pagePaths = {
  home: { sv: '/', en: '/en' },
  maskera: { sv: '/maskera', en: '/en/maskera' },
  contact: { sv: '/kontakt', en: '/en/contact' },
  privacy: { sv: '/integritet', en: '/en/privacy' },
} as const

export type PageKey = keyof typeof pagePaths

export function pageFromPath(pathname: string): PageKey {
  if (pathname.endsWith('/maskera')) return 'maskera'
  if (pathname.endsWith('/kontakt') || pathname.endsWith('/contact')) {
    return 'contact'
  }
  if (pathname.endsWith('/integritet') || pathname.endsWith('/privacy')) {
    return 'privacy'
  }
  return 'home'
}

/** The full per-route head: title, description, OG tags, canonical + hreflang
    set and optional JSON-LD. Canonicals must come from here (route heads),
    never from __root.tsx, where they would merge into duplicates. */
export function pageHead(opts: {
  lang: Lang
  page: PageKey
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  jsonLd?: Record<string, unknown>
}) {
  const paths = pagePaths[opts.page]
  const other: Lang = opts.lang === 'sv' ? 'en' : 'sv'
  const locale: Record<Lang, string> = { sv: 'sv_SE', en: 'en_US' }
  return {
    meta: [
      { title: opts.title },
      { name: 'description', content: opts.description },
      { property: 'og:title', content: opts.ogTitle },
      { property: 'og:description', content: opts.ogDescription },
      { property: 'og:url', content: site + paths[opts.lang] },
      { property: 'og:locale', content: locale[opts.lang] },
      { property: 'og:locale:alternate', content: locale[other] },
    ],
    links: [
      { rel: 'canonical', href: site + paths[opts.lang] },
      { rel: 'alternate', hrefLang: 'sv', href: site + paths.sv },
      { rel: 'alternate', hrefLang: 'en', href: site + paths.en },
      { rel: 'alternate', hrefLang: 'x-default', href: site + paths.en },
    ],
    ...(opts.jsonLd
      ? {
          scripts: [
            {
              type: 'application/ld+json',
              children: JSON.stringify(opts.jsonLd),
            },
          ],
        }
      : {}),
  }
}

// Structured data shared by the sv and en route variants: only the
// human-readable strings differ per language.

export function maskeraJsonLd(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Maskera',
    applicationCategory: 'SecurityApplication',
    url: 'https://maskera.dev',
    operatingSystem: 'Self-hosted (Linux, Docker)',
    description,
    publisher: { '@type': 'Organization', name: 'Hägvall Labs' },
  }
}

export function contactJsonLd(name: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    url: site + pagePaths.contact[lang],
    about: { '@type': 'Organization', name: 'Hägvall Labs' },
  }
}
