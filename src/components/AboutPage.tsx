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
  sectionTitleSm,
  sheet,
} from './ui'

const automatePostUrl = 'https://joelhagvall.com/blog/automate-everything'

// Side projects that show the same thing the company sells (local AI,
// automation, privacy). The full write-ups live on joelhagvall.com/projects.
// The name links to a live demo where one exists, else to the source; a
// project with a demo also gets a quieter source link.
const projects = [
  {
    key: 'jarvis',
    name: 'J.A.R.V.I.S',
    url: 'https://github.com/joelhagvall/jarvis-chat',
    destination: 'github.com',
  },
  {
    key: 'dataWipe',
    name: 'Data Wipe Mailer',
    url: 'https://data-wipe-mailer.vercel.app/',
    destination: 'vercel.app',
    source: 'https://github.com/joelhagvall/data-wipe-mailer',
  },
] as const

const copy = {
  sv: {
    title: 'Därför startade jag Hägvall Labs',
    intro:
      'Jag är utvecklare, och det som stör mig mest är sällan koden. Det är allt runt den: folk som kopierar data mellan system för hand, väntar på en fil från någon annan och dubbelkollar saker som ett skript hade kunnat kolla.',
    paragraphs: [
      'Förr kunde man säga att det var för dyrt eller för krångligt att automatisera. Det håller inte längre. Med AI kostar det nästan ingenting att testa, så varför sitta och göra det för hand?',
      'Så jag startade Hägvall Labs. Visa mig era processer och era API:er, så bygger jag bort det som tar tid.',
    ],
    maskeraAfter:
      ' kom till för att jag själv behövde det. Så fort man kopplar AI mot riktig data hamnar namn och personnummer i promptar och loggar, och jag hittade inget som funkade bra på svenska.',
    solo: 'Det är bara jag i bolaget. Jag pratar med er, bygger det, släpper det och fixar det när något går sönder.',
    postBefore: 'Jag har skrivit mer om hur jag tänker i ',
    postAfter: ' (på engelska).',
    projectsTitle: 'Annat jag byggt',
    projects: {
      jarvis:
        'Min egen assistent på Macen. Lokal AI som kommer åt mina anteckningar och verktyg via MCP, utan att något lämnar datorn.',
      dataWipe:
        'En webbapp som hjälper dig begära att företag raderar dina uppgifter enligt GDPR.',
    },
    source: 'Källkoden på GitHub',
    closing: 'Om du har något som tar för lång tid vill jag höra om det.',
    cta: 'Hör av dig',
  },
  en: {
    title: 'Why I Started Hägvall Labs',
    intro:
      'I’m a developer, and what bugs me most is rarely the code. It’s everything around it: people copying data between systems by hand, waiting on a file from someone else, double-checking things a script could check.',
    paragraphs: [
      'A few years ago you could say it was too expensive or too complicated to automate. That doesn’t hold anymore. With AI, trying something costs next to nothing, so why keep doing it by hand?',
      'So I started Hägvall Labs. Show me your processes and your APIs, and I’ll build away whatever eats your time.',
    ],
    maskeraAfter:
      ' came from needing it myself. The moment you wire AI into real data, names and personal ID numbers end up in prompts and logs, and I couldn’t find anything that worked well for Swedish.',
    solo: 'It’s just me. I talk to you, build it, ship it and fix it when something breaks.',
    postBefore: 'I wrote more about how I think about this in ',
    postAfter: '.',
    projectsTitle: 'Other Things I’ve Built',
    projects: {
      jarvis:
        'My own assistant on the Mac. Local AI that reaches my notes and tools over MCP, without anything leaving the machine.',
      dataWipe:
        'A web app that helps you ask companies to delete your data under GDPR.',
    },
    source: 'Source on GitHub',
    closing: 'If something takes too long, I want to hear about it.',
    cta: 'Get in Touch',
  },
}

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

      {/* A short personal text, so it reads as prose: no headings, lists or
          cards breaking it up. */}
      <div className={sheet}>
        <article className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="space-y-6 text-pretty text-lg leading-relaxed text-neutral-700">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p>
              <Link to={pagePaths.maskera[lang]} translate="no" className={linkInk}>
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
                data-umami-event="outbound-link-click"
                data-umami-event-destination="joelhagvall.com"
                data-umami-event-placement="about-post"
              >
                Automate Everything Possible
                <span aria-hidden="true" className={`inline-block ${btnArrow}`}>
                  ↗
                </span>
              </a>
              {t.postAfter}
            </p>
          </div>

          <h2 className={`mt-16 ${sectionTitleSm}`}>{t.projectsTitle}</h2>
          {/* role="list": Safari drops list semantics under list-style: none. */}
          <ul role="list" className="mt-6 space-y-6">
            {projects.map((project) => (
              <li key={project.key}>
                <a
                  href={project.url}
                  {...externalLinkProps}
                  translate="no"
                  className={`group text-lg font-semibold tracking-tight ${linkInk}`}
                  data-umami-event="outbound-link-click"
                  data-umami-event-destination={project.destination}
                  data-umami-event-placement="about-projects"
                >
                  {project.name}
                  <span aria-hidden="true" className={`ml-1 inline-block ${btnArrow}`}>
                    ↗
                  </span>
                </a>
                <p className="mt-1 text-pretty leading-relaxed text-neutral-600">
                  {t.projects[project.key]}
                </p>
                {'source' in project && (
                  <a
                    href={project.source}
                    {...externalLinkProps}
                    className={`group mt-2 inline-block text-sm text-neutral-600 ${linkInk}`}
                    data-umami-event="outbound-link-click"
                    data-umami-event-destination="github.com"
                    data-umami-event-placement="about-projects"
                  >
                    {t.source}
                    <span aria-hidden="true" className={`ml-1 inline-block ${btnArrow}`}>
                      ↗
                    </span>
                  </a>
                )}
              </li>
            ))}
          </ul>

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
