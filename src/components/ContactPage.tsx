import { useEffect, useRef, useState } from 'react'
import { contactEmail } from '../seo'
import type { Lang } from '../seo'
import {
  Cards,
  HeroGlows,
  RevealObserver,
  btnPrimary,
  btnSecondary,
  container,
  heroBody,
  heroTitle,
  kicker,
  sectionTitleSm,
} from './ui'

const copy = {
  sv: {
    kicker: 'Kontakt',
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
    kicker: 'Contact',
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
      <RevealObserver />
      {/* Hero. Same static headline rule as the other pages: nothing may
          delay the LCP paint. */}
      <section className="relative isolate overflow-hidden">
        <HeroGlows />
        <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-24">
          <p className={`mb-4 ${kicker}`}>{t.kicker}</p>
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBody}>{t.body}</p>

          <div className="mt-10 max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
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

      {/* What happens next */}
      <section className="border-t border-neutral-200">
        <div className={container}>
          <h2 className={`reveal ${sectionTitleSm}`}>
            {t.stepsTitle}
          </h2>
          <Cards items={t.steps} className="mt-8 sm:grid-cols-3" />
        </div>
      </section>
    </>
  )
}
