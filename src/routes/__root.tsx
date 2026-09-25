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
  brandOnCobalt,
  btnPrimaryOnCobalt,
  btnSmall,
  btnSmallOnCobalt,
  externalLinkProps,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  kickerOnCobalt,
  linkInk,
  sheet,
} from '../components/ui'
import {
  contactEmail,
  founderLinks,
  lighthouseReportsUrl,
  pageFromPath,
  pagePaths,
  site,
} from '../seo'
import type { Lang } from '../seo'

function useLang(): Lang {
  const pathname = useLocation({ select: (l) => l.pathname })
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'sv'
}

/* Preload the small secondary routes (contact, privacy) as soon as the
   browser is idle after hydration. Waiting for pointerdown raced the click
   itself: the chunk started downloading at the moment of navigation, so on
   a slow connection the click felt dead until the page appeared. */
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

/* Links the web app manifest (makes the site installable) once the page is
   idle after load. A <link rel="manifest"> in the head makes Chrome fetch
   the manifest and then its icon at high priority while the page is still
   painting, and Lighthouse's simulation counts both as render-blocking.
   Chrome picks up a manifest link added later, and "Add to Home Screen"
   reads it long after load. */
function useManifestLink() {
  useEffect(() => {
    const add = () => {
      if (document.querySelector('link[rel="manifest"]')) return
      const link = document.createElement('link')
      link.rel = 'manifest'
      link.href = '/manifest.webmanifest'
      document.head.append(link)
    }
    const schedule = () => {
      if (typeof window.requestIdleCallback === 'function') {
        window.requestIdleCallback(add, { timeout: 3000 })
      } else {
        window.setTimeout(add, 1000)
      }
    }
    if (document.readyState === 'complete') schedule()
    else window.addEventListener('load', schedule, { once: true })
    return () => window.removeEventListener('load', schedule)
  }, [])
}

/* Scroll to the top before the new page is painted. The router's own
   scroll reset runs on onRendered, which waits for the React transition to
   settle: that is often a frame after the new matches were committed, so the
   next page was painted once at the old scroll position (the footer links
   sit at the bottom of a tall page) and then jumped to the top, a visible
   flash. onBeforeRouteMount fires in the layout effect of the commit that
   mounts the new matches, before paint. Only forward navigations are
   handled here: back/forward keep the router's cached-position restore, and
   resetScroll={false} links (the language switcher) keep their position. */
function useEarlyScrollReset() {
  const router = useRouter()

  useEffect(() => {
    let action: string | undefined
    const unsubHistory = router.history.subscribe((event) => {
      action = event.action.type
    })
    const unsubRouter = router.subscribe('onBeforeRouteMount', (event) => {
      if (action !== 'PUSH' && action !== 'REPLACE') return
      if (!event.pathChanged || event.toLocation.hash || !router._scroll.next) {
        return
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    })
    return () => {
      unsubRouter()
      unsubHistory()
    }
  }, [router])
}

/* Where the white sheet is relative to the sticky header (h-14, 56px).
   overSheet: the sheet has scrolled up under the header's midline, so the
   header recolors for it (headerTone). docked: the sheet's top edge has
   reached the top of the viewport, the moment its rounded corners would
   scroll away, so the header takes them over (the cobalt corner masks).
   SSR renders the band state, which is what every page shows unscrolled;
   onRendered re-checks after a navigation swaps the page underneath. */
function useHeaderOverSheet() {
  const router = useRouter()
  const [state, setState] = useState({ overSheet: false, docked: false })

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const sheet = document.querySelector('main .sheet')
      const top = sheet ? sheet.getBoundingClientRect().top : Infinity
      setState((prev) => {
        const next = { overSheet: top <= 28, docked: top <= 0 }
        return prev.overSheet === next.overSheet && prev.docked === next.docked
          ? prev
          : next
      })
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })
    const unsub = router.subscribe('onRendered', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      unsub()
    }
  }, [router])

  return state
}

/* Header colors for the surface underneath: white over the cobalt band
   (where the translucent cobalt reads as fully transparent), ink over the
   frosted white sheet. */
