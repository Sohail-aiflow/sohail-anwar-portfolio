import { getPortfolioContent } from "@/lib/content/repository";
import type { Project } from "@/types/project";

export async function getProjects(): Promise<readonly Project[]> {
  return (await getPortfolioContent()).projects;
}
export async function getProjectBySlug(
  slug: string,
): Promise<Project | undefined> {
  return (await getProjects()).find((project) => project.slug === slug);
}
export async function getProjectStaticParams(): Promise<{ slug: string }[]> {
  return (await getProjects()).map(({ slug }) => ({ slug }));
}
