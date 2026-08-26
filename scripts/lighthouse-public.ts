// Public Lighthouse check of the live site, run daily and after each deploy
// by .github/workflows/lighthouse.yml. Audits every route on
// https://hagvall-labs.com (mobile, all four categories), takes the median
// of LH_RUNS runs per route, writes one HTML report per route to OUT_DIR (a
// workflow artifact) and the lowest score per category across all routes to
// src/lighthouse-scores.json, which the footer in __root.tsx renders. Also
// writes OUT_DIR/index.html, a small page listing every route's median scores
// with a link to the report of the median run; the workflow publishes OUT_DIR
// to GitHub Pages so the reports can be read without downloading anything.
//
// Usage: bun scripts/lighthouse-public.ts   (env: BASE, OUT_DIR, LH_RUNS,
// CPU_SLOWDOWN, RUN_URL). Exits 1 if any score is below the AGENTS.md gates
// (Performance >= 95, Accessibility and SEO 100), after writing the scores,
// so a regression is visible on the site and fails the workflow.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pagePaths } from '../src/seo'

const BASE = process.env.BASE ?? 'https://hagvall-labs.com'
const OUT_DIR = process.env.OUT_DIR ?? 'lighthouse-reports'
const RUNS = Number(process.env.LH_RUNS ?? 3)
const CPU = process.env.CPU_SLOWDOWN ?? '4'
const RUN_URL = process.env.RUN_URL ?? ''
const SCORES_FILE = 'src/lighthouse-scores.json'
const categories = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
] as const
type Category = (typeof categories)[number]

if (!Number.isInteger(RUNS) || RUNS < 1 || RUNS % 2 === 0) {
  throw new Error('LH_RUNS must be a positive odd integer')
}
mkdirSync(OUT_DIR, { recursive: true })

const routes = Object.values(pagePaths).flatMap((p) => [p.sv, p.en])
const labels: Record<Category, string> = {
  performance: 'Performance',
  accessibility: 'Accessibility',
  'best-practices': 'Best practices',
  seo: 'SEO',
}
type RouteResult = {
  path: string
  scores: Record<Category, number>
  report: string
}
const results: RouteResult[] = []
const worst: Record<Category, number> = {
  performance: 100,
  accessibility: 100,
  'best-practices': 100,
  seo: 100,
}

for (const path of routes) {
  const slug = path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')
  const perRun: Array<Record<Category, number>> = []
  for (let run = 1; run <= RUNS; run++) {
    // Retry Chrome transport failures (NO_NAVSTART and friends) without
    // weakening any threshold, like scripts/audit.sh does.
    let proc: ReturnType<typeof Bun.spawnSync> | undefined
    for (let attempt = 1; attempt <= 3; attempt++) {
      proc = Bun.spawnSync(
        [
          'bun',
          'x',
          'lighthouse',
          `${BASE}${path}`,
          '--output=json',
          '--output=html',
          `--output-path=${OUT_DIR}/${slug}-${run}`,
          `--throttling.cpuSlowdownMultiplier=${CPU}`,
          `--chrome-flags=${process.env.CHROME_FLAGS ?? '--headless=new'}`,
          '--quiet',
        ],
        { stdout: 'inherit', stderr: 'inherit' },
      )
      if (proc.exitCode === 0) break
      console.error(`lighthouse attempt ${attempt} failed for ${path}`)
    }
    if (proc?.exitCode !== 0) throw new Error(`lighthouse failed for ${path}`)
    // Lighthouse writes <path>.report.json / .report.html for multi-output.
    const result = JSON.parse(
      readFileSync(`${OUT_DIR}/${slug}-${run}.report.json`, 'utf8'),
    )
    const scores = Object.fromEntries(
      categories.map((c) => [c, Math.round(result.categories[c].score * 100)]),
    ) as Record<Category, number>
    perRun.push(scores)
    console.log(
      `${path} run ${run}:`,
      scores,
      `LCP ${result.audits.metrics.details.items[0].largestContentfulPaint}`,
    )
  }
  const medians = {} as Record<Category, number>
  for (const c of categories) {
    const sorted = perRun.map((r) => r[c]).sort((a, b) => a - b)
    medians[c] = sorted[Math.floor(sorted.length / 2)]!
    worst[c] = Math.min(worst[c], medians[c])
  }
  // Link the run whose performance score is the median (the other categories
  // are deterministic, so any run shows the same findings for them).
  const medianRun =
    perRun.findIndex((r) => r.performance === medians.performance) + 1
  results.push({
    path,
    scores: medians,
    report: `${slug}-${medianRun}.report.html`,
  })
}

