import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/HomePage'
import { homeJsonLd, pageHead } from '../seo'
import { copy } from '../i18n'

const t = copy.sv.meta.home

export const Route = createFileRoute('/')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'home',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: homeJsonLd(),
    }),
  component: () => <HomePage lang="sv" />,
})
