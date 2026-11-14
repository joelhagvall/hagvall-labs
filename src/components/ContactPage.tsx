import { copy as translations } from '../i18n'
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

const copy = { sv: translations.sv.contact, en: translations.en.contact }

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
            >
              {contactEmail}
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <CopyEmailButton label={t.copyBtn} copied={t.copiedBtn} />
              <a href={`mailto:${contactEmail}`} className={btnPrimary}>
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
