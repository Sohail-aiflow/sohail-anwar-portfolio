import { expect, test, type Locator, type Page } from "@playwright/test";
import { createClient } from "@sanity/client";
import { applyApprovedProjectReview } from "../src/content/approved-project-review";
import { adaptSanityContent } from "../src/lib/content/adapter";
import { getLocalContent } from "../src/lib/content/local";
import { portfolioQuery } from "../src/lib/sanity/query";

const routes = [
  "/",
  "/projects/marketlink-team/",
  "/projects/car-rental-system/",
  "/projects/school-website-cms/",
  "/projects/marketlink-solo/",
];

const proseSelector = [
  ".hero-copy",
  ".hero-introduction",
  ".section-description",
  ".about-copy p",
  ".education p",
  ".connect-copy",
  ".case-description",
  ".case-section-content p:not(.sr-only)",
].join(", ");

const normalize = (text: string) => text.replace(/\s+/g, " ").trim();

for (const theme of ["light", "dark"] as const) {
  for (const width of [320, 1440]) {
    test(`${theme}: editorial prose remains fully readable at ${width}px`, async ({
      page,
    }) => {
      test.setTimeout(90_000);
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme: theme });
      for (const route of routes) {
        await page.goto(route);
        await page.evaluate(() => document.fonts.ready);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const panels = page.locator(".editorial-panel");
        expect(
          await panels.count(),
          `${route}: editorial grouping exists`,
        ).toBeGreaterThan(0);
        for (const panel of await panels.all()) {
          await expect(panel).toBeVisible();
          const box = await panel.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.x, `${route}: panel left edge`).toBeGreaterThanOrEqual(0);
          expect(
            box!.x + box!.width,
            `${route}: panel right edge`,
          ).toBeLessThanOrEqual(width);
        }

        // Inspect actual text rectangles, not a screenshot or a mirrored CSS
        // expectation: clipped, clamped or hidden prose must fail this check.
        const paragraphs = await page
          .locator(proseSelector)
          .evaluateAll((elements) =>
            elements
              .filter((element) => element.textContent?.trim())
              .map((element) => {
                const style = getComputedStyle(element);
                const box = element.getBoundingClientRect();
                const range = document.createRange();
                range.selectNodeContents(element);
                const text = range.getBoundingClientRect();
                const clippingAncestors: string[] = [];
                let ancestor = element.parentElement;
                while (ancestor) {
                  const ancestorStyle = getComputedStyle(ancestor);
                  const ancestorBox = ancestor.getBoundingClientRect();
                  if (
                    ["hidden", "clip"].includes(ancestorStyle.overflowY) &&
                    (text.top < ancestorBox.top - 2 ||
                      text.bottom > ancestorBox.bottom + 2)
                  )
                    clippingAncestors.push(
                      ancestor.className || ancestor.tagName,
                    );
                  ancestor = ancestor.parentElement;
                }
                return {
                  label: element.textContent!.trim().slice(0, 80),
                  visible:
                    box.width > 0 &&
                    box.height > 0 &&
                    style.visibility === "visible" &&
                    Number(style.opacity) > 0,
                  textOverflow: style.textOverflow,
                  lineClamp: style.webkitLineClamp,
                  horizontalOverflow:
                    element.scrollWidth > element.clientWidth + 1,
                  verticalOverflow:
                    element.scrollHeight > element.clientHeight + 1,
                  textFits:
                    text.left >= box.left - 2 &&
                    text.right <= box.right + 2 &&
                    text.top >= box.top - 2 &&
                    text.bottom <= box.bottom + 2,
                  clippingAncestors,
                };
              }),
          );
        expect(paragraphs.length, `${route}: rendered prose`).toBeGreaterThan(
          0,
        );
        for (const paragraph of paragraphs) {
          const label = `${route}: ${paragraph.label}`;
          expect(paragraph.visible, label).toBe(true);
          expect(paragraph.textOverflow, label).not.toBe("ellipsis");
          expect(["none", "0"], label).toContain(paragraph.lineClamp);
          expect(paragraph.horizontalOverflow, label).toBe(false);
          expect(paragraph.verticalOverflow, label).toBe(false);
          expect(paragraph.textFits, label).toBe(true);
          expect(paragraph.clippingAncestors, label).toEqual([]);
        }
      }
    });
  }
}

interface ProseSection {
  heading: string;
  body: string;
}
interface PublishedProse {
  profile: {
    shortIntroduction: string;
    aboutIntroduction?: string | null;
    about: string[];
  };
  homepage: {
    heroSupportingText: string;
    workDescription: string;
    skillsDescription: string;
    connectMessage: string;
  };
  education: { description?: string; program: string; institution: string }[];
  projects: {
    slug: string;
    description: string;
    caseStudy: {
      overview: string;
      purpose?: string;
      contributionNote?: string;
      technicalApproach?: ProseSection[];
      challenges?: ProseSection[];
      lessonsLearned?: ProseSection[];
    };
  }[];
}

