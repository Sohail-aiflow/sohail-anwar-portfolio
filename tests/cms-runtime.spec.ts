import { expect, test } from "@playwright/test";

test("exported pages never request the Sanity content API in the browser", async ({
  page,
}) => {
  const apiRequests: string[] = [];
  page.on("request", (request) => {
    if (/https:\/\/[^/]+\.(?:api|apicdn)\.sanity\.io\//.test(request.url()))
      apiRequests.push(request.url());
  });
  await page.goto("/");
  await page
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: "Work", exact: true })
    .click();
  await page
    .getByRole("link", {
      name: "Read case study — MarketLink — Team Project",
      exact: true,
    })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "MarketLink — Team Project",
  );
  await page
    .getByRole("link", { name: "Back to selected work", exact: true })
    .click();
  await expect(page.locator("#work-title")).toBeInViewport();
  expect(apiRequests).toEqual([]);
});
