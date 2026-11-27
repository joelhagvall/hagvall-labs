import { createFileRoute } from '@tanstack/react-router'
import { MaskeraPage } from '../components/MaskeraPage'
import { maskeraJsonLd, pageHead } from '../seo'
import { copy } from '../i18n'

const t = copy.sv.meta.maskera

export const Route = createFileRoute('/maskera')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'maskera',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: maskeraJsonLd(t.schemaDescription),
    }),
  component: () => <MaskeraPage lang="sv" />,
})
