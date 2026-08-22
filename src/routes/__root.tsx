import { useEffect, useRef, useState } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
  useRouter,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import appCssInline from '../styles.css?inline'
import {
  BRAND_PATHS,
  BRAND_VIEWBOX,
  BrandSymbol,
} from '../components/BrandSymbol'
import {
  btnPrimary,
  btnSmall,
  heroBody,
  heroTitle,
  kicker,
  linkInk,
} from '../components/ui'
import { contactEmail, founderLinks, pageFromPath, pagePaths, site } from '../seo'
import type { Lang } from '../seo'

function useLang(): Lang {
  const pathname = useLocation({ select: (l) => l.pathname })
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'sv'
}

/* Preload the small secondary routes (contact, privacy) as soon as the
   browser is idle after hydration. Waiting for pointerdown raced the click
   itself: the chunk started downloading at the moment of navigation, and on
   a slow connection the router fell through to an empty pending state, so
   <main> blanked for a beat before the page appeared. */
function useSecondaryRoutePreload(lang: Lang) {
  const router = useRouter()

  useEffect(() => {
    const preload = () => {
      void Promise.all([
        router.preloadRoute({ to: pagePaths.privacy[lang] }),
        router.preloadRoute({ to: pagePaths.contact[lang] }),
      ]).catch(() => undefined)
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(preload, { timeout: 2000 })
      return () => window.cancelIdleCallback(id)
    }
    const id = window.setTimeout(preload, 1000)
    return () => window.clearTimeout(id)
  }, [lang, router])
}

// Data URI so the favicon costs no request; a fetched favicon landing near
// the LCP paint flips Lighthouse's simulated LCP a full RTT later. Built
// from the same paths as the rendered symbol.
const favicon =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${BRAND_VIEWBOX}">` +
      BRAND_PATHS.map((p) => `<path fill="${p.fill}" d="${p.d}"/>`).join('') +
      '</svg>',
  )

const chrome = {
  sv: {
    menu: 'Meny',
    products: 'Produkter',
    maskeraDesc: 'Maskera personuppgifter i text',
    services: 'Tjänster',
    contact: 'Kontakt',
    privacy: 'Integritet',
    orgNr: 'org.nr',
    runBy: 'Drivs av',
    noCookies: 'Inga cookies.',
    skip: 'Hoppa till innehållet',
    homeAria: 'Hägvall Labs, startsida',
  },
  en: {
    menu: 'Menu',
    products: 'Products',
    maskeraDesc: 'Mask personal data in text',
    services: 'Services',
    contact: 'Contact',
    privacy: 'Privacy',
    orgNr: 'org. no.',
    runBy: 'Founded and run by',
    noCookies: 'No cookies.',
    skip: 'Skip to Content',
    homeAria: 'Hägvall Labs, Home',
  },
}

const umamiWebsiteId = '4f1d3158-8b29-4380-9852-e6ba8069c881'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
      { title: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran' },
      {
        name: 'description',
        content:
          'Hägvall Labs bygger integritetssäker mjukvara som körs i er egen IT-miljö. Maskera maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg.',
      },
      { property: 'og:site_name', content: 'Hägvall Labs' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: site + '/brand/og-image.png' },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      {
        property: 'og:image:alt',
        content: 'Hägvall Labs, integritetssäker mjukvara för AI-eran',
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      ...(import.meta.env.DEV ? [{ rel: 'stylesheet', href: appCss }] : []),
      { rel: 'icon', type: 'image/svg+xml', href: favicon },
      // Not fetched during page load (only when saving to a home screen),
      // so unlike a fetched favicon it costs nothing in Lighthouse.
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': site + '/#organization',
          name: 'Hägvall Labs',
          legalName: 'Hägvall Labs AB',
          alternateName: 'Hägvall Labs AB',
          identifier: {
            '@type': 'PropertyValue',
            propertyID: 'Swedish organisation number',
            value: '559598-0110',
          },
          url: site,
          logo: site + '/brand/hagvall-labs-symbol.svg',
          description:
            'Hägvall Labs develops, licenses and sells software and digital services for information security, privacy protection and artificial intelligence.',
          email: contactEmail,
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: contactEmail,
            url: site + pagePaths.contact.sv,
            availableLanguage: ['sv', 'en'],
          },
          founder: {
            '@type': 'Person',
            name: 'Joel Hägvall',
            url: founderLinks.site,
            sameAs: [founderLinks.linkedin, founderLinks.github],
          },
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Stockholm',
            addressCountry: 'SE',
          },
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
  notFoundComponent: NotFound,
})

// Switches language while staying on the current page.
function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = useLocation({ select: (l) => l.pathname })
  const paths = pagePaths[pageFromPath(pathname)]
  const active = 'text-ink'
  const inactive = 'text-neutral-400 transition-colors hover:text-ink'
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide">
      <Link
        to={paths.sv}
        resetScroll={false}
        className={lang === 'sv' ? active : inactive}
        lang="sv"
      >
        SV
      </Link>
      <span aria-hidden="true" className="text-neutral-300">
        /
      </span>
      <Link
        to={paths.en}
        resetScroll={false}
        className={lang === 'en' ? active : inactive}
        lang="en"
      >
        EN
      </Link>
    </span>
  )
}

