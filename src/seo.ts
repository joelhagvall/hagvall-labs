export const site = 'https://hagvall-labs.com'

// Temporary until hello@hagvall-labs.com is live. Referenced everywhere the
// address appears in code; llms.txt carries it as prose, switch both together.
export const contactEmail = 'work@joelhagvall.com'

// Public profiles and open Maskera artifacts. Referenced by the pages,
// the footer and the JSON-LD so the URLs live in exactly one place.
export const founderLinks = {
  site: 'https://joelhagvall.com',
  linkedin: 'https://www.linkedin.com/in/joel-h%C3%A4gvall-810601147/',
  github: 'https://github.com/joelhagvall',
  huggingFace: 'https://huggingface.co/joelhagvall',
}

export const maskeraLinks = {
  github: 'https://github.com/joelhagvall/maskera',
  npm: 'https://www.npmjs.com/package/maskera',
  huggingFace: 'https://huggingface.co/joelhagvall/maskera-sv-ner',
}

// Published version of the maskera npm package, used in the
// SoftwareApplication JSON-LD. Bump when a new version is published.
export const maskeraVersion = '0.10.2'

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
      { rel: 'alternate', hrefLang: 'x-default', href: site + paths.sv },
      // The same URL also serves Markdown via content negotiation
      // (Accept: text/markdown, handled in scripts/serve-prod.ts).
      {
        rel: 'alternate',
        type: 'text/markdown',
        href: site + paths[opts.lang],
      },
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

/** WebSite + founder Person for the home pages. The Person shares the
    @id of the founder node in the Organization JSON-LD (__root.tsx), so
    the two merge into one entity that AI search can attribute Maskera and
    Hägvall Labs to. */
export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': site + '/#website',
        name: 'Hägvall Labs',
        alternateName: ['Hägvall Labs AB', 'hagvall-labs.com'],
        url: site + '/',
        inLanguage: ['sv', 'en'],
        publisher: { '@id': site + '/#organization' },
      },
      {
        '@type': 'Person',
        '@id': site + '/#founder',
        name: 'Joel Hägvall',
        url: founderLinks.site,
        jobTitle: 'Founder',
        worksFor: { '@id': site + '/#organization' },
        sameAs: [
          founderLinks.site,
          founderLinks.linkedin,
          founderLinks.github,
          founderLinks.huggingFace,
        ],
        knowsLanguage: ['sv', 'en'],
      },
    ],
  }
}

export function maskeraJsonLd(description: string) {
  const appId = 'https://maskera.dev/#software'
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': appId,
        name: 'Maskera',
        applicationCategory: 'SecurityApplication',
        url: 'https://maskera.dev',
        operatingSystem: 'Self-hosted (Linux, Docker)',
        softwareVersion: maskeraVersion,
        license: 'https://opensource.org/license/mit/',
        downloadUrl: maskeraLinks.npm,
        description,
        sameAs: [maskeraLinks.github, maskeraLinks.npm, maskeraLinks.huggingFace],
        author: { '@id': site + '/#organization' },
        publisher: { '@id': site + '/#organization' },
      },
      {
        '@type': 'SoftwareSourceCode',
        '@id': maskeraLinks.github,
        name: 'Maskera source code',
        codeRepository: maskeraLinks.github,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Node.js',
        license: 'https://opensource.org/license/mit/',
        targetProduct: { '@id': appId },
        author: { '@id': site + '/#founder' },
      },
    ],
  }
}

export function contactJsonLd(name: string, lang: Lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name,
    url: site + pagePaths.contact[lang],
    about: { '@id': site + '/#organization' },
  }
}
