import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../../components/MaskeraPage'
import { alternateLinks, localeMeta, site } from '../../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Maskera',
  applicationCategory: 'SecurityApplication',
  url: 'https://maskera.dev',
  operatingSystem: 'Self-hosted (Linux, Docker)',
  description:
    'Maskera finds and masks personal data in text before it reaches AI systems, logs or analytics tools. Deployed in the customer’s own IT environment.',
  publisher: { '@type': 'Organization', name: 'Hägvall Labs AB' },
})

export const Route = createFileRoute('/en/maskera')({
  head: () => ({
    meta: [
      {
        title:
          'Mask Personal Data Before It Reaches AI | Hägvall Labs',
      },
      {
        name: 'description',
        content:
          'Maskera masks personal data in text, like names and identity numbers, before it reaches AI systems, logs or analytics tools. Runs in your own IT environment.',
      },
      {
        property: 'og:title',
        content: 'Mask Personal Data Before It Reaches AI',
      },
      {
        property: 'og:description',
        content:
          'Find and mask personal data before AI systems, logs and analytics see it. Self-hosted, GDPR-friendly, built in Sweden.',
      },
      { property: 'og:url', content: site + '/en/maskera' },
      ...localeMeta('en'),
    ],
    links: alternateLinks('/maskera', '/en/maskera', 'en'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <MaskeraPage lang="en" />,
})
