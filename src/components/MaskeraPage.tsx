import { Fragment, useEffect, useRef, useState } from 'react'
import { SegmentedControl, SegmentedControlItem } from '@ui-sdk/react/segmented-control'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@ui-sdk/react/tabs'
import { copy as translations } from '../i18n'
import { maskeraCopy } from '../i18n/maskera'
import { Link } from '@tanstack/react-router'
import { maskeraLinks, maskeraSite, pagePaths } from '../seo'
import type { Lang } from '../seo'
import {
  btnArrow,
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
  linkInk,
  sectionTitle,
  sheet,
} from './ui'

/* The preview uses Maskera’s token colours and placeholders. Each pill
   carries its label in text as well as colour. */

const LABEL_HUES: Record<string, string> = {
  // names
  NAMN: '#1d4ed8',
  // places and addresses
  PLATS: '#166534',
  ADRESS: '#b8420a',
  POSTNUMMER: '#3f6212',
  LAGENHETSNUMMER: '#065f46',
  // organisations
  ORGANISATION: '#713f12',
  ORGANISATIONSNUMMER: '#854d0e',
  // structured ids and contact details
  PERSONNUMMER: '#b91c1c',
  SAMORDNINGSNUMMER: '#be123c',
  EPOST: '#0369a1',
  TELEFON: '#115e59',
  IBAN: '#6d28d9',
  BANKGIRO: '#7e22ce',
  PLUSGIRO: '#a21caf',
  KORTNUMMER: '#be185d',
  REGNUMMER: '#4338ca',
  IP_ADRESS: '#334155',
  URL: '#075985',
}

const FALLBACK_HUE = '#334155'

/** Tinted pill: the hue drives text, background and border together. */
function pillVars(label: string): React.CSSProperties {
  return { '--pill': LABEL_HUES[label] ?? FALLBACK_HUE } as React.CSSProperties
}

const PILL_COLOURS = 'text-(--pill) border-(--pill)/45 bg-(--pill)/10'

// A placeholder inside the masked text: 4px radius, 5px horizontal padding
// and NO vertical padding, so the line height of the surrounding text is
// left intact.
const tokenClass = `rounded-sm border px-[5px] font-mono text-[0.92em] whitespace-nowrap ${PILL_COLOURS}`

// The same hue in the source text: a 16% fill plus a 2px underline drawn
// with an inset shadow, which adds no width.
const highlightClass =
  'rounded-xs bg-(--pill)/16 pill-underline'

type PreviewSegment = { text: string; label?: string }

// Both locales demonstrate Swedish source data. The same segments drive each
// pair of views, so masking only replaces the labelled parts of the sample.
const examples = {
  freeText: [
    { text: 'Anna Lindqvist', label: 'NAMN' },
    { text: ' på ' },
    { text: 'Verkstadsgatan 12', label: 'ADRESS' },
    { text: ' i ' },
    { text: 'Malmö', label: 'PLATS' },
    { text: ' undrar om sin faktura.' },
  ],
  structured: [
    { text: 'E-post: ' },
    { text: 'anna@example.com', label: 'EPOST' },
    { text: '\nIP-adress: ' },
    { text: '192.0.2.42', label: 'IP_ADRESS' },
  ],
} satisfies Record<string, PreviewSegment[]>

const views = ['original', 'masked'] as const

