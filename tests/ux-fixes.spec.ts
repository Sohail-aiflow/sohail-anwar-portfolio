import { expect, test, type Locator, type Page } from "@playwright/test";

const themes = ["light", "dark"] as const;
const contentSections = ["Work", "About", "Skills", "Connect"] as const;
const projectIds = [
  "marketlink-team",
  "car-rental-system",
  "school-website-cms",
  "marketlink-solo",
];

async function settleScroll(page: Page) {
  // Observe consecutive rendered frames instead of guessing a smooth-scroll
  // duration. This also waits for the enhancement's scheduled animation frame.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let previous = window.scrollY;
        let stableFrames = 0;
        const frame = () => {
          const current = window.scrollY;
          stableFrames =
            Math.abs(current - previous) < 0.5 ? stableFrames + 1 : 0;
          previous = current;
          if (stableFrames >= 3) resolve();
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }),
  );
}

async function positionWithinUsableViewport(heading: Locator) {
  return heading.evaluate((element) => {
    const heading = element.getBoundingClientRect();
    const navigation = document
      .querySelector('nav[aria-label="Primary"]')!
      .getBoundingClientRect();
    const topNavigation =
      navigation.bottom > 0 && navigation.top < window.innerHeight / 2;
    const bottomNavigation =
      navigation.top >= window.innerHeight / 2 &&
      navigation.top < window.innerHeight;
    const usableTop = topNavigation ? Math.max(0, navigation.bottom) : 0;
    const usableBottom = bottomNavigation ? navigation.top : window.innerHeight;
    return {
      headingTop: heading.top,
      headingBottom: heading.bottom,
      usableTop,
      usableBottom,
      atDocumentEnd:
        Math.abs(
          window.scrollY -
            (document.documentElement.scrollHeight - window.innerHeight),
        ) < 2,
      fullyVisible:
        heading.top >= usableTop - 1 && heading.bottom <= usableBottom + 1,
      nearStart: heading.top <= usableTop + (usableBottom - usableTop) * 0.12,
    };
  });
}

async function expectNearUsableStart(heading: Locator) {
  await expect
    .poll(async () => {
      const position = await positionWithinUsableViewport(heading);
      return position.fullyVisible && position.nearStart;
    })
    .toBe(true);
  await settleScroll(heading.page());
  const position = await positionWithinUsableViewport(heading);
  expect(position.fullyVisible, JSON.stringify(position)).toBe(true);
  expect(position.nearStart, JSON.stringify(position)).toBe(true);
}

async function openWork(page: Page) {
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeFocused();
  await expectNearUsableStart(page.locator("#work-title"));
}

async function expectDetailsRevealed(page: Page, id: string) {
  const radio = page.locator(`#select-${id}`);
  const preview = page.locator(`#preview-${id}`);
  await expect(radio).toBeChecked();
  await expect(page.locator(".project-preview:visible")).toHaveCount(1);
  await expect(preview).toBeVisible();
  await expectNearUsableStart(preview.locator("h3"));
  const action = preview.getByRole("link", { name: /^Read case study/ });
  await expect(action).toHaveAttribute("href", `/projects/${id}/`);
  const actionPosition = await positionWithinUsableViewport(action);
  expect(actionPosition.fullyVisible, JSON.stringify(actionPosition)).toBe(
    true,
  );
}

for (const width of [320, 375, 430, 768, 1024, 1440]) {
  test(`section links place the actual headings near the usable start at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    for (const theme of themes) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const navigation = page.getByRole("navigation", { name: "Primary" });
      for (const label of contentSections) {
        const id = label.toLowerCase();
        const link = navigation.getByRole("link", { name: label, exact: true });
        await link.click();
        await expect(page).toHaveURL(new RegExp(`#${id}$`));
        await expect(page.locator(`#${id}`)).toBeFocused();
        await expect(navigation).toHaveAttribute("data-floating", "true");
        // Connect is checked just as strictly as the other destinations. The
        // diagnostic retains the physical bottom-clamp state on failure.
        await expectNearUsableStart(page.locator(`#${id}-title`));
        await expect(link).toHaveAttribute("aria-current", "location");
        await expect(navigation.locator("[aria-current]")).toHaveCount(1);
      }
      await navigation.getByRole("link", { name: "Home", exact: true }).click();
      await expect(page).toHaveURL(/#home$/);
      await expect(page.locator("#home")).toBeFocused();
      await settleScroll(page);
      const home = await page.evaluate(() => ({
        scrollY: window.scrollY,
        headerHeight: document
          .querySelector("[data-header-region]")!
          .getBoundingClientRect().height,
      }));
      expect(home.scrollY).toBeLessThanOrEqual(home.headerHeight);
      const homePosition = await positionWithinUsableViewport(
        page.locator("#intro-title"),
      );
      expect(homePosition.fullyVisible, JSON.stringify(homePosition)).toBe(
        true,
      );
      await expect(
        navigation.getByRole("link", { name: "Home", exact: true }),
      ).toHaveAttribute("aria-current", "location");
    }
  });
}

for (const width of [320, 375, 430]) {
  test(`mobile project activation reveals details and working actions at ${width}px`, async ({
    page,
  }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    for (const theme of themes) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await openWork(page);
      // The first and last activations select an already-selected record. A
      // deliberate activation must still reveal its details in that case.
      for (const id of [...projectIds, projectIds[projectIds.length - 1]!]) {
        const label = page.locator(`label[for="select-${id}"]`);
        await label.scrollIntoViewIfNeeded();
        await settleScroll(page);
        await label.click();
        await expectDetailsRevealed(page, id);
      }
      await page
        .locator('label[for="select-school-website-cms"]')
        .scrollIntoViewIfNeeded();
      await page.locator('label[for="select-school-website-cms"]').click();
      await expectDetailsRevealed(page, "school-website-cms");
      await page
        .locator("#preview-school-website-cms")
        .getByRole("link", { name: /^Read case study/ })
        .click();
      await expect(page).toHaveURL(/\/projects\/school-website-cms\/$/);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        "School Website & CMS",
      );
    }
  });
}

