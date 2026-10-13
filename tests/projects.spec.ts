import { expect, test } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";

const cases = [
  {
    slug: "marketlink-team",
    title: "MarketLink — Team Project",
    status: "Live",
    role: "Project Manager & Backend Developer",
    stack: [],
    functionality: [],
  },
  {
    slug: "car-rental-system",
    title: "Car Rental System",
    status: "Complete",
    role: "Role details awaiting confirmation",
    stack: ["ASP.NET Core MVC", "SQL Server"],
    functionality: ["Rental return workflow", "Data validation"],
  },
  {
    slug: "school-website-cms",
    title: "School Website & CMS",
    status: "Complete",
    role: "Role details awaiting confirmation",
    stack: ["PHP", "MySQL"],
    functionality: [
      "News",
      "Faculty",
      "Gallery",
      "Admissions",
      "Downloads",
      "Site settings",
    ],
  },
  {
    slug: "marketlink-solo",
    title: "MarketLink — Solo Project",
    status: "In progress",
    role: "Independent developer",
    stack: ["MongoDB", "Express", "React", "Node.js"],
    functionality: [
      "Authentication and user roles",
      "Product discovery",
      "Cart and checkout",
      "Orders",
      "Pickup scheduling",
      "Farmer functionality",
      "Administration",
      "Reviews and favorites",
    ],
  },
] as const;

for (const width of [320, 375, 768, 1024, 1440]) {
  for (const project of cases) {
    test(`${project.slug} at ${width}px`, async ({ page }, testInfo) => {
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(`/projects/${project.slug}/`);
      expect(response?.status()).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(
        project.title,
      );
      const displayName = (
        await page.locator(".identity-name").innerText()
      ).replace(/\.$/, "");
      await expect(page).toHaveTitle(`${project.title} | ${displayName}`);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        /.+/,
      );
      await expect(page.locator(".case-metadata")).toContainText(
        project.status,
      );
      await expect(page.locator(".case-metadata")).toContainText(project.role);
      for (const technology of project.stack)
        await expect(page.locator(".case-technologies")).toContainText(
          technology,
        );
      for (const feature of project.functionality)
        await expect(page.locator(".case-feature-list")).toContainText(feature);
      await expect(
        page.getByText("Project screenshots pending", { exact: true }),
      ).toBeVisible();
      await expect(page.locator(".project-gallery img")).toHaveCount(0);
      await expect(
        page.getByRole("heading", {
          name: "Challenges & decisions",
          exact: true,
        }),
      ).toHaveCount(0);
      await expect(
        page.getByRole("heading", { name: "Technical approach", exact: true }),
      ).toHaveCount(0);
      const otherProjects = page.getByRole("navigation", {
        name: "Other projects",
      });
      await expect(otherProjects.locator('a[href^="/projects/"]')).toHaveCount(
        3,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      await expect(
        page
          .getByRole("navigation", { name: "Primary" })
          .locator("[aria-current]"),
      ).toHaveCount(0);
      if (
        (width === 1440 || width === 375) &&
        project.slug === "car-rental-system"
      ) {
        await page.screenshot({
          path: testInfo.outputPath(`case-${width}.png`),
          fullPage: true,
        });
      }
      await page
        .getByRole("link", { name: "Back to selected work", exact: true })
        .click();
      await expect(page).toHaveURL(/\/#work$/);
      await expect(page.locator("#work-title")).toBeInViewport();
      expect(errors).toEqual([]);
    });
  }
}

test("homepage links navigate to every case study and retain selection", async ({
  page,
}) => {
  for (const project of cases) {
    await page.goto("/#work");
    await page.locator(`label[for="select-${project.slug}"]`).click();
    await page
      .getByRole("link", {
        name: `Read case study — ${project.title}`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(new RegExp(`/projects/${project.slug}/$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      project.title,
    );
  }
});

test("team and solo scopes, supplied demo URL, and pending facts stay accurate", async ({
  page,
}) => {
  await page.goto("/projects/marketlink-team/");
  await expect(page.locator(".case-metadata")).toContainText(
    "3-member team, including me",
  );
  await expect(
    page.getByText(
      "The application is shared team work. My role does not represent all of the team’s contributions.",
    ),
  ).toBeVisible();
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
  await expect(page.locator(".case-link-note")).toContainText(
    "has not been independently verified",
  );
  await page.goto("/projects/marketlink-solo/");
  await expect(
    page.getByRole("heading", { name: "Development areas", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Confirmed functionality", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByText(
      "These are development areas, not a claim that every feature is complete or production-ready.",
    ),
  ).toBeVisible();
  await expect(
    page.locator('a[href*="github.com"], a[target="_blank"]'),
  ).toHaveCount(0);
});

test("keyboard, reduced motion, and shared homepage navigation on case studies", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/projects/car-rental-system/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  const back = page.getByRole("link", {
    name: "Back to selected work",
    exact: true,
  });
  await back.focus();
  expect(
    await back.evaluate((element) => getComputedStyle(element).outlineStyle),
  ).toBe("solid");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/#work$/);
  await page.goto("/projects/school-website-cms/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await expect(page).toHaveURL(/\/#about$/);
  await expect(page.locator("#about-title")).toBeInViewport();
});

test("native case-study links work without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 375, height: 900 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4173/#work");
  await page.locator('label[for="select-car-rental-system"]').click();
  await page
    .getByRole("link", {
      name: "Read case study — Car Rental System",
      exact: true,
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Car Rental System",
  );
  await page
    .getByRole("link", { name: "Back to selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  await context.close();
});

test("only known slugs export and unknown URLs return 404", async ({
  page,
}) => {
  for (const project of cases) {
    const file = `out/projects/${project.slug}/index.html`;
    expect(existsSync(file)).toBe(true);
    expect(readFileSync(file, "utf8")).toContain(
      project.title.replaceAll("&", "&amp;"),
    );
  }
  expect(existsSync("out/projects/unknown-project/index.html")).toBe(false);
  expect((await page.goto("/projects/unknown-project/"))?.status()).toBe(404);
  // The simple test file server has a generic 404 body; test the host fallback artifact explicitly.
  await page.goto("/404.html");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This page isn’t here.",
  );
  await page
    .getByRole("link", { name: "Return to selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
});
