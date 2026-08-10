import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../../components/ContactPage'
import { contactJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/contact')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'contact',
      title: 'Contact Joel Hägvall | Hägvall Labs',
      description:
        'Contact Joel Hägvall about Maskera, pilot projects or software development. Hear directly from the person who builds and delivers.',
      ogTitle: 'Contact Joel Hägvall | Hägvall Labs',
      ogDescription:
        'Write directly to the person who builds the products. Replies usually the same day.',
      jsonLd: contactJsonLd('Contact Hägvall Labs', 'en'),
    }),
  component: () => <ContactPage lang="en" />,
})
