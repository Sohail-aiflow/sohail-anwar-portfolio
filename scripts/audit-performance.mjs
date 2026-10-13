import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { launch } from "chrome-launcher";
import { mkdir, writeFile } from "node:fs/promises";

const label = process.argv[2] ?? "final";
const origin = "http://127.0.0.1:4173";
await mkdir("test-results/audits", { recursive: true });
const summaries = [];
for (const mode of ["mobile", "desktop"]) {
  const chrome = await launch({ chromeFlags: ["--headless", "--no-sandbox"] });
  try {
    const result = await lighthouse(
      origin,
      {
        port: chrome.port,
        output: "json",
        logLevel: "error",
        onlyCategories: [
          "performance",
          "accessibility",
          "best-practices",
          "seo",
        ],
      },
      mode === "desktop" ? desktopConfig : undefined,
    );
    if (result.lhr.runtimeError)
      throw new Error(result.lhr.runtimeError.message);
    await writeFile(`test-results/audits/${label}-${mode}.json`, result.report);
    const { lhr } = result;
    const summary = {
      label,
      mode,
      lighthouseVersion: lhr.lighthouseVersion,
      scores: Object.fromEntries(
        Object.entries(lhr.categories).map(([key, category]) => [
          key,
          Math.round(category.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
          "speed-index",
          "total-byte-weight",
        ].map((key) => [key, lhr.audits[key].numericValue]),
      ),
      failedAudits: Object.values(lhr.audits)
        .filter((audit) => audit.score !== null && audit.score < 1)
        .map((audit) => ({
          id: audit.id,
          title: audit.title,
          displayValue: audit.displayValue,
        })),
    };
    summaries.push(summary);
    console.log(JSON.stringify(summary));
  } finally {
    await chrome.kill();
  }
}
await writeFile(
  `test-results/audits/${label}-summary.json`,
  JSON.stringify(summaries, null, 2),
);
