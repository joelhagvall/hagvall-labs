import { useEffect, useRef, useState } from 'react'
import { contactEmail } from '../seo'
import type { Lang } from '../seo'
import {
  btnPrimary,
  btnSecondary,
  container,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  itemBody,
  itemTitle,
  sectionTitle,
  sheet,
} from './ui'

const copy = {
  sv: {
    title: 'Hör av dig.',
    body: 'Du skriver direkt till mig, Joel. Ingen säljkö, inget ”vi återkommer inom fem arbetsdagar”. Jag läser allt själv och svarar oftast samma dag.',
    emailLabel: 'Mejla mig på',
    copyBtn: 'Kopiera adressen',
    copiedBtn: 'Kopierat!',
    openBtn: 'Öppna i mejlprogram',
    stepsTitle: 'Så brukar det gå till',
    steps: [
      {
        title: 'Du mejlar',
        body: 'Berätta kort vad ni vill lösa: en produktfråga, en pilot eller ett uppdrag. Ett par rader räcker.',
      },
      {
        title: 'Vi ses digitalt',
        body: 'Ett kort möte där vi går igenom ert case. Handlar det om en produkt visar jag den på era egna exempel, inte en tillrättalagd demo.',
      },
      {
        title: 'Vi börjar smått',
        body: 'En pilot eller ett avgränsat första uppdrag med tydliga mål och fast tidsram. Sen bestämmer ni er, med bevis på bordet.',
      },
    ],
  },
  en: {
    title: 'Get in Touch.',
    body: 'You write directly to me, Joel. No sales queue, no “we’ll get back to you within five business days”. I read everything myself and usually reply the same day.',
    emailLabel: 'Email me at',
    copyBtn: 'Copy Address',
    copiedBtn: 'Copied!',
    openBtn: 'Open in Mail App',
    stepsTitle: 'How It Usually Goes',
    steps: [
      {
        title: 'You Email',
        body: 'Tell me briefly what you want to solve: a product question, a pilot or a project. A few lines are enough.',
      },
      {
        title: 'We Meet Online',
        body: 'A short call where we walk through your case. If it’s about a product, I show it on your own examples, not a polished canned demo.',
      },
      {
        title: 'We Start Small',
        body: 'A pilot or a scoped first project with clear goals and a fixed timeline. Then you decide, with proof on the table.',
      },
    ],
  },
}

function CopyEmailButton({ label, copied }: { label: string; copied: string }) {
  const [isCopied, setIsCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setIsCopied(true)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => setIsCopied(false), 2000)
    } catch {
      // Clipboard unavailable (permissions, insecure context): the address
      // is selectable text right next to the button, so fail silently.
    }
  }

  return (
    <button type="button" onClick={onCopy} className={btnSecondary}>
      <span aria-live="polite">{isCopied ? copied : label}</span>
    </button>
  )
}

export function ContactPage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      {/* Hero on the cobalt band: the invitation on the left, the address
          itself on the right. Same static headline rule as the other pages:
          nothing may delay the LCP paint. */}
      <section className={heroBand}>
        <div className="mx-auto grid w-full max-w-5xl gap-10 px-6 pb-28 pt-24 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
            <p className={heroBodyOnCobalt}>{t.body}</p>
          </div>

          {/* text-ink and on-white: the card sits on the cobalt band, so the
              inherited text color and focus ring are white; uncolored text
              (the copy button) and the rings must stay visible on white. */}
          <div className="on-white rounded-2xl bg-white p-6 text-ink sm:p-8">
            <p className="text-sm font-medium text-neutral-500">
              {t.emailLabel}
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-2 block break-all text-2xl font-semibold tracking-tight text-ink underline-offset-4 transition-colors hover:text-cobalt sm:text-3xl"
              data-umami-event="outbound-link-click"
              data-umami-event-destination="email"
              data-umami-event-placement="contact-address"
            >
              {contactEmail}
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CopyEmailButton label={t.copyBtn} copied={t.copiedBtn} />
              <a
                href={`mailto:${contactEmail}`}
                className={btnPrimary}
                data-umami-event="outbound-link-click"
                data-umami-event-destination="email"
                data-umami-event-placement="contact-button"
              >
                {t.openBtn}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The white sheet rolls over the band. What happens next is a real
          sequence, so it is an ordered list drawn as a timeline: the numbers
          and the rule between them carry the order (decorative, the <ol>
          carries it for assistive tech and the Markdown rendering). */}
      <div className={sheet}>
        <section className={container}>
          <h2 className={sectionTitle}>{t.stepsTitle}</h2>
          {/* role="list": Safari drops list semantics under list-style: none. */}
          <ol role="list" className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {t.steps.map((step, i) => (
              <li key={step.title}>
                <div aria-hidden="true" className="flex items-center gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-cobalt text-sm font-semibold text-cobalt tabular-nums">
                    {i + 1}
                  </span>
                  {i < t.steps.length - 1 ? (
                    <span className="hidden h-0.5 flex-1 bg-cobalt/20 sm:block" />
                  ) : null}
                </div>
                <h3 className={`mt-5 ${itemTitle}`}>{step.title}</h3>
                <p className={itemBody}>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
