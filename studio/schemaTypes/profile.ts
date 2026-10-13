import { defineType, defineField, defineArrayMember } from "sanity";
import { httpsField } from "./shared";

export const profile = defineType({
  name: "profile",
  title: "Personal profile",
  type: "document",
  groups: [
    { name: "identity", title: "Identity", default: true },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    defineField({
      name: "displayName",
      title: "Display name",
      type: "string",
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "professionalHeadline",
      title: "Professional headline",
      type: "string",
      group: "identity",
      description: "Keep your student/developer identity accurate.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortIntroduction",
      title: "Short introduction",
      type: "text",
      rows: 3,
      group: "identity",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "aboutIntroduction",
      title: "About introduction (optional)",
      type: "text",
      group: "about",
    }),
    defineField({
      name: "about",
      title: "About paragraphs",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          name: "paragraph",
          type: "object",
          fields: [
            defineField({
              name: "body",
              title: "Paragraph",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: { select: { title: "body" } },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: "portrait",
      title: "Real portrait (optional)",
      type: "portfolioImage",
      group: "about",
    }),
    defineField({
      name: "location",
      title: "Location display (optional)",
      type: "string",
      group: "identity",
    }),
    { ...httpsField("resumeUrl", "Resume link (optional)"), group: "contact" },
    defineField({
      name: "contactEmail",
      title: "Public contact email (optional)",
      type: "string",
      group: "contact",
      description:
        "This address will be public in the static website. Do not add private account details.",
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: "socialLinks",
      title: "Professional links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          name: "socialLink",
          type: "object",
          fields: [
            defineField({
              name: "label",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            {
              ...httpsField("url", "URL"),
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["https"],
                  allowRelative: false,
                }),
            },
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "displayName", subtitle: "professionalHeadline" },
  },
});
