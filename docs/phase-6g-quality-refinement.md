# Phase 6G - Portfolio quality refinement and evidence audit

Date: October 19, 2026 (Asia/Karachi). Baseline Git HEAD/local origin/main: `7041f1f95484b1509a59ca572b03bd08a53be065`. The ten existing Phase 6F working-tree paths were preserved. This report distinguishes local implementation from public deployment and owner decisions.

## A. Implemented locally

| Proposal | Local result                                                                                                                                                                                                          |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F-P07    | Footer Back to top explicitly returns the homepage to document y=0, including repeated `#home` activation.                                                                                                            |
| F-P08    | Ignored root `.env.local` now uses `SITE_URL=https://sohail-anwar-portfolio.pages.dev` and `SITE_INDEXABLE=false`. Existing metadata code emits the correct canonical/social URLs without enabling indexing.          |
| F-P04    | Shared `LinkButton` consistently announces new tabs and preserves/adds `noopener noreferrer`. Existing destinations and opening behavior remain intact.                                                               |
| F-P05    | README now distinguishes the live Free Pages deployment, local unpublished refinements, pending evidence, and static CMS publishing workflow.                                                                         |
| F-P03    | Related case-study evidence, project links, and outstanding facts share one quiet documentation surface; homepage evidence notes share a restrained border/group. All published wording and important caveats remain. |

No commit, push, deployment, production environment edit, CMS write, schema change, paid resource, or indexing enablement is part of this work.

### Back to top root cause and behavior

The Phase 6F real-browser reproduction reached the footer at scrollY=4111 while the URL already ended in `#home`. Activating the Next Link left scrollY=4111. The anchor target existed; this was Next's same-fragment navigation shortcut, not a missing target, fixed-nav obstruction, IntersectionObserver loop, or evidence of an animation interruption.

`BackToTop` is a small client leaf inside the otherwise server-rendered footer. On the homepage, an ordinary activation scrolls to document y=0 and focuses `#home` with `preventScroll`. A changed fragment uses `router.push('/#home', {scroll:false})`, retaining ordinary navigation history; a repeated fragment does not push another entry. Reduced motion uses an immediate scroll. Cross-route and modified-link clicks retain normal Next/native link behavior. The real href remains available without JavaScript. No global scroll listener or navbar handler was replaced.

### Link policy

| Link kind                                                                  | Policy                                                                                                                                         |
| -------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Navbar, homepage anchors, case studies, other-project/back links           | Same tab; existing routes/hash semantics preserved.                                                                                            |
| External project demos, supplied repositories, HTTPS professional contacts | Retain existing new-tab behavior; announce it in the accessible name and use `noopener noreferrer`.                                            |
| Email                                                                      | Existing `mailto:` protocol; no forced new tab.                                                                                                |
| Supplied resume/document link                                              | Retain new-tab preview behavior and announce it; do not invent a download or force a download attribute. No resume URL is currently published. |

The helper adds the cue to explicit labels (unless already present), or appends screen-reader text when a label is derived from children. Case-study project actions already announced new tabs and retain those names; homepage project actions, HTTPS contacts, and any supplied resume now follow the same policy. No external destination was invented or changed. Visible case-study new-tab guidance remains.

### Evidence/status presentation

The three existing case-study sections remain separate headings with unchanged IDs: Evidence & media, Project links, Still to document. A shared `role=group` documentation surface connects them visually. Existing artwork captions, missing-media notices, owner-contribution caveats, in-progress status, unverified URL caveats, and every pending item remain visible. Homepage notes are grouped without shortening their wording. No disclosure/collapse hides limitations.

This presentation refinement does not supply or replace project screenshots (F-P01 remains gated). Repeated CMS text that carries distinct context was retained, not deduplicated by fragile string comparisons. The full published prose is verified against API content in the regression suite.

### Local metadata preparation

The existing `src/lib/seo.ts` already validates a public HTTPS origin, derives canonical/OG/Twitter image URLs, and separately gates indexing. No production SEO rewrite was needed. Local origin configuration is ignored by Git and contains public identifiers only; portfolio authentication tokens were not introduced.

Expected generated canonical URLs are the assigned HTTPS origin plus `/`, `/projects/marketlink-team/`, `/projects/marketlink-solo/`, `/projects/car-rental-system/`, and `/projects/school-website-cms/`. Each page uses its existing relevant title/description, `og:url`, a committed 1200x630 editorial title card, and Twitter `summary_large_image`. The cards were visually inspected; they describe the student portfolio/project identities and do not masquerade as application screenshots or claim Solo is launched.

