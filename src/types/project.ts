export type ProjectStatus = "live" | "complete" | "in-progress";

export interface ProjectScreenshot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface CaseStudySection {
  heading: string;
  body: string;
}

export interface ProjectCaseStudy {
  overview: string;
  purpose?: string;
  responsibilities?: readonly string[];
  contributionNote?: string;
  functionality?: {
    kind: "confirmed" | "development";
    items: readonly string[];
    note?: string;
  };
  technicalApproach?: readonly CaseStudySection[];
  challenges?: readonly CaseStudySection[];
  lessonsLearned?: readonly CaseStudySection[];
  evidenceNote?: string;
  pending: readonly string[];
}

export interface Project {
  readonly featured?: boolean;
  readonly displayOrder?: number;
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly status: ProjectStatus;
  readonly collaboration: "team" | "solo" | "unconfirmed";
  /** Omit until the owner confirms their role. */
  readonly role?: string;
  readonly teamSize?: number;
  /** An empty list means the stack has not been confirmed. */
  readonly technologies: readonly string[];
  readonly liveUrl?: string;
  readonly liveUrlVerified?: boolean;
  readonly githubUrl?: string;
  readonly screenshots?: readonly ProjectScreenshot[];
  readonly caseStudy?: ProjectCaseStudy;
}
