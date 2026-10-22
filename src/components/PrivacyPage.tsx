import { contactEmail } from '../seo'
import type { Lang } from '../seo'
import {
  externalLinkProps,
  heroBand,
  heroBodyOnCobalt,
  heroTitle,
  kickerOnCobalt,
  linkInk,
  sectionTitleSm,
  sheet,
} from './ui'

const updatedAt = new Date('2026-10-22T12:00:00Z')

const copy = {
  sv: {
    kicker: 'Integritet',
    title: 'Så hanterar jag dina uppgifter.',
    intro:
      'Jag samlar bara in det som behövs för att förstå hur webbplatsen används, hålla den säker och svara när du kontaktar mig.',
    updatedLabel: 'Senast uppdaterad',
    controller: {
      title: 'Vem ansvarar?',
      paragraphs: [
        'Hägvall Labs AB (org.nr 559598-0110), Stockholm, är personuppgiftsansvarig för behandlingen på den här webbplatsen. Jag, Joel Hägvall, driver bolaget och hanterar frågorna själv.',
        'Kontakta mig om du undrar något eller vill använda någon av dina rättigheter:',
      ],
    },
    analytics: {
      title: 'Besöksstatistik',
      paragraphs: [
        'Jag använder Cloudflare Web Analytics för att förstå vilka sidor som är användbara och hur snabbt de laddar. Statistiken används inte för annonsering, försäljning av data eller spårning mellan webbplatser.',
        'Cloudflare Web Analytics använder inga cookies och sparar inget annat i din webbläsare. Enligt Cloudflare identifieras besökare inte med hjälp av IP-adress, user-agent eller andra uppgifter.',
      ],
      items: [
        'Besökt sida. URL-parametrar sparas inte.',
        'Hänvisande sida och tidpunkt.',
        'Webbläsare, operativsystem och enhetstyp.',
        'Ungefärligt land.',
        'Laddningstider och andra prestandamått för sidan.',
      ],
      after:
        'Den rättsliga grunden enligt GDPR är mitt berättigade intresse av att förbättra och driva webbplatsen med en så begränsad mätning som möjligt.',
    },
    retention: {
      title: 'Hur länge sparas uppgifterna?',
      paragraphs: [
        'Cloudflare sparar den detaljerade besöksstatistiken i 7 dagar. Därefter finns bara ett sammanställt urval kvar, i högst 6 månader.',
        'Jag sparar inga egna åtkomstloggar för webbplatsen. Statistiken från min tidigare egenhostade installation av Umami är raderad.',
      ],
    },
    operations: {
      title: 'Drift och säkerhet',
      paragraphs: [
        'Webbplatsen körs på Cloudflares nätverk. För att kunna leverera sidorna och skydda dem mot attacker behandlar Cloudflare din IP-adress och tekniska uppgifter om förfrågan, som begärd adress, webbläsare och tidpunkt.',
        'Uppgifterna används inte för marknadsföring eller för att skapa besökarprofiler. Den rättsliga grunden är mitt berättigade intresse av att skydda och driva tjänsten.',
      ],
    },
    contact: {
      title: 'När du kontaktar mig',
      paragraphs: [
        'Om du mejlar behandlar jag de kontaktuppgifter och det innehåll du själv skickar för att kunna svara och hantera ditt ärende. Uppgifterna sparas så länge de behövs för kontakten, ett eventuellt avtal eller rättsliga skyldigheter som bokföring.',
      ],
    },
    sharing: {
      title: 'Leverantörer och överföringar',
      paragraphs: [
        'Cloudflare levererar webbplatsen och besöksstatistiken. Cloudflare är ett amerikanskt bolag, och överföringen till USA stöds av ramverket för dataskydd mellan EU och USA (Data Privacy Framework) och av EU:s standardavtalsklausuler i Cloudflares personuppgiftsbiträdesavtal. Min e-postleverantör behandlar det du mejlar mig. Jag säljer inte uppgifter och lämnar dem inte till annonsnätverk. Ingen automatiserad profilering eller beslutsfattande används.',
      ],
    },
    rights: {
      title: 'Dina rättigheter',
      paragraphs: [
        'Du kan begära tillgång, rättelse, radering eller begränsning och invända mot behandling som bygger på berättigat intresse. Besöksstatistiken innehåller varken namn eller IP-adress, så jag kan oftast inte koppla en enskild statistikpost till dig.',
        'Du kan också lämna klagomål till Integritetsskyddsmyndigheten. Kontakta gärna mig först så försöker jag lösa frågan direkt.',
      ],
      authorityLabel: 'Läs om dina rättigheter hos IMY',
    },
  },
  en: {
    kicker: 'Privacy',
    title: 'How I Handle Your Data.',
    intro:
      'I collect only what is needed to understand how the website is used, keep it secure and reply when you contact me.',
    updatedLabel: 'Last updated',
    controller: {
      title: 'Who Is Responsible?',
      paragraphs: [
        'Hägvall Labs AB (Swedish org. no. 559598-0110), Stockholm, is the controller for processing on this website. I, Joel Hägvall, run the company and handle privacy questions myself.',
        'Contact me if you have a question or want to exercise any of your rights:',
      ],
    },
    analytics: {
      title: 'Visitor Analytics',
      paragraphs: [
        'I use Cloudflare Web Analytics to understand which pages are useful and how fast they load. The statistics are not used for advertising, selling data or tracking people across websites.',
        'Cloudflare Web Analytics uses no cookies and stores nothing else in your browser. According to Cloudflare, visitors are not identified by their IP address, user-agent or any other data.',
      ],
      items: [
        'Visited page. URL parameters are not stored.',
        'Referring page and timestamp.',
        'Browser, operating system and device type.',
        'Approximate country.',
        'Load times and other performance metrics for the page.',
      ],
      after:
        'The GDPR legal basis is my legitimate interest in improving and operating the website with measurement that is as limited as possible.',
    },
    retention: {
      title: 'How Long Is Data Kept?',
      paragraphs: [
        'Cloudflare keeps the detailed visitor statistics for 7 days. After that only an aggregated sample remains, for no more than 6 months.',
        'I keep no access logs of my own for the website. The statistics from my former self-hosted Umami installation have been deleted.',
      ],
    },
    operations: {
      title: 'Hosting & Security',
      paragraphs: [
        'The website runs on Cloudflare’s network. To deliver the pages and protect them from attacks, Cloudflare processes your IP address and technical details of the request, such as the requested address, browser and time.',
        'This data is not used for marketing or visitor profiles. The legal basis is my legitimate interest in protecting and operating the service.',
      ],
    },
    contact: {
      title: 'When You Contact Me',
      paragraphs: [
        'If you email me, I process the contact details and content you provide to reply and handle your request. The information is kept for as long as needed for the conversation, a possible agreement or legal duties such as accounting.',
      ],
    },
    sharing: {
      title: 'Providers & Transfers',
      paragraphs: [
        'Cloudflare delivers the website and the visitor analytics. Cloudflare is a US company, and the transfer to the US is covered by the EU-U.S. Data Privacy Framework and by the EU Standard Contractual Clauses in Cloudflare’s data processing agreement. My email provider processes what you email me. I do not sell data or share it with advertising networks. No automated profiling or decision-making is used.',
      ],
    },
    rights: {
      title: 'Your Rights',
      paragraphs: [
        'You may request access, correction, deletion or restriction and object to processing based on legitimate interests. The visitor analytics hold neither names nor IP addresses, so I usually cannot connect an individual analytics record to you.',
        'You may also lodge a complaint with the Swedish Authority for Privacy Protection. Feel free to contact me first and I will try to resolve the matter directly.',
      ],
      authorityLabel: 'Read About Your Rights at IMY',
    },
  },
} as const

