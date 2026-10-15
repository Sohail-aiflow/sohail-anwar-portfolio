import { ContentImage } from "@/components/ui/content-image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { PortfolioProfile } from "@/types/portfolio";
import { LinkButton } from "@/components/ui/link-button";

export function About({
  profile,
  heading,
}: {
  profile: PortfolioProfile;
  heading: string;
}) {
  const introduction = profile.aboutIntroduction || profile.about[0];
  const paragraphs = profile.aboutIntroduction
    ? profile.about
    : profile.about.slice(1);
  return (
    <section
      id="about"
      className="homepage-section about-section section-target"
      tabIndex={-1}
      aria-labelledby="about-title"
    >
      <div className="about-heading">
        <SectionHeading id="about-title" eyebrow="About me" title={heading} />
        <p className="about-margin-note">
          From the first sketch
          <br />
          to the logic behind it.
          <ArrowUpRight size={20} aria-hidden="true" />
        </p>
        {profile.portrait && (
          <ContentImage
            className="portrait"
            image={profile.portrait}
            sizes="(max-width: 767px) 100vw, 40vw"
          />
        )}
      </div>
      <div className="about-copy">
        {introduction && (
          <p className="about-introduction editorial-panel editorial-panel-sage">
            {introduction}
          </p>
        )}
        {paragraphs.length > 0 && (
          <div className="about-body">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        <p className="about-signoff">Still learning. Always building.</p>
        {profile.location && <p>{profile.location}</p>}
        {profile.resumeUrl && (
          <LinkButton
            href={profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume
          </LinkButton>
        )}
      </div>
    </section>
  );
}
