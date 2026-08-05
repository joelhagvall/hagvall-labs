import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '../components/PrivacyPage'
import { pageHead } from '../seo'

export const Route = createFileRoute('/integritet')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'privacy',
      title: 'Integritet | Hägvall Labs',
      description:
        'Så hanterar Hägvall Labs besöksstatistik, driftloggar och uppgifter du skickar när du tar kontakt.',
      ogTitle: 'Integritet | Hägvall Labs',
      ogDescription:
        'Tydlig information om besöksstatistik, driftloggar, lagringstider och dina rättigheter.',
    }),
  component: () => <PrivacyPage lang="sv" />,
})
