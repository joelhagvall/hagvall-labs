import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../components/MaskeraPage'
import { maskeraJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/maskera')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'maskera',
      title: 'Maskera personuppgifter före AI | Hägvall Labs',
      description:
        'Maskera hittar och maskerar namn, personnummer och adresser innan text når AI-system, loggar eller analysverktyg. Körs i er egen IT-miljö.',
      ogTitle: 'Maskera personuppgifter före AI | Hägvall Labs',
      ogDescription:
        'Maskera personuppgifter före AI, loggar och analysverktyg. Self-hosted, GDPR-vänlig och byggd i Sverige.',
      jsonLd: maskeraJsonLd(
        'Maskera hittar och maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg. Installeras i kundens egen IT-miljö.',
      ),
    }),
  component: () => <MaskeraPage lang="sv" />,
})
