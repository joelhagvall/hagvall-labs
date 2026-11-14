import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../../components/AboutPage'
import { aboutJsonLd, pageHead } from '../../seo'
import { copy } from '../../i18n'

const t = copy.en.meta.about

export const Route = createFileRoute('/en/about')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'about',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: aboutJsonLd(t.schemaName, 'en'),
    }),
  component: () => <AboutPage lang="en" />,
})
