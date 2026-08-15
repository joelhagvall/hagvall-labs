import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { pagePaths } from '../seo'
import type { Lang } from '../seo'
import { BrandSymbol } from './BrandSymbol'
import {
  Cards,
  HeroGlows,
  RevealObserver,
  btnArrow,
  btnPrimary,
  btnSecondary,
  container,
  heroBody,
  heroTitle,
  kicker,
  linkCobalt,
  linkInk,
  sectionTitle,
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
  return { '--pill': LABELS[label]?.light ?? FALLBACK_LIGHT } as React.CSSProperties
}

const PILL_COLOURS = 'text-(--pill) border-(--pill)/45 bg-(--pill)/10'

// A placeholder inside the masked text: 4px radius, 5px horizontal padding
// and NO vertical padding, so the line height of the surrounding text is
// left intact.
const tokenClass = `rounded-sm border px-[5px] font-mono text-[0.92em] whitespace-nowrap ${PILL_COLOURS}`

// The same hue in the source text: a 16% fill plus a 2px underline drawn
// with an inset shadow, which adds no width.
const highlightClass =
  'rounded-xs bg-(--pill)/16 shadow-[inset_0_-2px_0_var(--pill)]'

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
    <div ref={ref} className="rounded-xl border border-neutral-200 bg-white p-5">
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
      <path fillOpacity="0.45" d="M4.5 5.5 12 2.5 12 21.5C7 19 4.5 15.1 4.5 10Z" />
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

// Precision: cut gem, three facets
function IconGem({ className }: { className?: string }) {
  return (
    <Svg className={className}>
      <path fillOpacity="0.35" d="M6.5 4.5 17.5 4.5 20.5 10 3.5 10Z" />
      <path fillOpacity="0.65" d="M3.5 10 12 10 12 21Z" />
      <path d="M12 10 20.5 10 12 21Z" />
    </Svg>
  )
}

const serviceIcons = [IconBuild, IconChip, IconShield]
const buildIcons = [IconWorkflow, IconBolt, IconGem]

