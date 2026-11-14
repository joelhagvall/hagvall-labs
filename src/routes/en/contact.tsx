import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../../components/ContactPage'
import { contactJsonLd, pageHead } from '../../seo'
import { copy } from '../../i18n'

const t = copy.en.meta.contact

export const Route = createFileRoute('/en/contact')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'contact',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: contactJsonLd(t.schemaName, 'en'),
    }),
  component: () => <ContactPage lang="en" />,
})
