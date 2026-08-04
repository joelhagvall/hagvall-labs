import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'

import appCss from '../styles.css?url'
import appCssInline from '../styles.css?inline'

const siteUrl = 'https://hagvall-labs.com'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Hägvall Labs — Privacy-first software for the AI era' },
      {
        name: 'description',
        content:
          'Hägvall Labs AB develops software for information security, privacy protection and AI. The first product, Maskera, detects and masks personal data in text before it reaches AI systems, logs or analytics tools.',
      },
      { property: 'og:site_name', content: 'Hägvall Labs' },
      { property: 'og:type', content: 'website' },
      {
        property: 'og:title',
        content: 'Hägvall Labs — Privacy-first software for the AI era',
      },
      {
        property: 'og:description',
        content:
          'Software for information security, privacy protection and AI. Self-hosted, built in Sweden.',
      },
      { property: 'og:url', content: siteUrl },
      { name: 'twitter:card', content: 'summary' },
    ],
    links: [
      ...(import.meta.env.DEV ? [{ rel: 'stylesheet', href: appCss }] : []),
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Hägvall Labs AB',
          url: siteUrl,
          description:
            'Hägvall Labs AB develops, licenses and sells software and digital services for information security, privacy protection and artificial intelligence.',
          email: 'hello@hagvall-labs.com',
          founder: {
            '@type': 'Person',
            name: 'Joel Hägvall',
            url: 'https://joelhagvall.com',
          },
          address: { '@type': 'PostalAddress', addressCountry: 'SE' },
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
})

function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
          <Link to="/" className="text-sm font-semibold tracking-tight">
            Hägvall&nbsp;Labs
          </Link>
          <nav className="flex items-center gap-6 text-sm text-neutral-600">
            <Link
              to="/maskera"
              className="transition-colors hover:text-neutral-900"
            >
              Maskera
            </Link>
            <a
              href="mailto:hello@hagvall-labs.com"
              className="rounded-full bg-neutral-900 px-4 py-1.5 text-white transition-colors hover:bg-neutral-700"
            >
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-6 py-10 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Hägvall Labs AB. Run by{' '}
            <a
              href="https://joelhagvall.com"
              className="underline underline-offset-4 transition-colors hover:text-neutral-900"
            >
              Joel Hägvall
            </a>
            . Built in Sweden.
          </p>
          <div className="flex gap-6">
            <a
              href="mailto:hello@hagvall-labs.com"
              className="transition-colors hover:text-neutral-900"
            >
              hello@hagvall-labs.com
            </a>
            <a href="/llms.txt" className="transition-colors hover:text-neutral-900">
              llms.txt
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {import.meta.env.PROD && (
          <style dangerouslySetInnerHTML={{ __html: appCssInline }} />
        )}
        <HeadContent />
      </head>
      <body className="bg-white text-neutral-900 antialiased">
        {children}
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        )}
        <Scripts />
      </body>
    </html>
  )
}
