import { expect, test } from "@playwright/test";

const projects = [
  "MarketLink — Team Project",
  "Car Rental System",
  "School Website & CMS",
  "MarketLink — Solo Project",
];

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`project selection and homepage at ${width}px`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/#work");
    await page.evaluate(() => document.fonts.ready);
    const group = page.getByRole("group", {
      name: "Choose a project to preview",
    });
    await expect(group.getByRole("radio")).toHaveCount(4);
    const initialHeight = await page
      .locator(".work-grid")
      .evaluate((element) => element.getBoundingClientRect().height);
    const initialPreview = await page
      .locator(".project-preview:visible")
      .boundingBox();
    for (const title of projects) {
      const radio = group.getByRole("radio", { name: title, exact: true });
      await page
        .locator(`label[for="${await radio.getAttribute("id")}"]`)
        .click();
      await expect(radio).toBeChecked();
      const preview = page.locator(".project-preview:visible");
      await expect(preview).toHaveCount(1);
      await expect(
        preview.getByRole("heading", { name: title, exact: true }),
      ).toBeVisible();
      await expect(
        preview.getByText("Abstract concept", { exact: true }),
      ).toBeVisible();
      await expect(
        preview.getByText(
          "Concept artwork. View application screenshots in the case study.",
        ),
      ).toBeVisible();
      expect(
        await page
          .locator(".work-grid")
          .evaluate((element) => element.getBoundingClientRect().height),
      ).toBe(initialHeight);
      const position = (await preview.boundingBox())!;
      expect(position.width).toBe(initialPreview!.width);
      expect(position.height).toBe(initialPreview!.height);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
    }
    await page.locator('label[for="select-marketlink-team"]').click();
    await page
      .locator(".work-grid")
      .screenshot({ path: testInfo.outputPath(`work-${width}.png`) });
    await page.evaluate(() => {
      (document.activeElement as HTMLElement | null)?.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await expect(
      page.getByRole("navigation", { name: "Primary" }),
    ).toHaveAttribute("data-floating", "false");
    await expect(page.locator(".navigation-list")).toHaveCSS("opacity", "1");
    await page.screenshot({
      path: testInfo.outputPath(`homepage-${width}.png`),
      fullPage: true,
    });
    await expect(
      page.getByRole("heading", { name: "Education", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText("Currently studying", { exact: true }),
    ).toBeVisible();
    if (await page.locator(".contact-links").count())
      await expect(page.locator(".contact-links")).toBeVisible();
    else await expect(page.locator(".contact-pending")).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.locator('a[href^="/projects/"]')).toHaveCount(4);
  });
}

test("project keyboard arrows, focus preview, and hover preview", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/#work");
  const team = page.getByRole("radio", { name: projects[0], exact: true });
  await team.focus();
  await page.keyboard.press("ArrowDown");
  const rental = page.getByRole("radio", { name: projects[1], exact: true });
  await expect(rental).toBeFocused();
  await expect(rental).toBeChecked();
  await expect(
    page
      .locator(".project-preview:visible")
      .getByRole("heading", { name: projects[1], exact: true }),
  ).toBeVisible();
  expect(
    await page
      .locator('label[for="select-car-rental-system"]')
      .evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page.locator('label[for="select-school-website-cms"]').hover();
  await expect(
    page.getByRole("radio", { name: projects[2], exact: true }),
  ).toBeChecked();
  await page.getByRole("radio", { name: projects[3], exact: true }).focus();
  await expect(
    page
      .locator(".project-preview:visible")
      .getByRole("heading", { name: projects[3], exact: true }),
  ).toBeVisible();
});

test("project links are factual and safe, and contacts reflect published content", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.getByRole("link", {
    name: "Live Demo — MarketLink — Team Project (opens in a new tab)",
    exact: true,
  });
  await expect(demo).toHaveAttribute(
    "href",
    "https://aptechmetrostargate.com:190/",
  );
  await expect(demo).toHaveAttribute("target", "_blank");
  await expect(demo).toHaveAttribute("rel", "noopener noreferrer");
  await expect(page.locator('a[href*="linkedin.com"]')).toHaveCount(0);
  if (await page.locator(".contact-links").count()) {
    await expect(page.locator('#connect a[href^="mailto:"]')).toHaveAttribute(
      "href",
      "mailto:sohailanwar.ai@gmail.com",
    );
    const github = page.locator('#connect a[href*="github.com"]');
    await expect(github).toHaveAttribute(
      "href",
      "https://github.com/Sohail-aiflow",
    );
    await expect(github).toHaveAttribute("rel", "noopener noreferrer");
    await expect(github).toHaveAttribute("target", "_blank");
  } else {
    await expect(page.locator("#connect a")).toHaveCount(0);
  }
  await expect(page.locator(".experience-role")).toHaveText(
    "Project Manager & Backend Developer",
  );
  await expect(page.locator(".experience-context")).toHaveText(
    "3-member team · Live project",
  );
});

test("native project selection works without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/#work");
  await page.locator('label[for="select-school-website-cms"]').click();
  await expect(
    page.getByRole("radio", { name: projects[2], exact: true }),
  ).toBeChecked();
  await expect(
    page
      .locator(".project-preview:visible")
      .getByRole("heading", { name: projects[2], exact: true }),
  ).toBeVisible();
  await context.close();
});

test("project selection remains usable with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/#work");
  await page.locator('label[for="select-marketlink-solo"]').click();
  await expect(
    page.getByRole("radio", { name: projects[3], exact: true }),
  ).toBeChecked();
  await expect(
    page
      .locator(".project-preview:visible")
      .getByRole("heading", { name: projects[3], exact: true }),
  ).toBeVisible();
  expect(
    await page
      .locator(".project-choice")
      .first()
      .evaluate((element) => getComputedStyle(element).transitionDuration),
  ).toBe("1e-05s");
});
