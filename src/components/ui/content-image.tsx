/* eslint-disable @next/next/no-img-element -- Sanity images use native srcset and CDN transforms; no Next.js optimization server exists on static hosting. */
import Image from "next/image";
import type { ProjectScreenshot } from "@/types/project";
import {
  isSanityImage,
  sanityImageUrl,
  sanityImageSrcSet,
} from "@/lib/content/images";

export function ContentImage({
  image,
  sizes,
  className,
}: {
  image: ProjectScreenshot;
  sizes: string;
  className?: string;
}) {
  if (!isSanityImage(image.src))
    return (
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className={className}
      />
    );
  return (
    <img
      src={sanityImageUrl(image.src, image.width)}
      srcSet={sanityImageSrcSet(image.src, image.width)}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className={className}
    />
  );
}
