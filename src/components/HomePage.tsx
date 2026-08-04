import { Link } from '@tanstack/react-router'
import type { Lang } from '../seo'
import { BrandSymbol } from './BrandSymbol'

const copy = {
  sv: {
    kicker: 'Hägvall Labs AB',
    heroTitle: 'Integritetssäker mjukvara för AI-eran.',
    heroBody:
      'Jag utvecklar, licensierar och säljer programvara inom informationssäkerhet, integritetsskydd och artificiell intelligens, byggd för att köras i er egen IT-miljö.',
    ctaPrimary: 'Upptäck Maskera',
    ctaSecondary: 'Boka en demo',
    teaserKicker: 'Min första produkt',
    teaserBody:
      'Maskera identifierar och maskerar personuppgifter i text innan informationen används i AI-system, loggar eller analysverktyg. Körs helt i er egen infrastruktur. Ingen data lämnar er organisation.',
    teaserMore: 'Läs mer om Maskera →',
    exampleIn: '// indata',
    exampleOut: '// utdata',
    exampleText: 'Anna Svensson (740512-1234) ringde om sin faktura.',
    exampleMaskedTail: ') ringde om sin faktura.',
    maskName: '[NAMN]',
    maskSsn: '[PERSONNR]',
    servicesTitle: 'Vad jag erbjuder',
    services: [
      {
        title: 'Pilotprojekt',
        body: 'Avgränsade piloter som bevisar värdet i er miljö innan ni binder er: tydliga mål, fast tidsram, riktiga dataflöden.',
      },
      {
        title: 'Programvarulicenser',
        body: 'Årliga licenser för programvara som installeras och körs i er egen IT-miljö. Er data lämnar aldrig er infrastruktur.',
      },
      {
        title: 'Installation & support',
        body: 'Jag sköter driftsättning, integration och löpande support så att ert team kan fokusera på att använda produkten, inte drifta den.',
      },
      {
        title: 'Konsulttjänster',
        body: 'Praktisk konsultation inom systemutveckling och IT-säkerhet, från arkitekturgenomgångar till implementation.',
      },
    ],
    aboutTitle: 'Att jobba med mig',
    aboutP1a: 'Hägvall Labs AB är ett enmansbolag. Jag heter ',
    aboutP1b:
      ' och ansvarar personligen för allt bolaget bygger och levererar, utan mellanled.',
    aboutP2:
      'Jag arbetar direkt med företag och organisationer, främst i Sverige, via webbplats, digitala möten, demonstrationer och avtal. Betalning sker mot faktura via banköverföring. Verksamheten bedrivs helt online.',
    aboutCta: 'Hör av dig',
  },
  en: {
    kicker: 'Hägvall Labs AB',
    heroTitle: 'Privacy-First Software for the AI Era.',
    heroBody:
      'I develop, license and sell software for information security, privacy protection and artificial intelligence, built to run in your own IT environment.',
    ctaPrimary: 'Discover Maskera',
    ctaSecondary: 'Book a Demo',
    teaserKicker: 'My First Product',
    teaserBody:
      'Maskera identifies and masks personal data in text before the information is used in AI systems, logs or analytics tools. It runs entirely inside your own infrastructure. No data ever leaves your organization.',
    teaserMore: 'Learn More About Maskera →',
    exampleIn: '// input',
    exampleOut: '// output',
    exampleText: 'Anna Svensson (740512-1234) called about her invoice.',
    exampleMaskedTail: ') called about her invoice.',
    maskName: '[NAME]',
    maskSsn: '[SSN]',
    servicesTitle: 'What I Offer',
    services: [
      {
        title: 'Pilot Projects',
        body: 'Scoped pilots that prove value in your environment before you commit: clear goals, fixed timeline, real data flows.',
      },
      {
        title: 'Software Licensing',
        body: 'Annual licenses for software installed and running in your own IT environment. Your data never leaves your infrastructure.',
      },
      {
        title: 'Installation & Support',
        body: 'I handle deployment, integration and ongoing support so your team can focus on using the product, not operating it.',
      },
      {
        title: 'Consulting',
        body: 'Hands-on consulting in systems development and IT security, from architecture reviews to implementation.',
      },
    ],
    aboutTitle: 'Working With Me',
    aboutP1a: 'Hägvall Labs AB is a one-person company. I’m ',
    aboutP1b:
      ', and I’m personally responsible for everything the company builds and ships. No layers, no handoffs.',
    aboutP2:
      'I work directly with companies and organizations, primarily in Sweden, through this website, digital meetings, demonstrations and agreements. Invoicing by standard bank transfer. The company operates fully online.',
    aboutCta: 'Get in Touch',
  },
}

