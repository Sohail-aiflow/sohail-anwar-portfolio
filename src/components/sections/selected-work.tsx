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

  function selectProject(projectId: string, focusDetails = false) {
    setSelected(projectId);
    if (!window.matchMedia("(max-width: 767px)").matches) return;

    // Wait for the checked radio's panel to become visible. Also reveal an
    // already selected project when its label is deliberately activated again.
    requestAnimationFrame(() => {
      const details = document
        .getElementById(`preview-${projectId}`)
        ?.querySelector<HTMLElement>(".preview-details");
      if (!details?.getClientRects().length) return;
      if (focusDetails)
        details
          .querySelector<HTMLElement>("h3")
          ?.focus({ preventScroll: true });
      details.scrollIntoView({
        block: "start",
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
    });
  }

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
          Choose a project to explore its details and case study.
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
                onKeyDown={(event) => {
                  const direction =
                    event.key === "ArrowDown" || event.key === "ArrowRight"
                      ? 1
                      : event.key === "ArrowUp" || event.key === "ArrowLeft"
                        ? -1
                        : 0;
                  if (
                    direction &&
                    !event.altKey &&
                    !event.ctrlKey &&
                    !event.metaKey &&
                    !event.shiftKey
                  ) {
                    // Native radio navigation scrolls our visually hidden inputs
                    // into view. Keep native group order/wrapping, but control focus.
                    event.preventDefault();
                    const next =
                      projects[
                        (index + direction + projects.length) % projects.length
                      ];
                    if (next) {
                      document
                        .getElementById(`select-${next.id}`)
                        ?.focus({ preventScroll: true });
                      setSelected(next.id);
                    }
                    return;
                  }
                  if (
                    (event.key === " " || event.key === "Enter") &&
                    window.matchMedia("(max-width: 767px)").matches
                  ) {
                    event.preventDefault();
                    selectProject(project.id, true);
                  }
                }}
                aria-labelledby={`project-title-${project.id}`}
                aria-describedby={`project-context-${project.id} project-status-${project.id}`}
                aria-controls={`preview-${project.id}`}
              />
              <label
                className="project-choice"
                htmlFor={`select-${project.id}`}
                style={{ gridRow: index + 1 }}
                onClick={(event) => {
                  // Avoid the label's implicit focus-scroll to its clipped radio.
                  // Preserve keyboard focus and the intentional mobile reveal.
                  event.preventDefault();
                  event.currentTarget.control?.focus({ preventScroll: true });
                  selectProject(project.id);
                }}
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
