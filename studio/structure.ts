import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio content")
    .items([
      S.listItem()
        .id("profile")
        .title("Personal profile")
        .child(S.document().schemaType("profile").documentId("profile")),
      S.listItem()
        .id("homepage")
        .title("Homepage copy")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.divider(),
      S.listItem()
        .title("Projects & case studies")
        .child(
          S.documentTypeList("project")
            .title("Projects")
            .filter(
              '_type == "project" && (!(_id match "*.*") || _id in path("drafts.*"))',
            )
            .defaultOrdering([{ field: "displayOrder", direction: "asc" }]),
        ),
      S.listItem()
        .title("Skills & exposure")
        .child(
          S.documentTypeList("skill").filter(
            '_type == "skill" && (!(_id match "*.*") || _id in path("drafts.*"))',
          ),
        ),
      S.listItem()
        .title("Education")
        .child(
          S.documentTypeList("education").filter(
            '_type == "education" && (!(_id match "*.*") || _id in path("drafts.*"))',
          ),
        ),
    ]);
