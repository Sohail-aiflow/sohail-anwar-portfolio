/* eslint-disable @next/next/no-img-element -- Sanity images use native srcset and CDN transforms; no Next.js optimization server exists on static hosting. */
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
  variant = "preview",
}: {
  image: ProjectScreenshot;
  sizes: string;
  className?: string;
  variant?: "preview" | "thumbnail" | "full";
}) {
  if (!isSanityImage(image.src))
    return (
      <img
        src={
          variant === "thumbnail"
            ? (image.thumbnailSrc ?? image.src)
            : variant === "preview"
              ? (image.previewSrc ?? image.src)
              : image.src
        }
        srcSet={variant === "preview" ? image.srcSet : undefined}
        alt={image.alt}
        width={image.width}
        height={image.height}
        sizes={sizes}
        className={className}
        loading="lazy"
        decoding="async"
      />
    );
  return (
    <img
      src={sanityImageUrl(
        image.src,
        variant === "thumbnail" ? 240 : image.width,
        variant === "full" ? 2560 : 1600,
      )}
      srcSet={
        variant === "thumbnail"
          ? undefined
          : sanityImageSrcSet(
              image.src,
              image.width,
              variant === "full" ? 2560 : 1600,
            )
      }
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
