import type { Project, ProjectScreenshot } from "./project";

export type SkillIcon =
  "frontend" | "backend" | "database" | "design" | "tools" | "management";
export interface SkillGroup {
  title: string;
  icon: SkillIcon;
  items: readonly string[];
}
export interface EducationRecord {
  institution: string;
  program: string;
  status: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}
export interface PortfolioProfile {
  name: string;
  headline: string;
  shortIntroduction: string;
  about: readonly string[];
  aboutIntroduction?: string;
  portrait?: ProjectScreenshot;
  location?: string;
  resumeUrl?: string;
  contacts: readonly { label: string; href: string }[];
}
export interface HomepageContent {
  heroHeadline: string;
  heroEmphasis: string;
  heroSupportingText: string;
  workTitle: string;
  workDescription: string;
  aboutTitle: string;
  skillsTitle: string;
  skillsDescription: string;
  connectHeadline: string;
  connectEmphasis: string;
  connectMessage: string;
}
export interface PortfolioContent {
  profile: PortfolioProfile;
  homepage: HomepageContent;
  education: readonly EducationRecord[];
  skills: readonly SkillGroup[];
  projects: readonly Project[];
  source: "local" | "sanity";
  warnings: readonly string[];
}