const headerTone = {
  band: {
    bar: 'on-cobalt border-transparent bg-cobalt/85',
    nav: 'text-white/80',
    hover: 'hover:text-white',
    strong: 'text-white',
    muted: 'text-white/75 hover:text-white',
    faint: 'text-white/40',
    accent: 'text-cobalt-tint',
    symbol: brandOnCobalt,
    pill: btnSmallOnCobalt,
  },
  sheet: {
    bar: 'border-neutral-200 bg-white/85',
    nav: 'text-neutral-600',
    hover: 'hover:text-ink',
    strong: 'text-ink',
    muted: 'text-neutral-500 hover:text-ink',
    faint: 'text-neutral-300',
    accent: 'text-cobalt',
    symbol: '',
    pill: btnSmall,
  },
}
type HeaderTone = (typeof headerTone)['band']

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
    lhChecked: 'Lighthouse mäts dagligen mot den här sajten: se',
    lhReports: 'rapporterna',
    lhVerify: 'eller kolla själv i',
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
    lhChecked: 'Lighthouse is measured daily against this site: see',
    lhReports: 'the reports',
    lhVerify: 'or verify it yourself in',
    skip: 'Skip to Content',
    homeAria: 'Hägvall Labs, Home',
  },
}

// The footer links to the published Lighthouse reports (lighthouseReportsUrl
// in seo.ts) and to Google's own PageSpeed Insights, so anyone can read or
// re-run the numbers.
const pageSpeedUrl = `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(site + '/')}`

