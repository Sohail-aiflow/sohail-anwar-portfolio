export function isSanityImage(src: string): boolean {
  return src.startsWith("https://cdn.sanity.io/images/");
}
export function sanityImageUrl(
  src: string,
  width: number,
  maxWidth = 1600,
): string {
  const url = new URL(src);
  if (!isSanityImage(src))
    throw new Error("Expected a validated Sanity image asset.");
  url.searchParams.set("auto", "format");
  url.searchParams.set(
    "w",
    String(Math.max(1, Math.min(maxWidth, Math.round(width)))),
  );
  url.searchParams.set("fit", "max");
  return url.toString();
}
export function sanityImageSrcSet(
  src: string,
  width: number,
  maxWidth = 1600,
): string {
  return [
    ...new Set([
      320,
      480,
      768,
      1024,
      1600,
      maxWidth,
      Math.min(maxWidth, width),
    ]),
  ]
    .filter((size) => size <= width && size <= maxWidth)
    .sort((a, b) => a - b)
    .map((size) => `${sanityImageUrl(src, size, maxWidth)} ${size}w`)
    .join(", ");
}
