// Builds the generated folders of the brand package in brand/ (README.md is
// hand-written and kept) plus the site icons in public/ from
// the single source of truth: BRAND_PATHS in src/components/BrandSymbol.tsx.
// The wordmark is outlined from Avenir Next Medium (macOS system font) so
// no output depends on a font being installed. Raster files go through
// ImageMagick (`magick`, brew install imagemagick).
//
//   bun scripts/build-brand.ts
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { execFileSync } from 'node:child_process'
import * as fontkit from 'fontkit'
import { BRAND_PATHS } from '../src/components/BrandSymbol'

const ROOT = join(import.meta.dir, '..')
const OUT = join(ROOT, 'brand')
const TMP = join(ROOT, 'node_modules/.brand-tmp')

const COBALT = '#1748D4'
const COBALT_TINT = '#5B7CE4'
const INK = '#20272D'
const WHITE = '#FFFFFF'
const GREY = '#5B6570'

// Symbol geometry: BRAND_PATHS live in a 210..790 canvas, the shapes span
// x 270..710 and y 165..680. Everything below works in a normalised space
// where the symbol's bounding box starts at 0,0.
const SYM_X = 270
const SYM_Y = 165
const SYM_W = 440
const SYM_H = 515

type Variant = 'color' | 'ink' | 'white'
const symbolFills = (v: Variant, i: number) => {
  const mid = i === 1
  if (v === 'color') return { fill: mid ? COBALT_TINT : COBALT }
  return { fill: v === 'ink' ? INK : WHITE, opacity: mid ? 0.55 : undefined }
}

function transformPath(d: string, s: number, tx: number, ty: number, flipY = false) {
  // Absolute commands only (fontkit and BRAND_PATHS both emit those).
  let i = 0
  return d.replace(/-?\d*\.?\d+(?:e-?\d+)?/g, (n) => {
    const v = Number(n)
    const out = i % 2 === 0 ? v * s + tx : (flipY ? -v : v) * s + ty
    i++
    return String(Math.round(out * 100) / 100)
  })
}

function symbol(x: number, y: number, h: number, v: Variant) {
  const s = h / SYM_H
  return BRAND_PATHS.map((p, i) => {
    const f = symbolFills(v, i)
    const d = transformPath(p.d, s, x - SYM_X * s, y - SYM_Y * s)
    return `<path fill="${f.fill}"${f.opacity ? ` fill-opacity="${f.opacity}"` : ''} d="${d}"/>`
  }).join('')
}

// Wordmark ----------------------------------------------------------------
const collection = fontkit.openSync('/System/Library/Fonts/Avenir Next.ttc') as any
const medium = collection.getFont('AvenirNext-Medium')
const regular = collection.getFont('AvenirNext-Regular')
const UPM = medium.unitsPerEm as number
const CAP = medium.capHeight as number

type Word = { text: string; fill: string }
// Returns paths plus the total advance width, for a run of words laid out
// at `capHeight` px with `tracking` em letterspacing, baseline at `y`.
function text(
  font: any,
  words: Word[],
  x: number,
  y: number,
  capHeight: number,
  tracking: number,
  wordGap = 0.35,
) {
  const s = capHeight / CAP
  let cx = x
  let out = ''
  words.forEach((w, wi) => {
    const run = font.layout(w.text)
    let d = ''
    run.glyphs.forEach((g: any, i: number) => {
      d += transformPath(g.path.toSVG(), s, cx, y, true)
      cx += run.positions[i].xAdvance * s + tracking * UPM * s
    })
    out += `<path fill="${w.fill}" d="${d}"/>`
    if (wi < words.length - 1) cx += wordGap * UPM * s
  })
  const width = cx - x - tracking * UPM * s
  return { svg: out, width }
}

const wordmarkWords = (v: Variant): Word[] => [
  { text: 'HÄGVALL', fill: v === 'white' ? WHITE : INK },
  { text: 'LABS', fill: v === 'color' ? COBALT : v === 'ink' ? INK : WHITE },
]
const TRACKING = 0.15

function wordmarkWidth(capHeight: number) {
  return text(medium, wordmarkWords('ink'), 0, 0, capHeight, TRACKING).width
}

// Compositions ------------------------------------------------------------
function svgDoc(w: number, h: number, body: string, title: string, bg?: string) {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}">` +
    (bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : '') +
    body +
    '</svg>'
  )
}

// Square symbol tile: symbol height = 80% of the side, centred.
function symbolTile(side: number, v: Variant, bg?: string, scale = 0.8) {
  const h = side * scale
  const w = h * (SYM_W / SYM_H)
  return svgDoc(side, side, symbol((side - w) / 2, (side - h) / 2, h, v), 'Hägvall Labs', bg)
}

