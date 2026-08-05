import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../components/ContactPage'
import { contactEmail, contactJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/kontakt')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'contact',
      title: 'Kontakt | Hägvall Labs',
      description: `Hör av dig direkt till Joel Hägvall på ${contactEmail}. Du får svar från personen som bygger produkterna, oftast samma dag.`,
      ogTitle: 'Kontakt | Hägvall Labs',
      ogDescription:
        'Skriv direkt till personen som bygger produkterna. Svar oftast samma dag.',
      jsonLd: contactJsonLd('Kontakta Hägvall Labs', 'sv'),
    }),
  component: () => <ContactPage lang="sv" />,
})
