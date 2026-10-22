import { z } from "zod";
import type { PortfolioContent, SkillGroup } from "@/types/portfolio";
import type { Project } from "@/types/project";

const text = z.string().trim().min(1);
const publishedId = text.refine(
  (value) => !value.startsWith("drafts.") && !value.startsWith("versions."),
);
const optionalText = z.preprocess(
  (value) =>
    value === null ||
    value === "" ||
    (typeof value === "string" && !value.trim())
      ? undefined
      : value,
  text.optional(),
);
const list = z
  .array(text)
  .nullish()
  .transform((value) => (value?.length ? value : undefined));
const optional = <T extends z.ZodType>(schema: T) =>
  schema.nullish().transform((value) => value ?? undefined);
export const slugSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(96);
export const externalUrlSchema = text.refine((value) => {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !/[\r\n]/.test(value)
    );
  } catch {
    return false;
  }
}, "Use an absolute HTTPS URL without credentials.");
const optionalUrl = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  externalUrlSchema.optional(),
);
const image = z.object({
  id: optionalText,
  label: optionalText,
  src: externalUrlSchema.refine((value) => {
    try {
      const url = new URL(value);
      return (
        url.hostname === "cdn.sanity.io" && url.pathname.startsWith("/images/")
      );
    } catch {
      return false;
    }
  }),
  alt: text.min(5),
  caption: optionalText,
  width: z.number().int().positive().max(50000),
  height: z.number().int().positive().max(50000),
});
const optionalImage = z.preprocess(
  (value) =>
    value === null ||
    (typeof value === "object" && value && "src" in value && !value.src)
      ? undefined
      : value,
  image.optional(),
);
const section = z.object({ heading: text, body: text });
const caseStudy = z.object({
  overview: optionalText,
  purpose: optionalText,
  responsibilities: list,
  contributionNote: optionalText,
  functionality: optional(
    z.object({
      kind: z.enum(["confirmed", "development"]),
      items: z.array(text).min(1),
      note: optionalText,
    }),
  ),
  technicalApproach: optional(z.array(section)),
  challenges: optional(z.array(section)),
  lessonsLearned: optional(z.array(section)),
  evidenceNote: optionalText,
  pending: optional(z.array(text)),
});
const project = z.object({
  _id: publishedId,
  slug: slugSchema,
  title: optionalText,
  description: optionalText,
  status: optional(z.enum(["live", "complete", "in-progress"])),
  collaboration: optional(z.enum(["team", "solo", "unconfirmed"])),
  role: optionalText,
  teamSize: optional(z.number().int().min(1)),
  technologies: list,
  liveUrl: optionalUrl,
  liveUrlVerified: optional(z.boolean()),
  githubUrl: optionalUrl,
  screenshots: optional(z.array(optionalImage)),
  featured: optional(z.boolean()),
  displayOrder: optional(z.number().int()),
  caseStudy: optional(caseStudy),
});
const profile = z.object({
  _id: z.literal("profile"),
  displayName: optionalText,
  professionalHeadline: optionalText,
  shortIntroduction: optionalText,
  aboutIntroduction: optionalText,
  about: list,
  location: optionalText,
  resumeUrl: optionalUrl,
  contactEmail: z.preprocess(
    (value) => (value === null || value === "" ? undefined : value),
    z.email().optional(),
  ),
  socialLinks: optional(
    z.array(z.object({ label: text, url: externalUrlSchema })),
  ),
  portrait: optionalImage,
});
const homepage = z.object({
  _id: z.literal("homepage"),
  heroHeadline: optionalText,
  heroEmphasis: optionalText,
  heroSupportingText: optionalText,
  workTitle: optionalText,
  workDescription: optionalText,
  aboutTitle: optionalText,
  skillsTitle: optionalText,
  skillsDescription: optionalText,
  connectHeadline: optionalText,
  connectEmphasis: optionalText,
  connectMessage: optionalText,
});
const skill = z.object({
  _id: publishedId,
  category: text,
  name: text,
  icon: optional(
    z.enum([
      "frontend",
      "backend",
      "database",
      "design",
      "tools",
      "management",
    ]),
  ),
  displayOrder: optional(z.number().int()),
  visible: optional(z.boolean()),
});
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (value) =>
      !Number.isNaN(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value,
  );
const education = z
  .object({
    _id: publishedId,
    institution: text,
    program: text,
    status: text,
    startDate: optional(date),
    endDate: optional(date),
    description: optionalText,
    displayOrder: optional(z.number().int()),
  })
  .refine(
    (value) =>
      !value.startDate || !value.endDate || value.endDate >= value.startDate,
  );
const payload = z.object({
  profile: profile.nullish(),
  homepage: homepage.nullish(),
  projects: z.array(project).nullish(),
  skills: z.array(skill).nullish(),
  education: z.array(education).nullish(),
});

function defined<T extends object>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined),
  ) as Partial<T>;
}

