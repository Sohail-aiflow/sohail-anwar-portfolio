# Phase 5 — Sanity CMS integration

## Architecture

The portfolio remains a Next.js static export. `src/lib/content/repository.ts`
is server-only and caches the content snapshot within each build worker. Layout,
metadata, homepage, project lookup, and static params consume that same normalized
repository. There are no API routes, server actions, draft preview routes, runtime
CMS queries, custom backend, or persistent production Next.js server.

`studio/` is an independent npm package with its own lockfile, schemas, editor
configuration, and build output. It is excluded from the portfolio TypeScript and
ESLint jobs and is separately type-checked. Its editor dependencies never become
portfolio dependencies. This layout is monorepo-compatible without forcing npm
workspaces or coupling the two builds. Neither application was deployed.

The public read client uses a pinned API version, `perspective: published`,
`useCdn: false`, and no token. The GROQ query also excludes draft and release-version
IDs. Results pass through Zod before being mapped into frontend types. No Sanity
field names or client calls are needed in presentation components. Published-only
reads follow [Sanity's perspective documentation](https://www.sanity.io/docs/content-lake/perspectives).

## Content model and editor

- Profile singleton (`profile`): display name, professional headline, introduction,
  About paragraphs/introduction, optional real portrait/location/resume, public
  email, and professional/social links.
- Homepage singleton (`homepage`): hero headline/emphasis/supporting text, section
  headings/descriptions, About heading, Connect headline/emphasis/message.
- Projects: stable slugs, canonical summaries/status/ownership/roles/team size,
  technologies, overview, purpose, contributions, confirmed/development features,
  optional technical decisions/challenges/lessons, links, real screenshot galleries,
  alt text/captions, featured state, and display order.
- Skills: category, name, supported optional icon, order, and visibility. No
  proficiency percentages or mastery claims.
- Education: institution, program, status, optional real dates/description/order.
- Reusable image type: genuine asset, required meaningful alt text, optional caption.

Studio uses the built-in Structure tool, not a custom dashboard or paid plugin.
Singletons have fixed document IDs and cannot be duplicated/deleted/unpublished
through this editor. Project tabs separate summary, case study, evidence, and
display fields. Original project slugs are read-only after starter import. Native
array controls support reordering screenshots and narrative sections; document
display order controls project sorting. Required/optional fields have validation
and descriptions. Publication remains the editor's responsibility: syntax checks
cannot prove claims or remote availability.

## Loading and fallback policy

`PORTFOLIO_CONTENT_SOURCE=auto` is the default. With both project ID and dataset
blank, the repository returns the existing local profile, homepage copy, skills,
education, and all four project records. No request occurs and there is no runtime
CMS error. `local` is an explicit offline mode even if CMS IDs are present.
`sanity` requires complete configuration; partial configuration fails clearly.

When configured, only published documents load at build time. Missing singleton
documents, skills, education, or original projects retain the relevant local
records with build warnings. Missing/blank required singleton or original-project
fields retain verified local values rather than erasing them. Empty factual text
lists retain baseline facts; an explicitly empty pending list clears resolved
documentation gaps. Explicit booleans such as featured=false and visible=false
are respected. Optional fields with no local value remain absent.

Malformed content, invalid URLs/enums/images/dates, duplicate slugs/IDs, renamed
preserved project identities, and team/solo ownership contradictions fail
validation. MarketLink's confirmed three-member team is protected. New projects
require title, summary, status, classification, and overview before routes can
generate. All complete published slugs generate statically, while the original
four routes always remain available under the missing-document policy.

Configured network/access failures stop the build with a sanitized error; there
is no automatic stale-content fallback. An operator can deliberately select
`PORTFOLIO_CONTENT_SOURCE=local` for an offline build. This policy is explicit,
not a hidden retry fallback. Restart the development server after publishing if
testing configured content locally; production updates always need a new build.

## Environment variables

Portfolio root `.env.local` (see `.env.example`):

```dotenv
PORTFOLIO_CONTENT_SOURCE=auto
SANITY_PROJECT_ID=<your-public-project-id>
SANITY_DATASET=production
SANITY_API_VERSION=2026-10-13
```

`studio/.env.local` (see `studio/.env.example`):

```dotenv
SANITY_STUDIO_PROJECT_ID=<same-project-id>
SANITY_STUDIO_DATASET=production
```

IDs/dataset names are non-secret. Studio bundles SANITY_STUDIO_* variables, as
[Sanity documents](https://www.sanity.io/docs/studio/environment-variables).
Never put write/read tokens or deployment credentials in those variables or in
NEXT_PUBLIC_* variables. The portfolio currently supports public datasets only
and consumes no tokens. Both applications' local environment files are ignored.
Studio uses Sanity's normal account sign-in for editing, not custom authentication.

## Owner setup — no account was created by the agent

1. Create/sign in to a Sanity account and create a project in
   [Sanity Manage](https://manage.sanity.io/). Choose the **Free** plan and a public
   dataset named `production`. Do not select a paid plan or attach billing for
   this portfolio. Free projects have included quotas and do not allow paid
   overages; see [plans and payments](https://www.sanity.io/docs/platform-management/plans-and-payments).
2. Copy the real project ID and fill the two environment files above. Do not use
   the synthetic test ID from verification as your real configuration.
3. From `C:\Sohail-Portfolio`, install the portfolio with `npm.cmd ci`; install
   Studio separately with `npm.cmd --prefix studio ci`.
4. Run `npm.cmd run studio:dev`, then open http://localhost:3333 and sign in.
   If needed, permit only this exact Studio origin in the project's CORS settings
   with authenticated credentials. Add a future deployed Studio origin only when
   selected. Do not grant wildcard CORS. Build-time Node reads do not need CORS.
5. To start with the existing factual content, regenerate the local import with
   `npm.cmd run cms:seed`. Then, from `studio/`, run the following yourself after
   reviewing `seed.ndjson` and signing in:

   ```powershell
   npm.cmd exec -- sanity login
   npm.cmd exec -- sanity datasets import seed.ndjson production --missing
   ```

   `--missing` skips IDs already present; it avoids replacing edited documents.
   This is a remote write for the owner to perform, not an action performed here.
   Import behavior follows the [datasets CLI reference](https://www.sanity.io/docs/cli-reference/cli-datasets).
   The generated 32-document starter includes the four original projects, local
   profile/homepage, Aptech education, and supplied skill exposure. It contains
   no invented URLs, images, dates, or employment.

6. Review documents, add only verified personal information, and publish. Run
   `npm.cmd run build` at the portfolio root to fetch/validate published content
   and generate `out/`. `npm.cmd run studio:build` separately builds Studio into
   `studio/dist/`; it does not deploy either application.

## Screenshots and publishing

Upload genuine screenshots in the project's Media & links tab. Add descriptive
alt text and optional captions; drag to reorder, then publish. Asset metadata
supplies original dimensions. Missing assets become pending states; malformed
image records with a real URL but missing alt/dimensions fail validation.

The image component uses native responsive srcset for Sanity images, capped at
1600px with CDN auto-format transforms and intrinsic proportions. Images load
lazily and decode asynchronously. Local files continue using unoptimized Next.js
Image. There is no image-optimization server. This uses
[Sanity's image transformation API](https://www.sanity.io/docs/content-lake/image-urls).
Browsers may request public image assets from the CDN, but never query CMS content.
Full original screenshots are displayed; editor crop/hotspot selections are not
applied in this phase.

Workflow: **edit → publish → trigger portfolio build → validate/export → deploy
the new out/**. Publishing does not alter a previously deployed static site.
Hosting, deployments, and webhooks are not configured. Later, a hosting provider
or CI job can rebuild on a verified webhook or manual trigger; keep deploy-hook
secrets in the provider's secret store, never in Studio/browser code. Failed CMS
builds should not replace the previous working deployment.

## Security and dependency review

Root production dependency audit reports zero vulnerabilities. The earlier five
high-severity development lint-chain findings remain unchanged. Added root
packages are @sanity/client, Zod, and the small server-only guard.

Studio is isolated from the public site. Its audit initially reported 17 findings;
compatible same-major overrides update @vercel/frameworks' smol-toml to 1.9.1 and
js-yaml to 3.15.2, reducing the audit to 16 (7 high, 9 moderate). Remaining paths
are Studio/CLI tooling: Sanity CLI/codegen → chokidar/globby → braces/micromatch;
framework detection → js-yaml/argparse/sprintf-js; typeid-js → uuid 10. The installed
uuid 10 also emits a deprecation warning. Upstream parser branches still have
unresolved advisories; the audit's broad suggested fix downgrades Sanity across a
major version. No force fix, unsafe major override, or portfolio migration was
applied. These dependencies do not ship in out/; recheck before deploying Studio.

## Files

Created: `src/types/portfolio.ts`, `src/content/homepage.ts`,
`src/lib/content/{adapter,images,load,local,repository}.ts`,
`src/lib/sanity/{client,query}.ts`, `src/components/ui/{content-image,editorial-title}.tsx`,
`playwright.content.config.ts`, `tests/{content,cms-runtime}.spec.ts`,
`scripts/create-sanity-seed.mjs`, and the separate Studio package/configuration,
environment example, structure, five document schemas, reusable image type,
32-document seed, and lockfile under `studio/`.

Modified: profile-consuming homepage sections, editorial header/footer, root
layout/metadata, homepage and case-study pages, async project utilities, project
type, gallery renderer, grid row-count styling, CMS config, npm package/lockfile,
environment example, ignore files, root lint/TS exclusions, README, and architecture
notes. Navigation destinations, behavior, verified project data, Next.js static
configuration, and Windows export workaround remain intact.

## Verification

Executed checks: portfolio lint, strict typecheck, formatting, credential-free
production build/static export, and the full **57-test content/browser suite**
(all passed). The standalone content
suite has 12 passing tests covering local/no-fetch behavior, mock configured reads
and failures, the factual seed round-trip, optional fields, unsafe URLs, duplicate
and malformed slugs, ownership, drafts, dates, images, display/visibility, and
explicitly clearing resolved pending labels.
The content tests also passed after the final malformed-image URL guard and
intrinsic local-portrait dimension adjustment; these targeted checks require no
CMS account or browser. The final production build was rerun successfully.

Studio typecheck, build, and schema extraction passed with synthetic public IDs.
The portfolio production-only audit reports zero findings. The build still exports
all four case-study routes and normalizes five Windows payload files. Browser
testing includes the existing responsive/navigation suite and confirms that pages
do not query the Sanity content API in the browser. Sanity client/config markers
were not found in the public browser chunks.

An initial regression run was interrupted while a build was completing; its
orphaned local file server was identified and stopped before subsequent runs.
No results from that incomplete run are counted. Test-runner color warnings,
intentional unknown-route 404s, Studio CLI telemetry notices, and the documented
dependency/deprecation warnings remain informational or explicitly unresolved.

## Remaining setup and limitations

No live Sanity dataset/account access, authenticated Studio editing, real asset
upload, or CMS deployment has been tested. Configured loading is exercised with
mocked published payloads and the factual starter import. Studio compile/schema
checks use synthetic public IDs only; they do not establish live connectivity.
Actual Sanity API transport and publishing require the owner's project and account.
The editor cannot verify human claims; publish only factual evidence. Previously
missing contact details, screenshots, repositories, and technical case-study
information remain missing. No Phase 6 work was started.
