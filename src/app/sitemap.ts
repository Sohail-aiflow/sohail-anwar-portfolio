import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/seo";
import { getPortfolioContent } from "@/lib/content/repository";

export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = getSiteOrigin();
  if (!origin) return [];
  const { projects } = await getPortfolioContent();
  return ["/", ...projects.map((project) => `/projects/${project.slug}/`)].map(
    (path) => ({ url: new URL(path, origin).href }),
  );
}