export function adaptSanityContent(
  input: unknown,
  local: PortfolioContent,
): PortfolioContent {
  const parsed = payload.safeParse(input);
  if (!parsed.success)
    throw new Error(
      `Invalid published CMS content at ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}.`,
    );
  const data = parsed.data;
  const warnings: string[] = [];
  const documents = data.projects ?? [];
  const slugs = new Set<string>();
  const ids = new Set<string>();
  const mapped: Project[] = documents.map((doc) => {
    if (slugs.has(doc.slug) || ids.has(doc._id))
      throw new Error(
        "Duplicate project slug or document ID in published CMS content.",
      );
    slugs.add(doc.slug);
    ids.add(doc._id);
    const identity = local.projects.find(
      (item) => `project-${item.id}` === doc._id,
    );
    if (identity && identity.slug !== doc.slug)
      throw new Error("A preserved project identity has a changed slug.");
    const base = local.projects.find((item) => item.slug === doc.slug);
    if (
      base &&
      ["marketlink-team", "marketlink-solo"].includes(base.id) &&
      doc.collaboration &&
      doc.collaboration !== base.collaboration
    )
      throw new Error(
        "MarketLink ownership must stay distinct between team and solo projects.",
      );
    if (base?.id === "marketlink-team" && doc.teamSize && doc.teamSize !== 3)
      throw new Error("The confirmed MarketLink team has three members.");
    const details = doc.caseStudy;
    const overview = details?.overview ?? base?.caseStudy?.overview;
    if (
      !base &&
      (!doc.title ||
        !doc.description ||
        !doc.status ||
        !doc.collaboration ||
        !overview)
    )
      throw new Error(
        "New CMS projects require title, summary, status, classification, and overview.",
      );
    if (
      base &&
      (!doc.title || !doc.description || !doc.status || !details?.overview)
    )
      warnings.push(
        `Incomplete project ${base.slug}: missing fields retain local facts.`,
      );
    const screenshots = doc.screenshots?.filter((item) => item !== undefined);
    return {
      ...base,
      ...defined({
        title: doc.title,
        description: doc.description,
        status: doc.status,
        collaboration: doc.collaboration,
        role: doc.role,
        teamSize: doc.teamSize,
        technologies: doc.technologies,
        liveUrl: doc.liveUrl,
        githubUrl: doc.githubUrl,
        liveUrlVerified: doc.liveUrlVerified,
        featured: doc.featured,
        displayOrder: doc.displayOrder,
      }),
      id: base?.id ?? doc._id,
      slug: doc.slug,
      title: doc.title ?? base!.title,
      description: doc.description ?? base!.description,
      status: doc.status ?? base!.status,
      collaboration: doc.collaboration ?? base!.collaboration,
      technologies: doc.technologies ?? base?.technologies ?? [],
      featured: doc.featured ?? base?.featured ?? Boolean(base),
      ...(doc.liveUrl
        ? {
            liveUrlVerified:
              doc.liveUrlVerified ?? base?.liveUrlVerified ?? false,
          }
        : {}),
      ...(screenshots?.length ? { screenshots } : {}),
      caseStudy: {
        ...base?.caseStudy,
        ...defined(details ?? {}),
        overview: overview!,
        pending: details?.pending ?? base?.caseStudy?.pending ?? [],
      },
    };
  });
  for (const project of local.projects)
    if (!slugs.has(project.slug)) {
      mapped.push(project);
      warnings.push(`Missing project ${project.slug}: retained local record.`);
    }
  mapped.sort(
    (a, b) =>
      (a.displayOrder ??
        local.projects.findIndex((item) => item.slug === a.slug)) -
      (b.displayOrder ??
        local.projects.findIndex((item) => item.slug === b.slug)),
  );
  if (!data.profile)
    warnings.push("Missing profile singleton: retained local profile.");
  else if (
    !data.profile.displayName ||
    !data.profile.professionalHeadline ||
    !data.profile.shortIntroduction ||
    !data.profile.about
  )
    warnings.push(
      "Incomplete profile singleton: missing fields retain local facts.",
    );
  if (!data.homepage)
    warnings.push("Missing homepage singleton: retained local homepage.");
  else if (
    Object.keys(local.homepage).some(
      (key) => !data.homepage?.[key as keyof typeof data.homepage],
    )
  )
    warnings.push(
      "Incomplete homepage singleton: missing fields retain local copy.",
    );
  const contacts = data.profile?.socialLinks?.map(({ label, url }) => ({
    label,
    href: url,
  })) ?? [...local.profile.contacts];
  if (data.profile?.contactEmail)
    contacts.unshift({
      label: "Email",
      href: `mailto:${data.profile.contactEmail}`,
    });
  const groups: SkillGroup[] = [];
  for (const item of [...(data.skills ?? [])].sort(
    (a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0),
  )) {
    if (item.visible === false) continue;
    let group = groups.find((group) => group.title === item.category);
    if (!group) {
      group = {
        title: item.category,
        icon:
          item.icon ??
          local.skills.find((group) => group.title === item.category)?.icon ??
          "tools",
        items: [],
      };
      groups.push(group);
    }
    if (group.items.includes(item.name))
      throw new Error("Duplicate skill in a CMS category.");
    group.items = [...group.items, item.name];
  }
  if (!data.skills?.length)
    warnings.push("Missing skills: retained local skill groups.");
  if (!data.education?.length)
    warnings.push("Missing education: retained local education.");
  return {
    source: "sanity",
    warnings,
    projects: mapped,
    profile: {
      ...local.profile,
      ...defined({
        name: data.profile?.displayName,
        headline: data.profile?.professionalHeadline,
        shortIntroduction: data.profile?.shortIntroduction,
        aboutIntroduction: data.profile?.aboutIntroduction,
        about: data.profile?.about,
        location: data.profile?.location,
        resumeUrl: data.profile?.resumeUrl,
        portrait: data.profile?.portrait,
      }),
      contacts,
    },
    homepage: {
      ...local.homepage,
      ...defined(
        data.homepage
          ? Object.fromEntries(
              Object.entries(data.homepage).filter(([key]) => key !== "_id"),
            )
          : {},
      ),
    },
    skills: data.skills?.length ? groups : local.skills,
    education: data.education?.length
      ? [...data.education]
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map(
            ({
              institution,
              program,
              status,
              startDate,
              endDate,
              description,
            }) => ({
              institution,
              program,
              status,
              startDate,
              endDate,
              description,
            }),
          )
      : local.education,
  };
}
