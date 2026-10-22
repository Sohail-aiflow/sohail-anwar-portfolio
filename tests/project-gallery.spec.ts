import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { existsSync, readFileSync } from "node:fs";
import { projectGalleries } from "../src/data/project-galleries";
import { applyApprovedProjectReview } from "../src/content/approved-project-review";
import { getLocalContent } from "../src/lib/content/local";

for (const width of [375, 768, 1440])
  for (const [slug, images] of Object.entries(projectGalleries)) {
    test(`${slug}: genuine gallery, keyboard and modal at ${width}px in both themes`, async ({
      page,
    }, testInfo) => {
      test.setTimeout(120_000);
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.setViewportSize({ width, height: 900 });
      for (const theme of ["light", "dark"] as const) {
        await page.emulateMedia({
          colorScheme: theme,
          reducedMotion: "reduce",
        });
        await page.goto(`/projects/${slug}/`);
        const gallery = page.getByRole("region", {
          name: "Application screenshot gallery",
        });
        const panel = await page.locator(".case-documentation").boundingBox();
        const galleryBox = await gallery.boundingBox();
        expect(galleryBox!.width / panel!.width).toBeGreaterThan(0.8);
        await expect(
          gallery.getByRole("button", { name: /^View / }),
        ).toHaveCount(images.length);
        await expect(
          gallery.getByRole("button", { name: "Previous", exact: true }),
        ).toBeDisabled();
        for (const image of images) {
          await gallery
            .getByRole("button", { name: `View ${image.label}`, exact: true })
            .click();
          const current = gallery.locator(".gallery-stage img");
          await expect(current).toHaveAttribute("alt", image.alt);
          await expect
            .poll(() =>
              current.evaluate(
                (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
              ),
            )
            .toBe(true);
          await expect(gallery.locator("figcaption")).toContainText(
            image.caption!,
          );
        }
        await expect(
          gallery.getByRole("button", { name: "Next", exact: true }),
        ).toBeDisabled();
        await gallery
          .getByRole("button", { name: /^View / })
          .first()
          .click();
        const opener = gallery.locator(".gallery-stage");
        await opener.focus();
        await page.keyboard.press("ArrowRight");
        await expect(gallery.locator("figcaption strong")).toHaveText(
          images[1]!.label!,
        );
        await page.keyboard.press("Enter");
        const modal = page.getByRole("dialog", {
          name: "Application screenshot viewer",
        });
        await expect(modal).toBeVisible();
        await expect(
          modal.getByRole("button", { name: "Close screenshot viewer" }),
        ).toBeFocused();
        await expect
          .poll(() =>
            modal
              .locator("img")
              .evaluate(
                (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
              ),
          )
          .toBe(true);
        expect(
          await modal.evaluate((el) => {
            const image = el.querySelector("img")!.getBoundingClientRect();
            const frame = el
              .querySelector(".lightbox-image-area")!
              .getBoundingClientRect();
            return (
              image.top >= frame.top - 1 &&
              image.bottom <= frame.bottom + 1 &&
              image.left >= frame.left - 1 &&
              image.right <= frame.right + 1
            );
          }),
        ).toBe(true);
        await page.keyboard.press("ArrowRight");
        await expect(modal.locator(".lightbox-footer strong")).toHaveText(
          images[2]?.label ?? images[1]!.label!,
        );
        for (let i = 0; i < 7; i++) {
          await page.keyboard.press("Tab");
          expect(
            await modal.evaluate((el) => el.contains(document.activeElement)),
          ).toBe(true);
        }
        if (width === 375) {
          const a = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
          expect(a.violations).toEqual([]);
        }
        await modal
          .getByRole("button", { name: "Actual size", exact: true })
          .click();
        await expect(modal.locator(".lightbox-image-area")).toHaveClass(
          /is-actual-size/,
        );
        await expect(
          modal.getByRole("button", { name: "Fit image", exact: true }),
        ).toHaveAttribute("aria-pressed", "true");
        await page.keyboard.press("Escape");
        await expect(modal).toHaveCount(0);
        await expect(opener).toBeFocused();
        expect(
          await page.evaluate(() => document.body.style.overflow),
        ).not.toBe("hidden");
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
        ).toBe(true);
        if (width === 375) {
          const a = await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
          expect(a.violations).toEqual([]);
        }
        if (
          ["car-rental-system", "marketlink-solo"].includes(slug) &&
          width !== 768
        ) {
          await gallery.screenshot({
            path: testInfo.outputPath(`${slug}-${theme}-${width}.png`),
          });
        }
      }
      expect(errors).toEqual([]);
    });
  }

test("mobile swipe changes the image without opening the lightbox", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 375, height: 900 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:4173/projects/car-rental-system/");
    const stage = page.locator(".gallery-stage");
    await stage.scrollIntoViewIfNeeded();
    const box = (await stage.boundingBox())!;
    const cdp = await context.newCDPSession(page);
    const y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + box.width - 20, y }],
    });
    for (let i = 1; i <= 6; i++)
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: box.x + box.width - 20 - i * 24, y }],
      });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await expect(page.locator(".project-gallery figcaption strong")).toHaveText(
      "Book a car",
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);
  } finally {
    await context.close();
  }
});

