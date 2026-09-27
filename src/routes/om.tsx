import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../components/AboutPage'
import { aboutJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/om')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'about',
      title: 'Därför startade jag Hägvall Labs | Hägvall Labs',
      description:
        'Joel Hägvall om varför Hägvall Labs finns: det mesta som tar tid på jobbet är handpåläggning som går att automatisera, och med AI finns inga ursäkter kvar.',
      ogTitle: 'Därför startade jag Hägvall Labs',
      ogDescription:
        'Det mesta som tar tid är inte svåra problem. Det är handpåläggning som går att bygga bort.',
      jsonLd: aboutJsonLd('Om Hägvall Labs', 'sv'),
    }),
  component: () => <AboutPage lang="sv" />,
})
