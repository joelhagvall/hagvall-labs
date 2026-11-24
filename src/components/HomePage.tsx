import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { founderLinks, pagePaths } from '../seo'
import type { Lang } from '../seo'
import { copy } from '../i18n'
import { BrandSymbol } from './BrandSymbol'
import {
  brandOnCobalt,
  btnPrimary,
  btnPrimaryOnCobalt,
  btnSecondary,
  btnSecondaryOnCobalt,
  container,
  externalLinkProps,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  itemBody,
  itemTitle,
  kickerOnCobalt,
  linkCobalt,
  linkInk,
  sectionTitle,
  sheet,
} from './ui'

/** The hero symbol. SSR and first paint show the static SVG; once the page
    has loaded and the browser is idle, the three.js scene (BrandScene.tsx,
    its own lazily imported chunk) mounts over it and crossfades in. Only on
    lg screens; small screens, Save-Data, reduced motion and browsers
    without WebGL keep the SVG. The box has a
    fixed aspect ratio, so the swap never shifts layout, and a canvas is
    never an LCP candidate. */
function BrandHero() {
  const ref = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = ref.current
    // Only where the symbol is large (lg, the two-column hero): on a phone it
    // is 128px, not worth 143 KB of three.js and a GPU context. Save-Data
    // and reduced motion keep the SVG too.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection
    if (
      !host ||
      !window.matchMedia('(min-width: 1024px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      connection?.saveData
    ) {
      return
    }
    let cancelled = false
    let dispose: (() => void) | undefined
    let cancelIdle = () => {}
    const mount = () => {
      import('./BrandScene')
        .then(({ mountBrandScene }) => {
          if (!cancelled) dispose = mountBrandScene(host, () => setReady(true))
        })
        .catch(() => {
          // Chunk failed to load: the SVG stays, nothing else to do.
        })
    }
    const whenIdle = () => {
      if (typeof window.requestIdleCallback === 'function') {
        const id = window.requestIdleCallback(mount, { timeout: 3000 })
        cancelIdle = () => window.cancelIdleCallback(id)
      } else {
        const id = window.setTimeout(mount, 1500)
        cancelIdle = () => window.clearTimeout(id)
      }
    }
    if (document.readyState === 'complete') whenIdle()
    else window.addEventListener('load', whenIdle, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', whenIdle)
      cancelIdle()
      dispose?.()
    }
  }, [])

  return (
    <div ref={ref} className="relative aspect-square w-32 sm:w-44 lg:w-full">
      {/* p-[5%]: the SVG's viewBox gives the symbol 89% of the box, the 3D
          camera 80%, so the two match through the crossfade. */}
      <div
        className={`absolute inset-0 p-[5%] transition-opacity duration-500 motion-reduce:transition-none ${brandOnCobalt} ${ready ? 'opacity-0' : ''}`}
      >
        <BrandSymbol size={352} className="size-full" />
      </div>
    </div>
  )
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang].home

  return (
    <>
      <section className={heroBand}>
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 pb-24 pt-12 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-center">
          <div>
            <p className={`mb-4 ${kickerOnCobalt}`}>{t.heroKicker}</p>
            <h1 className={`${heroTitle} sm:text-6xl`}>{t.heroTitle}</h1>
            <p className={heroBodyOnCobalt}>{t.heroBody}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link to={pagePaths.contact[lang]} className={btnPrimaryOnCobalt}>
                {t.ctaPrimary}
              </Link>
              <Link
                to={pagePaths.home[lang]}
                hash="example"
                className={btnSecondaryOnCobalt}
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
          <div aria-hidden="true" className="hidden lg:block">
            <BrandHero />
          </div>
        </div>
      </section>

      <div className={sheet}>
        <section
          id="example"
          className={`${container} grid scroll-mt-20 gap-10 md:grid-cols-2 md:gap-16`}
        >
          <div>
            <h2 className={sectionTitle}>{t.exampleTitle}</h2>
            <p className="mt-5 text-pretty text-lg leading-relaxed text-neutral-600">
              {t.exampleBody}
            </p>
            <h3 className={`mt-8 ${itemTitle}`}>{t.methodTitle}</h3>
            <p className={itemBody}>{t.methodBody}</p>
            <Link
              to={pagePaths.projects[lang]}
              className={`mt-6 ${btnSecondary}`}
            >
              {t.methodLink}
            </Link>
          </div>
          <div className="rounded-3xl bg-neutral-50 p-6 sm:p-8">
            <h3 className="text-sm font-semibold text-neutral-600">
              {t.exampleLabel}
            </h3>
            <ol role="list" className="mt-6 space-y-6">
              {t.exampleSteps.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4"
                >
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full border border-cobalt text-sm font-semibold text-cobalt tabular-nums"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="mt-1 text-pretty text-sm leading-relaxed text-neutral-600">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-pretty text-sm leading-relaxed text-neutral-600">
              {t.exampleNote}
            </p>
          </div>
        </section>

        <section id="services" className={`${container} scroll-mt-20`}>
          <h2 className={sectionTitle}>{t.pilotTitle}</h2>
          <p className="mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600">
            {t.pilotIntro}
          </p>
          <ol role="list" className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {t.pilotSteps.map((step, index) => (
              <li key={step.title}>
                <div aria-hidden="true" className="flex items-center gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-cobalt text-sm font-semibold text-cobalt tabular-nums">
                    {index + 1}
                  </span>
                  {index < t.pilotSteps.length - 1 ? (
                    <span className="hidden h-0.5 flex-1 bg-cobalt/20 sm:block" />
                  ) : null}
                </div>
                <h3 className={`mt-5 ${itemTitle}`}>{step.title}</h3>
                <p className={itemBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className={container}>
          <h2 className={sectionTitle}>{t.aboutTitle}</h2>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <img
              src="/joel-hagvall.webp"
              alt="Joel Hägvall"
              width={112}
              height={112}
              loading="lazy"
              decoding="async"
              className="h-28 w-28 shrink-0 rounded-2xl object-cover"
            />
            <div>
              <p className="font-medium">
                <a
                  href={founderLinks.site}
                  {...externalLinkProps}
                  className={linkInk}
                  translate="no"
                >
                  Joel Hägvall
                </a>
              </p>
              <p className="text-sm text-neutral-600">{t.aboutRole}</p>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
                {t.aboutP1}
              </p>
              <p className="mt-4 leading-relaxed">
                <Link to={pagePaths.about[lang]} className={linkCobalt}>
                  {t.aboutMore}
                </Link>
              </p>
              <p className="mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-neutral-600">
                {t.productBody}{' '}
                <Link to={pagePaths.maskera[lang]} className={linkCobalt}>
                  {t.productLink}
                </Link>
              </p>
              <Link
                to={pagePaths.contact[lang]}
                className={`mt-8 ${btnPrimary}`}
              >
                {t.aboutCta}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