const checkedAt = new Date().toISOString().slice(0, 10)
const runsUrl =
  'https://github.com/joelhagvall/hagvall-labs/actions/workflows/lighthouse.yml'
const cell = (n: number) =>
  `<td class="${n >= 90 ? 'good' : n >= 50 ? 'ok' : 'bad'}">${n}</td>`
writeFileSync(
  `${OUT_DIR}/index.html`,
  `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Lighthouse reports for hagvall-labs.com</title>
<style>
  body { margin: 0 auto; padding: 3rem 1.5rem; font: 16px/1.5 system-ui, sans-serif; color: #20272d; background: #fff; max-width: 52rem; }
  h1 { font-size: 1.75rem; margin: 0 0 .5rem; }
  p { margin: 0 0 1rem; color: #525a63; }
  a { color: #1748d4; }
  table { border-collapse: collapse; width: 100%; margin: 1.5rem 0; }
  th, td { text-align: left; padding: .6rem .5rem; border-bottom: 1px solid #e5e7eb; }
  td:not(:first-child), th:not(:first-child) { text-align: right; font-variant-numeric: tabular-nums; }
  .good { color: #0a7d2e; } .ok { color: #b45309; } .bad { color: #b91c1c; }
</style>
<h1>Lighthouse reports for <a href="${BASE}">hagvall-labs.com</a></h1>
<p>Measured ${checkedAt} by <a href="${RUN_URL || runsUrl}">a public GitHub Actions run</a> against the live site: mobile, median of ${RUNS} runs per page, CPU throttling ${CPU}x. Every day and after every deploy. <a href="${runsUrl}">All runs</a>.</p>
<table>
<thead><tr><th>Page</th>${categories.map((c) => `<th>${labels[c]}</th>`).join('')}<th>Report</th></tr></thead>
<tbody>
${results
  .map(
    (r) =>
      `<tr><td><a href="${BASE}${r.path}">${r.path}</a></td>${categories.map((c) => cell(r.scores[c])).join('')}<td><a href="${r.report}">Open</a></td></tr>`,
  )
  .join('\n')}
</tbody>
</table>
<p>Lowest score per category across all pages: ${categories.map((c) => `${labels[c]} ${worst[c]}`).join(', ')}. Verify it yourself in <a href="https://pagespeed.web.dev/analysis?url=${encodeURIComponent(BASE + '/')}">PageSpeed Insights</a>.</p>
</html>
`,
)

const previous = JSON.parse(readFileSync(SCORES_FILE, 'utf8')) as {
  scores: Record<Category, number>
}
const changed = categories.some((c) => previous.scores[c] !== worst[c])
if (changed) {
  writeFileSync(
    SCORES_FILE,
    JSON.stringify(
      { scores: worst, checkedAt, runUrl: RUN_URL, base: BASE },
      null,
      2,
    ) + '\n',
  )
  console.log(`scores changed, wrote ${SCORES_FILE}`)
} else {
  console.log('scores unchanged')
}
console.log('lowest score per category across all routes:', worst)

const gateFailed =
  worst.performance < 95 || worst.accessibility < 100 || worst.seo < 100
if (gateFailed) {
  console.error('below the AGENTS.md gates')
  process.exit(1)
}
