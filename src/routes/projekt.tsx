import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '../components/ProjectsPage'
import { pageHead, projectsJsonLd } from '../seo'
import { copy } from '../i18n'

const t = copy.sv.meta.projects

export const Route = createFileRoute('/projekt')({
  head: () =>
    pageHead({
      lang: 'sv',
      page: 'projects',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: projectsJsonLd(t.schemaName, 'sv'),
    }),
  component: () => <ProjectsPage lang="sv" />,
})
