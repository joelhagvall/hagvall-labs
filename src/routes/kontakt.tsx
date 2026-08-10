import { createFileRoute } from '@tanstack/react-router'
import { ContactPage } from '../components/ContactPage'
import { contactJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/kontakt')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'contact',
      title: 'Kontakta Joel Hägvall | Hägvall Labs',
      description:
        'Kontakta Joel Hägvall om Maskera, pilotprojekt eller utvecklingsuppdrag. Du får svar direkt från personen som bygger och levererar.',
      ogTitle: 'Kontakta Joel Hägvall | Hägvall Labs',
      ogDescription:
        'Skriv direkt till personen som bygger produkterna. Svar oftast samma dag.',
      jsonLd: contactJsonLd('Kontakta Hägvall Labs', 'sv'),
    }),
  component: () => <ContactPage lang="sv" />,
})