// Horizontal lockup: symbol, gap, wordmark. Wordmark cap height is 32% of
// the symbol height (the proportion the site header uses), optically
// centred on the symbol. Clear space = wordmark cap height on all sides.
function lockupHorizontal(symH: number, v: Variant, bg?: string) {
  const cap = symH * 0.32
  const gap = symH * 0.36
  const pad = cap
  const symW = symH * (SYM_W / SYM_H)
  const wmW = wordmarkWidth(cap)
  const w = pad + symW + gap + wmW + pad
  const h = pad + symH + pad
  const baseline = pad + symH / 2 + cap / 2
  const body =
    symbol(pad, pad, symH, v) +
    text(medium, wordmarkWords(v), pad + symW + gap, baseline, cap, TRACKING).svg
  return { svg: svgDoc(w, h, body, 'Hägvall Labs', bg), w, h }
}

// Stacked lockup: symbol above the wordmark, both centred.
function lockupStacked(symH: number, v: Variant, bg?: string) {
  const cap = symH * 0.26
  const gap = symH * 0.3
  const pad = cap
  const symW = symH * (SYM_W / SYM_H)
  const wmW = wordmarkWidth(cap)
  const w = pad * 2 + Math.max(symW, wmW)
  const h = pad + symH + gap + cap + pad
  const body =
    symbol((w - symW) / 2, pad, symH, v) +
    text(medium, wordmarkWords(v), (w - wmW) / 2, pad + symH + gap + cap, cap, TRACKING).svg
  return { svg: svgDoc(w, h, body, 'Hägvall Labs', bg), w, h }
}

function wordmark(cap: number, v: Variant, bg?: string) {
  const pad = cap
  const wmW = wordmarkWidth(cap)
  const w = pad * 2 + wmW
  const h = pad * 2 + cap
  const body = text(medium, wordmarkWords(v), pad, pad + cap, cap, TRACKING).svg
  return { svg: svgDoc(w, h, body, 'Hägvall Labs', bg), w, h }
}

// Social card (1200x630): centred horizontal lockup with the tagline below.
function socialCard(tagline: string) {
  const W = 1200
  const H = 630
  const symH = 150
  const cap = symH * 0.32
  const gap = symH * 0.36
  const symW = symH * (SYM_W / SYM_H)
  const wmW = wordmarkWidth(cap)
  const lockW = symW + gap + wmW
  const x0 = (W - lockW) / 2
  const y0 = (H - symH) / 2 - 10
  const baseline = y0 + symH / 2 - cap * 0.55
  const tagCap = 24
  const tag = text(regular, [{ text: tagline, fill: GREY }], 0, 0, tagCap, 0)
  const body =
    symbol(x0, y0, symH, 'color') +
    text(medium, wordmarkWords('color'), x0 + symW + gap, baseline, cap, TRACKING).svg +
    text(regular, [{ text: tagline, fill: GREY }], x0 + symW + gap, baseline + cap * 1.9, tagCap, 0).svg
  void tag
  return svgDoc(W, H, body, 'Hägvall Labs', WHITE)
}

// Wide banner (LinkedIn cover 1584x396): centred horizontal lockup.
function banner(v: Variant, bg: string) {
  const W = 1584
  const H = 396
  const symH = 140
  const cap = symH * 0.32
  const gap = symH * 0.36
  const symW = symH * (SYM_W / SYM_H)
  const wmW = wordmarkWidth(cap)
  const x0 = (W - (symW + gap + wmW)) / 2
  const y0 = (H - symH) / 2
  const body =
    symbol(x0, y0, symH, v) +
    text(medium, wordmarkWords(v), x0 + symW + gap, y0 + symH / 2 + cap / 2, cap, TRACKING).svg
  return svgDoc(W, H, body, 'Hägvall Labs', bg)
}

// Output ------------------------------------------------------------------
for (const d of ['symbol', 'logo', 'wordmark', 'social']) rmSync(join(OUT, d), { recursive: true, force: true })
rmSync(TMP, { recursive: true, force: true })
mkdirSync(TMP, { recursive: true })

function writeSvg(rel: string, svg: string) {
  const p = join(OUT, rel)
  mkdirSync(join(p, '..'), { recursive: true })
  writeFileSync(p, svg + '\n')
  return p
}

function png(svg: string, w: number, h: number, outPath: string) {
  const tmp = join(TMP, `${w}x${h}-${Math.random().toString(36).slice(2)}.svg`)
  writeFileSync(tmp, svg)
  mkdirSync(join(outPath, '..'), { recursive: true })
  execFileSync('magick', [
    '-background', 'none',
    '-size', `${w}x${h}`,
    tmp,
    '-strip',
    `PNG32:${outPath}`,
  ])
}

