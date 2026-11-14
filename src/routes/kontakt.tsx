import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../components/ContactPage'
import { contactJsonLd, pageHead } from '../seo'
import { copy } from '../i18n'

const t = copy.sv.meta.contact

export const Route = createFileRoute('/kontakt')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'contact',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: contactJsonLd(t.schemaName, 'sv'),
    }),
  component: () => <ContactPage lang="sv" />,
})
