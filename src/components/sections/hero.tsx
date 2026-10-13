import { ArrowDown, Code2, PenTool, Layers3 } from "lucide-react";
import Link from "next/link";
import { LinkButton } from "@/components/ui/link-button";
import { IconTreatment } from "@/components/ui/icon-treatment";
import type {
  EducationRecord,
  HomepageContent,
  PortfolioProfile,
} from "@/types/portfolio";
import { EditorialTitle } from "@/components/ui/editorial-title";
import { Fragment } from "react";

export function Hero({
  profile,
  education,
  homepage,
}: {
  profile: PortfolioProfile;
  education: EducationRecord | undefined;
  homepage: HomepageContent;
}) {
  return (
    <section
      id="home"
      className="hero section-target"
      tabIndex={-1}
      aria-labelledby="intro-title"
    >
      <div className="hero-content">
        <p className="eyebrow">
          {profile.headline}
          {education ? ` · ${education.institution}` : ""}
        </p>
        <h1 id="intro-title">
          <EditorialTitle
            headline={homepage.heroHeadline}
            emphasis={homepage.heroEmphasis}
          />
        </h1>
        <p className="hero-copy">
          {homepage.heroSupportingText.split("\n").map((line, index) => (
            <Fragment key={index}>
              {index > 0 && (
                <>
                  <br className="desktop-break" />{" "}
                </>
              )}
              {line}
            </Fragment>
          ))}
        </p>
        <p className="hero-introduction">{profile.shortIntroduction}</p>
        <div className="hero-actions">
          <LinkButton href="/#work" className="link-button-primary">
            Explore Work
          </LinkButton>
          <LinkButton href="/#connect">Connect</LinkButton>
        </div>
      </div>
      <aside className="hero-note glass-surface" aria-label="Areas of interest">
        <p className="eyebrow">Where my curiosity lives</p>
        <div className="interest-line">
          <IconTreatment>
            <Code2 size={20} aria-hidden="true" />
          </IconTreatment>
          <span>Software that works.</span>
        </div>
        <div className="interest-line">
          <IconTreatment>
            <PenTool size={20} aria-hidden="true" />
          </IconTreatment>
          <span>Design that makes sense.</span>
        </div>
        <div className="interest-line">
          <IconTreatment>
            <Layers3 size={20} aria-hidden="true" />
          </IconTreatment>
          <span>Projects built together.</span>
        </div>
        <p className="hero-note-caption">
          Learning across the stack,
          <br />
          one project at a time.
        </p>
      </aside>
      <div className="hero-footnote">
        <span>Development / Design / Collaboration</span>
        <Link href="/#work">
          A look at my work <ArrowDown size={15} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
