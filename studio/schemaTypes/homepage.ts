import { defineType, defineField } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "Homepage copy",
  type: "document",
  fields: [
    ...[
      "heroHeadline",
      "heroEmphasis",
      "heroSupportingText",
      "workTitle",
      "workDescription",
      "aboutTitle",
      "skillsTitle",
      "skillsDescription",
      "connectHeadline",
      "connectEmphasis",
      "connectMessage",
    ].map((name) =>
      defineField({
        name,
        title: name
          .replace(/([A-Z])/g, " $1")
          .replace(/^./, (letter) => letter.toUpperCase()),
        type:
          name.includes("Headline") ||
          name.includes("Text") ||
          name.includes("Description") ||
          name.includes("Message")
            ? "text"
            : "string",
        description: name.endsWith("Headline")
          ? "A newline creates an editorial line break. Emphasis text follows this headline."
          : "Plain text only. Navigation structure and behavior remain in code.",
        validation: (Rule) => Rule.required(),
      }),
    ),
  ],
  preview: { prepare: () => ({ title: "Homepage copy" }) },
});
