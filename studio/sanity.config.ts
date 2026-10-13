import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { studioEnvironment } from "./environment";
import { schemaTypes } from "./schemaTypes";
import { structure } from "./structure";

const singletons = new Set(["profile", "homepage"]);
export default defineConfig({
  name: "portfolio",
  title: "Sohail · Portfolio Studio",
  ...studioEnvironment(),
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter((template) => !singletons.has(template.schemaType)),
  },
  document: {
    newDocumentOptions: (options) =>
      options.filter((option) => !singletons.has(option.templateId)),
    actions: (actions, context) =>
      singletons.has(context.schemaType)
        ? actions.filter(
            (action) =>
              !["delete", "duplicate", "unpublish"].includes(
                action.action ?? "",
              ),
          )
        : actions,
  },
});
