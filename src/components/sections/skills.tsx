import {
  Code2,
  Server,
  Database,
  PenTool,
  Wrench,
  UsersRound,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { IconTreatment } from "@/components/ui/icon-treatment";
import type {
  EducationRecord,
  HomepageContent,
  SkillGroup,
} from "@/types/portfolio";
import type { Project } from "@/types/project";
import { Education } from "./education";

const icons = {
  frontend: Code2,
  backend: Server,
  database: Database,
  design: PenTool,
  tools: Wrench,
  management: UsersRound,
};

export function Skills({
  collaborativeProject,
  skillGroups,
  education,
  homepage,
}: {
  collaborativeProject?: Project;
  skillGroups: readonly SkillGroup[];
  education: readonly EducationRecord[];
  homepage: HomepageContent;
}) {
  return (
    <section
      id="skills"
      className="homepage-section skills-section section-target"
      tabIndex={-1}
      aria-labelledby="skills-title"
    >
      <div className="section-topline">
        <SectionHeading
          id="skills-title"
          eyebrow="Skills & experience"
          title={homepage.skillsTitle}
          description={homepage.skillsDescription}
        />
        <p className="section-side-note">
          Exposure & practice.
          <br />
          Always room to grow.
        </p>
      </div>
      <div className="skill-groups">
        {skillGroups.map(({ title, icon, items }) => {
          const Icon = icons[icon];
          return (
            <div key={title} className="skill-group">
              <IconTreatment>
                <Icon size={20} aria-hidden="true" />
              </IconTreatment>
              <div>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
      {collaborativeProject && (
        <div className="experience-note glass-surface">
          <div>
            <p className="eyebrow">Project-based experience</p>
            <h3>{collaborativeProject.title}</h3>
          </div>
          <div>
            <p className="experience-role">{collaborativeProject.role}</p>
            <p className="experience-context">
              {collaborativeProject.teamSize}-member team ·{" "}
              {collaborativeProject.status === "live"
                ? "Live project"
                : "Team project"}
            </p>
            <p>
              Contributing to backend development and project coordination
              alongside my teammates.
            </p>
          </div>
        </div>
      )}
      <Education records={education} />
    </section>
  );
}
