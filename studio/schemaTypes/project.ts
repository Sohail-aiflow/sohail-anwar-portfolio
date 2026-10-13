import { defineType, defineField, defineArrayMember } from "sanity";
import { httpsField, stringList, textSections } from "./shared";

const preserved = new Set([
  "project-marketlink-team",
  "project-car-rental-system",
  "project-school-website-cms",
  "project-marketlink-solo",
]);
export const project = defineType({
  name: "project",
  title: "Project & case study",
  type: "document",
  groups: [
    { name: "summary", title: "Summary", default: true },
    { name: "story", title: "Case study" },
    { name: "evidence", title: "Media & links" },
    { name: "display", title: "Display" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "summary",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "summary",
      description:
        "Stable URL. The four original project slugs must not be changed.",
      options: {
        source: "title",
        maxLength: 96,
        // Archived dotted originals must not make canonical slugs appear duplicated.
        isUnique: async (slug, context) => {
          const id = String(context.document?._id).replace(/^drafts\./, "");
          return context
            .getClient({ apiVersion: "2026-10-13" })
            .fetch<boolean>(
              '!defined(*[_type == "project" && (!(_id match "*.*") || _id in path("drafts.*")) && !(_id in [$id, $draftId]) && slug.current == $slug][0]._id)',
              { id, draftId: `drafts.${id}`, slug },
              { perspective: "raw" },
            );
        },
      },
      readOnly: ({ document }) =>
        preserved.has(String(document?._id).replace(/^drafts\./, "")),
      validation: (Rule) =>
        Rule.required().custom((value) =>
          !value?.current || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : "Use lowercase letters, numbers, and single hyphens.",
        ),
    }),
    defineField({
      name: "description",
      title: "Short summary",
      type: "text",
      rows: 3,
      group: "summary",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      type: "string",
      group: "summary",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Complete", value: "complete" },
          { title: "In progress", value: "in-progress" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "collaboration",
      title: "Ownership / collaboration",
      type: "string",
      group: "summary",
      initialValue: "unconfirmed",
      options: {
        list: [
          { title: "Team project", value: "team" },
          { title: "Independent project", value: "solo" },
          { title: "Not yet confirmed", value: "unconfirmed" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "My role (optional)",
      type: "string",
      group: "summary",
      description: "Do not attribute all team contributions to yourself.",
    }),
    defineField({
      name: "teamSize",
      title: "Team size (optional)",
      type: "number",
      group: "summary",
      validation: (Rule) => Rule.integer().min(1),
    }),
    {
      ...stringList(
        "technologies",
        "Technology stack",
        "Include only confirmed technologies. Leave empty when unknown.",
      ),
      group: "summary",
    },
    defineField({
      name: "caseStudy",
      title: "Case study",
      type: "object",
      group: "story",
      fields: [
        defineField({
          name: "overview",
          title: "Detailed overview",
          type: "text",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "purpose",
          title: "Purpose / problem (optional)",
          type: "text",
        }),
        stringList(
          "responsibilities",
          "Contribution details",
          "Confirmed responsibilities only.",
        ),
        defineField({
          name: "contributionNote",
          title: "Contribution context (optional)",
          type: "text",
        }),
        defineField({
          name: "functionality",
          title: "Functionality (optional)",
          type: "object",
          fields: [
            defineField({
              name: "kind",
              title: "Evidence classification",
              type: "string",
              options: {
                list: [
                  { title: "Confirmed functionality", value: "confirmed" },
                  {
                    title: "Development areas (not necessarily complete)",
                    value: "development",
                  },
                ],
              },
              validation: (Rule) => Rule.required(),
            }),
            {
              ...stringList("items", "Features / development areas"),
              validation: (Rule) => Rule.required().min(1).unique(),
            },
            defineField({
              name: "note",
              title: "Progress note (optional)",
              type: "text",
            }),
          ],
        }),
        textSections("technicalApproach", "Technical decisions (optional)"),
        textSections("challenges", "Challenges (optional)"),
        textSections("lessonsLearned", "Lessons learned (optional)"),
        defineField({
          name: "evidenceNote",
          title: "Evidence / deployment context (optional)",
          type: "text",
        }),
        stringList("pending", "Details still awaiting documentation"),
      ],
      validation: (Rule) => Rule.required(),
    }),
    { ...httpsField("liveUrl", "Live URL (optional)"), group: "evidence" },
    defineField({
      name: "liveUrlVerified",
      title: "Public access independently verified",
      type: "boolean",
      initialValue: false,
      group: "evidence",
      description:
        "Leave off unless the supplied live URL has actually been verified.",
    }),
    {
      ...httpsField("githubUrl", "Repository URL (optional)"),
      group: "evidence",
    },
    defineField({
      name: "screenshots",
      title: "Genuine screenshot gallery",
      type: "array",
      of: [defineArrayMember({ type: "portfolioImage" })],
      group: "evidence",
      description:
        "Upload real screenshots, add alt text and optional captions, and drag to reorder.",
    }),
    defineField({
      name: "featured",
      title: "Show in Selected Work",
      type: "boolean",
      initialValue: false,
      group: "display",
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      initialValue: 100,
      group: "display",
      description:
        "Smaller numbers appear first. Gallery and section arrays can also be reordered by dragging.",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  orderings: [
    {
      title: "Display order",
      name: "displayOrder",
      by: [{ field: "displayOrder", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "status" } },
});