const copy = {
  sv: {
    heroAccent: 'Bygg med AI.',
    heroTitleB: ' Behåll er data.',
    heroBody:
      'Jag bygger mjukvara med AI i verktygskedjan varje dag. Det är därför jag vet exakt var data läcker, och därför allt jag bygger utgår från samma princip: er data stannar hos er.',
    ctaPrimary: 'Upptäck Maskera',
    ctaSecondary: 'Boka en demo',
    teaserKicker: 'Det jag säljer',
    teaserBody:
      'Maskera hittar och maskerar personuppgifter i text innan den når AI-system, loggar eller analysverktyg. Byggd för att ni ska kunna använda AI utan att bjuda på era kunders data.',
    teaserMore: 'Läs mer om Maskera →',
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
      {
        title: 'Löjligt hög ribba',
        body: 'Sajten du läser på just nu får toppbetyg i Lighthouse på varje sida, med full pott på tillgänglighet och SEO. Ingen bad om det. Samma precision hamnar i det jag bygger åt er.',
      },
    ],
    aboutTitle: 'Att jobba med mig',
    aboutP1a: 'Hägvall Labs är jag, ',
    aboutP1b:
      '. Det är jag som bygger produkterna, säljer dem och står för det som levereras. Inga mellanled.',
    aboutP2:
      'Jag jobbar direkt med företag och organisationer, främst i Sverige. Vi träffas digitalt och jag visar produkten på era egna data. Räcker inte det som bevis ska ni inte köpa.',
    aboutCta: 'Hör av dig',
  },
  en: {
    heroAccent: 'Build With AI.',
    heroTitleB: ' Keep Your Data.',
    heroBody:
      'I build software with AI in the toolchain every day. That’s why I know exactly where data leaks, and why everything I build starts from the same principle: your data stays on your side.',
    ctaPrimary: 'Discover Maskera',
    ctaSecondary: 'Book a Demo',
    teaserKicker: 'What I Sell',
    teaserBody:
      'Maskera finds and masks personal data in text before it reaches AI systems, logs or analytics tools. Built so you can use AI without giving away your customers’ data.',
    teaserMore: 'Learn More About Maskera →',
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
      {
        title: 'A Ridiculously High Bar',
        body: 'The site you’re reading scores top marks in Lighthouse on every page, with a perfect score for accessibility and SEO. Nobody asked for that. The same precision goes into everything I build for you.',
      },
    ],
    aboutTitle: 'Working With Me',
    aboutP1a: 'Hägvall Labs is me, ',
    aboutP1b:
      '. I build the products, I sell them and I stand behind what ships. No layers in between.',
    aboutP2:
      'I work directly with companies and organizations, primarily in Sweden. We meet online and I show you the product on your own data. If that doesn’t convince you, you shouldn’t buy.',
    aboutCta: 'Get in Touch',
  },
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      <RevealObserver />
      {/* Hero. Decorative glows and the symbol animate; the headline and body
          stay static so nothing delays the LCP paint. */}
      <section className="relative isolate overflow-hidden">
        <HeroGlows />
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 px-6 pb-12 pt-16 md:grid-cols-[1fr_auto] md:gap-12 md:pb-24 md:pt-24">
          <div>
            <h1 className={`${heroTitle} sm:text-6xl`}>
              <span className="text-cobalt">{t.heroAccent}</span>
              {t.heroTitleB}
            </h1>
            <p className={heroBody}>{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link to={pagePaths.maskera[lang]} className={btnPrimary}>
                {t.ctaPrimary}
                <span aria-hidden="true" className={btnArrow}>
                  →
                </span>
              </Link>
              <Link to={pagePaths.contact[lang]} className={btnSecondary}>
                {t.ctaSecondary}
              </Link>
            </div>
          </div>
          {/* Visually first on mobile (CSS order, DOM order unchanged), so
              the headline stays the first element and the LCP paint. */}
          <div className="animate-float order-first md:order-0">
            <BrandSymbol
              size={230}
              animated
              className="size-20 md:size-57.5"
            />
          </div>
        </div>
      </section>

      {/* Maskera teaser */}
      <section className="border-y border-neutral-200 bg-cobalt/3">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div className="reveal">
            <p className={`mb-3 ${kicker}`}>{t.teaserKicker}</p>
            <h2 className={sectionTitle} translate="no">
              Maskera
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-neutral-600">
              {t.teaserBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium">
              <Link to={pagePaths.maskera[lang]} className={linkCobalt}>
                {t.teaserMore}
              </Link>
              <a
                href="https://maskera.dev"
                className={linkCobalt}
                translate="no"
                data-umami-event="outbound-link-click"
                data-umami-event-destination="maskera.dev"
                data-umami-event-placement="home-product"
              >
                maskera.dev →
              </a>
            </div>
          </div>
          <div className="reveal">
            <MaskPreview
              before={t.previewBefore}
              after={t.previewAfter}
              note={t.previewNote}
            />
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className={`${container} scroll-mt-20`}>
        <h2 className={`reveal ${sectionTitle}`}>
          {t.servicesTitle}
        </h2>
        <p className="reveal mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
          {t.servicesIntro}
        </p>
        <Cards
          items={t.services}
          icons={serviceIcons}
          className="mt-10 sm:grid-cols-3"
        />
        <dl className="reveal mt-8 grid gap-5 border-t border-neutral-200 pt-6 sm:grid-cols-3 sm:gap-6">
          {t.technologies.map((group) => (
            <div key={group.title}>
              <dt className="text-xs font-medium tracking-wide text-neutral-500">
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
      </section>

      {/* How I build */}
      <section className="border-t border-neutral-200">
        <div className={container}>
          <h2 className={`reveal ${sectionTitle}`}>
            {t.buildTitle}
          </h2>
          <Cards
            items={t.build}
            icons={buildIcons}
            className="mt-10 sm:grid-cols-3"
          />
        </div>
      </section>

      {/* About / contact */}
      <section className="border-t border-neutral-200">
        <div className={`reveal ${container}`}>
          <h2 className={sectionTitle}>
            {t.aboutTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
            {t.aboutP1a}
            <a
              href="https://joelhagvall.com"
              className={linkInk}
              data-umami-event="outbound-link-click"
              data-umami-event-destination="joelhagvall.com"
              data-umami-event-placement="home-founder"
            >
              Joel Hägvall
            </a>
            {t.aboutP1b}
          </p>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
            {t.aboutP2}
          </p>
          <Link to={pagePaths.contact[lang]} className={`mt-8 ${btnPrimary}`}>
            {t.aboutCta}
          </Link>
        </div>
      </section>
    </>
  )
}
