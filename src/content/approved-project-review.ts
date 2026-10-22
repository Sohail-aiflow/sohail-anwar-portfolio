import { projects as approvedProjects } from "@/data/projects";
import { projectGalleries } from "@/data/project-galleries";
import type { PortfolioContent } from "@/types/portfolio";

/** Local owner-approved Phase 6I review. Published Sanity documents are never mutated.
 * Remove this factual overlay only after a separately approved CMS reconciliation.
 * Status, identity, links, and unreviewed CMS prose remain authoritative upstream.
 */
export function applyApprovedProjectReview(
  content: PortfolioContent,
): PortfolioContent {
  return {
    ...content,
    projects: content.projects.map((project) => {
      const approved = approvedProjects.find(
        (item) => item.id === project.id && item.slug === project.slug,
      );
      if (!approved || !project.caseStudy) return project;
      const team = project.id === "marketlink-team";
      return {
        ...project,
        role: approved.role,
        collaboration: approved.collaboration,
        technologies: team ? project.technologies : approved.technologies,
        ...(project.id === "car-rental-system"
          ? { description: approved.description }
          : {}),
        // A timestamped public browser capture supports this narrow accessibility fact.
        ...(team &&
        approved.id === "marketlink-team" &&
        project.liveUrl === approved.liveUrl
          ? { liveUrlVerified: true }
          : {}),
        screenshots: projectGalleries[project.slug] ?? project.screenshots,
        caseStudy: {
          ...project.caseStudy,
          responsibilities: approved.caseStudy.responsibilities,
          evidenceNote: approved.caseStudy.evidenceNote,
          ...(team
            ? {
                overview: approved.caseStudy.overview,
                functionality: approved.caseStudy.functionality,
              }
            : {}),
          pending: project.caseStudy.pending
            .filter(
              (item) => item !== "My specific role and collaboration context",
            )
            .map((item) =>
              item === "Screenshots and repository evidence"
                ? "Repository evidence"
                : team && item === "Project purpose and confirmed functionality"
                  ? "Additional functionality and backend implementation details"
                  : item,
            ),
        },
      };
    }),
  };
}
