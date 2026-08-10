import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { pageHead } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'home',
      title: 'Privacy-First AI Software | Hägvall Labs',
      description:
        'Hägvall Labs builds self-hosted software that protects personal data before text reaches AI systems, logs or analytics. Your data stays with you.',
      ogTitle: 'Hägvall Labs | Privacy-First AI Software',
      ogDescription:
        'Privacy-first software for the AI era. Self-hosted, built in Sweden.',
    }),
  component: () => <HomePage lang="en" />,
})
