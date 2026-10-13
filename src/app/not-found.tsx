import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export default function NotFound() {
  return (
    <PageContainer>
      <main id="main" className="not-found-page" tabIndex={-1}>
        <p className="eyebrow">Page not found</p>
        <h1>This page isn’t here.</h1>
        <p>
          The address may be incorrect, or the project has not been published.
        </p>
        <Link href="/#work" className="link-button">
          Return to selected work
        </Link>
      </main>
    </PageContainer>
  );
}
