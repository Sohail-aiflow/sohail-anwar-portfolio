import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/projects/marketlink-team/",
  "/projects/car-rental-system/",
  "/projects/school-website-cms/",
  "/projects/marketlink-solo/",
];
const themeRoot = "html";
for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 375, 430, 768, 1024, 1440]) {
    test(`${theme} theme: all five pages at ${width}px`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(120_000);
      await page.emulateMedia({ colorScheme: theme });
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (
          message.type() === "error" &&
          /hydration|did not match|server rendered/i.test(message.text())
        )
          errors.push(message.text());
      });
      for (const route of routes) {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator(themeRoot)).toHaveAttribute(
          "data-theme",
          theme,
        );
        await expect(page.locator(themeRoot)).toHaveCSS("color-scheme", theme);
        const toggle = page.getByRole("button", {
          name:
            theme === "light" ? "Switch to dark mode" : "Switch to light mode",
          exact: true,
        });
        await expect(toggle).toBeVisible();
        await expect(toggle).toHaveAccessibleDescription(
          `Current theme: ${theme}`,
        );
        const boxes = await page
          .locator(".primary-navigation a, .theme-toggle")
          .evaluateAll((elements) =>
            elements.map((element) => {
              const box = element.getBoundingClientRect();
              return {
                left: box.left,
                right: box.right,
                width: box.width,
                height: box.height,
              };
            }),
          );
        for (const box of boxes) {
          expect(box.width).toBeGreaterThanOrEqual(44);
          expect(box.height).toBeGreaterThanOrEqual(44);
          expect(box.left).toBeGreaterThanOrEqual(0);
          expect(box.right).toBeLessThanOrEqual(width);
        }
        for (let index = 1; index < boxes.length; index++)
          expect(boxes[index]!.left).toBeGreaterThanOrEqual(
            boxes[index - 1]!.right,
          );
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth + 1,
          ),
        ).toBe(true);
        const result = await new AxeBuilder({ page })
          .withTags([
            "wcag2a",
            "wcag2aa",
            "wcag21a",
            "wcag21aa",
            "best-practice",
          ])
          .analyze();
        expect(
          result.violations.map((v) => ({
            id: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        ).toEqual([]);
        await page.screenshot({
          path: testInfo.outputPath(
            `${theme}-${route === "/" ? "home" : route.split("/")[2]}-${width}.png`,
          ),
          fullPage: true,
        });
      }
      expect(errors).toEqual([]);
    });
  }
  test(`${theme} first contentful paint is correct without hydrated bundles`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: theme });
    await page.addInitScript(() => {
      (window as unknown as { paintThemes: string[] }).paintThemes = [];
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries())
          if (entry.name === "first-contentful-paint")
            (window as unknown as { paintThemes: string[] }).paintThemes.push(
              document.documentElement.dataset.theme ?? "unset",
            );
      }).observe({ type: "paint", buffered: true });
    });
    await page.route("**/_next/static/**/*.js*", (route) => route.abort());
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
    await expect
      .poll(() =>
        page.evaluate(
          () => (window as unknown as { paintThemes: string[] }).paintThemes,
        ),
      )
      .toEqual([theme]);
    await expect(page.locator("body")).toHaveCSS(
      "background-color",
      theme === "dark" ? "rgb(21, 27, 40)" : "rgb(240, 238, 232)",
    );
  });
}

test("manual preference survives reload and client/direct case-study navigation", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const initial = await page.locator("#home").boundingBox();
  await page
    .getByRole("button", { name: "Switch to dark mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => localStorage.getItem("portfolio-theme")),
  ).toBe("dark");
  expect(await page.locator("#home").boundingBox()).toEqual(initial);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .locator('.project-preview:visible a[href="/projects/marketlink-team/"]')
    .click();
  await expect(page).toHaveURL(/projects\/marketlink-team\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.goto("/projects/marketlink-solo/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("system changes apply only without a manual preference", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(
    await page.evaluate(() => localStorage.getItem("portfolio-theme")),
  ).toBeNull();
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("existing manual preference wins and invalid saved values use the system", async ({
  browser,
}) => {
  for (const [saved, expected] of [
    ["light", "light"],
    ["sepia", "dark"],
  ]) {
    const context = await browser.newContext({ colorScheme: "dark" });
    await context.addInitScript(
      (value) => localStorage.setItem("portfolio-theme", value),
      saved!,
    );
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", expected!);
    await context.close();
  }
});

test("toggle is keyboard accessible and respects reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.getByRole("button", {
    name: "Switch to dark mode",
    exact: true,
  });
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    if (await toggle.evaluate((button) => button === document.activeElement))
      break;
  }
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(
    await page
      .locator("body")
      .evaluate((body) =>
        parseFloat(getComputedStyle(body).transitionDuration),
      ),
  ).toBeLessThan(0.01);
});

test("blocked localStorage does not break switching or system detection", async ({
  page,
}) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() =>
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Storage disabled", "SecurityError");
      },
    }),
  );
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page
    .getByRole("button", { name: "Switch to light mode", exact: true })
    .click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(errors).toEqual([]);
});

test("all four preview palettes are readable in both themes", async ({
  page,
}) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 375, height: 900 });
  for (const theme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/#work");
    for (const radio of await page.getByRole("radio").all()) {
      await page
        .locator(`label[for="${await radio.getAttribute("id")}"]`)
        .click();
      const previewId = await page
        .locator(".project-preview:visible")
        .getAttribute("id");
      const audit = await new AxeBuilder({ page })
        .include(`#${previewId}`)
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      expect(
        audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ).toEqual([]);
    }
  }
});
