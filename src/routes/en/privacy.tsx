import { createFileRoute } from '@tanstack/react-router'
import { PrivacyPage } from '../../components/PrivacyPage'
import { pageHead } from '../../seo'

export const Route = createFileRoute('/en/privacy')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'privacy',
      title: 'Privacy and Personal Data | Hägvall Labs',
      description:
        'Learn how Hägvall Labs handles visitor analytics, hosting, contact details, retention periods and your data protection rights.',
      ogTitle: 'Privacy and Personal Data | Hägvall Labs',
      ogDescription:
        'Clear information about visitor analytics, hosting, retention periods and your rights.',
    }),
  component: () => <PrivacyPage lang="en" />,
})
