import { getSiteOrigin, serializeStructuredData } from "@/lib/seo";
import { PageContainer } from "@/components/layout/page-container";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { Connect } from "@/components/sections/connect";
import { getPortfolioContent } from "@/lib/content/repository";

export default async function Home() {
  const content = await getPortfolioContent();
  const origin = getSiteOrigin();
  return (
    <PageContainer>
      <main id="main" tabIndex={-1}>
        {origin && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: serializeStructuredData({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: `${content.profile.name} · Portfolio`,
                description: content.profile.shortIntroduction,
                url: `${origin}/`,
              }),
            }}
          />
        )}
        <Hero
          profile={content.profile}
          education={content.education[0]}
          homepage={content.homepage}
        />
        <SelectedWork
          projects={content.projects.filter(
            (project) => project.featured !== false,
          )}
          heading={content.homepage.workTitle}
          description={content.homepage.workDescription}
        />
        <About
          profile={content.profile}
          heading={content.homepage.aboutTitle}
        />
        <Skills
          collaborativeProject={content.projects.find(
            (project) => project.id === "marketlink-team",
          )}
          skillGroups={content.skills}
          education={content.education}
          homepage={content.homepage}
        />
        <Connect profile={content.profile} homepage={content.homepage} />
      </main>
      <SiteFooter name={content.profile.name} />
    </PageContainer>
  );
}
