import { ProjectGallery } from "./project-gallery";
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
          <p className="media-pending-title">
            Application screenshots are not yet available.
          </p>
          <p>The concept artwork is illustrative, not application evidence.</p>
        </div>
      </div>
    );
  return <ProjectGallery screenshots={screenshots} />;
}
