import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

const services = [
  {
    title: 'Pilot projects',
    body: 'Scoped pilots that prove value in your environment before you commit — clear goals, fixed timeline, real data flows.',
  },
  {
    title: 'Software licensing',
    body: 'Annual licenses for software installed and running in your own IT environment. Your data never leaves your infrastructure.',
  },
  {
    title: 'Installation & support',
    body: 'We handle deployment, integration and ongoing support so your team can focus on using the product, not operating it.',
  },
  {
    title: 'Consulting',
    body: 'Hands-on consulting in systems development and IT security, from architecture reviews to implementation.',
  },
]

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24 pt-28">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-neutral-400">
          Hägvall Labs AB
        </p>
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
          Privacy-first software for the AI era.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-600">
          We develop, license and sell software for information security,
          privacy protection and artificial intelligence — built to run in your
          own IT environment.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            to="/maskera"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Discover Maskera
          </Link>
          <a
            href="mailto:hello@hagvalllabs.se"
            className="rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-colors hover:border-neutral-900"
          >
            Book a demo
          </a>
        </div>
      </section>

      {/* Maskera teaser */}
      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-neutral-400">
              Our first product
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Maskera</h2>
            <p className="mt-4 leading-relaxed text-neutral-600">
              Maskera identifies and masks personal data in text before the
              information is used in AI systems, logs or analytics tools. It
              runs entirely inside your own infrastructure — no data ever leaves
              your organization.
            </p>
            <Link
              to="/maskera"
              className="mt-6 inline-block text-sm font-medium underline underline-offset-4 transition-colors hover:text-neutral-500"
            >
              Learn more about Maskera →
            </Link>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 font-mono text-sm leading-7 shadow-sm">
            <p className="text-neutral-400">// input</p>
            <p>Anna Svensson (740512-1234) called about her invoice.</p>
            <p className="mt-4 text-neutral-400">// output</p>
            <p>
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-white">
                [NAME]
              </span>{' '}
              (
              <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-white">
                [SSN]
              </span>
              ) called about her invoice.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto w-full max-w-5xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">What we offer</h2>
        <div className="mt-10 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.title}>
              <h3 className="font-medium">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-neutral-600">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About / contact */}
      <section className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-5xl px-6 py-20">
          <h2 className="text-3xl font-semibold tracking-tight">
            Working with us
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-neutral-600">
            We work directly with companies and organizations, primarily in
            Sweden — through our website, digital meetings, demonstrations and
            agreements. Invoicing by standard bank transfer. The company
            operates fully online.
          </p>
          <a
            href="mailto:hello@hagvalllabs.se"
            className="mt-8 inline-block rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
          >
            Get in touch
          </a>
        </div>
      </section>
    </>
  )
}
