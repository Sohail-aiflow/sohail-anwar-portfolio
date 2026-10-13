import { profile, skillGroups } from "@/content/profile";
import { homepage } from "@/content/homepage";
import { projects } from "@/data/projects";
import { siteIdentity } from "@/data/site";
import type { PortfolioContent } from "@/types/portfolio";

export function getLocalContent(): PortfolioContent {
  return {
    source: "local",
    warnings: [],
    projects,
    skills: skillGroups,
    education: [profile.education],
    homepage,
    profile: {
      name: siteIdentity.name,
      headline: siteIdentity.discipline,
      shortIntroduction: `I’m studying ${profile.education.program}, bringing development, design, and a collaborative mindset to the applications I build.`,
      about: profile.about,
      contacts: profile.contacts,
      ...(profile.portrait ? { portrait: profile.portrait } : {}),
    },
  };
}