Every page must remain `noindex, nofollow`, and robots must retain `Disallow: /`. Configuring an origin allows the existing sitemap generator to list five accurate URLs and robots to reference that sitemap; a sitemap does not override noindex/robots blocking. Neither indexing guard was weakened. A future domain remains configurable through `SITE_URL`; no origin was hardcoded into production components.

Proposed future Cloudflare values, **not applied remotely**: the same assigned `SITE_URL`, `SITE_INDEXABLE=false`, and existing public Sanity configuration. Any future production environment update/deployment needs separate owner authorization. The live website's previously missing canonical/social-image tags are not claimed fixed by this local build.

## B. Proposed but awaiting owner approval

### F-P01 - Evidence collection plan

Verified scope: portfolio `public/`, source data, Studio/schema/seed references, canonical public API fields, the existing Phase 6F rendered Team demo capture, and scoped local project-folder searches. Standard Desktop/Documents/source-repos folder-name checks found no matching additional project source. A candidate PHP/MySQL school project exists under local XAMPP; its relationship to the portfolio is not yet owner-confirmed. This is not an exhaustive search of all disks or private accounts.

All four current public project records have zero screenshot assets and no `githubUrl`. The five files under `public/social/` are editorial title cards, not genuine application evidence. No screenshot was fabricated, generated with AI, copied into portfolio assets, or uploaded. No new public repository/deployment URL was inferred.

| Project              | Verified existing evidence / missing items                                                                                                                                                                                                | Recommended capture, only after approval                                                                                                                                                                                                                                    | Portfolio placement                                                                                                         |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Team MarketLink      | Supplied live URL and actual rendered homepage capture in `test-results/phase6f/team-demo-rendered.png`; role is PM/backend in a three-person team. No gallery or repository URL. Homepage reachability does not verify backend/features. | Approved public homepage desktop and 375/430px mobile; owner-confirmed implemented workflow; sanitized architecture/endpoint evidence showing the owner's specific contribution. Do not claim sole ownership or unverified features.                                        | Genuine gallery in existing Evidence & media; descriptive captions distinguish shared interface from personal backend work. |
| Car Rental System    | Confirmed completed ASP.NET Core MVC/SQL Server project; no matching source/gallery/repository found in the inspected scope.                                                                                                              | Run owner-supplied source with synthetic records: car/customer/rental view, return validation/error state, responsive view where supported, sanitized relationship/schema diagram if verified.                                                                              | Existing gallery: overview first, then one complete return workflow. No customer/client-use claims.                         |
| School Website & CMS | Completed PHP/MySQL portfolio record; candidate local PHP pages/admin/database folder exists but identity is unconfirmed. Only a favicon was found among inspected candidate media; no genuine UI capture supplied.                       | After confirming the correct project: public homepage/mobile navigation, a news or faculty page, admin content edit/result with synthetic names/images; sanitize student/application/contact data. Do not start services/import databases until prerequisites are reviewed. | Pair a public page with a clearly labeled admin view in the existing gallery. Preserve concept/evidence distinction.        |
| Solo MarketLink      | Independent MERN development, still in progress; no owner-approved local source/repository or screenshots located. Development-area list is not proof of completion.                                                                      | Current implemented interface and one working flow only, with explicit build/date and incomplete-state labels; mobile view if implemented. Optional verified component/API walkthrough using synthetic data.                                                                | Existing gallery with in-progress captions, never a fabricated launch/deployment link.                                      |

Capture process: owner identifies the correct source/repository, approves specific views, confirms factual feature/ownership captions, and supplies/approves non-sensitive data. Capture real browser UI at consistent desktop/mobile widths; preserve readable context and meaningful alt text, not a collage of unverifiable claims. Keep credentials, private repository names/URLs, user records, emails, and identifiers out of evidence. Review each asset/caption before a separately authorized visual/CMS change. Keep existing editorial framing and aspect-ratio-aware image components; no new visual treatment is required now.

Repository requests: provide or explicitly confirm one accurate public/approved URL per project. The known GitHub profile and portfolio repository do not establish repositories for these four projects. Local candidate paths are private audit notes, not proposed website copy.

### F-P02 - Role accuracy audit and owner confirmation

The user confirmed during this checkpoint that **both Car Rental System and School Website & CMS were developed independently**. This resolves their collaboration question in the audit. The instruction for F-P02 remains audit-only: no local fallback, seed, CMS field, or published role was changed. Detailed implementation responsibilities are not inferred from independence.

