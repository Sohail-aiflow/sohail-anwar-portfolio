# Phase 6I — local galleries and approved content review

Date: 22 October 2026. Local implementation only; no commit, push, CMS write, or deployment.

## Scope and provenance

The owner approved the gallery proposal, factual corrections, and five public Team captures. Fourteen supplied PNGs were found under an extra `public/public/images/projects` nesting and moved to `public/images/projects`. The input README was preserved under ignored `test-results/phase6i/input-README.txt`. No original PNG was retouched, cropped, or replaced.

The owner separately confirmed that Mileway customer names/contact information are approved demonstration records. The School admin image is an earlier Phase 1 Foundation capture; the owner confirms the project was completed afterward. Its caption records that limitation and the Completed status remains intact.

Five Team screenshots were captured in real Chrome at 1440 × 1050 through public HTTPS navigation: homepage, markets listing, market details, products listing, product details. No account was created, authentication attempted, form submitted, cart changed, or order placed. The source application currently displays mismatched product photography; screenshots preserve it and captions disclose it. Displayed counters are not independently verified business results. Capture URLs and timestamps are in ignored `test-results/phase6i/team-capture-log.json`.

## Verified originals

All originals are PNGs, stored under `public/images/projects/<project>/`.

| Project    | File                        | Dimensions  |
| ---------- | --------------------------- | ----------- |
| Car Rental | rentals-listing.png         | 2048 × 1526 |
| Car Rental | book-car-form.png           | 1906 × 2048 |
| Car Rental | customers-listing.png       | 2048 × 1548 |
| Car Rental | add-car-form.png            | 1973 × 2048 |
| Car Rental | cars-listing.png            | 2048 × 2020 |
| Solo       | homepage.png                | 1800 × 2048 |
| Solo       | products-listing.png        | 629 × 2048  |
| Solo       | product-details-bananas.png | 1925 × 2048 |
| Solo       | farmers-listing.png         | 375 × 2048  |
| Solo       | markets-listing.png         | 710 × 2047  |
| Solo       | farmer-dashboard.png        | 2048 × 1837 |
| Solo       | admin-dashboard.png         | 2048 × 2046 |
| School     | public-homepage.png         | 355 × 2048  |
| School     | admin-dashboard.png         | 1522 × 2048 |
| Team       | homepage.png                | 1440 × 1050 |
| Team       | markets-listing.png         | 1440 × 1050 |
| Team       | market-details.png          | 1440 × 1050 |
| Team       | products-listing.png        | 1440 × 1050 |
| Team       | product-details.png         | 1440 × 1050 |

Solo's duplicate products and Cumin views and School's admissions/faculty/gallery views are excluded. Existing social PNGs remain editorial sharing cards, separate from application evidence.

## Architecture and rendering

`ProjectMedia` chooses a real gallery or an accurate empty state. `ProjectGallery` provides an uncropped featured image, short labelled thumbnails, bounded Previous/Next controls, keyboard selection, touch swipe, captions, and live announcements. The Evidence & media section spans the existing documentation panel; other editorial sections retain their layout.

`ProjectLightbox` uses a native modal dialog with explicit initial focus, Escape/Close, focus restoration, background scroll locking, fit/actual-size modes, and independent image navigation. Browser zoom and vertical scrolling remain available. No autoplay or new motion is introduced. A no-script list links to every full-size image.

`src/data/project-galleries.ts` holds the validated local evidence order and metadata. Client components receive only the current project's screenshots. Local WebP variants and small thumbnails avoid loading full PNG originals for ordinary browsing. Dimensions reserve the image stage; screenshots keep original proportions and colours. Actual-size viewing supports the long, narrow captures without pretending they are readable at thumbnail size.

Original PNGs total 10,120,633 bytes. The 19 1200px-or-smaller WebP previews total 1,463,142 bytes. Responsive candidates allow smaller requests; full-resolution images are only used when enlarging. These byte totals are asset measurements, not a Lighthouse score or a claim about each visitor's transfer size.

Regenerate derived WebPs with `node scripts/prepare-project-images.mjs`. It uses the existing Sharp installation supplied with Next.js, validates original dimensions and output paths, and never writes to originals. No dependency, paid service, Next image server, or custom backend was added.

## CMS boundary and factual corrections

This task prohibits remote writes. Sanity project `xc6vvvsv`, dataset `production`, remains unchanged: no image upload or document patch was performed. Root content still loads through the existing fresh, token-free, published Sanity read. Failed configured reads still stop the build.

`src/content/approved-project-review.ts` is an explicit, temporary local review layer applied after the CMS adapter. It applies only the four preserved project identities and the approved fields. This is not a claim that the published CMS copy has been corrected, and it is not a silent fallback. Profile, homepage, skills, education, unreviewed project prose, project status, IDs, slugs, and links continue to come through the existing pipeline.

The local source facts in `src/data/projects.ts` are aligned with this review:

- Car/School: Solo full-stack developer; frontend, backend, database responsibilities. C# added to Car; HTML/CSS/JavaScript added to School. Car description names Mileway.
- Solo: Solo developer, frontend/backend responsibilities, In progress preserved, fictional demonstration records and illustrative imagery disclosed.
- Team: Project Manager & Backend Developer, three people; public browsing interface documented, unknown backend stack retained, shared-contribution caveat preserved.
- Ownership-pending items are removed only where owner confirmation resolves them. Screenshot/repository combined items become Repository evidence. Architecture, decisions, challenges, adoption, commercial use, and repository gaps remain where unverified.
- Hardcoded concept/screenshot notices now follow actual image availability. Concept artwork is retained and labelled; no concept image is presented as an application screenshot.

