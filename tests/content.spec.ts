import { expect, test } from "@playwright/test";
import { getLocalContent } from "../src/lib/content/local";
import {
  adaptSanityContent,
  externalUrlSchema,
  slugSchema,
} from "../src/lib/content/adapter";
import { loadPortfolioContent } from "../src/lib/content/load";
import { getSanityConfig } from "../src/lib/sanity/config";
import { portfolioQuery } from "../src/lib/sanity/query";
import { sanityImageSrcSet, sanityImageUrl } from "../src/lib/content/images";
import { readFileSync } from "node:fs";
import {
  getSiteOrigin,
  isSiteIndexable,
  serializeStructuredData,
} from "../src/lib/seo";

const local = getLocalContent();

test("launch URL and indexing require explicit safe configuration", () => {
  expect(getSiteOrigin({})).toBeUndefined();
  expect(isSiteIndexable({})).toBe(false);
  expect(
    getSiteOrigin({ SITE_URL: "https://portfolio.example.invalid/" }),
  ).toBe("https://portfolio.example.invalid");
  expect(
    isSiteIndexable({
      SITE_URL: "https://portfolio.example.invalid",
      SITE_INDEXABLE: "true",
    }),
  ).toBe(true);
  for (const value of [
    "http://localhost:3000",
    "https://localhost",
    "https://127.0.0.1",
    "https://x.local",
    "https://user:secret@example.invalid",
    "https://example.invalid/path",
    "https://example.invalid/?key=x",
  ])
    expect(() => getSiteOrigin({ SITE_URL: value })).toThrow();
  expect(() => isSiteIndexable({ SITE_INDEXABLE: "true" })).toThrow();
  expect(() => isSiteIndexable({ SITE_INDEXABLE: "yes" })).toThrow();
  const encoded = serializeStructuredData({
    name: "</script><script>alert(1)</script>",
  });
  expect(encoded).not.toContain("<");
  expect(JSON.parse(encoded).name).toBe("</script><script>alert(1)</script>");
});
test("factual starter import round-trips through the CMS adapter", () => {
  const docs = readFileSync("studio/seed.ndjson", "utf8")
    .trim()
    .split("\n")
    .map((line) => JSON.parse(line));
  const cmsProfile = docs.find((doc) => doc._type === "profile");
  const result = adaptSanityContent(
    {
      profile: {
        ...cmsProfile,
        about: cmsProfile.about.map(
          (paragraph: { body: string }) => paragraph.body,
        ),
      },
      homepage: docs.find((doc) => doc._type === "homepage"),
      projects: docs
        .filter((doc) => doc._type === "project")
        .map((doc) => ({ ...doc, slug: doc.slug.current })),
      skills: docs.filter((doc) => doc._type === "skill"),
      education: docs.filter((doc) => doc._type === "education"),
    },
    local,
  );
  expect(docs).toHaveLength(32);
  expect(new Set(docs.map((doc) => doc._id)).size).toBe(32);
  expect(docs.every((doc) => !doc._id.includes("."))).toBe(true);
  expect(result.warnings).toEqual([]);
  expect(result.profile).toEqual(local.profile);
  expect(result.homepage).toEqual(local.homepage);
  expect(result.skills).toEqual(local.skills);
  expect(
    result.projects.map(({ slug, title, status }) => ({ slug, title, status })),
  ).toEqual(
    local.projects.map(({ slug, title, status }) => ({ slug, title, status })),
  );
  expect(result.projects.every((project) => project.featured === true)).toBe(
    true,
  );
});

test("Sanity responsive image variants preserve aspect ratio without a server optimizer", () => {
  const src =
    "https://cdn.sanity.io/images/test1234/production/test-4000x3000.png";
  const url = new URL(sanityImageUrl(src, 4000));
  expect(url.searchParams.get("w")).toBe("1600");
  expect(url.searchParams.get("auto")).toBe("format");
  expect(sanityImageSrcSet(src, 4000)).toContain("320w");
  expect(sanityImageSrcSet(src, 4000)).toContain("1600w");
  expect(sanityImageSrcSet(src, 4000)).not.toContain("4000w");
});

test("draft skills and invalid education dates cannot enter published content", () => {
  expect(() =>
    adaptSanityContent(
      {
        skills: [{ _id: "drafts.skill.x", category: "Tools", name: "Fixture" }],
      },
      local,
    ),
  ).toThrow(/Invalid/);
  expect(() =>
    adaptSanityContent(
      {
        education: [
          {
            _id: "education-test",
            institution: "Aptech",
            program: "ACCP AI / Software Engineering",
            status: "Currently studying",
            startDate: "2026-02-31",
          },
        ],
      },
      local,
    ),
  ).toThrow(/Invalid/);
});
const config = {
  projectId: "test1234",
  dataset: "production",
  apiVersion: "2026-10-13",
};
const existing = (index = 0) => {
  const project = local.projects[index]!;
  return {
    ...project,
    _id: `project-${project.id}`,
    featured: true,
    displayOrder: index,
  };
};