const variants: Variant[] = ['color', 'ink', 'white']

// Symbol
for (const v of variants) {
  const name = `hagvall-labs-symbol-${v}`
  writeSvg(`symbol/${name}.svg`, symbolTile(640, v))
  for (const side of [256, 512, 1024, 2048]) {
    png(symbolTile(side, v), side, side, join(OUT, `symbol/png/${name}-${side}.png`))
  }
}
// Symbol on solid backgrounds (app icon style)
writeSvg('symbol/hagvall-labs-symbol-on-cobalt.svg', symbolTile(640, 'white', COBALT, 0.6))
writeSvg('symbol/hagvall-labs-symbol-on-white.svg', symbolTile(640, 'color', WHITE, 0.6))
for (const side of [512, 1024]) {
  png(symbolTile(side, 'white', COBALT, 0.6), side, side, join(OUT, `symbol/png/hagvall-labs-symbol-on-cobalt-${side}.png`))
  png(symbolTile(side, 'color', WHITE, 0.6), side, side, join(OUT, `symbol/png/hagvall-labs-symbol-on-white-${side}.png`))
}

// Lockups and wordmark
for (const v of variants) {
  const h = lockupHorizontal(200, v)
  writeSvg(`logo/hagvall-labs-logo-horizontal-${v}.svg`, h.svg)
  for (const scale of [1, 2, 4]) {
    png(h.svg, Math.round(h.w * scale), Math.round(h.h * scale), join(OUT, `logo/png/hagvall-labs-logo-horizontal-${v}@${scale}x.png`))
  }
  const s = lockupStacked(200, v)
  writeSvg(`logo/hagvall-labs-logo-stacked-${v}.svg`, s.svg)
  for (const scale of [1, 2, 4]) {
    png(s.svg, Math.round(s.w * scale), Math.round(s.h * scale), join(OUT, `logo/png/hagvall-labs-logo-stacked-${v}@${scale}x.png`))
  }
  const wm = wordmark(64, v)
  writeSvg(`wordmark/hagvall-labs-wordmark-${v}.svg`, wm.svg)
  for (const scale of [1, 2, 4]) {
    png(wm.svg, Math.round(wm.w * scale), Math.round(wm.h * scale), join(OUT, `wordmark/png/hagvall-labs-wordmark-${v}@${scale}x.png`))
  }
}

// Social
const ogSv = socialCard('Integritetssäker mjukvara för AI-eran')
const ogEn = socialCard('Privacy-first software for the AI era')
png(ogSv, 1200, 630, join(OUT, 'social/og-image-sv.png'))
png(ogEn, 1200, 630, join(OUT, 'social/og-image-en.png'))
png(symbolTile(1024, 'color', WHITE, 0.6), 1024, 1024, join(OUT, 'social/avatar-white-1024.png'))
png(symbolTile(1024, 'white', COBALT, 0.6), 1024, 1024, join(OUT, 'social/avatar-cobalt-1024.png'))
png(banner('color', WHITE), 1584, 396, join(OUT, 'social/banner-white-1584x396.png'))
png(banner('white', COBALT), 1584, 396, join(OUT, 'social/banner-cobalt-1584x396.png'))

// Site assets in public/
const PUB = join(ROOT, 'public')
const ico: string[] = []
for (const side of [16, 32, 48]) {
  const p = join(TMP, `favicon-${side}.png`)
  png(symbolTile(side, 'color', undefined, 0.94), side, side, p)
  ico.push(p)
}
execFileSync('magick', [...ico, join(PUB, 'favicon.ico')])
png(symbolTile(180, 'color', WHITE, 0.66), 180, 180, join(PUB, 'apple-touch-icon.png'))
png(ogSv, 1200, 630, join(PUB, 'brand/og-image-sv.png'))
png(ogEn, 1200, 630, join(PUB, 'brand/og-image-en.png'))
writeFileSync(join(PUB, 'brand/hagvall-labs-symbol.svg'), symbolTile(640, 'color') + '\n')
writeFileSync(join(PUB, 'favicon.svg'), symbolTile(640, 'color', undefined, 0.94) + '\n')

// Optimise PNGs in place when oxipng is around (optional).
try {
  execFileSync('oxipng', ['-o', '4', '--strip', 'safe', '-r', OUT, PUB], { stdio: 'ignore' })
} catch {}

rmSync(TMP, { recursive: true, force: true })
console.log('brand package written to brand/ and public/')
