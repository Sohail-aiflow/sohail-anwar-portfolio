import { expect, test, type Page } from "@playwright/test";

const projects = [
  "marketlink-team",
  "car-rental-system",
  "school-website-cms",
  "marketlink-solo",
];

async function settle(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let previous = scrollY,
          frames = 0;
        function frame() {
          frames = Math.abs(scrollY - previous) < 0.1 ? frames + 1 : 0;
          previous = scrollY;
          if (frames >= 10) resolve();
          else requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
      }),
  );
}

for (const width of [768, 1024, 1440])
  for (const height of [600, 900]) {
    test(`project selection keeps every scroll frame stable at ${width}x${height}`, async ({
      page,
    }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height });
      for (const theme of ["light", "dark"] as const) {
        await page.emulateMedia({ colorScheme: theme });
        await page.goto("/");
        await page.evaluate(() => document.fonts.ready);
        await page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: "Work", exact: true })
          .click();
        await expect(page).toHaveURL(/#work$/);
        await settle(page);
        let navigations = 0;
        page.on("request", (request) => {
          if (
            request.isNavigationRequest() &&
            request.frame() === page.mainFrame()
          )
            navigations++;
        });
        for (const id of projects)
          for (const position of ["upper", "middle", "lower"] as const) {
            const label = page.locator(`label[for="select-${id}"]`);
            // Place the actual click within the viewport first. A locator.click()
            // auto-scroll would otherwise conceal or contaminate the application bug.
            await label.evaluate((element, position) => {
              const box = element.getBoundingClientRect();
              const nav = document
                .querySelector('nav[aria-label="Primary"]')!
                .getBoundingClientRect();
              const target =
                position === "upper"
                  ? nav.bottom + 32
                  : position === "middle"
                    ? innerHeight / 2
                    : innerHeight - 40;
              scrollTo({
                top: scrollY + box.top + box.height / 2 - target,
                behavior: "instant",
              });
            }, position);
            await settle(page);
            const before = await page.evaluate(() => ({
              y: scrollY,
              url: location.href,
              history: history.length,
              gridHeight: document
                .querySelector(".work-grid")!
                .getBoundingClientRect().height,
            }));
            await page.evaluate(() => {
              const state = window as typeof window & {
                workScrollSamples: number[];
                workScrollRecord?: () => void;
              };
              if (state.workScrollRecord)
                removeEventListener("scroll", state.workScrollRecord);
              state.workScrollSamples = [scrollY];
              state.workScrollRecord = () =>
                state.workScrollSamples.push(scrollY);
              addEventListener("scroll", state.workScrollRecord);
            });
            const box = (await label.boundingBox())!;
            const clickY = box.y + box.height / 2;
            expect(clickY).toBeGreaterThan(0);
            expect(clickY).toBeLessThan(height);
            await page.mouse.click(box.x + 24, clickY);
            await expect(page.locator(`#select-${id}`)).toBeChecked();
            await expect(page.locator(`#select-${id}`)).toBeFocused();
            await expect(
              page.locator(".project-preview:visible"),
            ).toHaveAttribute("id", `preview-${id}`);
            await settle(page);
            const after = await page.evaluate(() => ({
              y: scrollY,
              url: location.href,
              history: history.length,
              gridHeight: document
                .querySelector(".work-grid")!
                .getBoundingClientRect().height,
              samples: (
                window as typeof window & { workScrollSamples: number[] }
              ).workScrollSamples,
            }));
            expect(after.url).toBe(before.url);
            expect(after.history).toBe(before.history);
            expect(after.gridHeight).toBe(before.gridHeight);
            expect(navigations).toBe(0);
            expect(
              Math.max(...after.samples.map((y) => Math.abs(y - before.y))),
              `${id}/${position}: ${JSON.stringify(after.samples)}`,
            ).toBeLessThanOrEqual(2);
            expect(Math.abs(after.y - before.y)).toBeLessThanOrEqual(2);
            // All four native radio arrow directions, including group wrapping,
            // must also preserve scroll at this manually chosen position.
            let selected = projects.indexOf(id);
            for (const key of [
              "ArrowDown",
              "ArrowRight",
              "ArrowUp",
              "ArrowLeft",
            ]) {
              selected =
                (selected +
                  (key === "ArrowDown" || key === "ArrowRight" ? 1 : -1) +
                  projects.length) %
                projects.length;
              await page.keyboard.press(key);
              await expect(
                page.locator(`#select-${projects[selected]}`),
              ).toBeChecked();
              await expect(
                page.locator(`#select-${projects[selected]}`),
              ).toBeFocused();
              await settle(page);
              expect(
                Math.abs((await page.evaluate(() => scrollY)) - before.y),
              ).toBeLessThanOrEqual(2);
            }
          }
      }
    });
  }
