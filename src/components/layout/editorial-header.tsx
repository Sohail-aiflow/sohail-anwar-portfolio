import type { PortfolioProfile } from "@/types/portfolio";
import Link from "next/link";
import { FloatingNavigation } from "@/components/navigation/floating-navigation";
import { PageContainer } from "./page-container";

export function EditorialHeader({
  identity,
}: {
  identity: Pick<PortfolioProfile, "name" | "headline">;
}) {
  return (
    <header className="editorial-header" data-header-region>
      <PageContainer className="header-content">
        <Link
          className="identity"
          href="/#home"
          aria-label={`${identity.name} — ${identity.headline} — home`}
        >
          <span className="identity-name">
            {identity.name}
            <span aria-hidden="true">.</span>
          </span>
          <span className="identity-caption">{identity.headline}</span>
        </Link>
        <div className="navigation-slot">
          <FloatingNavigation />
        </div>
        <span className="mobile-edition">Software & design</span>
      </PageContainer>
    </header>
  );
}
