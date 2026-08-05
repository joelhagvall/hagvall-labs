import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { pageHead } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'home',
      title: 'Hägvall Labs | Privacy-First Software for the AI Era',
      description:
        'Hägvall Labs builds privacy-first software that runs in your own IT environment. Maskera masks personal data in text before it reaches AI systems, logs or analytics tools.',
      ogTitle: 'Hägvall Labs | Privacy-First Software for the AI Era',
      ogDescription:
        'Privacy-first software for the AI era. Self-hosted, built in Sweden.',
    }),
  component: () => <HomePage lang="en" />,
})
