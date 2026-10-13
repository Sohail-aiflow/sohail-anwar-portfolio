import { ContentImage } from "@/components/ui/content-image";
import { ImageIcon } from "lucide-react";
import type { ProjectScreenshot } from "@/types/project";

export function ProjectMedia({
  screenshots,
}: {
  screenshots?: readonly ProjectScreenshot[];
}) {
  if (!screenshots?.length)
    return (
      <div className="media-pending">
        <ImageIcon size={28} strokeWidth={1.25} aria-hidden="true" />
        <div>
          <p className="media-pending-title">Project screenshots pending</p>
          <p>
            Genuine screenshots and captions will be added when available. The
            concept artwork above is not application evidence.
          </p>
        </div>
      </div>
    );
  return (
    <div className="project-gallery">
      {screenshots.map((screenshot) => (
        <figure key={screenshot.src}>
          <ContentImage
            image={screenshot}
            sizes="(max-width: 767px) 100vw, 75vw"
            className="evidence-image"
          />
          {screenshot.caption && <figcaption>{screenshot.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}