test("no CMS configuration uses local facts without fetching", async () => {
  expect(getSanityConfig({})).toBeNull();
  let calls = 0;
  const content = await loadPortfolioContent(local, null, async () => {
    calls += 1;
    throw new Error("Must not fetch");
  });
  expect(calls).toBe(0);
  expect(content).toBe(local);
  expect(content.projects.map((project) => project.slug)).toEqual([
    "marketlink-team",
    "car-rental-system",
    "school-website-cms",
    "marketlink-solo",
  ]);
  expect(content.profile.name).toBe("Sohail Anwar");
  expect(content.profile.contacts).toEqual([
    { label: "Email", href: "mailto:sohailanwar.ai@gmail.com" },
    { label: "GitHub", href: "https://github.com/Sohail-aiflow" },
  ]);
  expect(content.education[0]?.institution).toBe("Aptech");
});

test("partial/invalid configuration fails and explicit local mode is intentional", () => {
  expect(() => getSanityConfig({ SANITY_PROJECT_ID: "test1234" })).toThrow(
    /both/,
  );
  expect(() => getSanityConfig({ PORTFOLIO_CONTENT_SOURCE: "sanity" })).toThrow(
    /both/,
  );
  expect(() =>
    getSanityConfig({
      SANITY_PROJECT_ID: "../private",
      SANITY_DATASET: "production",
    }),
  ).toThrow(/Invalid/);
  expect(
    getSanityConfig({
      PORTFOLIO_CONTENT_SOURCE: "local",
      SANITY_PROJECT_ID: "test1234",
    }),
  ).toBeNull();
  expect(
    getSanityConfig({
      SANITY_PROJECT_ID: "test1234",
      SANITY_DATASET: "production",
    }),
  ).toEqual(config);
});

test("configured reads use an injected fetcher and surface failure without stale fallback", async () => {
  const content = await loadPortfolioContent(
    local,
    config,
    async (received) => {
      expect(received).toEqual(config);
      return { projects: [existing()] };
    },
  );
  expect(content.source).toBe("sanity");
  expect(content.projects).toHaveLength(4);
  await expect(
    loadPortfolioContent(local, config, async () => {
      throw new Error("SECRET must not be exposed");
    }),
  ).rejects.toThrow("Configured Sanity read failed.");
  await expect(
    loadPortfolioContent(local, config, async () => ({
      projects: [{ ...existing(), status: "fictional" }],
    })),
  ).rejects.toThrow(/Invalid published/);
});

test("empty singleton fields and missing documents retain verified local values with warnings", () => {
  const resolved = adaptSanityContent(
    {
      projects: [
        {
          ...existing(),
          caseStudy: {
            overview: local.projects[0]!.caseStudy!.overview,
            pending: [],
          },
        },
      ],
    },
    local,
  );
  expect(resolved.projects[0]?.caseStudy?.pending).toEqual([]);
  const content = adaptSanityContent(
    {
      profile: { _id: "profile", displayName: " ", about: [] },
      projects: [
        {
          _id: "project-marketlink-team",
          slug: "marketlink-team",
          title: null,
          technologies: [],
        },
      ],
    },
    local,
  );
  expect(content.profile.name).toBe(local.profile.name);
  expect(content.profile.about).toEqual(local.profile.about);
  expect(content.projects[0]?.title).toBe(local.projects[0]?.title);
  expect(content.projects[0]?.status).toBe("live");
  expect(content.projects[0]?.role).toBe("Project Manager & Backend Developer");
  expect(content.warnings.length).toBeGreaterThan(0);
});

test("published fields map into frontend models and homepage edits stay separate", () => {
  const content = adaptSanityContent(
    {
      profile: {
        _id: "profile",
        displayName: "Sohail",
        contactEmail: "test@example.invalid",
        socialLinks: [
          {
            label: "Example test profile",
            url: "https://example.invalid/profile",
          },
        ],
      },
      homepage: { _id: "homepage", workTitle: "Fixture heading" },
      projects: [existing()],
      skills: [
        {
          _id: "skill-test",
          category: "Frontend",
          name: "React",
          visible: true,
          icon: "frontend",
        },
      ],
      education: [
        {
          _id: "education-test",
          institution: "Aptech",
          program: "ACCP AI / Software Engineering",
          status: "Currently studying",
        },
      ],
    },
    local,
  );
  expect(content.homepage.workTitle).toBe("Fixture heading");
  expect(content.profile.contacts.map((link) => link.href)).toEqual([
    "mailto:test@example.invalid",
    "https://example.invalid/profile",
  ]);
  expect(content.skills[0]?.items).toEqual(["React"]);
  expect(content.education[0]?.startDate).toBeUndefined();
});

