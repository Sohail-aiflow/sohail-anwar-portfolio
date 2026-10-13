import type { Metadata } from "next";

export function getSiteOrigin(
  env: Record<string, string | undefined> = process.env,
): string | undefined {
  const value = env.SITE_URL?.trim();
  if (!value) return undefined;
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.port ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    !url.hostname.includes(".") ||
    /(^|\.)localhost$|\.(local|internal)$|^\d+\.\d+\.\d+\.\d+$/.test(
      url.hostname,
    )
  )
    throw new Error(
      "SITE_URL must be the chosen public HTTPS origin, without credentials, port, path, query, or fragment.",
    );
  return url.origin;
}

export function isSiteIndexable(
  env: Record<string, string | undefined> = process.env,
): boolean {
  if (env.SITE_INDEXABLE && !["true", "false"].includes(env.SITE_INDEXABLE))
    throw new Error("SITE_INDEXABLE must be true or false.");
  if (env.SITE_INDEXABLE === "true" && !getSiteOrigin(env))
    throw new Error("Set SITE_URL before enabling indexing.");
  return Boolean(getSiteOrigin(env)) && env.SITE_INDEXABLE === "true";
}

const originalSlugs = new Set([
  "marketlink-team",
  "marketlink-solo",
  "car-rental-system",
  "school-website-cms",
]);
export function socialImagePath(slug?: string): string {
  return `/social/${slug && originalSlugs.has(slug) ? slug : "portfolio"}.png`;
}

export function pageMetadata({
  title,
  description,
  path,
  name,
  slug,
}: {
  title: string;
  description: string;
  path: string;
  name: string;
  slug?: string;
}): Metadata {
  const origin = getSiteOrigin();
  const index = isSiteIndexable();
  const url = origin ? new URL(path, origin).href : undefined;
  const images = origin
    ? [
        {
          url: new URL(socialImagePath(slug), origin).href,
          width: 1200,
          height: 630,
          alt: `${title} — editorial portfolio preview`,
        },
      ]
    : undefined;
  return {
    title,
    description,
    ...(origin
      ? { metadataBase: new URL(origin), alternates: { canonical: url } }
      : {}),
    robots: { index, follow: index },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: `${name} · Portfolio`,
      locale: "en_US",
      ...(url ? { url } : {}),
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images: images.map((image) => image.url) } : {}),
    },
  };
}

export function serializeStructuredData(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
