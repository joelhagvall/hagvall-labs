# Hägvall Labs brand package

The folders `symbol/`, `logo/`, `wordmark/` and `social/` are generated:
`bun run build:brand` rebuilds them (and the site icons in `public/`) from
the symbol geometry in `src/components/BrandSymbol.tsx`. Do not edit the
generated files by hand, change the source and rebuild.

## Files

| Folder | Contents |
| --- | --- |
| `symbol/` | The symbol alone, square canvas with 10% padding. `color` (cobalt), `ink` (monochrome dark), `white` (for dark or cobalt backgrounds), plus `on-cobalt` and `on-white` app-icon tiles. PNG at 256, 512, 1024 and 2048 px. |
| `logo/` | Horizontal lockup (symbol left, wordmark right) and stacked lockup (symbol above wordmark). Same three variants, PNG at 1x, 2x and 4x. |
| `wordmark/` | "HÄGVALL LABS" alone, outlined from Avenir Next Medium with 0.15 em tracking. |
| `social/` | Open Graph card 1200x630 (sv and en), square avatars 1024x1024 (white and cobalt), wide banner 1584x396 (LinkedIn cover). |

The site itself uses `public/brand/hagvall-labs-symbol.svg` (JSON-LD logo),
`public/brand/og-image-sv.png` and `og-image-en.png`, `public/favicon.svg`, `public/favicon.ico` and
`public/apple-touch-icon.png`, all written by the same script. The header
renders the symbol inline and the wordmark as text, so the site never loads a
logo file.

## Colors

| Name | Hex | Use |
| --- | --- | --- |
| Cobalt | `#1748D4` | Outer symbol panels, "LABS", primary actions |
| Cobalt tint | `#5B7CE4` | Middle ribbon of the symbol only |
| Cobalt deep | `#1239A8` | Hover state on the site |
| Ink | `#20272D` | "HÄGVALL", body text, monochrome symbol |
| White | `#FFFFFF` | Backgrounds, reversed logo |

The symbol is monochrome cobalt: there is no second brand color. In the ink
and white variants the middle ribbon is the same color at 55% opacity.

## Rules

- Clear space around a lockup is the cap height of the wordmark on all sides;
  the SVGs already include it. Around the symbol alone, keep at least 10% of
  its height.
- Minimum sizes: symbol 16 px, horizontal lockup 24 px tall, stacked lockup
  64 px tall.
- Use `color` on white or very light backgrounds, `white` on cobalt, photos
  or dark backgrounds, `ink` when only one dark color is available (print,
  engraving, single-color embroidery).
- Do not recolor, rotate, add effects, outline the shapes or change the
  ratio between symbol and wordmark. Do not set the wordmark in another
  font; use the outlined files.
- The old symbol with a turquoise middle ribbon is retired: replace it
  wherever it still shows up.
