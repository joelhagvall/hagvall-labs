// Public Lighthouse check of the live site, run daily and after each deploy
// by .github/workflows/lighthouse.yml. Audits every route on
// https://hagvall-labs.com (mobile, all four categories), takes the median
// of LH_RUNS runs per route, writes one HTML report per route to OUT_DIR (a
// workflow artifact) and the lowest score per category across all routes to
// src/lighthouse-scores.json, which the footer in __root.tsx renders.
//
// Usage: bun scripts/lighthouse-public.ts   (env: BASE, OUT_DIR, LH_RUNS,
// CPU_SLOWDOWN, RUN_URL). Exits 1 if any score is below the AGENTS.md gates
// (Performance >= 95, Accessibility and SEO 100), after writing the scores,
// so a regression is visible on the site and fails the workflow.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pagePaths } from "../src/seo";

const BASE = process.env.BASE ?? "https://hagvall-labs.com";
const OUT_DIR = process.env.OUT_DIR ?? "lighthouse-reports";
const RUNS = Number(process.env.LH_RUNS ?? 3);
const CPU = process.env.CPU_SLOWDOWN ?? "4";
const RUN_URL = process.env.RUN_URL ?? "";
const SCORES_FILE = "src/lighthouse-scores.json";
const categories = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
] as const;
type Category = (typeof categories)[number];

if (!Number.isInteger(RUNS) || RUNS < 1 || RUNS % 2 === 0) {
  throw new Error("LH_RUNS must be a positive odd integer");
}
mkdirSync(OUT_DIR, { recursive: true });

const routes = Object.values(pagePaths).flatMap((p) => [p.sv, p.en]);
const worst: Record<Category, number> = {
  performance: 100,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};

for (const path of routes) {
  const slug = path === "/" ? "home" : path.slice(1).replaceAll("/", "-");
  const perRun: Array<Record<Category, number>> = [];
  for (let run = 1; run <= RUNS; run++) {
    const proc = Bun.spawnSync(
      [
        "bun",
        "x",
        "lighthouse",
        `${BASE}${path}`,
        "--output=json",
        "--output=html",
        `--output-path=${OUT_DIR}/${slug}-${run}`,
        `--throttling.cpuSlowdownMultiplier=${CPU}`,
        `--chrome-flags=${process.env.CHROME_FLAGS ?? "--headless=new"}`,
        "--quiet",
      ],
      { stdout: "inherit", stderr: "inherit" },
    );
    if (proc.exitCode !== 0) throw new Error(`lighthouse failed for ${path}`);
    // Lighthouse writes <path>.report.json / .report.html for multi-output.
    const result = JSON.parse(
      readFileSync(`${OUT_DIR}/${slug}-${run}.report.json`, "utf8"),
    );
    const scores = Object.fromEntries(
      categories.map((c) => [c, Math.round(result.categories[c].score * 100)]),
    ) as Record<Category, number>;
    perRun.push(scores);
    console.log(
      `${path} run ${run}:`,
      scores,
      `LCP ${result.audits.metrics.details.items[0].largestContentfulPaint}`,
    );
  }
  for (const c of categories) {
    const sorted = perRun.map((r) => r[c]).sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)]!;
    worst[c] = Math.min(worst[c], median);
  }
}

const previous = JSON.parse(readFileSync(SCORES_FILE, "utf8")) as {
  scores: Record<Category, number>;
};
const changed = categories.some((c) => previous.scores[c] !== worst[c]);
const checkedAt = new Date().toISOString().slice(0, 10);
if (changed) {
  writeFileSync(
    SCORES_FILE,
    JSON.stringify(
      { scores: worst, checkedAt, runUrl: RUN_URL, base: BASE },
      null,
      2,
    ) + "\n",
  );
  console.log(`scores changed, wrote ${SCORES_FILE}`);
} else {
  console.log("scores unchanged");
}
console.log("lowest score per category across all routes:", worst);

const gateFailed =
  worst.performance < 95 || worst.accessibility < 100 || worst.seo < 100;
if (gateFailed) {
  console.error("below the AGENTS.md gates");
  process.exit(1);
}
