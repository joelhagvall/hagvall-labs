import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../../components/ContactPage'
import { contactEmail, contactJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/contact')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'contact',
      title: 'Contact | Hägvall Labs',
      description: `Get in touch with Joel Hägvall directly at ${contactEmail}. You get a reply from the person who builds the products, usually the same day.`,
      ogTitle: 'Contact | Hägvall Labs',
      ogDescription:
        'Write directly to the person who builds the products. Replies usually the same day.',
      jsonLd: contactJsonLd('Contact Hägvall Labs', 'en'),
    }),
  component: () => <ContactPage lang="en" />,
})
