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
  linkInk,
  itemTitle,
  itemBody,
  sectionTitleSm,
  sheet,
} from './ui'

const automatePostUrl = 'https://joelhagvall.com/blog/automate-everything'
const portfolioUrl = 'https://joelhagvall.com/projects'

// Personal projects that demonstrate integrations and simpler workflows.
// Full write-ups live in the portfolio; these are not client case studies.
// The name links to a live demo where one exists, else to the source; a
// project with a demo also gets a quieter source link.
const projects = [
  {
    key: 'jarvisPanel',
    url: 'https://github.com/joelhagvall/jarvis-panel',
  },
  {
    key: 'dataWipe',
    url: 'https://data-wipe-mailer.vercel.app/',
    source: 'https://github.com/joelhagvall/data-wipe-mailer',
  },
] as const

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
          {/* role="list": Safari drops list semantics under list-style: none. */}
          <ul role="list" className="mt-6 space-y-6">
            {projects.map((project) => (
              <li key={project.key}>
                <a
                  href={project.url}
                  {...externalLinkProps}
                  translate="no"
                  className={`group text-lg font-semibold tracking-tight ${linkInk}`}
                >
                  {t.projects[project.key].name}
                  <span
                    aria-hidden="true"
                    className={`ml-1 inline-block ${btnArrow}`}
                  >
                    ↗
                  </span>
                </a>
                <p className="mt-1 text-pretty leading-relaxed text-neutral-600">
                  {t.projects[project.key].body}
                </p>
                {'source' in project && (
                  <a
                    href={project.source}
                    {...externalLinkProps}
                    className={`group mt-2 inline-block text-sm text-neutral-600 ${linkInk}`}
                  >
                    {t.source}
                    <span
                      aria-hidden="true"
                      className={`ml-1 inline-block ${btnArrow}`}
                    >
                      ↗
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>

          <a
            href={portfolioUrl}
            {...externalLinkProps}
            className={`group mt-6 inline-block ${linkInk}`}
          >
            {t.projectsMore}
            <span aria-hidden="true" className={`ml-1 inline-block ${btnArrow}`}>
              ↗
            </span>
          </a>

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