test("no-script evidence links and image failure recovery remain usable", async ({
  browser,
  page,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const native = await context.newPage();
    await native.goto("http://127.0.0.1:4173/projects/marketlink-solo/");
    await expect(native.locator(".project-gallery noscript a")).toHaveCount(7);
    await expect(native.locator(".gallery-stage")).toHaveAttribute(
      "href",
      /homepage\.webp$/,
    );
  } finally {
    await context.close();
  }
  await page.route(
    "**/images/projects/car-rental-system/rentals-listing*.webp",
    (route) => route.abort(),
  );
  await page.goto("/projects/car-rental-system/");
  await page.locator(".gallery-stage").scrollIntoViewIfNeeded();
  await expect(page.locator(".gallery-error")).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.locator(".gallery-error")).toHaveCount(0);
  await expect
    .poll(() =>
      page
        .locator(".gallery-stage img")
        .evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0),
    )
    .toBe(true);
});

test("local review preserves upstream identity, status, unrelated CMS facts, and all approved evidence files", () => {
  const original = getLocalContent();
  const snapshot = JSON.stringify(original);
  const review = applyApprovedProjectReview(original);
  expect(JSON.stringify(original)).toBe(snapshot);
  expect(review.source).toBe(original.source);
  expect(
    review.projects.map((p) => [p.id, p.slug, p.status, p.liveUrl]),
  ).toEqual(original.projects.map((p) => [p.id, p.slug, p.status, p.liveUrl]));
  expect(Object.values(projectGalleries).map((xs) => xs.length)).toEqual([
    5, 7, 2, 5,
  ]);
  for (const images of Object.values(projectGalleries))
    for (const image of images) {
      for (const src of [image.src, image.previewSrc!, image.thumbnailSrc!])
        expect(existsSync(`public${src}`), src).toBe(true);
      const png = readFileSync(`public${image.src.replace(/\.webp$/, ".png")}`);
      expect(png.readUInt32BE(16)).toBe(image.width);
      expect(png.readUInt32BE(20)).toBe(image.height);
    }
  expect(review.projects.find((p) => p.id === "car-rental-system")?.role).toBe(
    "Solo full-stack developer",
  );
  expect(
    review.projects.find((p) => p.id === "school-website-cms")?.caseStudy
      ?.evidenceNote,
  ).toContain("earlier Phase 1");
  const upstream = {
    ...original,
    source: "sanity" as const,
    projects: original.projects.map((project) =>
      project.id === "car-rental-system"
        ? {
            ...project,
            role: undefined,
            collaboration: "unconfirmed" as const,
            description: "Older published summary",
            caseStudy: {
              ...project.caseStudy!,
              purpose: "New published purpose remains authoritative",
              pending: [
                "My specific role and collaboration context",
                "Screenshots and repository evidence",
                "Custom architecture detail",
              ],
            },
          }
        : project,
    ),
  };
  const corrected = applyApprovedProjectReview(upstream);
  const car = corrected.projects.find(
    (project) => project.id === "car-rental-system",
  )!;
  expect(corrected.source).toBe("sanity");
  expect(car.role).toBe("Solo full-stack developer");
  expect(car.collaboration).toBe("solo");
  expect(car.caseStudy?.purpose).toBe(
    "New published purpose remains authoritative",
  );
  expect(car.caseStudy?.pending).toEqual([
    "Repository evidence",
    "Custom architecture detail",
  ]);
  expect(
    upstream.projects.find((project) => project.id === "car-rental-system")
      ?.collaboration,
  ).toBe("unconfirmed");
});
