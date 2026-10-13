export function isSanityImage(src: string): boolean {
  return src.startsWith("https://cdn.sanity.io/images/");
}
export function sanityImageUrl(src: string, width: number): string {
  const url = new URL(src);
  if (!isSanityImage(src))
    throw new Error("Expected a validated Sanity image asset.");
  url.searchParams.set("auto", "format");
  url.searchParams.set(
    "w",
    String(Math.max(1, Math.min(1600, Math.round(width)))),
  );
  url.searchParams.set("fit", "max");
  return url.toString();
}
export function sanityImageSrcSet(src: string, width: number): string {
  return [...new Set([320, 480, 768, 1024, 1600, Math.min(1600, width)])]
    .filter((size) => size <= width)
    .sort((a, b) => a - b)
    .map((size) => `${sanityImageUrl(src, size)} ${size}w`)
    .join(", ");
}
