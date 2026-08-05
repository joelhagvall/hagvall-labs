import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '../../components/PrivacyPage'
import { pageHead } from '../../seo'

export const Route = createFileRoute('/en/privacy')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'privacy',
      title: 'Privacy | Hägvall Labs',
      description:
        'How Hägvall Labs handles visitor analytics, operational logs and information you provide when getting in touch.',
      ogTitle: 'Privacy | Hägvall Labs',
      ogDescription:
        'Clear information about visitor analytics, operational logs, retention periods and your rights.',
    }),
  component: () => <PrivacyPage lang="en" />,
})
