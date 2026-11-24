import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@ui-sdk/react/dialog'
import { Link } from '@tanstack/react-router'
import { copy as translations } from '../i18n'
import { pagePaths } from '../seo'
import type { Lang } from '../seo'
import {
  btnArrow,
  btnPrimary,
  btnSecondary,
  externalLinkProps,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  itemTitle,
  linkInk,
  sheet,
} from './ui'

const portfolioUrl = 'https://joelhagvall.com/projects'

type ProjectKey = keyof typeof translations.sv.projects.items

type ProjectImage = {
  src: Record<Lang, string>
  width: number
  height: number
}

type ProjectItem = {
  key: ProjectKey
  url?: string
  properName?: boolean
  image: ProjectImage
}

// Personal builds demonstrating custom APIs, MCP connectors and simpler
// workflows. These are Joel's own projects, not client case studies.
const projects: readonly ProjectItem[] = [
  {
    key: 'webForms',
    image: {
      src: {
        sv: '/projects/eneo-tvatt.webp',
        en: '/projects/eneo-tvatt.webp',
      },
      width: 1440,
      height: 977,
    },
  },
  {
    key: 'tillsynRadar',
    properName: true,
    image: {
      src: {
        sv: '/projects/tillsyn-radar-sv.webp',
        en: '/projects/tillsyn-radar-en.webp',
      },
      width: 1440,
      height: 888,
    },
  },
  {
    key: 'regulatedMcp',
    image: {
      src: {
        sv: '/projects/eneo-mcp.webp',
        en: '/projects/eneo-mcp.webp',
      },
      width: 1440,
      height: 900,
    },
  },
  {
    key: 'localInbox',
    image: {
      src: {
        sv: '/projects/local-inbox.webp',
        en: '/projects/local-inbox.webp',
      },
      width: 1120,
      height: 560,
    },
  },
  {
    key: 'jarvisPanel',
    url: 'https://github.com/joelhagvall/jarvis-panel',
    properName: true,
    image: {
      src: {
        sv: '/projects/jarvis-panel.webp',
        en: '/projects/jarvis-panel.webp',
      },
      width: 1024,
      height: 600,
    },
  },
]

const copy = { sv: translations.sv.projects, en: translations.en.projects }

export function ProjectsPage({ lang }: { lang: Lang }) {
  const t = copy[lang]

  return (
    <>
      <section className={heroBand}>
        <div className="mx-auto w-full max-w-5xl px-6 pb-28 pt-24">
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBodyOnCobalt}>{t.intro}</p>
        </div>
      </section>

      <div className={sheet}>
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          {/* role="list": Safari drops list semantics under list-style: none. */}
          <ul role="list" className="space-y-16">
            {projects.map((project) => {
              const item = t.items[project.key]
              return (
                <li key={project.key}>
                  <h2
                    className={itemTitle}
                    translate={project.properName ? 'no' : undefined}
                  >
                    {project.url ? (
                      <a
                        href={project.url}
                        {...externalLinkProps}
                        className={`group ${linkInk}`}
                      >
                        {item.name}
                        <span
                          aria-hidden="true"
                          className={`ml-1 inline-block ${btnArrow}`}
                        >
                          ↗
                        </span>
                      </a>
                    ) : (
                      item.name
                    )}
                  </h2>
                  <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm leading-relaxed sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                    <dt className="font-medium text-ink">{t.labels.problem}</dt>
                    <dd className="text-pretty text-neutral-600">
                      {item.problem}
                    </dd>
                    <dt className="font-medium text-ink">{t.labels.built}</dt>
                    <dd className="text-pretty text-neutral-600">
                      {item.built}
                    </dd>
                    <dt className="font-medium text-ink">{t.labels.control}</dt>
                    <dd className="text-pretty text-neutral-600">
                      {item.control}
                    </dd>
                  </dl>
                  <figure className="mt-6">
                    <Dialog>
                      <DialogTrigger
                        aria-label={`${t.zoomLabel}: ${item.name}`}
                        className="block w-full cursor-zoom-in rounded-2xl text-left"
                      >
                        <img
                          src={project.image.src[lang]}
                          alt={item.imageAlt}
                          width={project.image.width}
                          height={project.image.height}
                          loading="lazy"
                          decoding="async"
                          className="w-full rounded-2xl border border-neutral-200 transition-colors duration-200 hover:border-cobalt motion-reduce:transition-none"
                        />
                      </DialogTrigger>
                      <DialogBackdrop className="fixed inset-0 z-40 bg-ink/70" />
                      <DialogContent className="fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[min(92vw,1120px)] -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-2xl border border-neutral-200 bg-white p-4 sm:p-6">
                        <div className="flex items-center justify-between gap-4">
                          <DialogTitle
                            className="text-base font-semibold tracking-tight text-ink"
                            translate={project.properName ? 'no' : undefined}
                          >
                            {item.name}
                          </DialogTitle>
                          <DialogClose className={btnSecondary}>
                            {t.close}
                          </DialogClose>
                        </div>
                        <img
                          src={project.image.src[lang]}
                          alt={item.imageAlt}
                          width={project.image.width}
                          height={project.image.height}
                          className="mx-auto mt-4 max-h-[72vh] w-auto max-w-full rounded-xl border border-neutral-200"
                        />
                        <DialogDescription className="mt-3 text-sm text-neutral-600">
                          {item.imageCaption}
                        </DialogDescription>
                      </DialogContent>
                    </Dialog>
                    <figcaption className="mt-2 text-xs text-neutral-600">
                      {item.imageCaption}
                    </figcaption>
                  </figure>
                </li>
              )
            })}
          </ul>

          <a
            href={portfolioUrl}
            {...externalLinkProps}
            className={`group mt-14 inline-block ${linkInk}`}
          >
            {t.more}
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
        </div>
      </div>
    </>
  )
}
