import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/types/project";

export function ProjectNavigation({
  current,
  projects,
}: {
  current: Project;
  projects: readonly Project[];
}) {
  return (
    <nav className="project-navigation" aria-label="Other projects">
      <h2>More to explore.</h2>
      <ul>
        {projects
          .filter((project) => project.id !== current.id)
          .map((project) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}/`}>
                <span>{project.title}</span>
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </li>
          ))}
      </ul>
      <Link className="case-back" href="/#work">
        All selected work
      </Link>
    </nav>
  );
}
