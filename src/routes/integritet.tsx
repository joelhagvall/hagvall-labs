import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '../components/PrivacyPage'
import { pageHead } from '../seo'

export const Route = createFileRoute('/integritet')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'privacy',
      title: 'Integritet och personuppgifter | Hägvall Labs',
      description:
        'Läs hur Hägvall Labs hanterar besöksstatistik, driftloggar, kontaktuppgifter, lagringstider och dina rättigheter enligt GDPR.',
      ogTitle: 'Integritet och personuppgifter | Hägvall Labs',
      ogDescription:
        'Tydlig information om besöksstatistik, driftloggar, lagringstider och dina rättigheter.',
    }),
  component: () => <PrivacyPage lang="sv" />,
})
