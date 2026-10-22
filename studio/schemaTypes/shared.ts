import { defineType, defineField, defineArrayMember } from "sanity";

export const portfolioImage = defineType({
  name: "portfolioImage",
  title: "Genuine image",
  type: "image",
  options: { hotspot: true },
  description:
    "Upload real project evidence or a real portrait. Do not use illustrative mockups as screenshots.",
  fields: [
    defineField({
      name: "label",
      title: "Short gallery label (optional)",
      type: "string",
      description:
        "A short screen name for thumbnail navigation, such as Rentals or Admin dashboard.",
    }),
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description:
        "Describe the meaningful content of the image for visitors who cannot see it.",
      validation: (Rule) => Rule.required().min(5),
    }),
    defineField({
      name: "caption",
      type: "text",
      rows: 2,
      title: "Caption (optional)",
    }),
  ],
});

export const textSections = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    description:
      "Optional. Include only details you can verify; reorder entries by dragging.",
    of: [
      defineArrayMember({
        name: "textSection",
        type: "object",
        fields: [
          defineField({
            name: "heading",
            type: "string",
            validation: (Rule) => Rule.required(),
          }),
          defineField({
            name: "body",
            type: "text",
            rows: 4,
            validation: (Rule) => Rule.required(),
          }),
        ],
        preview: { select: { title: "heading" } },
      }),
    ],
  });

export const httpsField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "url",
    description: "Optional verified HTTPS URL. Leave blank if unavailable.",
    validation: (Rule) => Rule.uri({ scheme: ["https"], allowRelative: false }),
  });
export const stringList = (name: string, title: string, description?: string) =>
  defineField({
    name,
    title,
    description,
    type: "array",
    of: [defineArrayMember({ type: "string" })],
    validation: (Rule) => Rule.unique(),
  });
