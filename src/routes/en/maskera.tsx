import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../../components/MaskeraPage'
import { alternateLinks, site } from '../../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Maskera',
  applicationCategory: 'SecurityApplication',
  url: 'https://maskera.dev',
  operatingSystem: 'Self-hosted (Linux, Docker)',
  description:
    'Maskera identifies and masks personal data in text before the information is used in AI systems, logs or analytics tools. Deployed in the customer’s own IT environment.',
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
          'Maskera identifies and masks personal data in text before it is used in AI systems, logs or analytics tools. Self-hosted in your own IT environment. No data leaves your organization.',
      },
      {
        property: 'og:title',
        content: 'Mask Personal Data Before It Reaches AI',
      },
      {
        property: 'og:description',
        content:
          'Detect and mask personal data in text before AI systems, logs and analytics see it. Self-hosted, GDPR-friendly, built in Sweden.',
      },
      { property: 'og:url', content: site + '/en/maskera' },
      { property: 'og:locale', content: 'en_US' },
    ],
    links: alternateLinks('/maskera', '/en/maskera', 'en'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <MaskeraPage lang="en" />,
})
