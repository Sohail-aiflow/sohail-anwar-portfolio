import type { ReactNode } from "react";

export function CaseStudySection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="case-section" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <div className="case-section-content">{children}</div>
    </section>
  );
}
