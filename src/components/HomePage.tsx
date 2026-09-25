import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { founderLinks, lighthouseReportsUrl, pagePaths } from '../seo'
import type { Lang } from '../seo'
import lighthouse from '../lighthouse-scores.json'
import { BrandSymbol } from './BrandSymbol'
import {
  brandOnCobalt,
  btnArrow,
  btnPrimary,
  btnPrimaryOnCobalt,
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

/* The masking preview, ported one-to-one from maskera-cloud
   (apps/web/src/lib/labels.ts + the HeroMaskPreview in routes/index.tsx):
   one hue per PII type, tinted highlights in the source text and placeholder
   pills that settle in with a staggered rise. Colour is reinforcement, never
   identity: every pill also carries its label as text.
   Duplicated in both page components on purpose: a shared module would be
   split into its own chunk, and an extra request near the LCP paint costs a
   simulated round-trip in Lighthouse's lantern model. */

type LabelMeta = { sv: string; light: string }

const LABELS: Record<string, LabelMeta> = {
  // names
  NAMN: { sv: 'Namn', light: '#1d4ed8' },
  // places and addresses
  PLATS: { sv: 'Plats', light: '#166534' },
  ADRESS: { sv: 'Adress', light: '#b8420a' },
  POSTNUMMER: { sv: 'Postnummer', light: '#3f6212' },
  LAGENHETSNUMMER: { sv: 'Lägenhetsnr', light: '#065f46' },
  // organisations
  ORGANISATION: { sv: 'Organisation', light: '#713f12' },
  ORGANISATIONSNUMMER: { sv: 'Org.nummer', light: '#854d0e' },
  // structured ids and contact details
  PERSONNUMMER: { sv: 'Personnummer', light: '#b91c1c' },
  SAMORDNINGSNUMMER: { sv: 'Samordningsnr', light: '#be123c' },
  EPOST: { sv: 'E-post', light: '#0369a1' },
  TELEFON: { sv: 'Telefon', light: '#115e59' },
  IBAN: { sv: 'IBAN', light: '#6d28d9' },
  BANKGIRO: { sv: 'Bankgiro', light: '#7e22ce' },
  PLUSGIRO: { sv: 'Plusgiro', light: '#a21caf' },
  KORTNUMMER: { sv: 'Kortnummer', light: '#be185d' },
  REGNUMMER: { sv: 'Reg.nummer', light: '#4338ca' },
  IP_ADRESS: { sv: 'IP-adress', light: '#334155' },
  URL: { sv: 'Länk', light: '#075985' },
}

const FALLBACK_LIGHT = '#334155'

/** Tinted pill: the hue drives text, background and border together. */
function pillVars(label: string): React.CSSProperties {
  return {
    '--pill': LABELS[label]?.light ?? FALLBACK_LIGHT,
  } as React.CSSProperties
}

const PILL_COLOURS = 'text-(--pill) border-(--pill)/45 bg-(--pill)/10'

// A placeholder inside the masked text: 4px radius, 5px horizontal padding
// and NO vertical padding, so the line height of the surrounding text is
// left intact.
const tokenClass = `rounded-sm border px-[5px] font-mono text-[0.92em] whitespace-nowrap ${PILL_COLOURS}`

// The same hue in the source text: a 16% fill plus a 2px underline drawn
// with an inset shadow, which adds no width.
const highlightClass = 'rounded-xs bg-(--pill)/16 pill-underline'

// The preview sentence, one segment per run of text. Labelled segments
// render highlighted in the before-row and as placeholder pills in the
// after-row, with the exact recipes from maskera-cloud so the card shows
// what a real response looks like.
const PREVIEW_SEGMENTS: Array<{ text: string; label?: string }> = [
  { text: 'Anna Lindqvist', label: 'NAMN' },
  { text: ' (' },
  // Intentionally invalid Luhn checksum, so this cannot be a real personnummer.
  { text: '900101-0000', label: 'PERSONNUMMER' },
  { text: ') på ' },
  { text: 'Verkstadsgatan 12', label: 'ADRESS' },
  { text: ' i ' },
  { text: 'Malmö', label: 'PLATS' },
  { text: ' undrar om sin faktura.' },
]

function MaskPreview({
  before,
  after,
  note,
}: {
  before: string
  after: string
  note?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  // idle: SSR/first paint, pills statically visible (also the no-JS state).
  // pending: JS confirmed the card is below the fold, pills hidden until it
  // scrolls into view. inView: run the staggered pill entrance. This way the
  // animation always plays when someone is actually looking at the card.
  const [state, setState] = useState<'idle' | 'pending' | 'inView'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) {
      setState('inView')
      return
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState('inView')
          observer.disconnect()
        } else {
          setState('pending')
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const pillState =
    state === 'inView' ? 'mask-in' : state === 'pending' ? 'opacity-0' : ''

  return (
    /* text-ink: the card can sit on the cobalt band, where the inherited
       color is white; uncolored runs in the preview text must stay ink on
       the white card. */
    <div
      ref={ref}
      className="rounded-xl border border-neutral-200 bg-white p-5 text-ink"
    >
      <p className="flex items-baseline justify-between gap-3 text-xs font-medium text-neutral-500">
        <span>{before}</span>
        {note ? (
          <span className="font-normal text-neutral-400">{note}</span>
        ) : null}
      </p>
      <p className="mt-2 text-sm leading-7">
        {PREVIEW_SEGMENTS.map((segment, index) =>
          segment.label ? (
            <span
              // Static list, index is the identity.
              key={`${index}-${segment.text}`}
              style={pillVars(segment.label)}
              className={highlightClass}
            >
              {segment.text}
            </span>
          ) : (
            <Fragment key={`${index}-${segment.text}`}>{segment.text}</Fragment>
          ),
        )}
      </p>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="my-3 size-4 text-neutral-400"
      >
        <path d="M12 4v16m0 0-5-5m5 5 5-5" />
      </svg>
      <p className="text-xs font-medium text-neutral-500">{after}</p>
      <p className="mt-2 text-sm leading-7">
        {PREVIEW_SEGMENTS.map((segment, index) =>
          segment.label ? (
            <span
              key={`${index}-${segment.text}`}
              style={{
                ...pillVars(segment.label),
                // Staggered by position so the pills land left to right.
                animationDelay: `${0.15 + index * 0.08}s`,
              }}
              // inline-block is what lets mask-in translate the pill, but it
              // also makes the box wrap a line box: leading-snug approximates
              // the font box an inline token gets, so the pills do not grow
              // into tall blocks.
              className={`${tokenClass} inline-block leading-snug ${pillState}`}
            >
              [{segment.label}_1]
            </span>
          ) : (
            <Fragment key={`${index}-${segment.text}`}>{segment.text}</Fragment>
          ),
        )}
      </p>
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

// Software development: isometric cube
function IconBuild({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path fillOpacity="0.35" d="M12 3 19.5 7.2 12 11.4 4.5 7.2Z" />
      <path fillOpacity="0.65" d="M4.5 7.2 12 11.4 12 20.4 4.5 16.2Z" />
      <path d="M12 11.4 19.5 7.2 19.5 16.2 12 20.4Z" />
    </Svg>
  )
}

// AI automation: chip with a folded core
function IconChip({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <rect fillOpacity="0.35" x="5" y="5" width="14" height="14" rx="2" />
      <path fillOpacity="0.65" d="M9 9 12 10.7 12 15.4 9 13.7Z" />
      <path d="M12 10.7 15 9 15 13.7 12 15.4Z" />
      <rect x="7.6" y="2" width="1.6" height="2.2" rx="0.8" />
      <rect x="11.2" y="2" width="1.6" height="2.2" rx="0.8" />
      <rect x="14.8" y="2" width="1.6" height="2.2" rx="0.8" />
      <rect x="7.6" y="19.8" width="1.6" height="2.2" rx="0.8" />
      <rect x="11.2" y="19.8" width="1.6" height="2.2" rx="0.8" />
      <rect x="14.8" y="19.8" width="1.6" height="2.2" rx="0.8" />
    </Svg>
  )
}

// Security and privacy: shield with two folded faces
function IconShield({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path
        fillOpacity="0.45"
        d="M4.5 5.5 12 2.5 12 21.5C7 19 4.5 15.1 4.5 10Z"
      />
      <path d="M12 2.5 19.5 5.5V10C19.5 15.1 17 19 12 21.5Z" />
    </Svg>
  )
}

// AI toolchain: folded workflow, three connected panels
function IconWorkflow({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M4 6 9.3 4 9.3 18 4 20Z" />
      <path fillOpacity="0.35" d="M9.3 4 14.6 6 14.6 20 9.3 18Z" />
      <path fillOpacity="0.65" d="M14.6 6 20 4 20 18 14.6 20Z" />
    </Svg>
  )
}

// Fast releases: lightning bolt, two facets
function IconBolt({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path d="M13 2 4.5 13.5 10 13.5 13.5 9.5Z" />
      <path fillOpacity="0.5" d="M10 13.5 9 22 19.5 9.5 13.5 9.5Z" />
    </Svg>
  )
}

const serviceIcons = [IconBuild, IconChip, IconShield]
const buildIcons = [IconWorkflow, IconBolt]

const scoreKeys = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
] as const

const copy = {
  sv: {
    heroKicker: 'Mjukvara, AI och automation från Stockholm',
    heroTitleA: 'Bygg med AI.',
    heroTitleB: 'Behåll er data.',
    heroBody:
      'Jag bygger mjukvara med AI i verktygskedjan varje dag. Det är därför jag vet exakt var data läcker, och därför allt jag bygger utgår från samma princip: er data stannar hos er.',
    ctaPrimary: 'Läs om Maskera',
    ctaSecondary: 'Hör av dig',
    teaserBody:
      'Maskera är det jag säljer. Den hittar och maskerar personuppgifter i text innan den når AI-system, loggar eller analysverktyg, så att ni kan använda AI utan att bjuda på era kunders data.',
    previewBefore: 'Er text',
    previewAfter: 'Det AI-modellen ser',
    previewNote: '',
    servicesTitle: 'Tjänster',
    servicesIntro:
      'Jag tar avgränsade uppdrag från idé och arkitektur till kod i produktion.',
    services: [
      {
        title: 'Mjukvaruutveckling',
        body: 'Jag bygger webbappar, API:er, interna verktyg och integrationer, i er befintliga kodbas eller från grunden.',
      },
      {
        title: 'AI & automation',
        body: 'Jag bygger AI-funktioner, agenter och automatiserade arbetsflöden runt era system, krav och känsliga data.',
      },
      {
        title: 'Säkerhet & integritet',
        body: 'Jag granskar och bygger system som hanterar känslig data. Konkreta förbättringar i arkitektur och kod, inte rapporter för hyllan.',
      },
    ],
    technologies: [
      {
        title: 'Gränssnitt',
        items: ['TypeScript', 'React', 'TanStack'],
      },
      {
        title: 'Backend',
        items: ['Node.js', 'Bun', 'Python', 'PostgreSQL', 'Docker'],
      },
      {
        title: 'AI & integrationer',
        items: ['AI-SDK:er', 'API:er', 'MCP', 'webhooks'],
      },
    ],
    buildTitle: 'Så bygger jag',
    build: [
      {
        title: 'AI i hela kedjan',
        body: 'Codex och Claude skriver kod med mig varje dag, kopplade mot mina system. Jag säljer inte AI-skräck, jag lever i verktygen och vet precis var gränsen för er data ska gå.',
      },
      {
        title: 'Snabba releaser, hårda grindar',
        body: 'Små releaser och CI/CD på allt. Varje ändring går genom kvalitetsgrindar som stoppar bygget om något inte håller måttet. Ni väntar inte ett kvartal på en fix.',
      },
    ],
    proofTitle: 'Löjligt hög ribba',
    proofBody:
      'Sajten du läser på just nu får toppbetyg i Lighthouse på varje sida, med full pott på tillgänglighet och SEO. Ingen bad om det. Samma precision hamnar i det jag bygger åt er.',
    scoreLabels: ['Prestanda', 'Tillgänglighet', 'Best practices', 'SEO'],
    scoresNote:
      'Lägsta resultatet över alla sidor, mätt dagligen mot den publicerade sajten.',
    scoresReports: 'Se rapporterna',
    aboutTitle: 'Att jobba med mig',
    aboutP1:
      'Hägvall Labs är jag. Det är jag som bygger produkterna, säljer dem och står för det som levereras. Inga mellanled.',
    aboutP2:
      'Jag jobbar direkt med företag och organisationer, främst i Sverige. Vi träffas digitalt, går igenom ert case och du får se vad jag bygger i praktiken. Sedan avgör du.',
    aboutRole: 'Grundare och utvecklare',
    aboutLinks: 'Kolla upp mig på',
    aboutCta: 'Hör av dig',
  },
  en: {
    heroKicker: 'Software, AI and Automation From Stockholm',
    heroTitleA: 'Build With AI.',
    heroTitleB: 'Keep Your Data.',
    heroBody:
      'I build software with AI in the toolchain every day. That’s why I know exactly where data leaks, and why everything I build starts from the same principle: your data stays on your side.',
    ctaPrimary: 'Read About Maskera',
    ctaSecondary: 'Get in Touch',
    teaserBody:
      'Maskera is what I sell. It finds and masks personal data in text before it reaches AI systems, logs or analytics tools, so you can use AI without giving away your customers’ data.',
    previewBefore: 'Your text',
    previewAfter: 'What the AI model sees',
    previewNote: 'Example in Swedish',
    servicesTitle: 'Services',
    servicesIntro:
      'I take on scoped projects from idea and architecture to production code.',
    services: [
      {
        title: 'Software Development',
        body: 'I build web apps, APIs, internal tools and integrations, in your existing codebase or from scratch.',
      },
      {
        title: 'AI & Automation',
        body: 'I build AI features, agents and automated workflows around your systems, requirements and sensitive data.',
      },
      {
        title: 'Security & Privacy',
        body: 'I review and build systems that handle sensitive data. Concrete improvements to architecture and code, not reports that gather dust.',
      },
    ],
    technologies: [
      {
        title: 'Interfaces',
        items: ['TypeScript', 'React', 'TanStack'],
      },
      {
        title: 'Backend',
        items: ['Node.js', 'Bun', 'Python', 'PostgreSQL', 'Docker'],
      },
      {
        title: 'AI & Integrations',
        items: ['AI SDKs', 'APIs', 'MCP', 'webhooks'],
      },
    ],
    buildTitle: 'How I Build',
    build: [
      {
        title: 'AI in the Toolchain',
        body: 'Codex and Claude write code with me every day, wired into my systems. I don’t sell AI fear, I live in these tools and know exactly where the line for your data should go.',
      },
      {
        title: 'Fast Releases, Hard Gates',
        body: 'Small releases and CI/CD on everything. Every change passes quality gates that fail the build if anything slips. You won’t wait a quarter for a fix.',
      },
    ],
    proofTitle: 'A Ridiculously High Bar',
    proofBody:
      'The site you’re reading scores top marks in Lighthouse on every page, with a perfect score for accessibility and SEO. Nobody asked for that. The same precision goes into everything I build for you.',
    scoreLabels: ['Performance', 'Accessibility', 'Best Practices', 'SEO'],
    scoresNote:
      'The lowest score across all pages, measured daily against the live site.',
    scoresReports: 'See the Reports',
    aboutTitle: 'Working With Me',
    aboutP1:
      'Hägvall Labs is me. I build the products, I sell them and I stand behind what ships. No layers in between.',
    aboutP2:
      'I work directly with companies and organizations, primarily in Sweden. We meet online, walk through your case and you see what I build in practice. Then you decide.',
    aboutRole: 'Founder and Developer',
    aboutLinks: 'Look me up on',
    aboutCta: 'Get in Touch',
  },
}

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

/** A titled list with an icon per item: the services and working habits.
    Plain rows instead of cards, the icons in cobalt without a chip. */
function ItemList({
  items,
  icons,
}: {
  items: ReadonlyArray<{ title: string; body: string }>
  icons: ReadonlyArray<(props: { className?: string }) => React.ReactNode>
}) {
  return (
    <ul className="grid content-start gap-10">
      {items.map((item, i) => {
        const Icon = icons[i]
        return (
          <li
            key={item.title}
            className="grid grid-cols-[2rem_minmax(0,1fr)] gap-x-4"
          >
            <Icon className="mt-0.5 size-8 text-cobalt" />
            <div>
              <h3 className={itemTitle}>{item.title}</h3>
              <p className={itemBody}>{item.body}</p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      {/* Hero on the cobalt band: the promise on the left, the symbol on
          the right, in 3D once the page is idle (BrandHero). The headline
          and body stay static so nothing delays the LCP paint. The bottom
          padding leaves room for the sheet's rounded overlap. */}
      <section className={heroBand}>
        <div className="mx-auto grid w-full max-w-5xl gap-8 px-6 pb-24 pt-12 md:pb-28 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center lg:gap-12">
          <div>
            {/* What and where, before the headline. The company name is
                already the header's wordmark right above. */}
            <p className={`mb-4 ${kickerOnCobalt}`}>{t.heroKicker}</p>
            {/* One sentence per line: the pair is the whole pitch, set large
                rather than colored apart. */}
            <h1 className={`${heroTitle} sm:text-6xl`}>
              <span className="block">{t.heroTitleA}</span>{' '}
              <span className="block">{t.heroTitleB}</span>
            </h1>
            <p className={heroBodyOnCobalt}>{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to={pagePaths.maskera[lang]} className={btnPrimaryOnCobalt}>
                {t.ctaPrimary}
              </Link>
              <Link
                to={pagePaths.contact[lang]}
                className={btnSecondaryOnCobalt}
              >
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
          {/* Visually first below lg (CSS order, DOM order unchanged), so
              the headline stays the first element and the LCP paint. */}
          <div className="order-first lg:order-0">
            <BrandHero />
          </div>
        </div>
      </section>

      {/* The white sheet: everything below the band rolls over it with
          rounded top corners. Sections are separated by space, not rules. */}
      <div className={sheet}>
        {/* Maskera: what it is in one sentence, next to the preview that
            shows it working. */}
        <section
          className={`${container} grid gap-10 md:grid-cols-2 md:items-center`}
        >
          <div>
            <h2 className={sectionTitle} translate="no">
              Maskera
            </h2>
            <p className="mt-5 text-pretty text-lg leading-snug tracking-tight text-ink sm:text-xl">
              {t.teaserBody}
            </p>
            {/* The product page is the hero's primary button; here only the
                product site. */}
            <p className="mt-8 text-sm font-medium">
              <a
                href="https://maskera.dev"
                {...externalLinkProps}
                className={`group inline-flex items-center gap-1 ${linkCobalt}`}
                translate="no"
                data-umami-event="outbound-link-click"
                data-umami-event-destination="maskera.dev"
                data-umami-event-placement="home-product"
              >
                maskera.dev
                <span aria-hidden="true" className={btnArrow}>
                  ↗
                </span>
              </a>
            </p>
          </div>
          <MaskPreview
            before={t.previewBefore}
            after={t.previewAfter}
            note={t.previewNote}
          />
        </section>

        {/* Services: heading and intro on the left, the services as a plain
            list on the right, the stack underneath. */}
        <section
          id="services"
          className={`${container} grid scroll-mt-20 gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16`}
        >
          <div>
            <h2 className={sectionTitle}>{t.servicesTitle}</h2>
            <p className="mt-4 text-pretty leading-relaxed text-neutral-600">
              {t.servicesIntro}
            </p>
          </div>
          <div>
            <ItemList items={t.services} icons={serviceIcons} />
            <dl className="mt-12 grid gap-5 sm:grid-cols-3 sm:gap-6">
              {t.technologies.map((group) => (
                <div key={group.title}>
                  <dt className="text-sm font-medium text-neutral-500">
                    {group.title}
                  </dt>
                  <dd
                    translate="no"
                    className="mt-1 text-pretty text-sm leading-relaxed text-ink"
                  >
                    {group.items.join(', ')}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* How I build: two working habits, and the proof of the third as
            the real numbers from the daily public Lighthouse run
            (src/lighthouse-scores.json, never edited by hand). */}
        <section className={container}>
          <h2 className={sectionTitle}>{t.buildTitle}</h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
            <ItemList items={t.build} icons={buildIcons} />
            <div className="rounded-3xl bg-neutral-50 p-6 sm:p-8">
              <h3 className={itemTitle}>{t.proofTitle}</h3>
              <p className={itemBody}>{t.proofBody}</p>
              <dl className="mt-8 grid grid-cols-2 gap-6">
                {scoreKeys.map((key, i) => (
                  <div key={key}>
                    <dt className="text-sm text-neutral-600">
                      {t.scoreLabels[i]}
                    </dt>
                    <dd className="mt-1 text-5xl font-semibold tracking-[-0.03em] text-cobalt tabular-nums">
                      {lighthouse.scores[key]}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-8 text-pretty text-sm leading-relaxed text-neutral-600">
                {t.scoresNote}{' '}
                <a
                  href={lighthouseReportsUrl}
                  {...externalLinkProps}
                  className={linkInk}
                  data-umami-event="outbound-link-click"
                  data-umami-event-destination="github.io"
                  data-umami-event-placement="home-lighthouse"
                >
                  {t.scoresReports}
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* About / contact. The portrait is a real photo of Joel: below the
            fold and lazy, so it never touches the LCP. */}
        <section>
          <div className={container}>
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
                    data-umami-event="outbound-link-click"
                    data-umami-event-destination="joelhagvall.com"
                    data-umami-event-placement="home-founder"
                  >
                    Joel Hägvall
                  </a>
                </p>
                <p className="text-sm text-neutral-600">{t.aboutRole}</p>
                <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
                  {t.aboutP1}
                </p>
                <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
                  {t.aboutP2}
                </p>
                <p className="mt-4 text-sm text-neutral-600">
                  {t.aboutLinks}{' '}
                  <a
                    href={founderLinks.linkedin}
                    {...externalLinkProps}
                    className={linkInk}
                    data-umami-event="outbound-link-click"
                    data-umami-event-destination="linkedin.com"
                    data-umami-event-placement="home-founder"
                  >
                    LinkedIn
                  </a>
                  {' / '}
                  <a
                    href={founderLinks.github}
                    {...externalLinkProps}
                    className={linkInk}
                    data-umami-event="outbound-link-click"
                    data-umami-event-destination="github.com"
                    data-umami-event-placement="home-founder"
                  >
                    GitHub
                  </a>
                  .
                </p>
                <Link
                  to={pagePaths.contact[lang]}
                  className={`mt-8 ${btnPrimary}`}
                >
                  {t.aboutCta}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
