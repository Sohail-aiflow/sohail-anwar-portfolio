# Phase 4 — project case studies

## Architecture and routes

Four pages share a server-rendered App Router template, with async params,
generateStaticParams, dynamicParams=false, slug lookup, and factual metadata:

```text
/projects/marketlink-team/
/projects/car-rental-system/
/projects/school-website-cms/
/projects/marketlink-solo/
```

Canonical titles, roles, statuses, stack, and URLs remain in src/data/projects.ts.
Case-study content is stored alongside that metadata in a typed caseStudy object.
There is no runtime backend, CMS dependency, new library, or deployment.

The template includes an editorial hero, metadata, conceptual artwork, overview,
purpose when known, contribution, functionality/development areas, technology,
media/evidence, project links, pending documentation, and navigation to the other
three projects. Technical approaches/challenges are optional and omitted because
none have been supplied. No speculative narrative or metrics were written.

ProjectHero, CaseStudySection, ProjectMedia, ProjectLinks, ProjectNavigation, and
shared ProjectArtwork keep layout reusable. The artwork is visibly distinct from
evidence. Homepage selection, keyboard and no-JavaScript behavior are preserved;
each preview now has a separate internal case-study action. The team Live Demo
remains external. Pointer hover reacts to movement so a stationary cursor does
not change selection when scrolling a case-study link into view.

## Confirmed content and missing facts

- Team MarketLink: Live status, three members including the owner, Project Manager
  & Backend Developer. Team ownership is explicit. Purpose, feature scope, stack,
  implementation decisions, and challenges remain pending. The supplied URL is
  linked safely; public access has not been independently verified.
- Car Rental: Complete, ASP.NET Core MVC and SQL Server. Confirmed car, customer,
  rental management, rental return workflow, and data validation. No deployment
  or real-customer adoption is claimed. Role and collaboration remain unconfirmed.
- School Website & CMS: Complete, PHP and MySQL. Confirmed public website,
  administrative content management, news, faculty, gallery, admissions, downloads,
  and site settings. No live deployment, school adoption, or use is claimed. Role
  and collaboration remain unconfirmed.
- Solo MarketLink: In progress, independent MERN project, distinct from the team
  version. Authentication/roles, discovery, cart/checkout, orders, pickup scheduling,
  farmer functionality, administration, reviews/favorites are development areas,
  not a completion or production-readiness claim. Detailed progress remains pending.

All projects lack genuine screenshots, repository URLs, and documented technical
decisions/challenges. These facts remain missing, rather than being invented.

## Media and future content

ProjectScreenshot adds required width/height and optional caption. ProjectMedia
renders responsive images with intrinsic proportions, meaningful alternative
text, and captions; multiple records form a gallery. Empty records show a clear
pending state without failed image requests or empty image boxes.

To add evidence, put real files in public/images/projects/ and add screenshots
records to the canonical project, for example using the actual local path, real
dimensions, descriptive alt text, and optional caption. No sample screenshot or
fake URL is included. Supply githubUrl only when verified. Add technicalApproach
or challenges as heading/body arrays only when the owner has documented them.
Rebuild after edits. A future Sanity mapper can feed the same types; Sanity is not
integrated and publishing content will still require a fresh static deployment.

## Static hosting and compatibility

Known slugs export directory-based index.html files. Unknown slugs have no output.
The host should return the exported 404.html with HTTP 404; no runtime rendering
or blanket SPA redirect is needed. The test Python server returns its own generic
404 for unknown paths, so tests separately inspect our 404.html and its return link.

Chrome exposed a Next.js Windows issue: dynamic-route segment payloads were
written to nested directories but requested as dotted filenames. This matches
[upstream issue #92339](https://github.com/vercel/next.js/issues/92339).
The build now executes a narrowly scoped copy script after export. It creates
the expected dotted payload files only inside out/, preserves source files,
checks collisions, and can be run repeatedly. It does not patch node_modules
or introduce a runtime service. The browser suite verifies payload responses.

## Files created

```text
src/app/projects/[slug]/page.tsx
src/app/not-found.tsx
src/components/projects/case-study-section.tsx
src/components/projects/project-artwork.tsx
src/components/projects/project-hero.tsx
src/components/projects/project-links.tsx
src/components/projects/project-media.tsx
src/components/projects/project-navigation.tsx
src/lib/project-labels.ts
src/styles/case-study.css
scripts/normalize-static-export.mjs
tests/projects.spec.ts
tests/export-payloads.spec.ts
docs/phase-4.md
```

Modified: src/types/project.ts, src/data/projects.ts, src/lib/projects.ts,
src/components/sections/project-preview.tsx, src/components/sections/selected-work.tsx,
src/app/globals.css, src/styles/homepage.css, package.json, tests/homepage.spec.ts,
README.md, and docs/architecture.md. Existing navigation logic, homepage sections,
framework configuration, dependencies, and lockfile remain unchanged.

## Verification results

- `npm.cmd run lint`: passed, zero errors/warnings.
- `npm.cmd run typecheck`: passed with strict TypeScript.
- `npm.cmd run format:check`: passed.
- `npm.cmd run build`: passed; all four known project routes exported as static HTML.
- `npm.cmd run test:browser`: 44 passed against the production export in Chrome.
- Running the payload normalizer again copied zero files, confirming idempotence.

Coverage includes every project at 320, 375, 768, 1024, and 1440px, no horizontal
overflow, factual titles/status/roles/stacks/functionality, per-page title and
description, homepage-to-case-study links, project-to-project links, return links,
keyboard focus/skip link, reduced motion, native links without JavaScript,
pending screenshots, unknown-path 404 status, exported files, and payloads
returning HTTP 200. Existing homepage/navigation tests also pass. No page
JavaScript errors were recorded in the 20 case-study viewport tests.

The first runs exposed the Windows payload issue and a hover/click interaction;
both were corrected and the full suite rerun successfully. Final browser output
includes the environmental NO_COLOR/FORCE_COLOR warning and intentional 404s
from the unknown-route test. The generic test-server 404 additionally requests
favicon.ico, which returns 404; exported portfolio pages load their SVG icon.

Representative captures, visually inspected:

```text
test-results/projects-car-rental-system-at-1440px/case-1440.png
test-results/projects-car-rental-system-at-375px/case-375.png
```

Screenshot output remains ignored by Git. No actual application screenshots are
claimed or fabricated.

## Limitations

The MarketLink URL is tested as a link target, not for remote accessibility.
The gallery's real-image branch cannot be visually verified with genuine project
evidence until assets are supplied; its pending states are tested on every page.
Chrome testing does not establish Safari/Firefox, physical iOS safe-area behavior,
or a full assistive-technology audit. Earlier development-only audit findings and
the ESLint deprecation remain documented; no dependency changes were made.
No Sanity, deployment, blog, contact backend, or Phase 5 work was performed.
