import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/maskera')({
  head: () => ({
    meta: [
      { title: 'Maskera — Mask personal data before it reaches AI | Hägvall Labs' },
      {
        name: 'description',
        content:
          'Maskera identifies and masks personal data in text before it is used in AI systems, logs or analytics tools. Self-hosted in your own IT environment — no data leaves your organization.',
      },
      {
        property: 'og:title',
        content: 'Maskera — Mask personal data before it reaches AI',
      },
      {
        property: 'og:description',
        content:
          'Detect and mask personal data in text before AI systems, logs and analytics see it. Self-hosted, GDPR-friendly, built in Sweden.',
      },
      { property: 'og:url', content: 'https://hagvall-labs.com/maskera' },
    ],
    links: [{ rel: 'canonical', href: 'https://hagvall-labs.com/maskera' }],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Maskera',
          applicationCategory: 'SecurityApplication',
          url: 'https://maskera.dev',
          operatingSystem: 'Self-hosted (Linux, Docker)',
          description:
            'Maskera identifies and masks personal data in text before the information is used in AI systems, logs or analytics tools. Deployed in the customer’s own IT environment.',
          publisher: { '@type': 'Organization', name: 'Hägvall Labs AB' },
        }),
      },
    ],
  }),
  component: Maskera,
})

const useCases = [
  {
    title: 'AI systems',
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
]

const principles = [
  {
    title: 'Self-hosted by default',
    body: 'Maskera is installed in your own IT environment. Text is processed inside your infrastructure and never sent to a third party.',
  },
  {
    title: 'Built for GDPR',
    body: 'Masking personal data before downstream use supports data minimization and reduces the scope of what you need to protect.',
  },
  {
    title: 'Simple to integrate',
    body: 'A straightforward API that fits into existing pipelines — before the AI call, before the log write, before the export.',
  },
]

function Maskera() {
  return (
    <>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20 pt-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-400">
          Maskera
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Mask personal data before it reaches your AI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
          Maskera identifies and masks personal data in text — names, personal
          identity numbers, addresses, phone numbers — before the information is
          used in AI systems, logs or analytics tools.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="https://maskera.dev"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Visit maskera.dev
          </a>
          <a
            href="mailto:hello@hagvall-labs.com?subject=Maskera%20demo"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:border-neutral-900"
          >
            Book a demo
          </a>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-2xl font-semibold tracking-tight">
            Where Maskera fits
          </h2>
          <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
            {useCases.map((u) => (
              <div key={u.title}>
                <h3 className="font-medium">{u.title}</h3>
                <p className="mt-2 leading-relaxed text-neutral-600">
                  {u.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-2xl font-semibold tracking-tight">
          How it's built
        </h2>
        <div className="mt-8 grid gap-x-12 gap-y-8 sm:grid-cols-3">
          {principles.map((p) => (
            <div key={p.title}>
              <h3 className="font-medium">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">
            See Maskera on your own data.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-neutral-600">
            I run pilot projects with companies and organizations in Sweden.
            Get in touch and I'll set up a demonstration — or read more at{' '}
            <a
              href="https://maskera.dev"
              className="underline underline-offset-4 transition-colors hover:text-neutral-900"
            >
              maskera.dev
            </a>
            .
          </p>
          <a
            href="mailto:hello@hagvall-labs.com?subject=Maskera%20pilot"
            className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Start a pilot
          </a>
        </div>
      </section>
    </>
  )
}
