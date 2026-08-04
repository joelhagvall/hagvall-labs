import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../components/MaskeraPage'
import { alternateLinks, localeMeta, site } from '../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Maskera',
  applicationCategory: 'SecurityApplication',
  url: 'https://maskera.dev',
  operatingSystem: 'Self-hosted (Linux, Docker)',
  description:
    'Maskera hittar och maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg. Installeras i kundens egen IT-miljö.',
  publisher: { '@type': 'Organization', name: 'Hägvall Labs AB' },
})

export const Route = createFileRoute('/maskera')({
  head: () => ({
    meta: [
      {
        title:
          'Maskera personuppgifter innan de når AI | Hägvall Labs',
      },
      {
        name: 'description',
        content:
          'Maskera maskerar personuppgifter i text, som namn, personnummer och adresser, innan de når AI-system, loggar eller analysverktyg. Körs i er egen IT-miljö.',
      },
      {
        property: 'og:title',
        content: 'Maskera personuppgifter innan de når AI',
      },
      {
        property: 'og:description',
        content:
          'Hitta och maskera personuppgifter innan AI-system, loggar och analysverktyg ser dem. Self-hosted, GDPR-vänlig, byggd i Sverige.',
      },
      { property: 'og:url', content: site + '/maskera' },
      ...localeMeta('sv'),
    ],
    links: alternateLinks('/maskera', '/en/maskera', 'sv'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <MaskeraPage lang="sv" />,
})
