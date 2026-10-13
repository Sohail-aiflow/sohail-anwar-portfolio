import { defineType, defineField } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  fields: [
    ...["institution", "program", "status"].map((name) =>
      defineField({
        name,
        title: name.charAt(0).toUpperCase() + name.slice(1),
        type: "string",
        validation: (Rule) => Rule.required(),
      }),
    ),
    defineField({
      name: "startDate",
      title: "Start date (optional)",
      type: "date",
      description: "Leave blank until confirmed.",
    }),
    defineField({
      name: "endDate",
      title: "End date (optional)",
      type: "date",
      description: "Do not invent a graduation date.",
      validation: (Rule) =>
        Rule.custom((value, context) =>
          !value ||
          !context.document?.startDate ||
          value >= String(context.document.startDate)
            ? true
            : "End date must not precede start date.",
        ),
    }),
    defineField({
      name: "description",
      title: "Description (optional)",
      type: "text",
    }),
    defineField({
      name: "displayOrder",
      title: "Display order",
      type: "number",
      validation: (Rule) => Rule.integer(),
    }),
  ],
  preview: { select: { title: "institution", subtitle: "program" } },
});
