import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../../components/ContactPage'
import { alternateLinks, localeMeta, site } from '../../seo'

const jsonLd = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Hägvall Labs',
  url: site + '/en/contact',
  about: { '@type': 'Organization', name: 'Hägvall Labs AB' },
})

export const Route = createFileRoute('/en/contact')({
  head: () => ({
    meta: [
      { title: 'Contact | Hägvall Labs' },
      {
        name: 'description',
        content:
          'Get in touch with Joel Hägvall directly at hello@hagvall-labs.com. You get a reply from the person who builds the products, usually the same day.',
      },
      { property: 'og:title', content: 'Contact | Hägvall Labs' },
      {
        property: 'og:description',
        content:
          'Write directly to the person who builds the products. Replies usually the same day.',
      },
      { property: 'og:url', content: site + '/en/contact' },
      ...localeMeta('en'),
    ],
    links: alternateLinks('/kontakt', '/en/contact', 'en'),
    scripts: [{ type: 'application/ld+json', children: jsonLd }],
  }),
  component: () => <ContactPage lang="en" />,
})
