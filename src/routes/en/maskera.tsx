import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../../components/MaskeraPage'
import { maskeraJsonLd, pageHead } from '../../seo'

export const Route = createFileRoute('/en/maskera')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'maskera',
      title: 'Mask Personal Data Before It Reaches AI | Hägvall Labs',
      description:
        'Maskera masks personal data in text, like names and identity numbers, before it reaches AI systems, logs or analytics tools. Runs in your own IT environment.',
      ogTitle: 'Mask Personal Data Before It Reaches AI',
      ogDescription:
        'Find and mask personal data before AI systems, logs and analytics see it. Self-hosted, GDPR-friendly, built in Sweden.',
      jsonLd: maskeraJsonLd(
        'Maskera finds and masks personal data in text before it reaches AI systems, logs or analytics tools. Deployed in the customer’s own IT environment.',
      ),
    }),
  component: () => <MaskeraPage lang="en" />,
})
