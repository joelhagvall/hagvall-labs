import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { alternateLinks, site } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () => ({
    meta: [
      { title: 'Hägvall Labs | Privacy-First Software for the AI Era' },
      {
        name: 'description',
        content:
          'Hägvall Labs AB develops software for information security, privacy protection and AI. The first product, Maskera, detects and masks personal data in text before it reaches AI systems, logs or analytics tools.',
      },
      {
        property: 'og:title',
        content: 'Hägvall Labs | Privacy-First Software for the AI Era',
      },
      {
        property: 'og:description',
        content:
          'Software for information security, privacy protection and AI. Self-hosted, built in Sweden.',
      },
      { property: 'og:url', content: site + '/en' },
      { property: 'og:locale', content: 'en_US' },
    ],
    links: alternateLinks('/', '/en', 'en'),
  }),
  component: () => <HomePage lang="en" />,
})
