import { defineType, defineField } from "sanity";

export const skill = defineType({
  name: "skill",
  title: "Skill / exposure",
  type: "document",
  fields: [
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      description: "Use a consistent category name to group related skills.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "name",
      title: "Skill name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "icon",
      title: "Category icon (optional)",
      type: "string",
      options: {
        list: [
          "frontend",
          "backend",
          "database",
          "design",
          "tools",
          "management",
        ],
      },
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      validation: (Rule) => Rule.integer(),
    }),
    defineField({
      name: "visible",
      title: "Visible",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: { select: { title: "name", subtitle: "category" } },
});
