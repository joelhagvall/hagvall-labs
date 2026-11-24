import { createFileRoute } from '@tanstack/react-router'
import { ProjectsPage } from '../../components/ProjectsPage'
import { pageHead, projectsJsonLd } from '../../seo'
import { copy } from '../../i18n'

const t = copy.en.meta.projects

export const Route = createFileRoute('/en/projects')({
  head: () =>
    pageHead({
      lang: 'en',
      page: 'projects',
      title: t.title,
      description: t.description,
      ogTitle: t.ogTitle,
      ogDescription: t.ogDescription,
      jsonLd: projectsJsonLd(t.schemaName, 'en'),
    }),
  component: () => <ProjectsPage lang="en" />,
})
