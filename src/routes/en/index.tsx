import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { homeJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'home',
      title: 'Privacy-First AI Software | Hägvall Labs',
      description:
        'Hägvall Labs is Joel Hägvall’s company in Stockholm. Self-hosted tools that protect personal data before text reaches AI systems, logs or analytics.',
      ogTitle: 'Hägvall Labs | Privacy-First AI Software',
      ogDescription:
        'Privacy-first software for the AI era. Self-hosted, built in Sweden.',
      jsonLd: homeJsonLd(),
    }),
  component: () => <HomePage lang="en" />,
})
