import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArtwork } from "@/components/projects/project-artwork";
import { LinkButton } from "@/components/ui/link-button";
import type { Project } from "@/types/project";

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <div
      id={`preview-${project.id}`}
      className="project-preview"
      aria-labelledby={`preview-title-${project.id}`}
    >
      <ProjectArtwork projectId={project.id} />
      <div className="preview-details">
        <h3 id={`preview-title-${project.id}`}>{project.title}</h3>
        <p>{project.description}</p>
        {project.technologies.length > 0 && (
          <ul className="technology-list" aria-label="Technology stack">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
        )}
        <div className="project-actions">
          <Link
            href={`/projects/${project.slug}/`}
            className="link-button"
            aria-label={`Read case study — ${project.title}`}
          >
            Read case study <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          {project.liveUrl && (
            <LinkButton
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live Demo — ${project.title}`}
            >
              Live Demo
            </LinkButton>
          )}
          {project.githubUrl && (
            <LinkButton
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`GitHub repository — ${project.title}`}
            >
              GitHub
            </LinkButton>
          )}
        </div>
        {project.liveUrl && project.liveUrlVerified === false && (
          <p className="preview-note">
            Provided project URL; public access has not been verified.
          </p>
        )}
        <p className="preview-note">
          Artwork is conceptual. Project screenshots are pending.
        </p>
      </div>
    </div>
  );
}