The existing Studio image type gains optional short labels; queries/validation accept labels and stable array keys for future CMS galleries. This local schema support does not upload or publish content. Local screenshot metadata is authoritative for this review; a future approved CMS reconciliation must deliberately migrate order/captions/assets and retire the local evidence override together, avoiding competing gallery sources.

Before removing the factual review layer, separately approve/publish the exact corresponding field edits on the four canonical documents. Do not reimport a seed or touch archived originals/system records. Empty-array handling and actual removals should be verified during that reconciliation; the existing adapter's missing-field fallback is intentionally not broadly rewritten here.

## Safety and deployment

No underlying application repository was changed. Team's server 404 behavior for direct nested routes and source-site photo mismatches were documented, not repaired. No Sanity Studio deployment, Cloudflare resource, webhook, permission, environment, or indexing change was made. The static build remains `npm run build` → `out`, with existing canonical/social metadata and `noindex, nofollow` safeguards.

The owner must review this local implementation before any future publication. Public deployment remains blocked by this task's explicit instruction, regardless of test results.

## Verification

| Check                        | Final result                                                                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint, TypeScript, formatting | Passed, including the final source revision                                                                                                                                                       |
| Production build             | Passed with fresh Sanity configuration; four static case-study routes; five normalized navigation payloads; no content/fallback warnings                                                          |
| Complete regression suite    | **147 passed in 14.0 minutes**, with `VERIFY_LIVE_SANITY=1`                                                                                                                                       |
| Dedicated gallery coverage   | All 15 new cases pass within the complete suite: all 19 images, 375/768/1440px, both themes, modal bounds/focus, real Chrome touch input, no-script links, failure recovery, and local provenance |
| Separate content suite       | **13 passed**; these repeat content cases in the complete suite, not 13 additional unique browser tests                                                                                           |
| Studio                       | Typecheck and production build passed; no deployment                                                                                                                                              |
| Public CMS comparison        | 32 canonical payloads and revision IDs unchanged; no authenticated system-record audit is claimed                                                                                                 |
| Static SEO                   | Correct production-origin canonical/OG/Twitter metadata on five pages; noindex/nofollow retained; robots Disallow and five sitemap URLs preserved                                                 |
| Manual lightbox inspection   | Long School capture fits at 375px light and 1440px dark; Actual size permits vertical inspection of all 2048 pixels                                                                               |

Browser tests use installed Chrome, not a mocked browser. The complete run includes unit/content cases and two real public API checks; it is not 147 purely visual tests. Responsive/theme/navigation, console/runtime, accessibility, overflow, links, and earlier scrolling behavior are covered by the retained regression suites.

Development checks found and corrected initial modal focus/cycling and tall-image Fit bounds. An earlier regression run was stopped when the Fit issue was found. The final complete run above used the rebuilt fixed source. The global image check was updated to load lazy images before asserting success and to recognize correctly labelled decorative thumbnail controls. No failing application check was skipped.

Raw logs, API snapshots, test traces, and QA screenshots stay ignored under `test-results/phase6i` and the Playwright output directory. No new Lighthouse score is claimed in this phase.

## Local review

The static preview is bound to loopback at <http://127.0.0.1:4180/>. Review each gallery at:

- <http://127.0.0.1:4180/projects/car-rental-system/#evidence-title>
- <http://127.0.0.1:4180/projects/marketlink-solo/#evidence-title>
- <http://127.0.0.1:4180/projects/school-website-cms/#evidence-title>
- <http://127.0.0.1:4180/projects/marketlink-team/#evidence-title>

Try thumbnails, Previous/Next, keyboard arrows, Enlarge, Actual size, Tab/Shift+Tab, Escape, and the theme toggle. Long captures retain their original resolution; enlargement cannot invent detail absent from the supplied image.

Local QA images are ignored artifacts available only in this workspace:

- [Desktop Mileway gallery](../test-results/phase6i/review/car-rental-system-light-1440.png)
- [Mobile dark Solo gallery](../test-results/phase6i/review/marketlink-solo-dark-375.png)
- [Mobile fitted long capture](../test-results/phase6i/review/school-lightbox-light-375.png)
- [Desktop dark fitted long capture](../test-results/phase6i/review/school-lightbox-dark-1440.png)

## Change locations

New implementation files: `src/components/projects/project-gallery.tsx`, `src/components/projects/project-lightbox.tsx`, `src/content/approved-project-review.ts`, `src/data/project-galleries.ts`, `scripts/prepare-project-images.mjs`, `tests/project-gallery.spec.ts`, and this report.

Existing implementation updates: `src/app/projects/[slug]/page.tsx`, `src/components/projects/case-study-section.tsx`, `src/components/projects/project-artwork.tsx`, `src/components/projects/project-links.tsx`, `src/components/projects/project-media.tsx`, `src/components/sections/project-preview.tsx`, `src/components/sections/selected-work.tsx`, `src/components/ui/content-image.tsx`, `src/data/projects.ts`, `src/lib/content/adapter.ts`, `src/lib/content/images.ts`, `src/lib/content/repository.ts`, `src/lib/sanity/query.ts`, `src/styles/case-study.css`, `src/types/project.ts`, and `studio/schemaTypes/shared.ts`.

Existing regression updates: `tests/editorial.spec.ts`, `tests/homepage.spec.ts`, `tests/production.spec.ts`, `tests/projects.spec.ts`, and `tests/quality-refinement.spec.ts`. Assertions now account for real evidence and the explicitly approved local facts; lazy images are loaded and checked, and empty thumbnail alt text is accepted only inside an explicitly labelled gallery button.

The 19 original PNGs and their derived WebPs live under `public/images/projects/`. No test screenshot, log, token, environment file, generated export, or Studio build is intended as source. Git changes remain unstaged; the existing HEAD is preserved.