test("tablet and desktop click and roving keyboard selection do not auto-scroll", async ({
  page,
}) => {
  test.setTimeout(120_000);
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const theme of themes) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      await openWork(page);
      const label = page.locator('label[for="select-car-rental-system"]');
      await expect(label).toBeInViewport();
      const initial = await page.evaluate(() => window.scrollY);
      await label.click();
      await expect(page.locator("#select-car-rental-system")).toBeChecked();
      await settleScroll(page);
      expect(
        Math.abs((await page.evaluate(() => window.scrollY)) - initial),
      ).toBeLessThanOrEqual(2);
      await page.locator("#select-marketlink-team").focus();
      await settleScroll(page);
      const beforeArrow = await page.evaluate(() => window.scrollY);
      await page.keyboard.press("ArrowDown");
      await expect(page.locator("#select-car-rental-system")).toBeFocused();
      await expect(page.locator("#select-car-rental-system")).toBeChecked();
      await settleScroll(page);
      expect(
        Math.abs((await page.evaluate(() => window.scrollY)) - beforeArrow),
      ).toBeLessThanOrEqual(2);
      await expect(page.locator("#preview-car-rental-system h3")).toBeVisible();
    }
  }
});

test("mobile Tab and arrows preserve selector position; explicit keys reveal details with reduced motion", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of themes) {
    await page.emulateMedia({ colorScheme: theme });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await openWork(page);
    expect(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
    ).toBe("auto");
    const beforeTab = await page.evaluate(() => window.scrollY);
    await page.keyboard.press("Tab");
    await expect(page.locator("#select-marketlink-team")).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.locator("#select-car-rental-system")).toBeFocused();
    await expect(page.locator("#select-car-rental-system")).toBeChecked();
    await settleScroll(page);
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - beforeTab),
    ).toBeLessThanOrEqual(2);

    for (const [key, id] of [
      ["Space", "car-rental-system"],
      ["Enter", "school-website-cms"],
    ] as const) {
      if (key === "Enter") {
        await openWork(page);
        await page.keyboard.press("Tab");
        await expect(page.locator("#select-car-rental-system")).toBeFocused();
        await page.keyboard.press("ArrowDown");
        await expect(page.locator(`#select-${id}`)).toBeFocused();
        await settleScroll(page);
      }
      await page.evaluate(() => {
        const trace = { positions: [] as number[] };
        const record = () => trace.positions.push(window.scrollY);
        window.addEventListener("scroll", record);
        (
          window as Window & {
            __uxScrollTrace?: { positions: number[]; stop: () => void };
          }
        ).__uxScrollTrace = {
          positions: trace.positions,
          stop: () => window.removeEventListener("scroll", record),
        };
      });
      await page.keyboard.press(key);
      await expectDetailsRevealed(page, id);
      await expect(page.locator(`#preview-${id} h3`)).toBeFocused();
      const positions = await page.evaluate(() => {
        const trace = (
          window as Window & {
            __uxScrollTrace?: { positions: number[]; stop: () => void };
          }
        ).__uxScrollTrace!;
        trace.stop();
        return [
          ...new Set(trace.positions.map((position) => Math.round(position))),
        ];
      });
      // An immediate move can have a native focus correction, but it must not
      // traverse the many intermediate positions of an animated scroll.
      expect(positions.length, JSON.stringify(positions)).toBeLessThanOrEqual(
        2,
      );
    }
  }
});

test("native anchors and radio previews remain usable without JavaScript", async ({
  browser,
}) => {
  test.setTimeout(120_000);
  for (const width of [375, 1440]) {
    for (const theme of themes) {
      const context = await browser.newContext({
        javaScriptEnabled: false,
        viewport: { width, height: 900 },
        colorScheme: theme,
      });
      try {
        const page = await context.newPage();
        await page.goto("http://127.0.0.1:4173/");
        const navigation = page.getByRole("navigation", { name: "Primary" });
        await navigation
          .getByRole("link", { name: "Work", exact: true })
          .click();
        await expect(page).toHaveURL(/#work$/);
        await expect(page.locator("#work-title")).toBeInViewport();
        const position = await positionWithinUsableViewport(
          page.locator("#work-title"),
        );
        expect(position.fullyVisible, JSON.stringify(position)).toBe(true);
        await page.locator('label[for="select-school-website-cms"]').click();
        await expect(page.locator("#select-school-website-cms")).toBeChecked();
        await expect(page.locator(".project-preview:visible")).toHaveCount(1);
        const preview = page.locator("#preview-school-website-cms");
        // No script enhancement is expected here. The normal document remains
        // scrollable and exposes the selected details and genuine action.
        await preview.locator(".preview-details").scrollIntoViewIfNeeded();
        await expect(
          preview.getByRole("heading", {
            name: "School Website & CMS",
            exact: true,
          }),
        ).toBeInViewport();
        await preview.getByRole("link", { name: /^Read case study/ }).click();
        await expect(page).toHaveURL(/\/projects\/school-website-cms\/$/);
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(
          "School Website & CMS",
        );
      } finally {
        await context.close();
      }
    }
  }
});
