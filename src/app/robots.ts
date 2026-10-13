import type { MetadataRoute } from "next";
import { getSiteOrigin, isSiteIndexable } from "@/lib/seo";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin();
  return {
    rules: {
      userAgent: "*",
      ...(isSiteIndexable() ? { allow: "/" } : { disallow: "/" }),
    },
    ...(origin ? { sitemap: `${origin}/sitemap.xml` } : {}),
  };
}
