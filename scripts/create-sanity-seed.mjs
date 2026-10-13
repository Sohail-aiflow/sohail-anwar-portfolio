import { writeFile } from "node:fs/promises";
import { profile, skillGroups } from "../src/content/profile.ts";
import { homepage } from "../src/content/homepage.ts";
import { projects } from "../src/data/projects.ts";
import { siteIdentity } from "../src/data/site.ts";

// Generates a local import file only; never connects to or writes to Sanity.
const documents = [
  {
    _id: "profile",
    _type: "profile",
    displayName: siteIdentity.name,
    professionalHeadline: siteIdentity.discipline,
    shortIntroduction: `I’m studying ${profile.education.program}, bringing development, design, and a collaborative mindset to the applications I build.`,
    about: profile.about.map((body, index) => ({
      _type: "paragraph",
      _key: `paragraph-${index}`,
      body,
    })),
    contactEmail: profile.contacts
      .find(({ href }) => href.startsWith("mailto:"))
      ?.href.slice(7),
    socialLinks: profile.contacts
      .filter(({ href }) => href.startsWith("https:"))
      .map(({ label, href }, index) => ({
        _type: "socialLink",
        _key: `social-${index}`,
        label,
        url: href,
      })),
  },
  { _id: "homepage", _type: "homepage", ...homepage },
  {
    _id: "education-aptech",
    _type: "education",
    ...profile.education,
    displayOrder: 0,
  },
  ...projects.map(({ id, ...project }, index) => ({
    ...project,
    _id: `project-${id}`,
    _type: "project",
    slug: { _type: "slug", current: project.slug },
    featured: true,
    displayOrder: index,
    caseStudy: {
      _type: "caseStudy",
      ...project.caseStudy,
      ...(project.caseStudy.functionality
        ? {
            functionality: {
              _type: "functionality",
              ...project.caseStudy.functionality,
            },
          }
        : {}),
    },
  })),
  ...skillGroups.flatMap((group, groupIndex) =>
    group.items.map((name, index) => ({
      _id: `skill-${group.icon}-${index}`,
      _type: "skill",
      name,
      category: group.title,
      icon: group.icon,
      displayOrder: groupIndex * 100 + index,
      visible: true,
    })),
  ),
];

await writeFile(
  new URL("../studio/seed.ndjson", import.meta.url),
  documents.map((document) => JSON.stringify(document)).join("\n") + "\n",
  "utf8",
);
console.log(
  `Created studio/seed.ndjson with ${documents.length} factual starter documents. No remote writes performed.`,
);
