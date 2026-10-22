import type { Project } from "@/types/project";
import { LinkButton } from "@/components/ui/link-button";

export function ProjectLinks({ project }: { project: Project }) {
  if (!project.liveUrl && !project.githubUrl)
    return (
      <p className="case-muted">
        No public live-site or repository links have been supplied.
      </p>
    );
  return (
    <>
      <div className="project-actions">
        {project.liveUrl && (
          <LinkButton
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Live Demo — ${project.title} (opens in a new tab)`}
          >
            Live Demo
          </LinkButton>
        )}
        {project.githubUrl && (
          <LinkButton
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`GitHub repository — ${project.title} (opens in a new tab)`}
          >
            GitHub repository
          </LinkButton>
        )}
      </div>
      <p className="case-link-note">
        External links open in a new tab.
        {project.liveUrl &&
          project.liveUrlVerified === false &&
          " Public access to the supplied live URL has not been independently verified."}
      </p>
    </>
  );
}
