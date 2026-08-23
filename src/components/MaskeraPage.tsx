import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { maskeraLinks, pagePaths } from '../seo'
import type { Lang } from '../seo'
import {
  Cards,
  HeroGlows,
  RevealObserver,
  btnArrow,
  btnPrimary,
  btnSecondary,
  container,
  externalLinkProps,
  heroBody,
  heroTitle,
  kicker,
  linkInk,
  sectionTitle,
  sectionTitleSm,
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
  'rounded-xs bg-(--pill)/16 pill-underline'

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
const principleIcons = [IconHosted, IconShield, IconIntegrate]

const copy = {
  sv: {
    heroTitle: 'Maskera personuppgifter innan de når er AI.',
    heroBody:
      'Maskera hittar och maskerar namn, personnummer, adresser och telefonnummer i text, innan den används i AI-system, loggar eller analysverktyg. Byggd för svensk text och svenska personuppgifter.',
    ctaVisit: 'Besök maskera.dev',
    ctaDemo: 'Boka en demo',
    previewBefore: 'Er text',
    previewAfter: 'Det AI-modellen ser',
    previewNote: '',
    fitTitle: 'Där Maskera passar in',
    useCases: [
      {
        title: 'AI-system',
        body: 'Skicka prompter och dokument till AI-modeller utan att läcka namn, personnummer eller kontaktuppgifter.',
      },
      {
        title: 'Loggar',
        body: 'Behåll loggarna användbara för felsökning, minus personuppgifterna.',
      },
      {
        title: 'Analys',
        body: 'Mata analys- och BI-verktyg med text som är fri från personuppgifter.',
      },
    ],
    builtTitle: 'Så är den byggd',
    principles: [
      {
        title: 'Self-hosted som standard',
        body: 'Maskera installeras hos er och texten stannar hos er. Inga molnberoenden, ingen tredje part i flödet.',
      },
      {
        title: 'Byggd för GDPR',
        body: 'Att maskera personuppgifter tidigt är dataminimering på riktigt: mindre data att skydda, färre system som omfattas.',
      },
      {
        title: 'Enkel att integrera',
        body: 'Ett rakt API som passar in i flödena ni redan har: före AI-anropet, före loggningen, före exporten.',
      },
    ],
    openTitle: 'Granska själv',
    openBody:
      'Kärnan i Maskera är öppen: koden ligger på GitHub, paketet på npm och NER-modellen på Hugging Face. Ni behöver inte ta mitt ord för hur den fungerar, ni kan läsa den och köra den innan ni pratar med mig.',
    openLinks: [
      { label: 'Källkod på GitHub', href: maskeraLinks.github, destination: 'github.com' },
      { label: 'Paketet på npm', href: maskeraLinks.npm, destination: 'npmjs.com' },
      { label: 'Modellen på Hugging Face', href: maskeraLinks.huggingFace, destination: 'huggingface.co' },
    ],
    bottomTitle: 'Se Maskera på era egna data.',
    bottomBodyA:
      'Hur träffsäker är den? Det svaret får ni på era egna data i piloten, inte från ett säljblad. Jag kör pilotprojekt med företag och organisationer i Sverige. Hör av dig så visar jag hur det ser ut, eller läs mer på ',
    bottomCta: 'Starta ett pilotprojekt',
  },
  en: {
    heroTitle: 'Mask Personal Data Before It Reaches Your AI.',
    heroBody:
      'Maskera finds and masks names, personal identity numbers, addresses and phone numbers in text, before it is used in AI systems, logs or analytics tools. Built for Swedish text and Swedish personal data.',
    ctaVisit: 'Visit maskera.dev',
    ctaDemo: 'Book a Demo',
    previewBefore: 'Your text',
    previewAfter: 'What the AI model sees',
    previewNote: 'Example in Swedish',
    fitTitle: 'Where Maskera Fits',
    useCases: [
      {
        title: 'AI Systems',
        body: 'Send prompts and documents to AI models without leaking names, personal identity numbers or contact details.',
      },
      {
        title: 'Logs',
        body: 'Keep your logs useful for debugging, minus the personal data.',
      },
      {
        title: 'Analytics',
        body: 'Feed analytics and BI tools with text that is free of personal data.',
      },
    ],
    builtTitle: 'How It’s Built',
    principles: [
      {
        title: 'Self-Hosted by Default',
        body: 'Maskera is installed on your side and the text stays on your side. No cloud dependencies, no third party in the flow.',
      },
      {
        title: 'Built for GDPR',
        body: 'Masking personal data early is data minimization for real: less data to protect, fewer systems in scope.',
      },
      {
        title: 'Simple to Integrate',
        body: 'A straightforward API that fits the flows you already have: before the AI call, before the log write, before the export.',
      },
    ],
    openTitle: 'Inspect It Yourself',
    openBody:
      'The core of Maskera is open: the code is on GitHub, the package on npm and the NER model on Hugging Face. You don’t have to take my word for how it works, you can read it and run it before you talk to me.',
    openLinks: [
      { label: 'Source on GitHub', href: maskeraLinks.github, destination: 'github.com' },
      { label: 'Package on npm', href: maskeraLinks.npm, destination: 'npmjs.com' },
      { label: 'Model on Hugging Face', href: maskeraLinks.huggingFace, destination: 'huggingface.co' },
    ],
    bottomTitle: 'See Maskera on Your Own Data.',
    bottomBodyA:
      'How accurate is it? You get that answer on your own data in the pilot, not from a sales deck. I run pilot projects with companies and organizations in Sweden. Get in touch and I’ll show you what it looks like, or read more at ',
    bottomCta: 'Start a Pilot',
  },
}

export function MaskeraPage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      <RevealObserver />
      {/* Hero with the masking preview. The headline stays static so nothing
          delays the LCP paint. */}
      <section className="relative isolate overflow-hidden">
        <HeroGlows />
        <div className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 pb-20 pt-24 md:grid-cols-2">
          <div>
            <p className={`mb-4 ${kicker}`} translate="no">
              Maskera
            </p>
            <h1 className={`${heroTitle} sm:text-5xl`}>{t.heroTitle}</h1>
            <p className={heroBody}>{t.heroBody}</p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="https://maskera.dev"
                {...externalLinkProps}
                className={btnPrimary}
                translate="no"
                data-umami-event="outbound-link-click"
                data-umami-event-destination="maskera.dev"
                data-umami-event-placement="maskera-hero"
              >
                {t.ctaVisit}
                <span aria-hidden="true" className={btnArrow}>
                  ↗
                </span>
              </a>
              <Link to={pagePaths.contact[lang]} className={btnSecondary}>
                {t.ctaDemo}
              </Link>
            </div>
          </div>
          <MaskPreview
            before={t.previewBefore}
            after={t.previewAfter}
            note={t.previewNote}
          />
        </div>
      </section>

      <section className="border-y border-neutral-200">
        <div className={container}>
          <h2 className={`reveal ${sectionTitleSm}`}>
            {t.fitTitle}
          </h2>
          <Cards
            items={t.useCases}
            icons={useCaseIcons}
            className="mt-8 sm:grid-cols-3"
          />
        </div>
      </section>

      <section className={container}>
        <h2 className={`reveal ${sectionTitleSm}`}>
          {t.builtTitle}
        </h2>
        <Cards
          items={t.principles}
          icons={principleIcons}
          className="mt-8 sm:grid-cols-3"
        />
      </section>

      {/* Open source: the trust argument is that the code, package and model
          are public, so the links are the content of this section. */}
      <section className="border-t border-neutral-200">
        <div className={`reveal ${container} md:grid md:grid-cols-[1fr_auto] md:items-center md:gap-12`}>
          <div>
            <h2 className={sectionTitleSm}>{t.openTitle}</h2>
            <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
              {t.openBody}
            </p>
          </div>
          <ul className="mt-8 flex flex-col gap-3 md:mt-0">
            {t.openLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  {...externalLinkProps}
                  className={`${btnSecondary} group w-full justify-between md:w-64`}
                  data-umami-event="outbound-link-click"
                  data-umami-event-destination={link.destination}
                  data-umami-event-placement="maskera-open"
                >
                  {link.label}
                  <span aria-hidden="true" className={btnArrow}>
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className={`reveal ${container} text-center`}>
          <h2 className={sectionTitle}>
            {t.bottomTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-neutral-600">
            {t.bottomBodyA}
            <a
              href="https://maskera.dev"
              {...externalLinkProps}
              className={linkInk}
              translate="no"
              data-umami-event="outbound-link-click"
              data-umami-event-destination="maskera.dev"
              data-umami-event-placement="maskera-bottom"
            >
              maskera.dev
            </a>
            .
          </p>
          <Link to={pagePaths.contact[lang]} className={`mt-8 ${btnPrimary}`}>
            {t.bottomCta}
          </Link>
        </div>
      </section>
    </>
  )
}
