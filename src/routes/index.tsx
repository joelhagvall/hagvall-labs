import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { pageHead, websiteJsonLd } from '../seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'home',
      title: 'Integritetssäker AI-mjukvara | Hägvall Labs',
      description:
        'Hägvall Labs bygger self-hosted mjukvara som skyddar personuppgifter innan text når AI-system, loggar eller analys. Er data stannar hos er.',
      ogTitle: 'Hägvall Labs | Integritetssäker AI-mjukvara',
      ogDescription:
        'Integritetssäker mjukvara för AI-eran. Self-hosted, byggd i Sverige.',
      jsonLd: websiteJsonLd(),
    }),
  component: () => <HomePage lang="sv" />,
})
