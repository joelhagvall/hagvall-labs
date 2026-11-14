import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../components/AboutPage'
import { aboutJsonLd, pageHead } from '../seo'
import { copy } from '../i18n'

const t = copy.sv.meta.about

export const Route = createFileRoute('/om')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'about',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: aboutJsonLd(t.schemaName, 'sv'),
    }),
  component: () => <AboutPage lang="sv" />,
})
