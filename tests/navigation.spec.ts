import { expect, test } from "@playwright/test";

const destinations = ["Home", "Work", "About", "Skills", "Connect"];

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`navigation and layout at ${width}px`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav).toBeVisible();
    await expect(
      nav.getByRole("link", { name: "Home", exact: true }),
    ).toHaveAttribute("aria-current", "location");
    const layout = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      introTop: document.getElementById("home")!.offsetTop,
    }));
    expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
    for (const label of destinations) {
      const link = nav.getByRole("link", { name: label, exact: true });
      const box = (await link.boundingBox())!;
      expect(box.width).toBeGreaterThanOrEqual(44);
      expect(box.height).toBeGreaterThanOrEqual(44);
      const fits = await link.locator("span").evaluate((span) => {
        const labelRect = span.getBoundingClientRect();
        const linkRect = span.parentElement!.getBoundingClientRect();
        return (
          labelRect.left >= linkRect.left && labelRect.right <= linkRect.right
        );
      });
      expect(fits).toBe(true);
    }
    await page.screenshot({
      path: testInfo.outputPath(`home-${width}.png`),
      fullPage: false,
    });
    for (const label of destinations.slice(1)) {
      const id = label.toLowerCase();
      const link = nav.getByRole("link", { name: label, exact: true });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(page.locator(`#${id}`)).toBeFocused();
      await expect
        .poll(async () =>
          page.locator(`#${id}-title`).evaluate((heading) => {
            const title = heading.getBoundingClientRect();
            const navigation = document
              .querySelector("nav")!
              .getBoundingClientRect();
            return window.innerWidth < 768
              ? title.bottom < navigation.top
              : title.top >= navigation.bottom;
          }),
        )
        .toBe(true);
    }
    await expect(nav).toHaveAttribute("data-floating", "true");
    expect(
      await page
        .locator("#home")
        .evaluate((section) => (section as HTMLElement).offsetTop),
    ).toBe(layout.introTop);
    await page.screenshot({
      path: testInfo.outputPath(`navigation-${width}.png`),
      fullPage: false,
    });
    await nav.getByRole("link", { name: "Home", exact: true }).click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY))
      .toBeLessThan(130);
    expect(errors).toEqual([]);
  });
}

test("keyboard skip link, navigation order, and focus visibility", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeInViewport();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  for (const label of destinations) {
    await page.keyboard.press("Tab");
    const link = page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: label, exact: true });
    await expect(link).toBeFocused();
    expect(
      await link.evaluate((element) => getComputedStyle(element).outlineStyle),
    ).toBe("solid");
  }
  await page.keyboard.press("Enter");
  await expect(page.locator("#connect")).toBeFocused();
});

test("direct anchors, active section while scrolling, and return from another route", async ({
  page,
}) => {
  await page.goto("/#skills");
  const nav = page.getByRole("navigation", { name: "Primary" });
  await expect(
    nav.getByRole("link", { name: "Skills", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await page.evaluate(() =>
    window.scrollTo({
      top: document.getElementById("about")!.offsetTop - 112,
      behavior: "instant",
    }),
  );
  await expect(
    nav.getByRole("link", { name: "About", exact: true }),
  ).toHaveAttribute("aria-current", "location");
  await page.goto("/404.html");
  await nav.getByRole("link", { name: "Work", exact: true }).click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.locator("#work-title")).toBeInViewport();
});

test("reduced motion keeps scrolling immediate and navigation usable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page.locator("#about")).toBeFocused();
  await expect(page.locator("#about-title")).toBeInViewport();
  await expect
    .poll(() =>
      page
        .locator(".navigation-list")
        .evaluate((element) => getComputedStyle(element).opacity),
    )
    .toBe("1");
});

test("navigation works without client JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 812 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work-title")).toBeInViewport();
  await context.close();
});
