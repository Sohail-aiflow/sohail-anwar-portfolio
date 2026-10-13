# Personal portfolio — Phases 1–6A

Phase 6B preparation records the confirmed public identity **Sohail Anwar**,
`sohailanwar.ai@gmail.com`, and `https://github.com/Sohail-aiflow` in local defaults
and social assets. The owner published the canonical Sanity Profile; token-free
API reads and the real CMS build verify the identity and contacts. Repository
creation/deployment are approved and pending account authentication; see
[Phase 6B status](docs/phase-6b.md). No remote repository or live URL exists yet.

Phase 6A adds launch-safe metadata, static social cards, robots/sitemap, local-font
loading and measured accessibility/performance polish. No deployment has occurred.
Read [launch readiness and the predeployment checklist](docs/phase-6a.md).

Leave `SITE_URL` blank and `SITE_INDEXABLE=false` until an approved public HTTPS
origin is selected. This safely exports noindex pages without fabricated canonical
URLs. Set the real origin and enable indexing only for the approved launch build.
Regenerate social title cards locally with `npm.cmd run social:generate` after
changing names/titles/descriptions; committed PNGs need no Chrome on hosting builds.

Phase 5.5 connected the real Free Sanity project and migrated 30 restricted seed
records to canonical public IDs. All original records are retained. See the
[live activation and migration report](docs/phase-5.5.md) for current verification
and remaining limitations; older Phase 5 setup notes describe the initial state.

Bright Frosted Editorial portfolio for an ACCP AI / Software Engineering student
at Aptech. The homepage and four dedicated case studies use Next.js static export.
Sanity published-content reads now run at build time, with credential-free local
fallback. Studio is a separate application. Neither app has been deployed.

## Development and verification

Use Node 24 (tested) and npm. On Windows PowerShell, use `npm.cmd` if execution
policy prevents running `npm.ps1`.

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run format:check
npm.cmd run test:content
npm.cmd run build
npm.cmd run test:browser
```

Development: http://localhost:3000. `npm.cmd run format` formats source.
The production build creates `out/`; `next start` is not used. Browser tests use
installed Chrome and a temporary loopback-only Python file server. Content tests
are pure Node tests and need no browser, CMS credentials, or prebuilt export.
Screenshots and failure traces are ignored under `test-results/`.

## Sanity setup

The portfolio builds without credentials. When both CMS environment fields are
blank, existing local profile, homepage, projects, skills, and education remain
the source of truth. No network request occurs.

For CMS editing, create a **Free** Sanity project and public dataset yourself.
Copy real IDs into root `.env.local` and `studio/.env.local` using their examples.
No token is needed for public published-content reads. Install Studio separately:

```powershell
npm.cmd --prefix studio ci
npm.cmd run studio:dev
npm.cmd run studio:typecheck
npm.cmd run studio:build
```

Studio opens at http://localhost:3333 and uses normal Sanity sign-in. Its build
goes to `studio/dist/`; it does not deploy. Do not deploy the synthetic Studio
verification build. `studio/seed.ndjson` contains 32 factual starter documents;
`npm.cmd run cms:seed` regenerates it locally. Review the owner import instructions
in [Phase 5](docs/phase-5.md) before performing any remote writes.

Root environment variables:

- `PORTFOLIO_CONTENT_SOURCE`: auto (default), local (explicit offline), or sanity.
- `SANITY_PROJECT_ID` and `SANITY_DATASET`: both blank for local, both set for CMS.
- `SANITY_API_VERSION`: pinned API date, default 2026-10-13.

Studio uses only public `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
Never put tokens in browser-exposed variables or commit environment files.

Configured reads validate published content. Missing documents/fields preserve
verified local records with warnings. Invalid content or failed configured reads
stop the build instead of silently deploying stale facts. Explicit `local` mode
is the documented offline alternative. Restart configured development after
publishing; production updates always need a new build.

Workflow: **edit → publish → rebuild portfolio → deploy new out/**. Sanity
publishing does not update deployed static HTML automatically. Hosting,
deployments, and webhooks remain unconfigured.

## Source map

- `src/app`: layout, homepage, static project routes, 404, metadata, global styles.
- `src/components`: existing design primitives, navigation, homepage sections,
  reusable case-study/media components.
- `src/content`, `src/data`: factual local fallback records and editable copy.
- `src/types`: frontend portfolio/project models.
- `src/lib/content`: local fallback, validation/normalization, image URLs, server-only repository.
- `src/lib/sanity`: optional configuration, published-only query, build-time client.
- `src/styles`: existing tokens and homepage/case-study styles.
- `studio/`: separate package/lockfile, schemas, singleton structure, editor config,
  environment example, factual starter import.

Locally bundled Newsreader and DM Sans remain in place. No paid assets/plugins
were introduced. Root CMS dependencies are @sanity/client, Zod, and server-only;
editor dependencies are isolated in Studio. Motion was replaced by the equivalent
reduced-motion-aware CSS navigation transition. Radix remains unnecessary.

## Content and evidence

The four original project identities/slugs are preserved. Complete new published
projects can add static routes; featured/visibility and display-order fields
control presentation. Project navigation and interactions stay in code.

Local fallback records live in `src/data/projects.ts`; configured mode uses
published documents through the adapter. Missing contact details, roles, stacks,
repository links, screenshots, and case-study evidence are not invented.
Concept artwork remains distinct from genuine screenshot galleries.

Add real screenshots through Studio with alt text and captions, or add local
`screenshots` records with src, alt, width, height, and optional caption. Sanity
images use responsive CDN variants without a Next.js optimization server. The
team MarketLink URL is still marked as unverified for public accessibility.

Static hosting must serve `404.html` with HTTP 404 for unknown paths, not use a
blanket SPA redirect. The build retains the idempotent Windows payload-copy step
for Next.js export compatibility; no persistent server is required.

## Reports and limitations

See [architecture](docs/architecture.md), [Phase 2](docs/phase-2.md),
[Phase 3](docs/phase-3.md), [Phase 4](docs/phase-4.md), and [Phase 5](docs/phase-5.md).

Live published-content API reads and the real CMS-backed static build are verified
in Phase 5.5, including the owner-operated edit/publish/restore workflow. Real asset
upload and deployment remain unverified. Mocked content and local fallback are
tested separately. Phase 6A adds automated accessibility/link/SEO checks and local
mobile/desktop Lighthouse measurements; those are not complete WCAG certification.
The owner should confirm the working display name, contact details, missing
project facts, repository URLs, and genuine images.

Root production dependency audit reports zero findings; five earlier development
lint-chain findings remain. Studio tooling has 16 unresolved findings after
compatible parser updates; details and dependency paths are in the Phase 5 report.
No forced major downgrade or framework migration was performed. Phase 6A makes no
remote content changes; hosting, webhooks and Phase 6B remain unconfigured.
