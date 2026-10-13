import { test, expect } from "@playwright/test";
import { createClient } from "@sanity/client";
import { portfolioQuery } from "../src/lib/sanity/query";
import { adaptSanityContent } from "../src/lib/content/adapter";
import { getLocalContent } from "../src/lib/content/local";

test("real public Sanity content contains all canonical records without fallback", async () => {
  test.skip(
    process.env.VERIFY_LIVE_SANITY !== "1",
    "Explicit live verification only",
  );
  const client = createClient({
    projectId: "xc6vvvsv",
    dataset: "production",
    apiVersion: "2026-10-13",
    perspective: "published",
    useCdn: false,
  });
  const payload = await client.fetch(portfolioQuery);
  expect(payload.profile._id).toBe("profile");
  expect(payload.homepage._id).toBe("homepage");
  expect(payload.projects).toHaveLength(4);
  expect(payload.skills).toHaveLength(25);
  expect(payload.education).toHaveLength(1);
  const content = adaptSanityContent(payload, getLocalContent());
  expect(content.source).toBe("sanity");
  expect(content.warnings).toEqual([]);
  expect(content.projects.map((p) => p.slug)).toEqual([
    "marketlink-team",
    "car-rental-system",
    "school-website-cms",
    "marketlink-solo",
  ]);
  expect(
    payload.projects.every((p: { _id: string }) => !p._id.includes(".")),
  ).toBe(true);
  expect(content.projects[0]?.role).toBe("Project Manager & Backend Developer");
  expect(content.projects[0]?.liveUrl).toBe(
    "https://aptechmetrostargate.com:190/",
  );
});
