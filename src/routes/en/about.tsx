import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../../components/AboutPage'
import { aboutJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/about')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'about',
      title: 'Why I Started Hägvall Labs | Hägvall Labs',
      description:
        'Joel Hägvall on why Hägvall Labs exists: most of what eats a workday is manual glue work that can be automated, and with AI there are no excuses left.',
      ogTitle: 'Why I Started Hägvall Labs',
      ogDescription:
        'Most of what eats time isn’t hard problems. It’s manual glue work that can be built away.',
      jsonLd: aboutJsonLd('About Hägvall Labs', 'en'),
    }),
  component: () => <AboutPage lang="en" />,
})
