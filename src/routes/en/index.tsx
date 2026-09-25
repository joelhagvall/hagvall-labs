import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/HomePage'
import { homeJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'home',
      title: 'Hägvall Labs | Software, AI and Automation',
      description:
        'Joel Hägvall’s company in Stockholm. I build software, APIs and AI automation for businesses, and Maskera, which removes personal data before text reaches AI.',
      ogTitle: 'Hägvall Labs | Software, AI and Automation',
      ogDescription:
        'Software, APIs and AI automation with privacy at the core. Built in Stockholm.',
      jsonLd: homeJsonLd(),
    }),
  component: () => <HomePage lang="en" />,
})
