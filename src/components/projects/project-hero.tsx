import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/types/project";
import { projectStatusLabels } from "@/lib/project-labels";

export function ProjectHero({ project }: { project: Project }) {
  return (
    <header className="case-hero">
      <Link href="/#work" className="case-back">
        <ArrowLeft size={16} aria-hidden="true" />
        Back to selected work
      </Link>
      <div className="case-hero-grid">
        <div>
          <p className="eyebrow">Project case study</p>
          <h1 id="project-title">{project.title}</h1>
          <p className="case-description">{project.description}</p>
        </div>
        <dl className="case-metadata glass-surface">
          <div>
            <dt>Status</dt>
            <dd className={`project-status status-${project.status}`}>
              {projectStatusLabels[project.status]}
            </dd>
          </div>
          <div>
            <dt>Project context</dt>
            <dd>
              {project.collaboration === "team"
                ? project.teamSize
                  ? `${project.teamSize}-member team, including me`
                  : "Team project"
                : project.collaboration === "solo"
                  ? "Independent project"
                  : "Collaboration details pending"}
            </dd>
          </div>
          <div>
            <dt>My role</dt>
            <dd>{project.role ?? "Role details awaiting confirmation"}</dd>
          </div>
        </dl>
      </div>
    </header>
  );
}
