import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../../components/MaskeraPage'
import { maskeraJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/maskera')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'maskera',
      title: 'Mask Personal Data Before AI | Hägvall Labs',
      description:
        'Maskera finds and masks names, identity numbers and addresses before text reaches AI systems, logs or analytics. Runs in your own IT environment.',
      ogTitle: 'Mask Personal Data Before AI | Hägvall Labs',
      ogDescription:
        'Mask personal data before AI, logs and analytics. Self-hosted, GDPR-friendly and built in Sweden.',
      jsonLd: maskeraJsonLd(
        'Maskera finds and masks personal data in text before it reaches AI systems, logs or analytics tools. Deployed in the customer’s own IT environment.',
      ),
    }),
  component: () => <MaskeraPage lang="en" />,
})