test("slug, duplicate, draft, and ownership errors are rejected", () => {
  for (const slug of [
    "../secret",
    "MarketLink",
    "two--hyphens",
    "with space",
    "x/y",
  ])
    expect(slugSchema.safeParse(slug).success).toBe(false);
  expect(() =>
    adaptSanityContent(
      { projects: [existing(), { ...existing(), _id: "project-duplicate" }] },
      local,
    ),
  ).toThrow(/Duplicate/);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), slug: "renamed" }] },
      local,
    ),
  ).toThrow(/changed slug/);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), collaboration: "solo" }] },
      local,
    ),
  ).toThrow(/ownership/);
  expect(() =>
    adaptSanityContent({ projects: [{ ...existing(), teamSize: 10 }] }, local),
  ).toThrow(/three/);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), _id: "drafts.project.test" }] },
      local,
    ),
  ).toThrow(/Invalid/);
  expect(portfolioQuery).toContain('path("drafts.**")');
  expect(portfolioQuery).toContain('path("versions.**")');
});

test("external links reject unsafe schemes, credentials, and malformed addresses", () => {
  for (const url of [
    "javascript:alert(1)",
    "data:text/html,bad",
    "http://example.invalid",
    "/relative",
    "https://user:password@example.invalid",
  ])
    expect(externalUrlSchema.safeParse(url).success).toBe(false);
  expect(
    externalUrlSchema.safeParse("https://aptechmetrostargate.com:190/").success,
  ).toBe(true);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), githubUrl: "javascript:alert(1)" }] },
      local,
    ),
  ).toThrow(/Invalid/);
  expect(() =>
    adaptSanityContent(
      { profile: { _id: "profile", contactEmail: "not-an-email" } },
      local,
    ),
  ).toThrow(/Invalid/);
});

test("missing images normalize safely and genuine asset dimensions/alt are required", () => {
  const content = adaptSanityContent(
    {
      projects: [
        {
          ...existing(),
          screenshots: [{ src: null, alt: null, width: null, height: null }],
        },
      ],
    },
    local,
  );
  expect(content.projects[0]?.screenshots).toBeUndefined();
  const image = {
    src: "https://cdn.sanity.io/images/test1234/production/fixture-800x600.png",
    alt: "Test-only asset metadata",
    width: 800,
    height: 600,
    caption: "Fixture; not portfolio evidence",
  };
  expect(() =>
    adaptSanityContent(
      {
        projects: [
          {
            ...existing(),
            screenshots: [{ ...image, src: "malformed-image-address" }],
          },
        ],
      },
      local,
    ),
  ).toThrow(/Invalid published/);
  const withImage = adaptSanityContent(
    { projects: [{ ...existing(), screenshots: [image] }] },
    local,
  );
  expect(withImage.projects[0]?.screenshots?.[0]).toEqual(image);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), screenshots: [{ ...image, alt: "" }] }] },
      local,
    ),
  ).toThrow(/Invalid/);
  expect(() =>
    adaptSanityContent(
      { projects: [{ ...existing(), screenshots: [{ ...image, width: 0 }] }] },
      local,
    ),
  ).toThrow(/Invalid/);
});

test("new published projects generate valid identities, and visibility/order are respected", () => {
  const content = adaptSanityContent(
    {
      projects: [
        {
          _id: "project-fixture",
          slug: "fixture-project",
          title: "Test fixture only",
          description: "Not shipped as portfolio content",
          status: "in-progress",
          collaboration: "solo",
          technologies: ["React"],
          featured: false,
          displayOrder: 20,
          caseStudy: {
            overview: "Fixture overview",
            functionality: { kind: "development", items: ["Fixture area"] },
          },
        },
      ],
      skills: [
        {
          _id: "skill-hidden",
          category: "Tools",
          name: "Fixture",
          visible: false,
        },
      ],
    },
    local,
  );
  expect(content.projects.map(({ slug }) => ({ slug }))).toContainEqual({
    slug: "fixture-project",
  });
  expect(
    content.projects.filter((project) => project.featured !== false),
  ).toHaveLength(4);
  expect(content.skills).toEqual([]);
  expect(() =>
    adaptSanityContent(
      { projects: [{ _id: "project-incomplete", slug: "incomplete" }] },
      local,
    ),
  ).toThrow(/require/);
});
