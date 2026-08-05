import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { pageHead } from '../seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'home',
      title: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran',
      description:
        'Hägvall Labs bygger integritetssäker mjukvara som körs i er egen IT-miljö. Maskera maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg.',
      ogTitle: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran',
      ogDescription:
        'Integritetssäker mjukvara för AI-eran. Self-hosted, byggd i Sverige.',
    }),
  component: () => <HomePage lang="sv" />,
})
