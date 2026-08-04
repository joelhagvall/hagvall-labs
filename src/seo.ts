export const site = 'https://hagvall-labs.com'

export type Lang = 'sv' | 'en'

// One canonical + full hreflang set per page. These must live in each route's
// head, never in __root.tsx, where they would merge into duplicate canonicals.
export function alternateLinks(svPath: string, enPath: string, current: Lang) {
  return [
    { rel: 'canonical', href: site + (current === 'sv' ? svPath : enPath) },
    { rel: 'alternate', hrefLang: 'sv', href: site + svPath },
    { rel: 'alternate', hrefLang: 'en', href: site + enPath },
    { rel: 'alternate', hrefLang: 'x-default', href: site + enPath },
  ]
}

// og:locale for the current language plus og:locale:alternate for the other.
export function localeMeta(current: Lang) {
  return current === 'sv'
    ? [
        { property: 'og:locale', content: 'sv_SE' },
        { property: 'og:locale:alternate', content: 'en_US' },
      ]
    : [
        { property: 'og:locale', content: 'en_US' },
        { property: 'og:locale:alternate', content: 'sv_SE' },
      ]
}