| Project / canonical ID                              | Exact current wording and field                                                                                                                                                                                                                                                                                              | Why / accurate proposed alternative                                                                                                                                                                                    | Remaining factual question                                                                                                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Car Rental System / `project-car-rental-system`     | CMS `role:null`, `collaboration:"unconfirmed"`; case-study hero: "Role details awaiting confirmation" / "Collaboration details pending"; contribution: "My specific role and collaboration details are awaiting confirmation."; `caseStudy.pending` includes "My specific role and collaboration context". Fallback matches. | Current generated uncertainty now lags the owner's answer. After separate content-edit approval, propose `collaboration:"solo"`, `role:"Independent developer"`; preserve completed ASP.NET Core MVC/SQL Server facts. | Which parts did you personally implement (MVC UI/controllers, SQL data model, return/validation flow), and which parts used a supplied template or starter? |
| School Website & CMS / `project-school-website-cms` | Same null/unconfirmed fields and generated pending wording; same role/context pending item. Fallback matches.                                                                                                                                                                                                                | After separate approval, propose `collaboration:"solo"`, `role:"Independent developer"`; preserve completed PHP/MySQL facts without inventing client work.                                                             | Which public-site, admin/CMS, and database parts did you implement, and is the inspected local school project the correct portfolio project?                |

Homepage selectors currently show the known stack when collaboration is unconfirmed, not an invented job title. Case studies explicitly expose uncertainty. Team MarketLink retains `teamSize:3`, `collaboration:"team"`, and `Project Manager & Backend Developer`, including its shared-contribution caveat. Solo retains independent ownership and `in-progress`, with no launch/production-readiness claim. No wording implies professional employment.

Any exact responsibility sentences require the owner's factual answer and separate CMS-write authorization. Do not replace pending role/context prose automatically or invent responsibilities from technology names.

## C. Investigated with no design/performance changes

### F-P06 - Mobile LCP

No source performance optimization was applied. The LCP element in all six mobile measurements remained `section#home > div.hero-content > div.hero-story > p.hero-introduction`. The prior Phase 6F live medians (91 mobile, 100 desktop, CLS 0) were measured on HTTPS Pages, and are not a controlled comparison with either local serving condition below. Phase 6G is not deployed.

Environment: Windows 11 build 26200, Intel i5-1145G7, Node 24.21.0, installed Chrome 155, Lighthouse 13.5.0. All measurements used the same final Sanity-backed production `out/`, fresh headless Chrome launches, and sequential mobile/desktop pairs with no concurrent builds or browser suites. Lighthouse simulated mobile 4x CPU, 150ms RTT, 1638.4Kbps, 412x823/DPR 1.75; desktop 1x CPU, 40ms RTT, 10240Kbps, 1350x940/DPR 1. Normal operating-system activity was not disabled or attributed to any specific background process.

First, the existing performance script measured the ordinary Python preview at `127.0.0.1:4173`, without compression. Then an ephemeral loopback-only Node gzip proxy on 4174 forwarded the same server's unchanged responses, preserving content types and compressing text/JS/JSON/XML/SVG responses when accepted. No application file, build, content, throttling option, or design changed between those serving conditions. This is a diagnostic serving experiment, not a product backend, deployment, or claim that the live origin uses exactly the same server/compression. The proxy was closed after measurement.

| Serving                 | Run | Mobile score |    Mobile LCP |   Mobile TBT | Desktop score |   Desktop LCP | Desktop TBT | CLS both |
| ----------------------- | --- | -----------: | ------------: | -----------: | ------------: | ------------: | ----------: | -------: |
| Uncompressed            | 1   |           58 |     5723.85ms |     885.05ms |            99 |     1010.35ms |         0ms |        0 |
| Uncompressed            | 2   |           80 |     5384.19ms |         37ms |            98 |     1069.34ms |        11ms |        0 |
| Uncompressed            | 3   |           63 |     5853.73ms |     566.59ms |            99 |     1023.04ms |         0ms |        0 |
| **Uncompressed median** |     |       **63** | **5723.85ms** | **566.59ms** |        **99** | **1023.04ms** |     **0ms** |    **0** |
| Gzip diagnostic         | 1   |           93 |     3026.49ms |        119ms |            99 |      693.69ms |        89ms |        0 |
| Gzip diagnostic         | 2   |           94 |     2996.66ms |      95.78ms |           100 |      784.96ms |     59.68ms |        0 |
| Gzip diagnostic         | 3   |           94 |     3014.21ms |      96.26ms |           100 |      656.95ms |         0ms |        0 |
| **Gzip median**         |     |       **94** | **3014.21ms** |  **96.26ms** |       **100** |  **693.69ms** | **59.68ms** |    **0** |

