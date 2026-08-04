import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { alternateLinks, site } from '../seo'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran' },
      {
        name: 'description',
        content:
          'Hägvall Labs AB utvecklar programvara inom informationssäkerhet, integritetsskydd och AI. Första produkten Maskera identifierar och maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg.',
      },
      {
        property: 'og:title',
        content: 'Hägvall Labs | Integritetssäker mjukvara för AI-eran',
      },
      {
        property: 'og:description',
        content:
          'Programvara inom informationssäkerhet, integritetsskydd och AI. Self-hosted, byggd i Sverige.',
      },
      { property: 'og:url', content: site + '/' },
      { property: 'og:locale', content: 'sv_SE' },
    ],
    links: alternateLinks('/', '/en', 'sv'),
  }),
  component: () => <HomePage lang="sv" />,
})
