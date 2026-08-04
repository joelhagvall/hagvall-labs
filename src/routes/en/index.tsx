import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { alternateLinks, localeMeta, site } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () => ({
    meta: [
      { title: 'Hägvall Labs | Privacy-First Software for the AI Era' },
      {
        name: 'description',
        content:
          'Hägvall Labs builds privacy-first software that runs in your own IT environment. Maskera masks personal data in text before it reaches AI systems, logs or analytics tools.',
      },
      {
        property: 'og:title',
        content: 'Hägvall Labs | Privacy-First Software for the AI Era',
      },
      {
        property: 'og:description',
        content:
          'Privacy-first software for the AI era. Self-hosted, built in Sweden.',
      },
      { property: 'og:url', content: site + '/en' },
      ...localeMeta('en'),
    ],
    links: alternateLinks('/', '/en', 'en'),
  }),
  component: () => <HomePage lang="en" />,
})