All runs are retained, including the slow uncompressed runs. Transfer weight was 795,361 bytes uncompressed versus 343,983 bytes through gzip (about 57% lower). Same-build compressed serving materially changed measured/simulated loading outcomes. It does not establish that compression explains every score difference: arrival timing, browser execution, and server/port conditions also differ. Main-thread execution varied substantially among the unchanged uncompressed runs, so their 58-80 range cannot be presented as a stable code regression or dismissed as a proven background-process issue.

Measured findings:

- Font-display audits passed in every mobile run; fonts remain local, preloaded by Next, and use `display:swap`. No font-loading failure or layout shift was observed.
- Measured paint/composite/render work was roughly 10-22ms across the six mobile traces, while style/layout and script execution were much larger and variable. This does not prove zero GPU cost, but supplies no evidence for removing the approved gradients or blur as an LCP fix.
- The compressed unused-JavaScript opportunity was about 29.2KiB, primarily framework runtime, versus a larger transport estimate without compression. An audit estimate is not proof that the whole chunk can safely be deleted. Client navigation, themes, and selection still require their current behavior.
- The LCP is text, not a missing hero image; adding/preloading a fake project image would not solve the identified request/render path.
- The live origin was not rebuilt or redeployed. No before/after website optimization recovery, field Core Web Vitals, or guaranteed device performance is claimed.

Potential follow-up, not implemented: profile framework startup and font/CSS request ordering under unchanged compressed serving conditions, then test one isolated change at a time. Expected benefit is lower text-render/startup delay if a specific dependency is identified; costs include preload contention, font-swap/layout risks, and navigation regressions. A different framework or removal of approved effects is not justified by this evidence. Compression is already a serving concern to verify on hosting, not a reason to add a backend to this static portfolio.

Raw uncompressed reports: `test-results/audits/phase6g-local-{1,2,3}-{mobile,desktop}.json`. Gzip reports: `test-results/phase6g/gzip-{1,2,3}-{mobile,desktop}.json`. `performance-summary.json` under the Phase 6G artifact folder records individual values, medians, actual fetch times, benchmark indices, and hardware/configuration. The existing script was not modified.

## Verification record

| Check                                | Actual result                                                                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Production build                     | Passed using real Sanity; all four case-study routes and five normalized nested payloads exported. No fallback warning.                                                                                       |
| Focused new-quality browser checks   | 8 passed in 1.7 minutes, covering all six widths/both themes, repeated footer/history/focus/reduced motion, cross-route return, metadata, link policy, grouped caveats, and native fallback.                  |
| Additional real Chrome audit         | 60 visits: five pages x six requested widths x both themes. No recorded console/page errors, resource failures, overflow, or missing images. Ten axe scans at 430px across both themes found zero violations. |
| Real external-link behavior          | GitHub contact opened `https://github.com/Sohail-aiflow` in a new tab, `window.opener===null`, portfolio source page unchanged. No authentication or remote content write.                                    |
| Root lint/typecheck                  | Passed; final lint/typecheck rerun after implementation and test edits also passed.                                                                                                                           |
| Content suite                        | 13 passed (836ms); these are fixture/injected/local content checks, separate from real token-free API checks.                                                                                                 |
| Studio                               | Typecheck passed; real configured Studio production build passed (22.5s), exposing only public Studio project/dataset identifiers. No deployment or editor content write.                                     |
| Full regression and final formatting | Passed: 132 tests in 7.8 minutes with VERIFY_LIVE_SANITY=1; npm run format also passed. Final npm run format:check also passed.                                                                               |
| Canonical CMS revision comparison    | Passed: all 32 canonical payloads and revision IDs match the before snapshot (real token-free published API; no writes).                                                                                      |

`test-results/phase6g/browser-audit.json` records the 60 visits and popup result. Screenshots are under `test-results/phase6g/screenshots/`. Full-page captures retain the actual fixed navigation. Isolated documentation-component crops hide navigation/skip controls only during screenshot capture for readability; this is not a source/style change. Representative [mobile light grouping](../test-results/phase6g/screenshots/light-documentation-375.png), [430px dark grouping](../test-results/phase6g/screenshots/dark-documentation-430.png), and [desktop grouping](../test-results/phase6g/screenshots/light-documentation-1440.png).