function MaskPreview({ lang }: { lang: Lang }) {
  const t = translations[lang].maskPreview
  const [example, setExample] = useState<keyof typeof examples>('freeText')
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current || !('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        observer.disconnect()
      }
    }, { threshold: 0.25 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="on-white min-w-0 rounded-xl border border-neutral-200 bg-white p-5 text-ink">
      <div className="mask-demo-control mb-5">
        <p id="mask-example-label" className="mb-2 text-sm font-medium">{t.example}</p>
        <SegmentedControl<keyof typeof examples>
          aria-labelledby="mask-example-label"
          value={example}
          onValueChange={value => { if (value !== null) setExample(value) }}
          className="grid grid-cols-[2fr_3fr] gap-1 rounded-lg border border-neutral-200 p-1"
        >
          {(['freeText', 'structured'] as const).map(key => (
            <SegmentedControlItem
              key={key}
              value={key}
              className="min-h-11 cursor-pointer rounded-md px-2 py-1 text-sm font-medium leading-tight text-neutral-700 hover:bg-neutral-100 aria-checked:bg-cobalt aria-checked:text-white aria-checked:hover:bg-cobalt-deep"
            >
              {t[key]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </div>
      <Tabs defaultValue="masked">
        <TabsList aria-label={t.view} className="mask-demo-control inline-flex rounded-lg bg-neutral-100 p-1">
          {views.map(view => (
            <TabsTab key={view} value={view} className="rounded-md px-3 py-2 text-sm font-medium hover:text-cobalt aria-selected:bg-white aria-selected:text-cobalt aria-selected:shadow-flat-sm">
              {t[view]}
            </TabsTab>
          ))}
        </TabsList>
        {views.map(view => (
          <TabsPanel key={view} value={view} keepMounted className="mt-4">
            <noscript><strong>{t[view]}</strong></noscript>
            <p lang="sv" className="min-h-24 whitespace-pre-line text-base leading-8">
              {examples[example].map(({ text, label }, index) => {
                if (!label) return <Fragment key={index}>{text}</Fragment>
                if (view === 'original') {
                  return <span key={index} style={pillVars(label)} className={highlightClass}>{text}</span>
                }
                return (
                  <span
                    key={label}
                    translate="no"
                    style={{ ...pillVars(label), animationDelay: `${index * 0.05}s` }}
                    className={`${tokenClass} inline-block leading-snug ${inView ? 'mask-in' : ''}`}
                  >
                    [{label}_1]
                  </span>
                )
              })}
            </p>
          </TabsPanel>
        ))}
      </Tabs>
    </div>
  )
}

// Custom solid icons in the brand's folded geometry (isometric faces shaded
// with fill-opacity), decorative only. Kept inline in the page so no shared
// chunk is split out: an extra request near the LCP paint costs a simulated
// round-trip in Lighthouse's lantern model.
function Svg({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      {children}
    </svg>
  )
}

// AI: diamond node with satellites
function IconAI({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M12 9.8 14.8 12.6 12 15.4 9.2 12.6Z" />
      <circle fillOpacity="0.5" cx="12" cy="4.2" r="1.8" />
      <circle fillOpacity="0.5" cx="4.6" cy="16.8" r="1.8" />
      <circle fillOpacity="0.5" cx="19.4" cy="16.8" r="1.8" />
      <path
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        d="M12 6.4V9.4M9.9 14 6.5 16M14.1 14l3.5 2"
      />
    </Svg>
  )
}

// Logs: text lines, one masked by a solid chip
function IconLogs({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <rect fillOpacity="0.35" x="3" y="4" width="18" height="3" rx="1.5" />
      <rect fillOpacity="0.35" x="3" y="10.5" width="6" height="3" rx="1.5" />
      <rect x="11" y="10" width="7" height="4" rx="2" />
      <rect fillOpacity="0.35" x="3" y="17" width="12" height="3" rx="1.5" />
    </Svg>
  )
}

// Analytics: bars with slanted tops
function IconChart({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path fillOpacity="0.35" d="M4 20 4 15 8 13 8 20Z" />
      <path fillOpacity="0.65" d="M10 20 10 11 14 9 14 20Z" />
      <path d="M16 20 16 7 20 5 20 20Z" />
    </Svg>
  )
}

// Self-hosted: dashed perimeter, cube inside
function IconHosted({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <rect
        x="3.5"
        y="3.5"
        width="17"
        height="17"
        rx="4.5"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeWidth="1.6"
        strokeDasharray="3.2 2.8"
      />
      <path fillOpacity="0.35" d="M12 8 15.5 10 12 12 8.5 10Z" />
      <path fillOpacity="0.65" d="M8.5 10 12 12 12 15.5 8.5 13.5Z" />
      <path d="M12 12 15.5 10 15.5 13.5 12 15.5Z" />
    </Svg>
  )
}

// GDPR: shield in two folded halves
function IconShield({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M12 3 4 6 4 12C4 16.5 7.5 20 12 21.5Z" />
      <path fillOpacity="0.35" d="M12 3 20 6 20 12C20 16.5 16.5 20 12 21.5Z" />
    </Svg>
  )
}

// Integration: plug into socket
function IconIntegrate({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <rect x="3" y="9" width="7" height="7" rx="1.6" />
      <rect x="9.5" y="10.4" width="6" height="1.6" rx="0.8" />
      <rect x="9.5" y="13" width="6" height="1.6" rx="0.8" />
      <rect fillOpacity="0.35" x="15" y="7" width="6" height="11" rx="1.6" />
    </Svg>
  )
}

const useCaseIcons = [IconAI, IconLogs, IconChart]
const openLinkKeys = ['github', 'npm', 'huggingFace'] as const
const principleIcons = [IconHosted, IconShield, IconIntegrate]

/** The small arrow in the flow diagram: down while it stacks, right beside. */
function FlowArrow() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0 rotate-90 text-neutral-400 md:rotate-0"
    >
      <path d="M4 12h16m0 0-5-5m5 5-5 5" />
    </svg>
  )
}

export function MaskeraPage({ lang }: { lang: Lang }) {
  const t = maskeraCopy[lang]

  return (
    <>
      {/* Hero with the masking preview on the cobalt band. The headline
          stays static so nothing delays the LCP paint; the white preview
          card pops straight off the band. */}
      <section className={heroBand}>
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 pb-28 pt-24 md:grid-cols-2">
          <div>
            <h1 className={`${heroTitle} sm:text-5xl`}>{t.heroTitle}</h1>
            <p className={heroBodyOnCobalt}>{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={maskeraSite.home[lang]}
                {...externalLinkProps}
                className={btnPrimaryOnCobalt}
                translate="no"
              >
                {t.ctaVisit}
                <span aria-hidden="true" className={btnArrow}>
                  ↗
                </span>
              </a>
              <Link to={pagePaths.contact[lang]} className={btnSecondaryOnCobalt}>
                {t.ctaDemo}
              </Link>
            </div>
          </div>
          <MaskPreview lang={lang} />
        </div>
      </section>

      {/* The white sheet rolls over the band. Sections are separated by
          space, not rules. */}
      <div className={sheet}>
        {/* The three products, plain text with one link out to the plan
            comparison: prices and quotas live on maskera.dev only. */}
        <section className={container}>
          <h2 className={sectionTitle}>{t.productsTitle}</h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {t.products.map((item) => (
              <li key={item.title}>
                <h3 className={itemTitle}>{item.title}</h3>
                <p className={itemBody}>{item.body}</p>
              </li>
            ))}
          </ul>
          <a
            href={maskeraSite.services[lang]}
            {...externalLinkProps}
            className={`mt-10 ${btnSecondary} group`}
          >
            {t.productsLink}
            <span aria-hidden="true" className={btnArrow}>
              ↗
            </span>
          </a>
        </section>

        {/* Where it fits, drawn as the flow it is: text with personal data
            goes in, Maskera sits in the stream, masked text fans out to
            the three kinds of destination. */}
        <section className={container}>
          <h2 className={sectionTitle}>{t.fitTitle}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-[minmax(0,16rem)_auto_minmax(0,1fr)] md:items-center md:gap-8">
            <div className="rounded-xl border border-neutral-200 p-5">
              <p className="text-xs font-medium text-neutral-500">
                {t.previewBefore}
              </p>
              <p className="mt-2 text-sm leading-7 whitespace-nowrap">
                <span style={pillVars('NAMN')} className={highlightClass}>
                  Anna Lindqvist
                </span>
                ,{' '}
                <span style={pillVars('PERSONNUMMER')} className={highlightClass}>
                  900101-0000
                </span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 pl-5 md:flex-row md:items-center md:pl-0">
              <FlowArrow />
              <span
                translate="no"
                className="rounded-full bg-cobalt px-4 py-2 text-sm font-medium text-white"
              >
                Maskera
              </span>
              <FlowArrow />
            </div>
            <ul className="grid gap-6 border-l-2 border-cobalt/25 pl-6">
              {t.useCases.map((item, i) => {
                const Icon = useCaseIcons[i]
                return (
                  <li
                    key={item.title}
                    className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3"
                  >
                    <Icon className="mt-0.5 size-6 text-cobalt" />
                    <div>
                      <h3 className={itemTitle}>{item.title}</h3>
                      <p className="mt-1 text-pretty text-sm leading-relaxed text-neutral-600">
                        {item.body}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>

        {/* The detected types, grouped by the layer that finds them, each in
            its preview hue. Real text, not an image: this is the page's most
            quotable fact for search and AI answers. */}
        <section className={container}>
          <h2 className={sectionTitle}>{t.detectTitle}</h2>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
            {t.detectBody}
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {t.detectGroups.map((group) => (
              <div key={group.title}>
                <h3 className={itemTitle}>{group.title}</h3>
                <p className="mt-2 text-pretty text-sm leading-relaxed text-neutral-600">
                  {group.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(group.items).map(([label, name]) => (
                    <li
                      key={label}
                      style={pillVars(label)}
                      className={`rounded-md border px-2.5 py-0.5 text-sm ${PILL_COLOURS}`}
                    >
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className={container}>
          <h2 className={sectionTitle}>{t.builtTitle}</h2>
          <ul className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {t.principles.map((item, i) => {
              const Icon = principleIcons[i]
              return (
                <li key={item.title}>
                  <Icon className="size-8 text-cobalt" />
                  <h3 className={`mt-4 ${itemTitle}`}>{item.title}</h3>
                  <p className={itemBody}>{item.body}</p>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Open source: the trust argument is that the code, package and model
            are public, so the links are the content of this section. The
            page's one tinted surface. */}
        <section className="mx-auto w-full max-w-5xl px-6">
          <div className="rounded-3xl bg-neutral-50 p-6 sm:p-10 md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12">
            <div>
              <h2 className={sectionTitle}>{t.openTitle}</h2>
              <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
                {t.openBody}
              </p>
            </div>
            <ul className="mt-8 flex flex-col gap-3 md:mt-0">
              {openLinkKeys.map((key) => (
                <li key={key}>
                  <a
                    href={maskeraLinks[key]}
                    {...externalLinkProps}
                    className={`${btnSecondary} group w-full justify-between bg-white md:w-64`}
                  >
                    {t.openLinks[key]}
                    <span aria-hidden="true" className={btnArrow}>
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section>
          <div className={`${container} text-center`}>
            <h2 className={sectionTitle}>{t.bottomTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-neutral-600">
              {t.bottomBodyBefore}
              <a
                href={maskeraSite.home[lang]}
                {...externalLinkProps}
                className={linkInk}
                translate="no"
              >
                maskera.dev
              </a>
              {t.bottomBodyAfter}
            </p>
            <Link to={pagePaths.contact[lang]} className={`mt-8 ${btnPrimary}`}>
              {t.bottomCta}
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