const authorityUrl =
  'https://www.imy.se/privatperson/dataskydd/dina-rattigheter/'

export function PrivacyPage({ lang }: { lang: Lang }) {
  const t = copy[lang]
  const updated = new Intl.DateTimeFormat(lang === 'sv' ? 'sv-SE' : 'en', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(updatedAt)
  const sections = [
    t.controller,
    t.analytics,
    t.retention,
    t.operations,
    t.contact,
    t.sharing,
    t.rights,
  ]

  return (
    <>
      <section className={heroBand}>
        <div className="mx-auto w-full max-w-5xl px-6 pb-28 pt-24">
          <p className={`mb-4 ${kickerOnCobalt}`}>{t.kicker}</p>
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBodyOnCobalt}>{t.intro}</p>
          <p className="mt-6 text-sm text-white/75">
            {t.updatedLabel}:{' '}
            <time dateTime="2026-10-22">{updated}</time>
          </p>
        </div>
      </section>

      {/* The white sheet rolls over the band. */}
      <div className={sheet}>
        <article className="mx-auto w-full max-w-3xl px-6 py-20">
          {sections.map((section, index) => (
            <section
              key={section.title}
              className={index === 0 ? '' : 'mt-14 border-t border-neutral-200 pt-14'}
            >
              <h2 className={sectionTitleSm}>{section.title}</h2>
              <div className="mt-5 space-y-4 text-pretty leading-relaxed text-neutral-600">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {'items' in section && (
                  <ul className="list-disc space-y-2 pl-5">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                {'after' in section && <p>{section.after}</p>}
                {section === t.controller && (
                  <a href={`mailto:${contactEmail}`} className={linkInk}>
                    {contactEmail}
                  </a>
                )}
                {'authorityLabel' in section && (
                  <a href={authorityUrl} {...externalLinkProps} className={linkInk}>
                    {section.authorityLabel}
                  </a>
                )}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  )
}
