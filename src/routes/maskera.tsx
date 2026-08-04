import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../components/MaskeraPage'
import { alternateLinks, site } from '../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Maskera',
  applicationCategory: 'SecurityApplication',
  url: 'https://maskera.dev',
  operatingSystem: 'Self-hosted (Linux, Docker)',
  description:
    'Maskera identifierar och maskerar personuppgifter i text innan informationen används i AI-system, loggar eller analysverktyg. Installeras i kundens egen IT-miljö.',
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
          'Maskera identifierar och maskerar personuppgifter i text innan informationen används i AI-system, loggar eller analysverktyg. Self-hosted i er egen IT-miljö. Ingen data lämnar organisationen.',
      },
      {
        property: 'og:title',
        content: 'Maskera personuppgifter innan de når AI',
      },
      {
        property: 'og:description',
        content:
          'Identifiera och maskera personuppgifter i text innan AI-system, loggar och analysverktyg ser dem. Self-hosted, GDPR-vänlig, byggd i Sverige.',
      },
      { property: 'og:url', content: site + '/maskera' },
      { property: 'og:locale', content: 'sv_SE' },
    ],
    links: alternateLinks('/maskera', '/en/maskera', 'sv'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <MaskeraPage lang="sv" />,
})
