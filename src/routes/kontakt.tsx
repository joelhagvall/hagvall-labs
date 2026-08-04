import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../components/ContactPage'
import { alternateLinks, localeMeta, site } from '../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Kontakta Hägvall Labs',
  url: site + '/kontakt',
  about: { '@type': 'Organization', name: 'Hägvall Labs AB' },
})

export const Route = createFileRoute('/kontakt')({
  head: () => ({
    meta: [
      { title: 'Kontakt | Hägvall Labs' },
      {
        name: 'description',
        content:
          'Hör av dig direkt till Joel Hägvall på hello@hagvall-labs.com. Du får svar från personen som bygger produkterna, oftast samma dag.',
      },
      { property: 'og:title', content: 'Kontakt | Hägvall Labs' },
      {
        property: 'og:description',
        content:
          'Skriv direkt till personen som bygger produkterna. Svar oftast samma dag.',
      },
      { property: 'og:url', content: site + '/kontakt' },
      ...localeMeta('sv'),
    ],
    links: alternateLinks('/kontakt', '/en/contact', 'sv'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <ContactPage lang="sv" />,
})