const umamiWebsiteId = '4f1d3158-8b29-4380-9852-e6ba8069c881'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#1748d4' },
      // No title or description here: every route sets its own through
      // pageHead(), and the 404 renders its own in its language (NotFound).
      { property: 'og:site_name', content: 'Hägvall Labs' },
      { property: 'og:type', content: 'website' },
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
      // The web app manifest is linked after load instead (useManifestLink).
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
          url: site + '/',
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
            '@id': site + '/#founder',
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
function LangSwitch({ lang, tone }: { lang: Lang; tone: HeaderTone }) {
  const pathname = useLocation({ select: (l) => l.pathname })
  const paths = pagePaths[pageFromPath(pathname)]
  const active = `transition-colors ${tone.strong}`
  const inactive = `transition-colors ${tone.muted}`
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
      <span aria-hidden="true" className={`transition-colors ${tone.faint}`}>
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

function ProductsMenu({ lang, tone }: { lang: Lang; tone: HeaderTone }) {
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
        className={`flex items-center gap-1 transition-colors ${tone.hover}`}
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
        /* text-ink and on-white: over the band the panel inherits the
           header's white nav color and focus ring; the sm-only links have
           no color of their own. */
        <div className="on-white animate-menu absolute right-0 top-full z-20 mt-3 w-64 rounded-xl border border-neutral-200 bg-white p-2 text-ink shadow-flat-lg">
          <Link
            to={pagePaths.maskera[lang]}
            onClick={close}
            className={itemClass}
          >
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
            <Link
              to={pagePaths.contact[lang]}
              onClick={close}
              className={itemClass}
            >
              {t.contact}
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

function Brand({ tone }: { tone: HeaderTone }) {
  return (
    <span className="flex items-center gap-2.5">
      {/* Over the band the geometry is recolored by CSS (brandOnCobalt): the
          brand fills would disappear on cobalt, white with a tint ribbon
          keeps the two-tone fold. Over the sheet it keeps its own fills. */}
      <span className={`[&_path]:transition-colors ${tone.symbol}`}>
        <BrandSymbol size={26} />
      </span>
      <span
        translate="no"
        className={`text-[11.5px] font-medium uppercase tracking-[0.12em] transition-colors ${tone.strong}`}
      >
        Hägvall&nbsp;
        <span className={`transition-colors ${tone.accent}`}>Labs</span>
      </span>
    </span>
  )
}

function RootLayout() {
  const lang = useLang()
  const t = chrome[lang]
  const { overSheet, docked } = useHeaderOverSheet()
  const tone = overSheet ? headerTone.sheet : headerTone.band
  useSecondaryRoutePreload(lang)
  useEarlyScrollReset()
  useManifestLink()
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-cobalt"
      >
        {t.skip}
      </a>
      {/* Transparent over the cobalt band, frosted white once the sheet
          scrolls under it, with the sheet's rounded corners once it docks
          (useHeaderOverSheet). z-20 so the sheet's z-10
          never paints over it. */}
      <header
        className={`header-blur sticky top-0 z-20 border-b transition-[background-color,border-color] duration-300 motion-reduce:transition-none ${tone.bar}`}
      >
        {/* The sheet's rounded top corners, kept by the header once the
            sheet docks under it, so the fold never flattens out. */}
        <span
          aria-hidden="true"
          className={`header-corner left-0 ${docked ? '' : 'opacity-0'}`}
        />
        <span
          aria-hidden="true"
          className={`header-corner header-corner-r right-0 ${docked ? '' : 'opacity-0'}`}
        />
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <Link to={pagePaths.home[lang]} aria-label={t.homeAria}>
            <Brand tone={tone} />
          </Link>
          <nav
            className={`flex items-center gap-6 text-sm transition-colors ${tone.nav}`}
          >
            <ProductsMenu lang={lang} tone={tone} />
            <Link
              to={pagePaths.home[lang]}
              hash="services"
              className={`hidden transition-colors sm:block ${tone.hover}`}
            >
              {t.services}
            </Link>
            <LangSwitch lang={lang} tone={tone} />
            <Link
              to={pagePaths.contact[lang]}
              className={`${tone.pill} max-sm:hidden`}
            >
              {t.contact}
            </Link>
          </nav>
        </div>
      </header>

      <main id="main" className="flex flex-1 flex-col">
        <Outlet />
      </main>

      {/* White like the sheet above it (the body is cobalt). */}
      <footer className="border-t border-neutral-200 bg-white">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <p>
              © {new Date().getFullYear()}{' '}
              <span translate="no">Hägvall&nbsp;Labs&nbsp;AB</span>, {t.orgNr}{' '}
              <span translate="no">559598-0110</span>, Stockholm. {t.runBy}{' '}
              <a
                href="https://joelhagvall.com"
                {...externalLinkProps}
                className={linkInk}
                data-umami-event="outbound-link-click"
                data-umami-event-destination="joelhagvall.com"
                data-umami-event-placement="footer-founder"
              >
                Joel Hägvall
              </a>
              . {t.noCookies}
            </p>
            {/* The scores themselves are on the home page (its Lighthouse
                panel); the footer only points at the third-party proof. */}
            <p>
              {t.lhChecked}{' '}
              <a
                href={lighthouseReportsUrl}
                {...externalLinkProps}
                className={linkInk}
                data-umami-event="outbound-link-click"
                data-umami-event-destination="github.io"
                data-umami-event-placement="footer-lighthouse"
              >
                {t.lhReports}
              </a>
{' '}
              {t.lhVerify}{' '}
              <a
                href={pageSpeedUrl}
                {...externalLinkProps}
                className={linkInk}
                data-umami-event="outbound-link-click"
                data-umami-event-destination="pagespeed.web.dev"
                data-umami-event-placement="footer-lighthouse"
              >
                PageSpeed Insights
              </a>
              .
            </p>
          </div>
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
    metaTitle: 'Sidan finns inte | Hägvall Labs',
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
    and: 'och',
  },
  en: {
    title: 'Page Not Found.',
    metaTitle: 'Page Not Found | Hägvall Labs',
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
    and: 'and',
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
    <>
      <section className={heroBand}>
        <div className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
          {/* No route head matches a 404, so its title and description are
              rendered here; React hoists them into <head>. */}
          <title>{t.metaTitle}</title>
          <meta name="description" content={t.body} />
          <p className={`mb-4 ${kickerOnCobalt}`}>404</p>
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBodyOnCobalt}>{t.body}</p>
          <Link to={pagePaths.home[lang]} className={`mt-10 ${btnPrimaryOnCobalt}`}>
            {t.cta}
          </Link>
        </div>
      </section>
      <div className={sheet}>
        <div className="mx-auto w-full max-w-5xl px-6 py-16">
          <h2 className="text-sm font-medium text-neutral-500">{t.next}</h2>
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
            {` ${t.and} `}
            <a href="/llms.txt" className={linkInk}>
              llms.txt
            </a>
          </p>
        </div>
      </div>
    </>
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
      {/* Cobalt body is only the canvas fallback: every page paints band,
          sheet and footer edge to edge, and the overscroll colors come from
          the split body::before layer in styles.css. */}
      <body className="bg-cobalt text-ink antialiased">
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
