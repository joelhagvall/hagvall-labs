import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { alternateLinks, localeMeta, site } from '../seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran' },
      {
        name: 'description',
        content:
          'Hägvall Labs bygger integritetssäker mjukvara som körs i er egen IT-miljö. Maskera maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg.',
      },
      {
        property: 'og:title',
        content: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran',
      },
      {
        property: 'og:description',
        content:
          'Integritetssäker mjukvara för AI-eran. Self-hosted, byggd i Sverige.',
      },
      { property: 'og:url', content: site + '/' },
      ...localeMeta('sv'),
    ],
    links: alternateLinks('/', '/en', 'sv'),
  }),
  component: () => <HomePage lang="sv" />,
})
