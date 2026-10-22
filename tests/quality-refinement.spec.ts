import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/projects/marketlink-team/",
  "/projects/car-rental-system/",
  "/projects/school-website-cms/",
  "/projects/marketlink-solo/",
];

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`Back to top repeats without extra history at ${width}px in both themes`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    for (const theme of ["light", "dark"] as const) {
      await page.emulateMedia({
        colorScheme: theme,
        reducedMotion: "no-preference",
      });
      await page.goto("/#home");
      await page.evaluate(() => document.fonts.ready);
      const nav = page.getByRole("navigation", { name: "Primary" });
      await nav.getByRole("link", { name: "Work", exact: true }).click();
      await page.locator('label[for="select-school-website-cms"]').click();
      const footer = page.getByRole("link", {
        name: "Back to top",
        exact: true,
      });
      await footer.click();
      await expect(page).toHaveURL(/\/#home$/);
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeLessThanOrEqual(1);
      const history = await page.evaluate(() => window.history.length);
      for (const motion of ["no-preference", "reduce"] as const) {
        await page.emulateMedia({ reducedMotion: motion });
        await page.evaluate(() =>
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "instant",
          }),
        );
        await footer.click();
        await expect
          .poll(() => page.evaluate(() => window.scrollY))
          .toBeLessThanOrEqual(1);
        await expect(page.locator("#home")).toBeFocused();
        expect(await page.evaluate(() => window.history.length)).toBe(history);
      }
      await nav.getByRole("link", { name: "About", exact: true }).click();
      await expect(page).toHaveURL(/#about$/);
      await footer.click();
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeLessThanOrEqual(1);
      await page.goto("/projects/car-rental-system/");
      await footer.click();
      await expect(page).toHaveURL(/\/#home$/);
      await expect(page.locator("#intro-title")).toBeInViewport();
    }
  });
}

test("configured export metadata remains noindex and new-tab links announce their behavior", async ({
  page,
  request,
}) => {
  await page.goto("/");
  const rootCanonical = page.locator('link[rel="canonical"]');
  const origin = (await rootCanonical.count())
    ? new URL((await rootCanonical.getAttribute("href"))!).origin
    : undefined;
  if (origin) expect(origin).toMatch(/^https:\/\//);
  for (const route of routes) {
    await page.goto(route);
    if (origin) {
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `${origin}${route}`,
      );
      await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
        "content",
        `${origin}${route}`,
      );
      const slug = route === "/" ? "portfolio" : route.split("/")[2];
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `${origin}/social/${slug}.png`,
      );
      await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
        "content",
        `${origin}/social/${slug}.png`,
      );
    } else {
      await expect(
        page.locator(
          'link[rel="canonical"],meta[property="og:image"],meta[name="twitter:image"]',
        ),
      ).toHaveCount(0);
    }
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    for (const link of await page.locator('a[target="_blank"]').all()) {
      await expect(link).toHaveAccessibleName(/opens in a new tab/);
      await expect(link).toHaveAttribute("rel", /noopener/);
      await expect(link).toHaveAttribute("rel", /noreferrer/);
    }
    for (const link of await page
      .locator('a[href^="/"],a[href^="#"],a[href^="mailto:"]')
      .all())
      expect(await link.getAttribute("target")).not.toBe("_blank");
  }
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Disallow: /");
  expect(robots).not.toContain("Allow: /");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap.match(/<loc>/g) ?? []).toHaveLength(origin ? 5 : 0);
  if (origin)
    for (const route of routes)
      expect(sitemap).toContain(`<loc>${origin}${route}</loc>`);
});

test("grouped evidence retains every limitation and native Back to top works without JavaScript", async ({
  browser,
  page,
}) => {
  for (const route of routes.slice(1)) {
    await page.goto(route);
    const documentation = page.getByRole("group", {
      name: "Project evidence and documentation",
      exact: true,
    });
    await expect(
      documentation.getByRole("region", {
        name: "Application screenshot gallery",
      }),
    ).toBeVisible();
    await expect(documentation).toContainText("Repository evidence");
    await expect(documentation.getByRole("heading", { level: 2 })).toHaveText([
      "Evidence & media",
      "Project links",
      "Still to document",
    ]);
    await expect(page.locator(".case-artwork-note")).toContainText(
      "Concept artwork only",
    );
  }
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  try {
    const native = await context.newPage();
    await native.goto("http://127.0.0.1:4173/#home");
    await native
      .getByRole("link", { name: "Back to top", exact: true })
      .click();
    await expect(native.locator("#intro-title")).toBeInViewport();
  } finally {
    await context.close();
  }
});
