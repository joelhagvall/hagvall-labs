// Shared page chrome: the class recipes every page uses. Statically imported by __root.tsx, so everything here is
// bundled into the always-loaded root chunk and never becomes a separate
// request near the LCP paint (see AGENTS.md). Keep it tiny; heavy
// page-specific pieces (MaskPreview, the icons) stay duplicated per page.

// Transitions list properties explicitly (never transition-all). Buttons
// change color and shadow only, they never move on hover or press.
export const btnPrimary =
  'group inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white shadow-flat-sm transition-[background-color,box-shadow] duration-200 hover:bg-cobalt-deep hover:shadow-flat-md motion-reduce:transition-none'

export const btnSecondary =
  'inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-[border-color,color] duration-200 hover:border-cobalt hover:text-cobalt motion-reduce:transition-none'

// The header's contact pill over the white sheet (btnSmallOnCobalt over the band).
export const btnSmall =
  'rounded-full bg-cobalt px-4 py-1.5 text-white transition-[background-color,color] duration-200 hover:bg-cobalt-deep motion-reduce:transition-none'

/* The on-cobalt counterparts, for the hero bands: a white pill whose hover
   swaps to the tint with deep text (the pair keeps AA), and a white outline
   that fills in faintly. The small one is the header's contact pill. */
export const btnPrimaryOnCobalt =
  'group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-cobalt shadow-flat-sm transition-[background-color,color,box-shadow] duration-200 hover:bg-cobalt-tint hover:text-cobalt-deep hover:shadow-flat-md motion-reduce:transition-none'

export const btnSecondaryOnCobalt =
  'inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition-[border-color,color,background-color] duration-200 hover:border-white hover:bg-white/10 motion-reduce:transition-none'

export const btnSmallOnCobalt =
  'rounded-full bg-white px-4 py-1.5 text-cobalt transition-[background-color,color] duration-200 hover:bg-cobalt-tint hover:text-cobalt-deep motion-reduce:transition-none'

// The ↗ on external links, nudged outward when the parent .group is hovered.
// Only external links carry an arrow: it says "leaves the site", which an
// internal link never needs.
export const btnArrow =
  'transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-none'

// Every external link opens in a new tab so the site stays open behind it.
export const externalLinkProps = { target: '_blank', rel: 'noopener' } as const

// Inline text links: ink for links inside body copy, cobalt for standalone.
export const linkInk =
  'underline underline-offset-4 transition-colors hover:text-ink'

export const linkCobalt =
  'text-cobalt underline underline-offset-4 transition-colors hover:text-cobalt-deep'

// The standard section container. Sections are separated by space alone,
// never by rules: a divider has to carry information to earn its place.
export const container = 'mx-auto w-full max-w-5xl px-6 py-14 sm:py-20'

/* Type scale, roughly a fourth (16 / 20 / 36 / 48 / 60): sentence and
   section headings are set tight and large so the system font carries the
   hierarchy on its own, without cards or dividers doing it for them.
   Margins and the responsive h1 size stay with the caller (the home hero
   uses sm:text-6xl, every other page sm:text-5xl). */

/* Kicker on the cobalt bands. The tint keeps AA against cobalt (#c3d2ff on
   #1748d4 is ~4.8:1), white at 80% ~5.2:1. Never letterspaced uppercase:
   the brand voice is calm, not spaced-out. Only where it says something the
   heading does not (the company line on home, the policy name, the 404). */
export const kickerOnCobalt = 'text-sm font-medium text-cobalt-tint'

export const heroTitle =
  'max-w-3xl text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em]'

export const heroBodyOnCobalt =
  'mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-white/80'

export const sectionTitle =
  'text-balance text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl'

// The long-form privacy page's section headings.
export const sectionTitleSm =
  'text-balance text-2xl font-semibold tracking-tight'

// A titled item in a list (services, principles, steps): no card around it.
export const itemTitle = 'text-lg font-semibold tracking-tight'

export const itemBody = 'mt-2 text-pretty leading-relaxed text-neutral-600'

/** The cobalt hero band every page starts with, and the white content sheet
    that rolls over it (-mt-10 overlaps the band so the rounded top corners
    read as a fold). The header sits above both (z-20) and recolors once the
    sheet scrolls under it (the `sheet` marker class, useHeaderOverSheet in
    __root.tsx); flex-1 stretches the sheet so no cobalt gap opens above the
    footer on tall screens. */
export const heroBand = 'on-cobalt bg-cobalt text-white'
export const sheet =
  'sheet relative z-10 -mt-10 flex-1 rounded-t-[2.5rem] bg-white'

/* Recolors the BrandSymbol for cobalt surfaces: the geometry's fill
   attributes lose to CSS, so a two-tone white symbol is a wrapper class. */
export const brandOnCobalt =
  '[&_path]:fill-white [&_path:nth-child(2)]:fill-cobalt-tint'