export function HomePage({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const maskeraLink = (className: string, label: string) =>
    lang === 'sv' ? (
      <Link to="/maskera" className={className}>
        {label}
      </Link>
    ) : (
      <Link to="/en/maskera" className={className}>
        {label}
      </Link>
    )

  return (
    <>
      {/* Hero */}
      <section className="mx-auto grid w-full max-w-5xl items-center gap-12 px-6 pb-24 pt-24 md:grid-cols-[1fr_auto]">
        <div>
          <p
            className="mb-4 text-sm font-medium uppercase tracking-widest text-cobalt"
            translate="no"
          >
            {t.kicker}
          </p>
          <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600">
            {t.heroBody}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {maskeraLink(
              'rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep',
              t.ctaPrimary,
            )}
            <a
              href="mailto:hello@hagvall-labs.com"
              className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:border-cobalt hover:text-cobalt"
            >
              {t.ctaSecondary}
            </a>
          </div>
        </div>
        <BrandSymbol size={230} className="hidden md:block" />
      </section>

      {/* Maskera teaser */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-cobalt">
              {t.teaserKicker}
            </p>
            <h2
              className="text-balance text-3xl font-semibold tracking-tight"
              translate="no"
            >
              Maskera
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-neutral-600">
              {t.teaserBody}
            </p>
            <div className="mt-6 flex flex-wrap gap-6 text-sm font-medium">
              {maskeraLink(
                'text-cobalt underline underline-offset-4 transition-colors hover:text-cobalt-deep',
                t.teaserMore,
              )}
              <a
                href="https://maskera.dev"
                className="text-cobalt underline underline-offset-4 transition-colors hover:text-cobalt-deep"
                translate="no"
              >
                maskera.dev →
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 font-mono text-sm leading-7 shadow-sm">
            <p className="text-neutral-400">{t.exampleIn}</p>
            <p className="break-words">{t.exampleText}</p>
            <p className="mt-4 text-neutral-400">{t.exampleOut}</p>
            <p className="break-words">
              <span className="rounded bg-cobalt px-1.5 py-0.5 text-white">
                {t.maskName}
              </span>{' '}
              (
              <span className="rounded bg-teal-deep px-1.5 py-0.5 text-white">
                {t.maskSsn}
              </span>
              {t.exampleMaskedTail}
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section
        id="services"
        className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20"
      >
        <h2 className="text-balance text-3xl font-semibold tracking-tight">
          {t.servicesTitle}
        </h2>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {t.services.map((s) => (
            <div key={s.title}>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-neutral-600">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About / contact */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-balance text-3xl font-semibold tracking-tight">
            {t.aboutTitle}
          </h2>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
            {t.aboutP1a}
            <a
              href="https://joelhagvall.com"
              className="underline underline-offset-4 transition-colors hover:text-ink"
            >
              Joel Hägvall
            </a>
            {t.aboutP1b}
          </p>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-neutral-600">
            {t.aboutP2}
          </p>
          <a
            href="mailto:hello@hagvall-labs.com"
            className="mt-8 inline-block rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
          >
            {t.aboutCta}
          </a>
        </div>
      </section>
    </>
  )
}
