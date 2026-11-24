import { copy as translations } from '../i18n'
import { Link } from '@tanstack/react-router'
import { pagePaths } from '../seo'
import type { Lang } from '../seo'
import {
  btnArrow,
  btnPrimary,
  externalLinkProps,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  linkCobalt,
  linkInk,
  itemTitle,
  itemBody,
  sectionTitleSm,
  sheet,
} from './ui'

const automatePostUrl = 'https://joelhagvall.com/blog/automate-everything'

const copy = { sv: translations.sv.about, en: translations.en.about }

export function AboutPage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      {/* Static headline and intro on the band, like every page: nothing
          may delay the LCP paint. */}
      <section className={heroBand}>
        <div className="mx-auto w-full max-w-5xl px-6 pb-28 pt-24">
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBodyOnCobalt}>{t.intro}</p>
        </div>
      </section>

      {/* Personal introduction, followed by working methods and projects. */}
      <div className={sheet}>
        <article className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="space-y-6 text-pretty text-lg leading-relaxed text-neutral-700">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              <Link
                to={pagePaths.maskera[lang]}
                translate="no"
                className={linkInk}
              >
                Maskera
              </Link>
              {t.maskeraAfter}
            </p>
            <p>{t.solo}</p>
            <p>
              {t.postBefore}
              <a
                href={automatePostUrl}
                {...externalLinkProps}
                lang="en"
                className={`group ${linkInk}`}
              >
                Automate Everything Possible
                <span aria-hidden="true" className={`inline-block ${btnArrow}`}>
                  ↗
                </span>
              </a>
              {t.postAfter}
            </p>
          </div>

          <h2 className={`mt-16 ${sectionTitleSm}`}>{t.methodTitle}</h2>
          <ul role="list" className="mt-6 space-y-8">
            {t.methodItems.map((item) => (
              <li key={item.title}>
                <h3 className={itemTitle}>{item.title}</h3>
                <p className={itemBody}>{item.body}</p>
              </li>
            ))}
          </ul>
          <h2 className={`mt-12 ${sectionTitleSm}`}>{t.deliveryTitle}</h2>
          <p className={itemBody}>{t.deliveryBody}</p>

          <h2 className={`mt-16 ${sectionTitleSm}`}>{t.projectsTitle}</h2>
          <p className={itemBody}>{t.projectsIntro}</p>
          <p className="mt-4 leading-relaxed">
            <Link to={pagePaths.projects[lang]} className={linkCobalt}>
              {t.projectsCta}
            </Link>
          </p>

          <p className="mt-16 text-pretty text-lg leading-relaxed text-neutral-700">
            {t.closing}
          </p>
          <Link to={pagePaths.contact[lang]} className={`mt-8 ${btnPrimary}`}>
            {t.cta}
          </Link>
        </article>
      </div>
    </>
  )
}
