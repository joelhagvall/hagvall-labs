// Inlined so the header/hero logo costs no network request. An above-fold
// <img> adds a simulated RTT to Lighthouse's pessimistic LCP estimate, which
// alone drops Performance from 100 to 99 on every page.

// The symbol geometry, single source for the component and the data-URI
// favicon in __root.tsx. public/brand/hagvall-labs-symbol.svg carries the
// same paths for the JSON-LD logo; regenerate it if these change.
// Monochrome cobalt: the middle ribbon is a lighter tint of the same hue.
export const BRAND_VIEWBOX = '210 110 580 580'
export const BRAND_PATHS = [
  { fill: '#1748D4', d: 'M270 350 495 438 495 566 414 535 414 680 270 625Z' },
  { fill: '#5B7CE4', d: 'M365 254 610 349 610 650 438 584 438 494 525 528 525 395 365 333Z' },
  { fill: '#1748D4', d: 'M480 165 710 254 710 560 630 529 630 334 480 278Z' },
] as const

// `animated` adds a staggered path entrance (CSS classes in styles.css,
// gated behind prefers-reduced-motion). Used in the hero only: the SVG is
// aria-hidden and never an LCP candidate, so the animation is free.
export function BrandSymbol({
  size,
  className,
  animated = false,
}: {
  size: number
  className?: string
  animated?: boolean
}) {
  const pathClass = animated ? 'brand-path' : undefined
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox={BRAND_VIEWBOX}
      className={className}
    >
      {BRAND_PATHS.map((p) => (
        <path key={p.d} className={pathClass} fill={p.fill} d={p.d} />
      ))}
    </svg>
  )
}
