import { LinkButton } from "@/components/ui/link-button";
import type { HomepageContent, PortfolioProfile } from "@/types/portfolio";
import { EditorialTitle } from "@/components/ui/editorial-title";

export function Connect({
  profile,
  homepage,
}: {
  profile: PortfolioProfile;
  homepage: HomepageContent;
}) {
  return (
    <section
      id="connect"
      className="homepage-section connect-section section-target"
      tabIndex={-1}
      aria-labelledby="connect-title"
    >
      <p className="eyebrow">Connect</p>
      <div className="connect-heading">
        <h2 id="connect-title">
          <EditorialTitle
            headline={homepage.connectHeadline}
            emphasis={homepage.connectEmphasis}
          />
        </h2>
      </div>
      <div className="connect-body editorial-panel editorial-panel-lavender">
        <p className="connect-copy">{homepage.connectMessage}</p>
        {profile.contacts.length > 0 ? (
          <div className="contact-links">
            {profile.contacts.map(({ label, href }) => (
              <LinkButton
                key={href}
                href={href}
                {...(href.startsWith("https:")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
              >
                {label}
              </LinkButton>
            ))}
          </div>
        ) : (
          <div className="contact-pending">
            <span className="contact-pending-dot" aria-hidden="true" />
            <p>
              Contact links are on their way.
              <span>
                Email and professional profiles will be added once confirmed.
              </span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
