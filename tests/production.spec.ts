import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, existsSync } from "node:fs";

const routes = [
  "/",
  "/projects/marketlink-team/",
  "/projects/car-rental-system/",
  "/projects/school-website-cms/",
  "/projects/marketlink-solo/",
];
for (const width of [320, 375, 768, 1024, 1440]) {
  test(`accessibility, links and SEO across five pages at ${width}px`, async ({
    page,
    request,
  }) => {
    test.setTimeout(90_000);
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of routes) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          nodes: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
      await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
      await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
        "content",
        "summary_large_image",
      );
      const canonical = page.locator('link[rel="canonical"]');
      if (await canonical.count()) {
        expect(await canonical.getAttribute("href")).toMatch(/^https:\/\//);
        expect(await canonical.getAttribute("href")).not.toMatch(
          /localhost|127\.0\.0\.1/,
        );
      } else
        await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
          "content",
          /noindex/,
        );
      const internal = await page
        .locator('a[href^="/"], a[href^="#"]')
        .evaluateAll((elements) =>
          elements.map((e) => e.getAttribute("href")!),
        );
      for (const href of new Set(internal)) {
        const url = new URL(href, `http://127.0.0.1:4173${route}`);
        expect((await request.get(url.pathname)).status(), href).toBe(200);
        if (url.hash) {
          const targetHTML = await (await request.get(url.pathname)).text();
          expect(targetHTML, href).toContain(`id="${url.hash.slice(1)}"`);
        }
      }
      const external = page.locator('a[target="_blank"]');
      for (const link of await external.all()) {
        expect(await link.getAttribute("href")).toMatch(/^https:\/\//);
        expect(await link.getAttribute("rel")).toMatch(/noopener/);
        expect(await link.getAttribute("rel")).toMatch(/noreferrer/);
      }
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      expect(
        await page
          .locator("img")
          .evaluateAll((images) =>
            images.every(
              (img) =>
                Boolean(img.getAttribute("alt")) &&
                img instanceof HTMLImageElement &&
                img.complete &&
                img.naturalWidth > 0,
            ),
          ),
      ).toBe(true);
    }
    expect(errors).toEqual([]);
  });
}

test("robots, sitemap and all static title cards are exported", async ({
  request,
}) => {
  expect((await request.get("/robots.txt")).status()).toBe(200);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toMatch(/localhost|127\.0\.0\.1/);
  for (const slug of [
    "portfolio",
    "marketlink-team",
    "marketlink-solo",
    "car-rental-system",
    "school-website-cms",
  ]) {
    const path = `public/social/${slug}.png`;
    expect(existsSync(path)).toBe(true);
    const png = readFileSync(path);
    expect(png.readUInt32BE(16)).toBe(1200);
    expect(png.readUInt32BE(20)).toBe(630);
    expect((await request.get(`/social/${slug}.png`)).status()).toBe(200);
  }
});
