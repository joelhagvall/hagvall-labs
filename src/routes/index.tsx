import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { homeJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'home',
      title: 'Hägvall Labs | Mjukvara, AI och automation',
      description:
        'Joel Hägvalls bolag i Stockholm. Jag bygger mjukvara, API:er och AI-automation åt företag, och Maskera, som tar bort personuppgifter innan text når AI.',
      ogTitle: 'Hägvall Labs | Mjukvara, AI och automation',
      ogDescription:
        'Mjukvara, API:er och AI-automation med integriteten i grunden. Byggt i Stockholm.',
      jsonLd: homeJsonLd(),
    }),
  component: () => <HomePage lang="sv" />,
})
