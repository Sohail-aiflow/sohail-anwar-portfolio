# Sohail Anwar - Portfolio

Student software developer portfolio built with Next.js static export, React, TypeScript, Tailwind CSS, and a separate Sanity Studio. The approved design uses local Newsreader/DM Sans fonts, light/dark themes, editorial surfaces, and four factual case studies.

- **Live:** https://sohail-anwar-portfolio.pages.dev/
- **Source:** https://github.com/Sohail-aiflow/sohail-anwar-portfolio
- **Approved release:** Phase 6F UX fixes and Phase 6G refinements are owner-approved for Phase 6H publication. See the release report for the actual commit, deployment, and live verification status.
- **Owner decisions pending:** genuine project evidence and separately authorized CMS wording updates. Car Rental and School CMS ownership is confirmed as independent frontend, backend, and database development. Published CMS fields remain unchanged during this release. Indexing remains disabled; Studio is not deployed; no webhooks are configured.

## Local setup

Use Node 24 and npm. Windows PowerShell may require `npm.cmd` instead of `npm`. Copy `.env.example` to ignored `.env.local`; never commit credentials.

```powershell
npm.cmd ci
npm.cmd run dev
```

Development opens at http://localhost:3000. Explicit offline mode uses `PORTFOLIO_CONTENT_SOURCE=local`. Auto mode uses local facts when both CMS identifiers are blank. Configured CMS request/validation failures stop the build; missing optional fields/documents can retain factual local values with warnings that require review.

| Variable                   | Purpose                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `PORTFOLIO_CONTENT_SOURCE` | `auto`, `local`, or required `sanity`                                                  |
| `SANITY_PROJECT_ID`        | Public project ID; connected project `xc6vvvsv`                                        |
| `SANITY_DATASET`           | Public published-content dataset: `production`                                         |
| `SANITY_API_VERSION`       | Pinned API date: `2026-10-13`                                                          |
| `SITE_URL`                 | Public HTTPS origin; local preparation uses `https://sohail-anwar-portfolio.pages.dev` |
| `SITE_INDEXABLE`           | Keep `false`; configuring an origin alone does not enable indexing                     |

Blank `SITE_URL` safely omits canonical/social-image origins. A valid origin emits per-page canonical URLs and existing social cards while noindex remains active. Changing domains requires changing this variable and rebuilding. Local values do not change Cloudflare production variables.

## Build and verification

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run format
npm.cmd run format:check
npm.cmd run test:content
npm.cmd run build
npm.cmd run test
```

Build output is `out/`, with the homepage, four case studies, robots/sitemap, social cards, and a 404 page. The build normalizes nested Windows export payloads. Do not use `next start`; no backend is required. Static preview:

```powershell
python -m http.server 4173 --bind 127.0.0.1 --directory out
```

Stop that preview before browser tests; Playwright starts its own server on 4173. Browser tests use installed Chrome and Python. Content tests use Node fixtures/injected reads. To include real token-free Sanity verification:

```powershell
$env:VERIFY_LIVE_SANITY='1'
npm.cmd run test
Remove-Item Env:VERIFY_LIVE_SANITY
```

`npm.cmd run audit:performance -- label` measures the running loopback production preview with mobile/desktop Lighthouse. Record host, throttling, transfer conditions, and repeated runs before comparing scores. `npm.cmd run social:generate` regenerates approved editorial title cards locally; these are not project screenshots. Audit artifacts and traces are ignored under `test-results/`.

## Sanity and production content updates

Sanity Free project `xc6vvvsv`, public dataset `production`, supplies 32 canonical published documents. Published content is read at build time without a token. Canonical IDs are dot-free; archived dotted originals are excluded from normal editing and portfolio queries. Never reimport or change remote documents without specific owner authorization.

Studio has a separate package and ignored `studio/.env.local`, with public `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. Never put credentials in browser variables.

```powershell
npm.cmd --prefix studio ci
npm.cmd run studio:dev
npm.cmd run studio:typecheck
npm.cmd run studio:build
```

Studio opens at http://localhost:3333 with normal Sanity sign-in. Its build produces `studio/dist/` without deploying it. The seed generator is not a routine publishing step; see [Phase 5.5](docs/phase-5.5.md).

Workflow: **edit, publish in Studio, verify public API, rebuild portfolio, then separately authorize deployment of new out/**. Publishing alone does not update live HTML. Cloudflare Pages hosts the current public portfolio on the Free plan. Source-build settings are `npm run build` and output `out`; configured builds need reviewed public CMS/origin/indexing values. Phase 6G does not change hosting settings, deploy, configure hooks, or enable indexing.

## Source and evidence

- `src/app`: homepage, project routes, layout, metadata, robots/sitemap, 404.
- `src/components`, `src/styles`: navigation, themes, editorial surfaces, case-study UI.
- `src/data`, `src/content`: factual offline defaults.
- `src/lib/content`, `src/lib/sanity`: validation, published queries, normalization, build-time repository.
- `studio/`: separate editor, schemas, canonical document lists, reviewed seed tooling.
- `tests/`, `docs/`: regression coverage and verification reports.

Team and Solo MarketLink remain distinct; Solo is in progress. Concept illustrations are labeled and are not interface evidence. Screenshots, captions, repository URLs, and technical claims need owner verification. No professional employment or client use is implied.

See [Phase 6F](docs/phase-6f-ux-audit-and-proposals.md), [Phase 6G](docs/phase-6g-quality-refinement.md), [Phase 6H release verification](docs/phase-6h-release-verification.md), and [architecture](docs/architecture.md). Older reports describe historical checkpoints. Automated checks are not full WCAG certification or field Core Web Vitals. Older dependency audit findings are dated snapshots, not newly executed audit results.
