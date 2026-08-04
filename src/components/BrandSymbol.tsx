// Inlined so the header/hero logo costs no network request. An above-fold
// <img> adds a simulated RTT to Lighthouse's pessimistic LCP estimate, which
// alone drops Performance from 100 to 99 on every page.
export function BrandSymbol({
  size,
  className,
}: {
  size: number
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="210 110 580 580"
      className={className}
    >
      <path fill="#1748D4" d="M270 350 495 438 495 566 414 535 414 680 270 625Z" />
      <path fill="#14B8A6" d="M365 254 610 349 610 650 438 584 438 494 525 528 525 395 365 333Z" />
      <path fill="#1748D4" d="M480 165 710 254 710 560 630 529 630 334 480 278Z" />
    </svg>
  )
}
