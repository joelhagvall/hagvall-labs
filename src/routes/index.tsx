import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { homeJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'home',
      title: 'Integritetssäker AI-mjukvara | Hägvall Labs',
      description:
        'Hägvall Labs är Joel Hägvalls bolag i Stockholm. Self-hosted mjukvara som skyddar personuppgifter innan text når AI-system, loggar eller analys.',
      ogTitle: 'Hägvall Labs | Integritetssäker AI-mjukvara',
      ogDescription:
        'Integritetssäker mjukvara för AI-eran. Self-hosted, byggd i Sverige.',
      jsonLd: homeJsonLd(),
    }),
  component: () => <HomePage lang="sv" />,
})
