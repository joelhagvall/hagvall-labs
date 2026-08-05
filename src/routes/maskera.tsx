import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../components/MaskeraPage'
import { maskeraJsonLd, pageHead } from '../seo'

export const Route = createFileRoute('/maskera')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'maskera',
      title: 'Maskera personuppgifter innan de når AI | Hägvall Labs',
      description:
        'Maskera maskerar personuppgifter i text, som namn, personnummer och adresser, innan de når AI-system, loggar eller analysverktyg. Körs i er egen IT-miljö.',
      ogTitle: 'Maskera personuppgifter innan de når AI',
      ogDescription:
        'Hitta och maskera personuppgifter innan AI-system, loggar och analysverktyg ser dem. Self-hosted, GDPR-vänlig, byggd i Sverige.',
      jsonLd: maskeraJsonLd(
        'Maskera hittar och maskerar personuppgifter i text innan de når AI-system, loggar eller analysverktyg. Installeras i kundens egen IT-miljö.',
      ),
    }),
  component: () => <MaskeraPage lang="sv" />,
})
