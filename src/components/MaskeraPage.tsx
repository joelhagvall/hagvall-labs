import type { Lang } from '../seo'

const copy = {
  sv: {
    heroTitle: 'Maskera personuppgifter innan de når er AI.',
    heroBody:
      'Maskera identifierar och maskerar personuppgifter i text, som namn, personnummer, adresser och telefonnummer, innan informationen används i AI-system, loggar eller analysverktyg.',
    ctaVisit: 'Besök maskera.dev',
    ctaDemo: 'Boka en demo',
    demoSubject: 'Maskera%20demo',
    fitTitle: 'Där Maskera passar in',
    useCases: [
      {
        title: 'AI-system',
        body: 'Skicka prompter och dokument till LLM:er utan att exponera namn, personnummer eller kontaktuppgifter.',
      },
      {
        title: 'Loggar',
        body: 'Behåll applikations- och åtkomstloggar användbara för felsökning samtidigt som de rensas från personuppgifter.',
      },
      {
        title: 'Analys',
        body: 'Mata analys- och BI-verktyg med ren text, fri från personligt identifierbar information.',
      },
    ],
    builtTitle: 'Så är den byggd',
    principles: [
      {
        title: 'Self-hosted som standard',
        body: 'Maskera installeras i er egen IT-miljö. Text bearbetas inuti er infrastruktur och skickas aldrig till tredje part.',
      },
      {
        title: 'Byggd för GDPR',
        body: 'Att maskera personuppgifter före vidare användning stödjer dataminimering och minskar omfattningen av det ni behöver skydda.',
      },
      {
        title: 'Enkel att integrera',
        body: 'Ett rakt API som passar in i befintliga flöden: före AI-anropet, före loggskrivningen, före exporten.',
      },
    ],
    bottomTitle: 'Se Maskera på er egen data.',
    bottomBodyA:
      'Jag kör pilotprojekt med företag och organisationer i Sverige. Hör av dig så ordnar jag en demonstration, eller läs mer på ',
    bottomCta: 'Starta ett pilotprojekt',
    pilotSubject: 'Maskera%20pilot',
  },
  en: {
    heroTitle: 'Mask Personal Data Before It Reaches Your AI.',
    heroBody:
      'Maskera identifies and masks personal data in text, such as names, personal identity numbers, addresses and phone numbers, before the information is used in AI systems, logs or analytics tools.',
    ctaVisit: 'Visit maskera.dev',
    ctaDemo: 'Book a Demo',
    demoSubject: 'Maskera%20demo',
    fitTitle: 'Where Maskera Fits',
    useCases: [
      {
        title: 'AI Systems',
        body: 'Send prompts and documents to LLMs without exposing names, personal identity numbers or contact details.',
      },
      {
        title: 'Logs',
        body: 'Keep application and access logs useful for debugging while stripping them of personal data.',
      },
      {
        title: 'Analytics',
        body: 'Feed analytics and BI tools with clean text, free of personally identifiable information.',
      },
    ],
    builtTitle: 'How It’s Built',
    principles: [
      {
        title: 'Self-Hosted by Default',
        body: 'Maskera is installed in your own IT environment. Text is processed inside your infrastructure and never sent to a third party.',
      },
      {
        title: 'Built for GDPR',
        body: 'Masking personal data before downstream use supports data minimization and reduces the scope of what you need to protect.',
      },
      {
        title: 'Simple to Integrate',
        body: 'A straightforward API that fits into existing pipelines: before the AI call, before the log write, before the export.',
      },
    ],
    bottomTitle: 'See Maskera on Your Own Data.',
    bottomBodyA:
      'I run pilot projects with companies and organizations in Sweden. Get in touch and I’ll set up a demonstration, or read more at ',
    bottomCta: 'Start a Pilot',
    pilotSubject: 'Maskera%20pilot',
  },
}

export function MaskeraPage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28">
        <p
          className="mb-4 text-sm font-medium uppercase tracking-widest text-cobalt"
          translate="no"
        >
          Maskera
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          {t.heroTitle}
        </h1>
        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600">
          {t.heroBody}
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://maskera.dev"
            className="rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
            translate="no"
          >
            {t.ctaVisit}
          </a>
          <a
            href={`mailto:hello@hagvall-labs.com?subject=${t.demoSubject}`}
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:border-cobalt hover:text-cobalt"
          >
            {t.ctaDemo}
          </a>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-balance text-2xl font-semibold tracking-tight">
            {t.fitTitle}
          </h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {t.useCases.map((u) => (
              <div key={u.title}>
                <h3 className="font-medium">{u.title}</h3>
                <p className="mt-2 text-pretty leading-relaxed text-neutral-600">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-balance text-2xl font-semibold tracking-tight">
          {t.builtTitle}
        </h2>
        <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {t.principles.map((p) => (
            <div key={p.title}>
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 text-pretty leading-relaxed text-neutral-600">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight">
            {t.bottomTitle}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty leading-relaxed text-neutral-600">
            {t.bottomBodyA}
            <a
              href="https://maskera.dev"
              className="underline underline-offset-4 transition-colors hover:text-ink"
              translate="no"
            >
              maskera.dev
            </a>
            .
          </p>
          <a
            href={`mailto:hello@hagvall-labs.com?subject=${t.pilotSubject}`}
            className="mt-8 inline-block rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-cobalt-deep"
          >
            {t.bottomCta}
          </a>
        </div>
      </section>
    </>
  )
}
