import type { Metadata } from "next";
import {
  pageMetadata,
  getSiteOrigin,
  serializeStructuredData,
} from "@/lib/seo";
import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectStaticParams,
  getProjects,
} from "@/lib/projects";
import { getPortfolioContent } from "@/lib/content/repository";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { ProjectHero } from "@/components/projects/project-hero";
import { ProjectArtwork } from "@/components/projects/project-artwork";
import { CaseStudySection } from "@/components/projects/case-study-section";
import { ProjectMedia } from "@/components/projects/project-media";
import { ProjectLinks } from "@/components/projects/project-links";
import { ProjectNavigation } from "@/components/projects/project-navigation";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}
export const dynamicParams = false;
export function generateStaticParams() {
  return getProjectStaticParams();
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const project = await getProjectBySlug((await params).slug);
  if (!project) return { title: "Project not found" };
  const { profile } = await getPortfolioContent();
  return pageMetadata({
    title: `${project.title} | ${profile.name}`,
    description: project.caseStudy?.overview ?? project.description,
    path: `/projects/${project.slug}/`,
    name: profile.name,
    slug: project.slug,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await getProjectBySlug((await params).slug);
  if (!project?.caseStudy) notFound();
  const content = project.caseStudy;
  const origin = getSiteOrigin();
  return (
    <PageContainer>
      <main
        id="main"
        className="case-study"
        tabIndex={-1}
        aria-labelledby="project-title"
      >
        {origin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeStructuredData({
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                name: project.title,
                description: project.description,
                url: `${origin}/projects/${project.slug}/`,
              }),
            }}
          />
        )}
        <ProjectHero project={project} />
        <ProjectArtwork projectId={project.id} className="case-artwork" />
        <p className="case-artwork-note">
          Concept artwork only. Genuine project screenshots are pending.
        </p>
        <CaseStudySection id="overview-title" title="The overview">
          <p>{content.overview}</p>
        </CaseStudySection>
        {content.purpose && (
          <CaseStudySection id="purpose-title" title="Purpose & scope">
            <p>{content.purpose}</p>
          </CaseStudySection>
        )}
        <CaseStudySection id="role-title" title="My contribution">
          {project.role ? (
            <>
              <p className="case-role">{project.role}</p>
              {content.responsibilities && (
                <ul>
                  {content.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {content.contributionNote && <p>{content.contributionNote}</p>}
            </>
          ) : (
            <p className="case-muted">
              My specific role and collaboration details are awaiting
              confirmation.
            </p>
          )}
        </CaseStudySection>
        {content.functionality && (
          <CaseStudySection
            id="functionality-title"
            title={
              content.functionality.kind === "confirmed"
                ? "Confirmed functionality"
                : "Development areas"
            }
          >
            <ul className="case-feature-list">
              {content.functionality.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {content.functionality.note && (
              <p className="case-muted">{content.functionality.note}</p>
            )}
          </CaseStudySection>
        )}
        <CaseStudySection id="technology-title" title="Technology stack">
          {project.technologies.length ? (
            <ul className="technology-list case-technologies">
              {project.technologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          ) : (
            <p className="case-muted">
              The technology stack is awaiting confirmation.
            </p>
          )}
        </CaseStudySection>
        {content.technicalApproach && content.technicalApproach.length > 0 && (
          <CaseStudySection id="approach-title" title="Technical approach">
            {content.technicalApproach.map(({ heading, body }) => (
              <div key={heading}>
                <h3>{heading}</h3>
                <p>{body}</p>
              </div>
            ))}
          </CaseStudySection>
        )}
        {content.challenges && content.challenges.length > 0 && (
          <CaseStudySection
            id="challenges-title"
            title="Challenges & decisions"
          >
            {content.challenges.map(({ heading, body }) => (
              <div key={heading}>
                <h3>{heading}</h3>
                <p>{body}</p>
              </div>
            ))}
          </CaseStudySection>
        )}
        <CaseStudySection id="evidence-title" title="Evidence & media">
          <ProjectMedia screenshots={project.screenshots} />
          {content.evidenceNote && <p>{content.evidenceNote}</p>}
        </CaseStudySection>
        <CaseStudySection id="links-title" title="Project links">
          <ProjectLinks project={project} />
        </CaseStudySection>
        {content.pending.length > 0 && (
          <CaseStudySection id="pending-title" title="Still to document">
            <p className="case-muted">
              These details remain open rather than being presented as verified
              facts.
            </p>
            <ul>
              {content.pending.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CaseStudySection>
        )}
        {content.lessonsLearned && content.lessonsLearned.length > 0 && (
          <CaseStudySection id="lessons-title" title="Lessons learned">
            {content.lessonsLearned.map(({ heading, body }) => (
              <div key={heading}>
                <h3>{heading}</h3>
                <p>{body}</p>
              </div>
            ))}
          </CaseStudySection>
        )}
        <ProjectNavigation current={project} projects={await getProjects()} />
      </main>
      <SiteFooter name={(await getPortfolioContent()).profile.name} />
    </PageContainer>
  );
}
