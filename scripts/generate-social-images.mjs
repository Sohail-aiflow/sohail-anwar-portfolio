import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { createClient } from "@sanity/client";
import { getSanityConfig } from "../src/lib/sanity/config.ts";
import { portfolioQuery } from "../src/lib/sanity/query.ts";
import { projects } from "../src/data/projects.ts";
import { siteIdentity } from "../src/data/site.ts";

// Local asset generation only. No runtime image endpoint and no remote writes.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const config = getSanityConfig();
const content = config
  ? await createClient({
      ...config,
      perspective: "published",
      useCdn: false,
    }).fetch(portfolioQuery)
  : undefined;
const name = content?.profile?.displayName ?? siteIdentity.name;
const records = content?.projects ?? projects;
const face = async (path) => (await readFile(path)).toString("base64");
const [body, display] = await Promise.all([
  face(
    "node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",
  ),
  face(
    "node_modules/@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2",
  ),
]);
const escape = (text) =>
  String(text).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const cards = [
  {
    slug: "portfolio",
    title: `${name} · Portfolio`,
    subtitle: content?.profile?.professionalHeadline ?? siteIdentity.discipline,
  },
  ...records.map((project) => ({
    slug:
      typeof project.slug === "string" ? project.slug : project.slug.current,
    title: project.title,
    subtitle: project.description,
  })),
];
await mkdir("public/social", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const card of cards) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(card.slug))
      throw new Error("Invalid social image slug");
    await page.setContent(`<!doctype html><html lang="en"><head><style>
      @font-face{font-family:Body;src:url(data:font/woff2;base64,${body})} @font-face{font-family:Display;src:url(data:font/woff2;base64,${display})}
      *{box-sizing:border-box}body{margin:0;width:1200px;height:630px;padding:72px 80px;color:#252d2c;background:radial-gradient(ellipse at 90% 15%,#dce9fa,transparent 50%),radial-gradient(ellipse at 80% 95%,#eae3f5,transparent 45%),radial-gradient(ellipse at 5% 90%,#e3eee5,transparent 45%),#fcfcf9;font-family:Body}
      .eyebrow{color:#496455;letter-spacing:3px;font-size:20px;text-transform:uppercase;margin:0 0 45px}h1{font-family:Display;font-size:78px;line-height:1.1;letter-spacing:-2px;font-weight:400;margin:0;max-width:1040px}p{font-size:26px;line-height:1.55;max-width:850px;margin-top:26px}.footer{position:absolute;left:80px;right:80px;bottom:55px;border-top:1px solid #b9c4bd;padding-top:22px;font-size:19px;color:#496455}
      </style></head><body><div class="eyebrow">${escape(name)} · Selected work & learning</div><h1>${escape(card.title)}</h1><p>${escape(card.subtitle)}</p><div class="footer">Development / Design / Collaboration</div></body></html>`);
    await page.evaluate(() => document.fonts.ready);
    await page.screenshot({ path: `public/social/${card.slug}.png` });
  }
} finally {
  await browser.close();
}
await writeFile(
  "public/social/manifest.json",
  JSON.stringify({ width: 1200, height: 630, cards }, null, 2) + "\n",
);
console.log(
  `Generated ${cards.length} genuine editorial title cards, not project screenshots.`,
);
