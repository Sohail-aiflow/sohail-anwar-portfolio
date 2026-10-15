"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectPreview } from "./project-preview";
import type { Project } from "@/types/project";
import { projectStatusLabels } from "@/lib/project-labels";
import type { CSSProperties } from "react";

function projectContext(project: Project) {
  if (project.collaboration === "team")
    return `${project.teamSize ? `${project.teamSize}-member team · ` : "Team project · "}${project.role ?? ""}`;
  if (project.collaboration === "solo")
    return project.role ?? "Independent development";
  return project.technologies.join(" · ");
}

export function SelectedWork({
  projects,
  heading,
  description,
}: {
  projects: readonly Project[];
  heading: string;
  description: string;
}) {
  const [selected, setSelected] = useState(projects[0]?.id);
  return (
    <section
      id="work"
      className="homepage-section work-section section-target"
      tabIndex={-1}
      aria-labelledby="work-title"
    >
      <div className="section-topline">
        <SectionHeading
          id="work-title"
          eyebrow="Selected work"
          title={heading}
          description={description}
          descriptionClassName="editorial-strip"
        />
        <p className="section-side-note">
          Independent & collaborative
          <br />
          software projects
        </p>
      </div>
      <fieldset className="project-selector">
        <legend className="sr-only">Choose a project to preview</legend>
        <p className="selection-hint">
          Choose a project to explore its details and abstract concept.
        </p>
        <div
          className={`work-grid${projects.length ? "" : " work-grid-empty"}`}
          style={
            { "--project-count": Math.max(1, projects.length) } as CSSProperties
          }
        >
          {projects.map((project, index) => (
            <article key={project.id} className="project-entry">
              <input
                className="project-radio"
                type="radio"
                name="selected-project"
                id={`select-${project.id}`}
                checked={selected === project.id}
                onChange={() => setSelected(project.id)}
                onFocus={() => setSelected(project.id)}
                aria-labelledby={`project-title-${project.id}`}
                aria-describedby={`project-context-${project.id} project-status-${project.id}`}
                aria-controls={`preview-${project.id}`}
              />
              <label
                className="project-choice"
                htmlFor={`select-${project.id}`}
                style={{ gridRow: index + 1 }}
                onPointerMove={(event) => {
                  // Scrolling under a stationary pointer must not change the
                  // selected panel while its case-study link is being activated.
                  if (event.pointerType === "mouse") setSelected(project.id);
                }}
              >
                <span className="project-choice-top">
                  <span
                    id={`project-status-${project.id}`}
                    className={`project-status status-${project.status}`}
                  >
                    {projectStatusLabels[project.status]}
                  </span>
                  <ArrowUpRight size={18} aria-hidden="true" />
                </span>
                <span
                  className="project-title"
                  id={`project-title-${project.id}`}
                >
                  {project.title}
                </span>
                <span
                  className="project-context"
                  id={`project-context-${project.id}`}
                >
                  {projectContext(project)}
                </span>
              </label>
              <ProjectPreview project={project} />
            </article>
          ))}
          {!projects.length && <p>No projects are currently featured.</p>}
        </div>
      </fieldset>
    </section>
  );
}