function ProductsMenu({ lang }: { lang: Lang }) {
  const t = chrome[lang]
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const close = () => setOpen(false)
  const itemClass =
    'block rounded-lg px-3 py-2 transition-colors hover:bg-neutral-50'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 transition-colors hover:text-ink"
      >
        {/* Below sm the dropdown is the whole nav (Tjänster and the Kontakt
            pill are hidden there), so it announces itself as the menu. */}
        <span className="sm:hidden">{t.menu}</span>
        <span className="hidden sm:inline">{t.products}</span>
        <svg
          aria-hidden="true"
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`transition-transform motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
        >
          <path
            d="M1.5 3.5 5 7l3.5-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <div className="animate-menu absolute right-0 top-full z-20 mt-3 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-flat-lg">
          <Link to={pagePaths.maskera[lang]} onClick={close} className={itemClass}>
            <span translate="no" className="block font-medium text-ink">
              Maskera
            </span>
            <span className="block text-xs text-neutral-500">
              {t.maskeraDesc}
            </span>
          </Link>
          <div className="mt-1 border-t border-neutral-200 pt-1 sm:hidden">
            <Link
              to={pagePaths.home[lang]}
              hash="services"
              onClick={close}
              className={itemClass}
            >
              {t.services}
            </Link>
            <Link to={pagePaths.contact[lang]} onClick={close} className={itemClass}>
              {t.contact}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Brand() {
  return (
    <span className="flex items-center gap-2.5">
      <BrandSymbol size={26} />
      <span
        translate="no"
        className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-ink"
      >
        Hägvall&nbsp;<span className="text-cobalt">Labs</span>
      </span>
    </span>
  )
}

function RootLayout() {
  const lang = useLang()
  const t = chrome[lang]
  useSecondaryRoutePreload(lang)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-cobalt focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {t.skip}
      </a>
      <header className="header-blur sticky top-0 z-10 border-b border-neutral-200 bg-white/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <Link to={pagePaths.home[lang]} aria-label={t.homeAria}>
            <Brand />
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-600">
            <ProductsMenu lang={lang} />
            <Link
              to={pagePaths.home[lang]}
              hash="services"
              className="hidden transition-colors hover:text-ink sm:block"
            >
              {t.services}
            </Link>
            <LangSwitch lang={lang} />
            <Link
              to={pagePaths.contact[lang]}
              className={`${btnSmall} max-sm:hidden`}
            >
              {t.contact}
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{' '}
            <span translate="no">Hägvall&nbsp;Labs&nbsp;AB</span> · {t.orgNr}{' '}
            <span translate="no">559598-0110</span> · Stockholm. {t.runBy}{' '}
            <a
              href="https://joelhagvall.com"
              className={linkInk}
              data-umami-event="outbound-link-click"
              data-umami-event-destination="joelhagvall.com"
              data-umami-event-placement="footer-founder"
            >
              Joel Hägvall
            </a>
            . {t.noCookies}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link
              to={pagePaths.privacy[lang]}
              preload="viewport"
              className="transition-colors hover:text-ink"
            >
              {t.privacy}
            </Link>
            <Link
              to={pagePaths.contact[lang]}
              preload="viewport"
              className="transition-colors hover:text-ink"
            >
              {t.contact}
            </Link>
            <a
              href={`mailto:${contactEmail}`}
              className="transition-colors hover:text-ink"
              data-umami-event="outbound-link-click"
              data-umami-event-destination="email"
              data-umami-event-placement="footer-contact"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

const notFoundCopy = {
  sv: {
    title: 'Sidan finns inte.',
    body: 'Adressen du försökte nå finns inte. Den kan ha flyttats eller aldrig ha funnits.',
    cta: 'Till startsidan',
    next: 'Leta vidare här:',
    pages: {
      home: 'Startsidan',
      maskera: 'Maskera',
      contact: 'Kontakt',
      privacy: 'Integritet',
    },
    agents: 'För sökmotorer och agenter:',
  },
  en: {
    title: 'Page Not Found.',
    body: 'The address you tried to reach doesn’t exist. It may have moved or never existed.',
    cta: 'Back to Home',
    next: 'Where to look next:',
    pages: {
      home: 'Home',
      maskera: 'Maskera',
      contact: 'Contact',
      privacy: 'Privacy',
    },
    agents: 'For crawlers and agents:',
  },
}

// The 404 keeps its real status (the router sets it) and points at the pages
// that do exist, plus the sitemap and llms.txt, so a visitor or an agent can
// recover instead of guessing. The Markdown representation (see
// scripts/serve-prod.ts) is derived from this same markup.
function NotFound() {
  const lang = useLang()
  const t = notFoundCopy[lang]
  const pages = Object.keys(t.pages) as Array<keyof typeof t.pages>
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
      <p className={`mb-4 ${kicker}`}>404</p>
      <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
      <p className={heroBody}>{t.body}</p>
      <Link to={pagePaths.home[lang]} className={`mt-10 ${btnPrimary}`}>
        {t.cta}
      </Link>
      <h2 className="mt-14 text-sm font-medium text-neutral-500">{t.next}</h2>
      <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {pages.map((page) => (
          <li key={page}>
            <Link to={pagePaths[page][lang]} className={linkInk}>
              {t.pages[page]}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-neutral-500">
        {t.agents}{' '}
        <a href="/sitemap.xml" className={linkInk}>
          sitemap.xml
        </a>
        {' · '}
        <a href="/llms.txt" className={linkInk}>
          llms.txt
        </a>
      </p>
    </section>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const lang = useLang()
  return (
    <html lang={lang}>
      <head>
        {import.meta.env.PROD && (
          <style dangerouslySetInnerHTML={{ __html: appCssInline }} />
        )}
        <HeadContent />
        {import.meta.env.PROD &&
          import.meta.env.VITE_UMAMI_ENABLED === 'true' && (
            <script
              defer
              src="/analytics/script.js"
              data-website-id={umamiWebsiteId}
              data-host-url="https://hagvall-labs.com/analytics"
              data-domains="hagvall-labs.com,www.hagvall-labs.com"
              data-exclude-search="true"
              data-exclude-hash="true"
              data-do-not-track="true"
            />
          )}
      </head>
      <body className="bg-white text-ink antialiased">
        {children}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