Live response inspection is separate: all five public URLs still return HTTP 200, `noindex, nofollow`, and no canonical/OG-image tags. This confirms local preparation has not been represented as a deployed fix (`test-results/phase6g/live-metadata.json`).

## Changed-file scope and owner decisions

Phase 6G touches README; project route grouping; footer and its new `BackToTop` leaf; shared `LinkButton`; project-link conditional warning; homepage preview grouping; case/homepage grouping styles; homepage accessible-name expectations; theme/UX tests extended to 430px; new `tests/quality-refinement.spec.ts`; and this report. The ignored root environment file changes only the two public local metadata settings. Existing Phase 6F source/test/report changes remain in the working tree.

Outstanding owner decisions: approve local visual refinements; approve a specific genuine-evidence capture/placement plan and provide project sources/repository URLs; confirm detailed responsibilities and the school-project candidate; separately authorize any content-field updates. Independence for Car/School is already confirmed and does not need to be asked again. Cloudflare configuration, deployment, and indexing remain separate gates.

Owner review is required before any further content/visual work, commit, push, deployment, production configuration change, or indexing change.

## Exact local file inventory and final boundaries

| Phase 6G path                                 | Purpose                                                                              |
| --------------------------------------------- | ------------------------------------------------------------------------------------ |
| `README.md`                                   | Current live/local workflow, safe setup and verification commands.                   |
| `src/app/projects/[slug]/page.tsx`            | Group three existing documentation sections without rewriting CMS text.              |
| `src/components/layout/back-to-top.tsx`       | New focused client leaf for repeated return-to-top behavior.                         |
| `src/components/layout/site-footer.tsx`       | Use the BackToTop leaf; preserve footer content/design.                              |
| `src/components/projects/project-links.tsx`   | Only show the existing URL verification caveat when a live URL is actually supplied. |
| `src/components/sections/project-preview.tsx` | Group existing evidence notes; preserve Phase 6F title focus.                        |
| `src/components/ui/link-button.tsx`           | Consistent new-tab announcements and secure rel values.                              |
| `src/styles/case-study.css`                   | Quiet grouped documentation surface using existing tokens.                           |
| `src/styles/homepage.css`                     | Restrained preview-note grouping; preserve Phase 6F scroll clearance.                |
| `tests/homepage.spec.ts`                      | Assert the now-explicit new-tab accessible name.                                     |
| `tests/themes.spec.ts`                        | Add both-theme five-page coverage at 430px.                                          |
| `tests/ux-fixes.spec.ts`                      | Preserve/extend Phase 6F landing and mobile reveal tests to 430px.                   |
| `tests/quality-refinement.spec.ts`            | Eight new quality/metadata/interaction regression cases.                             |
| `docs/phase-6g-quality-refinement.md`         | This report and owner-gated evidence/content plan.                                   |

The other seven Phase 6F paths remain preserved: `src/app/globals.css`, `src/components/navigation/floating-navigation.tsx`, `src/components/sections/about.tsx`, `src/components/sections/connect.tsx`, `src/components/sections/selected-work.tsx`, `src/styles/tokens.css`, `docs/phase-6f-ux-audit-and-proposals.md`. Combined Git status is 21 paths: 16 modified tracked files and five new files, all unstaged. No prior local work was discarded. The additional ignored .env.local metadata preparation is not staged/tracked. Studio build output and all audit/screenshots remain ignored.

HEAD and the local origin/main reference remain 7041f1f95484b1509a59ca572b03bd08a53be065; staging is empty. No remote-history freshness claim is made without a fetch, and no fetch/commit/push is needed for this local checkpoint. Protected local facts, CMS schemas/queries, dependencies/lockfiles, and Next configuration have no diff.

The credential-pattern scan checked 121 source/document text files and 57 exported text files with zero flagged files and zero tracked private environment files. This is a heuristic check, not a guarantee; no credential values were printed. No token was used for the public API queries.

The 132-test suite includes the 13 content tests and two enabled real public API checks as well as Chrome UI cases. The separate 13-test content run repeats those cases, not 13 additional unique tests. Live/public API checks are distinguished from mocks. Automated axe/Lighthouse checks are not complete WCAG conformance or manual screen-reader/Safari/Firefox coverage.

No performance source change or deployed improvement is claimed. The compressed diagnostic is a local serving experiment. Final owner gates remain the evidence plan/assets, responsibilities/content wording, visual review, and any future Git/deployment/production-setting action. Indexing remains disabled.
