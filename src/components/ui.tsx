// Shared page chrome: class recipes and the small presentational pieces
// every page uses. Statically imported by __root.tsx, so everything here is
// bundled into the always-loaded root chunk and never becomes a separate
// request near the LCP paint (see AGENTS.md). Keep it tiny; heavy
// page-specific pieces (MaskPreview, the icons) stay duplicated per page.
import { useEffect } from 'react'

// Transitions list properties explicitly (never transition-all). Buttons
// change color and shadow only, they never move on hover or press.
export const btnPrimary =
  'group inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white shadow-flat-sm transition-[background-color,box-shadow] duration-200 hover:bg-cobalt-deep hover:shadow-flat-md motion-reduce:transition-none'

export const btnSecondary =
  'inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-[border-color,color] duration-200 hover:border-cobalt hover:text-cobalt motion-reduce:transition-none'

export const btnSmall =
  'rounded-full bg-cobalt px-4 py-1.5 text-white transition-[background-color] duration-200 hover:bg-cobalt-deep motion-reduce:transition-none'

// Arrow that nudges right when the parent .group button/link is hovered.
export const btnArrow =
  'transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'

// Every external link opens in a new tab so the site stays open behind it.
export const externalLinkProps = { target: '_blank', rel: 'noopener' } as const

// Inline text links: ink for links inside body copy, cobalt for standalone.
export const linkInk =
  'underline underline-offset-4 transition-colors hover:text-ink'

export const linkCobalt =
  'text-cobalt underline underline-offset-4 transition-colors hover:text-cobalt-deep'

// The standard section container.
export const container = 'mx-auto w-full max-w-5xl px-6 py-20'

// Type hierarchy. Margins and the responsive h1 size stay with the caller
// (the home hero uses sm:text-6xl, every other page sm:text-5xl), `reveal`
// too since above-fold headings must not animate.
export const kicker = 'text-sm font-medium text-cobalt'

export const heroTitle =
  'max-w-3xl text-balance text-4xl font-semibold tracking-tight'

export const heroBody =
  'mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-neutral-600'

export const sectionTitle = 'text-balance text-3xl font-semibold tracking-tight'

export const sectionTitleSm =
  'text-balance text-2xl font-semibold tracking-tight'

const cardClass =
  'reveal rounded-2xl border border-neutral-200 bg-white p-6 transition-colors duration-200 hover:border-cobalt/40'

const chipClass =
  'flex h-10 w-10 items-center justify-center rounded-xl bg-cobalt/10 text-cobalt'

/* Drives the .reveal entrances (classes in styles.css). Only elements
   strictly below the first viewport are hidden and animated in on scroll;
   anything visible on load stays fully opaque, so an accessibility audit
   never catches text mid-fade.

   Rendered by each PAGE component, never by the root layout: the pages are
   lazy chunks, and an effect in the root fires after the shell hydrates but
   before the page subtree does. Mutating .reveal classes in that window
   makes React report a hydration mismatch on the page's elements. A page's
   own effect runs only after its subtree has hydrated, so the race cannot
   happen; route changes remount the page and re-run it. */
export function RevealObserver() {
  useEffect(() => {
    if (
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return
    }
    const pending = Array.from(
      document.querySelectorAll<HTMLElement>('.reveal'),
    ).filter((el) => el.getBoundingClientRect().top > window.innerHeight)
    if (pending.length === 0) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.remove('reveal-pending')
          entry.target.classList.add('reveal-in')
          observer.unobserve(entry.target)
        }
      },
      // The huge top margin counts anything already scrolled PAST as
      // intersecting: a fast jump (keyboard End, anchor link) must never
      // leave skipped sections permanently hidden.
      { rootMargin: '9999px 0px -10% 0px' },
    )
    for (const el of pending) {
      el.classList.add('reveal-pending')
      observer.observe(el)
    }
    return () => {
      observer.disconnect()
      for (const el of pending) {
        el.classList.remove('reveal-pending')
      }
    }
  }, [])
  return null
}

/** Decorative hero background: radial-gradient divs, never blur() filters. */
export function HeroGlows() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <div className="glow glow-cobalt absolute -top-32 right-[-10%] size-112" />
      <div className="glow glow-cobalt-soft glow-delay absolute -left-48 top-40 size-120" />
    </div>
  )
}

/** A grid of feature cards. Renders a 1-based step number when no icons are
    given (the contact page); the chip is decorative (aria-hidden) like the
    icons, so neither assistive tech nor the Markdown representation gets a
    stray "1" before each heading. Pass grid columns and top margin via
    className. */
export function Cards({
  items,
  icons,
  className,
}: {
  items: ReadonlyArray<{ title: string; body: string }>
  icons?: ReadonlyArray<(props: { className?: string }) => React.ReactNode>
  className?: string
}) {
  return (
    <div className={`grid gap-6 ${className ?? ''}`}>
      {items.map((item, i) => {
        const Icon = icons?.[i]
        return (
          <div key={item.title} className={cardClass}>
            <span
              aria-hidden="true"
              className={`${chipClass}${Icon ? '' : ' text-sm font-semibold'}`}
            >
              {Icon ? <Icon className="h-5 w-5" /> : i + 1}
            </span>
            <h3 className="mt-4 font-medium">{item.title}</h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-neutral-600">
              {item.body}
            </p>
          </div>
        )
      })}
    </div>
  )
}
