import type { ReactNode } from "react";

type EditorialTreatment =
  "overview" | "purpose" | "approach" | "decisions" | "learnings" | "media";

const treatmentSurfaces: Partial<Record<EditorialTreatment, string>> = {
  overview: "editorial-panel editorial-panel-blue",
  approach: "editorial-panel editorial-panel-sage",
  learnings: "editorial-panel editorial-panel-lavender",
};

export function CaseStudySection({
  id,
  title,
  children,
  treatment,
}: {
  id: string;
  title: string;
  children: ReactNode;
  treatment?: EditorialTreatment;
}) {
  return (
    <section
      className={`case-section${treatment ? ` case-section-${treatment}` : ""}`}
      aria-labelledby={id}
    >
      <h2 id={id}>{title}</h2>
      <div
        className={`case-section-content${treatment && treatmentSurfaces[treatment] ? ` ${treatmentSurfaces[treatment]}` : ""}`}
      >
        {children}
      </div>
    </section>
  );
}
