// Shared interactive styles. Transitions list properties explicitly (never
// transition-all), transforms are disabled under prefers-reduced-motion.
export const btnPrimary =
  'group inline-flex items-center gap-2 rounded-full bg-cobalt px-6 py-3 text-sm font-medium text-white shadow-sm transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-cobalt-deep hover:shadow-md active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:-translate-y-0'

export const btnSecondary =
  'inline-flex items-center gap-2 rounded-full border border-neutral-300 px-6 py-3 text-sm font-medium transition-[border-color,color,transform] duration-200 hover:-translate-y-0.5 hover:border-cobalt hover:text-cobalt active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:-translate-y-0'

export const btnSmall =
  'rounded-full bg-cobalt px-4 py-1.5 text-white transition-[background-color,transform] duration-200 hover:-translate-y-px hover:bg-cobalt-deep motion-reduce:transition-none motion-reduce:hover:translate-y-0'

// Arrow that nudges right when the parent .group button/link is hovered.
export const btnArrow =
  'transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
