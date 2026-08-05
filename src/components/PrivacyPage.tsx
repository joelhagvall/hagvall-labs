import { contactEmail } from '../seo'
import type { Lang } from '../seo'
import { heroBody, heroTitle, kicker, linkInk, sectionTitleSm } from './ui'

const updatedAt = new Date('2026-08-05T12:00:00Z')

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
        'Hägvall Labs AB i Stockholm är personuppgiftsansvarig för behandlingen på den här webbplatsen. Jag, Joel Hägvall, driver bolaget och hanterar frågorna själv.',
        'Kontakta mig om du undrar något eller vill använda någon av dina rättigheter:',
      ],
    },
    analytics: {
      title: 'Besöksstatistik',
      paragraphs: [
        'Jag använder en egenhostad installation av Umami för att förstå vilka sidor och länkar som är användbara. Statistiken används inte för annonsering, försäljning av data eller spårning mellan webbplatser.',
        'Umami använder inga kakor. Session replay, heatmaps och identifierade användarprofiler är avstängda. Inställningen Do Not Track respekteras.',
      ],
      items: [
        'Besökt sida och sidtitel. URL-parametrar och hashvärden tas bort.',
        'Hänvisande domän och sida, tidpunkt samt särskilt markerade länkklick.',
        'Webbläsare, operativsystem, enhetstyp, skärmstorlek och språk.',
        'Ungefärligt land, region och stad som härleds från IP-adressen.',
        'Ett månatligt sessions-ID som räknas fram från IP-adress, user-agent, webbplats-ID och ett hemligt salt.',
      ],
      after:
        'IP-adressen används tillfälligt för geolokalisering och sessionsberäkning men sparas inte i Umami. Rå user-agent sparas inte heller. Den rättsliga grunden enligt GDPR är mitt berättigade intresse av att förbättra och driva webbplatsen med en så begränsad och egenkontrollerad mätning som möjligt.',
    },
    retention: {
      title: 'Hur länge sparas uppgifterna?',
      paragraphs: [
        'Rå besöksdata i Umami raderas automatiskt efter 90 dagar. Åtkomstskyddade återställningskopior roteras efter 7 dagar, vilket innebär att en post kan finnas där i högst cirka 97 dagar.',
        'Den separata driftloggen hos webbservern sparas i högst 30 dagar. Den används för säkerhet, felsökning och kapacitetsplanering.',
      ],
    },
    operations: {
      title: 'Driftloggar',
      paragraphs: [
        'Webbservern Caddy loggar tidpunkt, begärd adress, metod, svarskod, user-agent och en maskerad nätverksadress. IPv4-adresser maskeras till /24 och IPv6-adresser till /48 innan de skrivs till disk. Cookie- och Authorization-header sparas inte.',
        'Loggarna används inte för marknadsföring eller för att skapa besökarprofiler. Den rättsliga grunden är mitt berättigade intresse av att skydda och driva tjänsten.',
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
        'Webbplatsen och Umami körs på min server hos Hetzner inom EU/EES. Nödvändiga leverantörer kan behandla uppgifter för drift och e-post, men jag säljer inte uppgifter och lämnar dem inte till annonsnätverk. Ingen automatiserad profilering eller beslutsfattande används.',
      ],
    },
    rights: {
      title: 'Dina rättigheter',
      paragraphs: [
        'Du kan begära tillgång, rättelse, radering eller begränsning och invända mot behandling som bygger på berättigat intresse. Eftersom Umami inte sparar namn eller IP-adress kan jag ibland sakna möjlighet att koppla en enskild statistikpost till dig.',
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
        'Hägvall Labs AB in Stockholm is the controller for processing on this website. I, Joel Hägvall, run the company and handle privacy questions myself.',
        'Contact me if you have a question or want to exercise any of your rights:',
      ],
    },
    analytics: {
      title: 'Visitor Analytics',
      paragraphs: [
        'I use a self-hosted installation of Umami to understand which pages and links are useful. The statistics are not used for advertising, selling data or tracking people across websites.',
        'Umami uses no cookies. Session replay, heatmaps and identified user profiles are disabled. Do Not Track is respected.',
      ],
      items: [
        'Visited page and page title. URL parameters and hash values are removed.',
        'Referring domain and page, timestamp and specifically marked link clicks.',
        'Browser, operating system, device type, screen size and language.',
        'Approximate country, region and city derived from the IP address.',
        'A monthly session ID calculated from the IP address, user-agent, website ID and a secret salt.',
      ],
      after:
        'The IP address is used temporarily for geolocation and session calculation but is not stored in Umami. The raw user-agent is not stored either. The GDPR legal basis is my legitimate interest in improving and operating the website with measurement that is as limited and self-controlled as possible.',
    },
    retention: {
      title: 'How Long Is Data Kept?',
      paragraphs: [
        'Raw visitor data in Umami is deleted automatically after 90 days. Access-controlled recovery copies are rotated after 7 days, which means a record may remain there for at most about 97 days.',
        'The web server’s separate operational log is kept for no more than 30 days. It is used for security, troubleshooting and capacity planning.',
      ],
    },
    operations: {
      title: 'Operational Logs',
      paragraphs: [
        'The Caddy web server logs the timestamp, requested address, method, response status, user-agent and a masked network address. IPv4 addresses are masked to /24 and IPv6 addresses to /48 before being written to disk. Cookie and Authorization headers are not stored.',
        'The logs are not used for marketing or visitor profiles. The legal basis is my legitimate interest in protecting and operating the service.',
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
        'The website and Umami run on my server at Hetzner within the EU/EEA. Necessary providers may process data for hosting and email, but I do not sell data or share it with advertising networks. No automated profiling or decision-making is used.',
      ],
    },
    rights: {
      title: 'Your Rights',
      paragraphs: [
        'You may request access, correction, deletion or restriction and object to processing based on legitimate interests. Because Umami stores neither names nor IP addresses, I may sometimes be unable to connect an individual analytics record to you.',
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
      <section className="border-b border-neutral-200">
        <div className="mx-auto w-full max-w-5xl px-6 pb-20 pt-24">
          <p className={`mb-4 ${kicker}`}>{t.kicker}</p>
          <h1 className={`${heroTitle} sm:text-5xl`}>{t.title}</h1>
          <p className={heroBody}>{t.intro}</p>
          <p className="mt-6 text-sm text-neutral-500">
            {t.updatedLabel}:{' '}
            <time dateTime="2026-08-05">{updated}</time>
          </p>
        </div>
      </section>

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
                <a href={authorityUrl} className={linkInk}>
                  {section.authorityLabel}
                </a>
              )}
            </div>
          </section>
        ))}
      </article>
    </>
  )
}
