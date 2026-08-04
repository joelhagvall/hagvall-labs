import { useEffect, useRef, useState } from 'react'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  useLocation,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import appCssInline from '../styles.css?inline'
import { BrandSymbol } from '../components/BrandSymbol'
import { btnPrimary, btnSmall } from '../components/ui'
import { site } from '../seo'
import type { Lang } from '../seo'

function useLang(): Lang {
  const pathname = useLocation({ select: (l) => l.pathname })
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'sv'
}

const chrome = {
  sv: {
    menu: 'Meny',
    products: 'Produkter',
    maskeraDesc: 'Maskera personuppgifter i text',
    services: 'Tjänster',
    contact: 'Kontakt',
    runBy: 'Drivs av',
    builtIn: 'Byggt i Sverige.',
    skip: 'Hoppa till innehållet',
  },
  en: {
    menu: 'Menu',
    products: 'Products',
    maskeraDesc: 'Mask personal data in text',
    services: 'Services',
    contact: 'Contact',
    runBy: 'Run by',
    builtIn: 'Built in Sweden.',
    skip: 'Skip to Content',
  },
}

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
      // Data URI so the favicon costs no request; a fetched favicon landing
      // near the LCP paint flips Lighthouse's simulated LCP a full RTT later.
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 viewBox%3D%22210 110 580 580%22%3E%3Cpath fill%3D%22%231748D4%22 d%3D%22M270 350 495 438 495 566 414 535 414 680 270 625Z%22%2F%3E%3Cpath fill%3D%22%2314B8A6%22 d%3D%22M365 254 610 349 610 650 438 584 438 494 525 528 525 395 365 333Z%22%2F%3E%3Cpath fill%3D%22%231748D4%22 d%3D%22M480 165 710 254 710 560 630 529 630 334 480 278Z%22%2F%3E%3C%2Fsvg%3E',
      },
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
          name: 'Hägvall Labs AB',
          url: site,
          logo: site + '/brand/hagvall-labs-symbol.svg',
          description:
            'Hägvall Labs AB develops, licenses and sells software and digital services for information security, privacy protection and artificial intelligence.',
          email: 'hello@hagvall-labs.com',
          founder: {
            '@type': 'Person',
            name: 'Joel Hägvall',
            url: 'https://joelhagvall.com',
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

function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = useLocation({ select: (l) => l.pathname })
  const onMaskera = pathname.endsWith('/maskera')
  const onContact =
    pathname.endsWith('/kontakt') || pathname.endsWith('/contact')
  const active = 'text-ink'
  const inactive = 'text-neutral-400 transition-colors hover:text-ink'
  return (
    <span className="flex items-center gap-1.5 text-xs font-semibold tracking-wide">
      {onMaskera ? (
        <Link to="/maskera" className={lang === 'sv' ? active : inactive} lang="sv">
          SV
        </Link>
      ) : onContact ? (
        <Link to="/kontakt" className={lang === 'sv' ? active : inactive} lang="sv">
          SV
        </Link>
      ) : (
        <Link to="/" className={lang === 'sv' ? active : inactive} lang="sv">
          SV
        </Link>
      )}
      <span aria-hidden="true" className="text-neutral-300">
        /
      </span>
      {onMaskera ? (
        <Link to="/en/maskera" className={lang === 'en' ? active : inactive} lang="en">
          EN
        </Link>
      ) : onContact ? (
        <Link to="/en/contact" className={lang === 'en' ? active : inactive} lang="en">
          EN
        </Link>
      ) : (
        <Link to="/en" className={lang === 'en' ? active : inactive} lang="en">
          EN
        </Link>
      )}
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
        <div className="animate-menu absolute right-0 top-full z-20 mt-3 w-64 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
          {lang === 'sv' ? (
            <Link to="/maskera" onClick={close} className={itemClass}>
              <span translate="no" className="block font-medium text-ink">
                Maskera
              </span>
              <span className="block text-xs text-neutral-500">
                {t.maskeraDesc}
              </span>
            </Link>
          ) : (
            <Link to="/en/maskera" onClick={close} className={itemClass}>
              <span translate="no" className="block font-medium text-ink">
                Maskera
              </span>
              <span className="block text-xs text-neutral-500">
                {t.maskeraDesc}
              </span>
            </Link>
          )}
          <div className="mt-1 border-t border-neutral-200 pt-1 sm:hidden">
            {lang === 'sv' ? (
              <>
                <Link to="/" hash="services" onClick={close} className={itemClass}>
                  {t.services}
                </Link>
                <Link to="/kontakt" onClick={close} className={itemClass}>
                  {t.contact}
                </Link>
              </>
            ) : (
              <>
                <Link to="/en" hash="services" onClick={close} className={itemClass}>
                  {t.services}
                </Link>
                <Link to="/en/contact" onClick={close} className={itemClass}>
                  {t.contact}
                </Link>
              </>
            )}
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

/* Drives the .reveal entrances (classes in styles.css). Only elements
   strictly below the first viewport are hidden and animated in on scroll;
   anything visible on load stays fully opaque, so an accessibility audit
   never catches text mid-fade. Runs again per navigation. */
function RevealObserver() {
  const pathname = useLocation({ select: (l) => l.pathname })
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const pending = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal'),
    ).filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    if (pending.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove('reveal-pending')
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      },
      // The huge top margin counts anything already scrolled PAST as
      // intersecting: a fast jump (keyboard End, anchor link) must never
      // leave skipped sections permanently hidden.
      { rootMargin: '9999px 0px -10% 0px' },
    )
    for (const el of pending) {
      el.classList.add('reveal-pending')
      observer.observe(el)
    }
    return () => {
      observer.disconnect()
      for (const el of pending) {
        el.classList.remove('reveal-pending')
      }
    }
  }, [pathname])
  return null
}

