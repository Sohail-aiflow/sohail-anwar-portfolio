import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";

test("project prefetch payloads resolve on the static host", async ({
  page,
  request,
}) => {
  const missing: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400 && response.url().includes("__next."))
      missing.push(response.url());
  });
  for (const slug of [
    "marketlink-team",
    "car-rental-system",
    "school-website-cms",
    "marketlink-solo",
  ]) {
    const payload = `/projects/${slug}/__next.projects.$d$slug.__PAGE__.txt`;
    expect(existsSync(`out${payload}`)).toBe(true);
    expect((await request.get(payload)).status()).toBe(200);
  }
  await page.goto("/#work");
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
    .getByRole("navigation", { name: "Other projects" })
    .getByRole("link", { name: "Car Rental System", exact: true })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Car Rental System",
  );
  expect(missing).toEqual([]);
});