async function expectExactCopy(locator: Locator, original: string) {
  expect(original.trim()).not.toBe("");
  await expect(locator).toBeVisible();
  expect(normalize(await locator.innerText())).toBe(normalize(original));
}

async function expectStaticProse(
  page: Page,
  html: string,
  selector: string,
  originals: string[],
) {
  // DOMParser reads the served static HTML without executing hydration scripts;
  // CMS copy must already be present, rather than added or replaced client-side.
  const staticText = await page.evaluate(
    ({ html, selector }) => {
      const document = new DOMParser().parseFromString(html, "text/html");
      return [...document.querySelectorAll(selector)].map(
        (element) => element.textContent ?? "",
      );
    },
    { html, selector },
  );
  for (const original of originals) {
    expect(staticText.map(normalize)).toContain(normalize(original));
  }
}

test("fresh Sanity prose plus explicit approved local project corrections appear in static HTML", async ({
  page,
  request,
}) => {
  test.skip(
    process.env.VERIFY_LIVE_SANITY !== "1",
    "Explicit token-free live verification only",
  );
  test.setTimeout(90_000);
  const client = createClient({
    projectId: "xc6vvvsv",
    dataset: "production",
    apiVersion: "2026-10-13",
    perspective: "published",
    useCdn: false,
  });
  const raw = await client.fetch<PublishedProse>(portfolioQuery);
  const adapted = adaptSanityContent(raw, getLocalContent());
  expect(adapted.warnings).toEqual([]);
  const review = applyApprovedProjectReview(adapted);
  const published = {
    ...raw,
    projects: raw.projects.map((project) => {
      const expected = review.projects.find(
        (item) => item.slug === project.slug,
      )!;
      return {
        ...project,
        description: expected.description,
        caseStudy: {
          ...project.caseStudy,
          overview: expected.caseStudy!.overview,
        },
      };
    }),
  };
  expect(published.projects).toHaveLength(4);
  expect(published.education).toHaveLength(1);
  await page.goto("/");
  const homepageChecks: [string, string][] = [
    [".hero-copy", published.homepage.heroSupportingText],
    [".hero-introduction", published.profile.shortIntroduction],
    ["#work .section-description", published.homepage.workDescription],
    ["#skills .section-description", published.homepage.skillsDescription],
    [".connect-copy", published.homepage.connectMessage],
  ];
  if (published.profile.aboutIntroduction?.trim()) {
    homepageChecks.push([
      ".about-introduction",
      published.profile.aboutIntroduction,
    ]);
  }
  for (const [selector, original] of homepageChecks) {
    await expectExactCopy(page.locator(selector), original);
  }
  for (const original of published.profile.about) {
    const paragraph = page
      .locator(".about-copy p")
      .filter({ hasText: original });
    await expectExactCopy(paragraph, original);
  }
  const education = published.education[0]!;
  await expectExactCopy(page.locator(".education-program"), education.program);
  await expectExactCopy(
    page.locator(".education-institution").first(),
    education.institution,
  );
  if (education.description)
    await expectExactCopy(
      page.locator(".education-description"),
      education.description,
    );
  const homeResponse = await request.get("/");
  expect(homeResponse.ok()).toBe(true);
  const homeHtml = await homeResponse.text();
  for (const [selector, original] of homepageChecks) {
    await expectStaticProse(page, homeHtml, selector, [original]);
  }
  await expectStaticProse(
    page,
    homeHtml,
    ".about-copy p",
    published.profile.about,
  );

  for (const project of published.projects) {
    const route = `/projects/${project.slug}/`;
    await page.goto(route);
    await expectExactCopy(
      page.locator(".case-description"),
      project.description,
    );
    const checks: [string, string[]][] = [
      [
        "#overview-title + .case-section-content p",
        [project.caseStudy.overview],
      ],
    ];
    if (project.caseStudy.purpose)
      checks.push([
        "#purpose-title + .case-section-content p",
        [project.caseStudy.purpose],
      ]);
    if (project.caseStudy.contributionNote)
      checks.push([
        ".case-editorial-note",
        [project.caseStudy.contributionNote],
      ]);
    for (const [id, sections] of [
      ["approach", project.caseStudy.technicalApproach],
      ["challenges", project.caseStudy.challenges],
      ["lessons", project.caseStudy.lessonsLearned],
    ] as const) {
      if (sections?.length)
        checks.push([
          `#${id}-title + .case-section-content p`,
          sections.map(({ body }) => body),
        ]);
    }
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    await expectStaticProse(page, html, ".case-description", [
      project.description,
    ]);
    for (const [selector, originals] of checks) {
      const paragraphs = page.locator(selector);
      await expect(paragraphs).toHaveCount(originals.length);
      for (let index = 0; index < originals.length; index++) {
        await expectExactCopy(paragraphs.nth(index), originals[index]!);
      }
      await expectStaticProse(page, html, selector, originals);
    }
  }
});