function RootLayout() {
  const lang = useLang()
  const t = chrome[lang]
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
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          {lang === 'sv' ? (
            <Link to="/" aria-label="Hägvall Labs, startsida">
              <Brand />
            </Link>
          ) : (
            <Link to="/en" aria-label="Hägvall Labs, Home">
              <Brand />
            </Link>
          )}
          <nav className="flex items-center gap-6 text-sm text-neutral-600">
            <ProductsMenu lang={lang} />
            {lang === 'sv' ? (
              <Link
                to="/"
                hash="services"
                className="hidden transition-colors hover:text-ink sm:block"
              >
                {t.services}
              </Link>
            ) : (
              <Link
                to="/en"
                hash="services"
                className="hidden transition-colors hover:text-ink sm:block"
              >
                {t.services}
              </Link>
            )}
            <LangSwitch lang={lang} />
            {lang === 'sv' ? (
              <Link to="/kontakt" className={`${btnSmall} max-sm:hidden`}>
                {t.contact}
              </Link>
            ) : (
              <Link to="/en/contact" className={`${btnSmall} max-sm:hidden`}>
                {t.contact}
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <RevealObserver />

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()}{' '}
            <span translate="no">Hägvall&nbsp;Labs&nbsp;AB</span>, Stockholm.{' '}
            {t.runBy}{' '}
            <a
              href="https://joelhagvall.com"
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              Joel Hägvall
            </a>
            . {t.builtIn}
          </p>
          <div className="flex gap-6">
            {lang === 'sv' ? (
              <Link
                to="/kontakt"
                className="transition-colors hover:text-ink"
              >
                {t.contact}
              </Link>
            ) : (
              <Link
                to="/en/contact"
                className="transition-colors hover:text-ink"
              >
                {t.contact}
              </Link>
            )}
            <a
              href="mailto:hello@hagvall-labs.com"
              className="transition-colors hover:text-ink"
            >
              hello@hagvall-labs.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NotFound() {
  const lang = useLang()
  return (
    <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
      <p className="mb-4 text-sm font-medium text-cobalt">
        404
      </p>
      <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
        {lang === 'sv' ? 'Sidan finns inte.' : 'Page Not Found.'}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600">
        {lang === 'sv'
          ? 'Adressen du försökte nå finns inte. Den kan ha flyttats eller aldrig ha funnits.'
          : 'The address you tried to reach doesn’t exist. It may have moved or never existed.'}
      </p>
      {lang === 'sv' ? (
        <Link to="/" className={`mt-10 ${btnPrimary}`}>
          Till startsidan
        </Link>
      ) : (
        <Link to="/en" className={`mt-10 ${btnPrimary}`}>
          Back to the Start Page
        </Link>
      )}
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
