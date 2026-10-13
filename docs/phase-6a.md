# Phase 6A — Production polish and launch readiness

Phase 6A preserves the Bright Frosted Editorial layout, factual project identities,
canonical Sanity records, static export, and verified edit/publish/rebuild workflow.
No portfolio or Studio deployment, remote content change, permission change,
webhook, GitHub remote, paid service, or Phase 6B work was performed.

## SEO and deployment origin

`src/lib/seo.ts` creates unique page titles/descriptions, Open Graph and Twitter
large-image cards, canonical URLs, and explicit indexing rules. The homepage uses
the current profile name/headline/introduction. Each project uses its own title
and factual overview. The four project titles remain distinct. Each visible page
has one H1, section H2s and subsection H3s.

The real public domain has not been selected. Root environment configuration adds:

```dotenv
SITE_URL=
SITE_INDEXABLE=false
```

`SITE_URL` must be the approved public HTTPS origin, with no credentials, port,
subpath, query, or fragment. Localhost, IP literals, local/internal hosts and
invalid URLs fail validation. `SITE_INDEXABLE=true` requires a configured origin.
No production domain is guessed. In the unconfigured final export, canonical,
OG URL/image URLs, and origin-dependent JSON-LD are absent, sitemap XML has no
URLs, and robots/meta tags block indexing. Local social assets still exist.
After selecting the real hosting origin, set it explicitly and rebuild. For
previews use `SITE_INDEXABLE=false`; enable indexing only for the approved launch.

Static App Router metadata files export `/robots.txt` and `/sitemap.xml` with no
runtime handler. Configured sitemap lists the homepage and every canonical
published project, including future valid projects. Dates are omitted rather than
inventing last-modified dates. Homepage WebSite and project CreativeWork JSON-LD
use factual names, descriptions and page URLs; no employer, awards, client results
or completed-feature claims are added. JSON text escapes `<` to prevent a supplied
string from terminating the script element. There is no raw HTML CMS rendering.

An explicitly temporary reserved-origin fixture verified absolute canonicals on
all five pages, social image metadata, JSON-LD, five sitemap URLs and indexable
robots. The fixture origin was process-only and is absent from the final export
and saved environment files. Unit tests cover absent, valid, unsafe and invalid
configuration, indexing prerequisites, and script-termination escaping.

## Static social previews

`npm.cmd run social:generate` uses locally installed Chrome and embedded, bundled
Newsreader/DM Sans fonts to create five 1200×630 PNG title cards in `public/social/`.
The same frosted palette, editorial type and verified titles/summaries are used.
These are social title cards, not fabricated application screenshots. A manifest
records their text and dimensions. The team card was visually inspected.

Cards are committed source assets and copied to `out/social/`; ordinary hosting
builds require neither Chrome nor an image service. Regenerate them locally after
changing names/titles/descriptions, review them, and include the assets in the
approved release. The four original projects have dedicated cards; new projects
currently fall back to the reusable portfolio card unless their metadata mapping
is extended. No dynamic OG endpoint or paid service exists.

## Accessibility and content review

Two measured label-in-name issues were corrected: the identity link now includes
its visible name and headline, and case-study actions include the exact visible
words “Read case study.” Tests use those accessible names. Keyboard skip links,
focus outlines, radio selection, no-JavaScript selection, reading-order semantics,
mobile dock labels, safe-area clearance, and reduced-motion behavior remain intact.
The brief navigation transition now uses CSS with reduced-motion opt-out.

Automated axe checks cover WCAG A/AA and relevant best-practice rules on the
homepage and all four project pages at 320, 375, 768, 1024 and 1440 pixels. The
production tests also check one H1, page metadata, overflow, image alternatives,
internal links/section targets, and external noopener/noreferrer handling. There
are no empty contact buttons: missing contact information has an honest pending
state. Missing genuine screenshots have a pending state rather than broken images.

Automated results are not a claim of complete WCAG compliance. Before launch,
manually review NVDA/VoiceOver reading order, radio announcements and navigation
focus after routing; zoom/reflow and Windows high-contrast mode; touch targets on
real iOS/Android hardware; and representative long future CMS content. Transparent
surfaces and decorative gradients deserve manual contrast review despite automated
passing checks. No contact information, image, resume or repository link was invented.

The supplied team URL `https://aptechmetrostargate.com:190/` returned HTTP 200
without authentication and Chrome rendered “MarketLink — Connecting Fresh.
Sourcing Local.” with its public navigation and discovery interface. This verifies
homepage reachability at the time of testing, not feature correctness, uptime,
or screen-reader compliance of that external site. The CMS verification flag and
existing portfolio uncertainty text were left unchanged as required.

## Performance measurements

Only floating navigation and SelectedWork need client state. CMS validation,
metadata, case-study text/media and the other homepage sections remain server
components. Sanity/Zod/native Node transport stay out of browser JavaScript.

Motion was used only for a short opacity/translation transition. It was replaced
with the same-duration CSS animation and the unused dependency removed. Local
fonts now use `next/font/local`, explicit Latin files, preloads, swap behavior and
generated fallback metrics. Faces and typography are preserved. Native image
srcset, capped Sanity CDN variants, lazy loading and intrinsic dimensions remain.
No prefetch behavior, accessible interaction, or visual section was removed.

Actual Lighthouse 13.5.0 runs used installed Chrome, a loopback Python static
server, mobile simulated throttling (4× CPU) and the actual desktop configuration.
The post-polish SEO audit used the explicitly indexable reserved-origin fixture;
the final unconfigured export intentionally remains noindex. Baseline and final
single-run measurements are diagnostic, not production field Core Web Vitals:

| Measure                  | Baseline mobile | Polished mobile | Baseline desktop | Polished desktop |
| ------------------------ | --------------: | --------------: | ---------------: | ---------------: |
| Performance              |              74 |              80 |               98 |               99 |
| Accessibility score      |             100 |             100 |              100 |              100 |
| Best practices           |             100 |             100 |               96 |              100 |
| SEO, indexable fixture   |             100 |             100 |              100 |              100 |
| First contentful paint   |          2.28 s |          1.06 s |           0.51 s |           0.30 s |
| Largest contentful paint |          6.00 s |          5.39 s |           1.02 s |           1.02 s |
| Total blocking time      |          129 ms |           36 ms |            59 ms |             0 ms |
| Cumulative layout shift  |          0.0040 |               0 |           0.0126 |                0 |

Homepage JavaScript resource bytes fell from 621,903 to 491,675 (~21%). Font
resource bytes were 159,536 in both mobile runs; the font change improves loading
and stability rather than claiming a font-byte reduction. Resource totals include
framework hydration and link prefetches; these are not gzip sizes. Mobile LCP
remains above the 2.5-second “good” target in this lab environment. The local
server lacks production compression/caching, so transfer/cache diagnostics must
be rerun on the eventual HTTPS host. Unused framework JS and legacy-JS diagnostics
remain; no unsafe framework upgrades or interaction removal were applied.

The aggregate accessibility score hid a label diagnostic, so the individual
finding was inspected and fixed rather than relying on 100 alone. Final Lighthouse
runs have no label-in-name finding. Visual QA also caught and corrected the
local-font variable scope; final screenshots and computed styles confirm the
intended serif/body pairing. An initial desktop run accidentally
used mobile settings; it was excluded and rerun with desktop config. Browser test
output is now under `test-results/browser/` to preserve independent audit files.

Reproduce Lighthouse with a static server on 127.0.0.1:4173 and
`npm.cmd run audit:performance`. Stop that server before browser tests, which start
their own server on that port. Reports are local, ignored verification artifacts.

## Security and CMS production safety

Production dependencies have zero npm audit findings. Root development tooling
has five high findings in the existing Next lint → fast-glob/micromatch/braces
chain. Studio has 16 findings (7 high, 9 moderate), involving Sanity CLI/codegen,
parser and UUID tooling; these editor dependencies are isolated from the public
export. Audit suggestions require framework/tooling major downgrades, so no force
fix or unsafe major override was applied. Free audit tools are development-only.

Published-only, dot-free canonical GROQ filters, pinned API version and token-free
public reads are unchanged. Fresh reads use the Phase 5.5 native Node transport,
not Next's persistent fetch cache. Read-only migration preflight still sees 74
records, 12 system documents, zero missing public destinations and zero conflicts.
Live adapter testing confirms 32 canonical records without fallback warnings.
Existing content tests verify configured fetch failures stop builds, unsafe URLs
and drafts fail validation, and no-configuration local fallback performs no fetch.
No remote data was changed or permission broadened.

Both `.env.local` files remain Git-ignored. No read/write tokens are used by the
portfolio. Studio exposes only its public IDs. Structured-data serialization is
the only deliberate script injection and is escaped; ordinary CMS text uses React
escaping. External HTTPS links retain noopener/noreferrer. `public/_headers`
prepares nosniff, strict referrer policy, DENY framing, and disabled unused device
permissions for compatible static hosts. Those headers are not supplied by Python
and need verification after hosting approval. No CSP was added that might break
framework scripts or future genuine Sanity images.

## Free hosting compatibility and exact preparation

Recommended: **Cloudflare Pages static HTML export**, with no Workers adapter,
Functions, SSR, or paid service. Its official guide supports existing Next static
exports; output is ordinary static files, so the project stays on its installed
Next 16.4 version. This has been built on Windows/Node 24.21.0, not yet on
Cloudflare's Linux runner. Pin Node using `.node-version` (added) or `NODE_VERSION`.
The local normalizer is idempotent/no-op on already flat Linux payloads. Committed
social assets avoid a Chrome requirement on hosting builds.

Future approved Pages settings:

- Root directory: repository root, not `studio/`.
- Preset: Next.js Static HTML Export, or custom static build.
- Node: 24.21.0 (`.node-version` or `NODE_VERSION`).
- Build command: `npm ci && npm run build`.
- Output directory: `out`.
- Optional deterministic-install setting: `SKIP_DEPENDENCY_INSTALL=1` when using
  the explicit npm-ci command, to avoid a separate automatic installation.
- `PORTFOLIO_CONTENT_SOURCE=sanity`, `SANITY_PROJECT_ID=xc6vvvsv`,
  `SANITY_DATASET=production`, `SANITY_API_VERSION=2026-10-13`.
- `SITE_URL=<approved HTTPS origin>` and `SITE_INDEXABLE=true` only for launch.
  Preview environment: `SITE_INDEXABLE=false`.
- No API token or Studio variables required for the portfolio build.

The free `pages.dev` origin can be used; a purchased custom domain is optional.
Choose the intended hostname before the final indexing-enabled build. Pages Free
currently allows 500 monthly builds, 20,000 files and a 25 MiB per-asset limit.
Keep Free billing scope and do not add paid services. The export is far below the
file/size limits. Git integration requires a separately approved remote/account;
Direct Upload can later use an approved locally built export without a Git remote.

Preserve directory routes and trailing slashes. Keep top-level `404.html`: Pages
uses it for unknown paths and otherwise assumes SPA fallback. Do not add a `/* /
200` rewrite. Do not run `next start` or deploy `studio/dist` with the portfolio.
Verify HTTPS, host redirects, custom 404 status/body, caching and `_headers` on
the selected host before announcing the launch. Publishing Sanity content alone
does not change a deployed static export. Initially rebuild and deploy manually
after publishing; later automation requires separate approval. No deploy hook or
Sanity webhook is currently configured.

Practical alternative: **GitHub Pages user/organization root site** on GitHub Free
with a public repository named `<owner>.github.io`, HTTPS enabled, a Node-24
build and static `out` artifact via an approved Actions workflow. Preserve `_next`
assets by using the Pages artifact workflow/`.nojekyll`. A project subpath site
requires additional basePath/link changes and is not compatible as-is; prefer a
root site. GitHub Pages does not implement the Cloudflare `_headers` file. No
repository or workflow was created by this phase.

Sources checked during this work:
[Cloudflare static Next guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/),
[build image](https://developers.cloudflare.com/pages/configuration/build-image/),
[Free limits](https://developers.cloudflare.com/pages/platform/limits/),
[routing and 404 behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/),
[GitHub Pages plans and root sites](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages),
[GitHub Pages HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https).

## Predeployment checklist and remaining content

1. Confirm the professional display name; “Sohail” remains the supplied working
   name, not a verified full legal/professional name.
2. Supply an actual public contact email and optional verified GitHub/LinkedIn
   profiles. The missing contacts currently prevent a recruiter from contacting
   the owner through the portfolio.
3. Supply genuine project screenshots and repository URLs; confirm pending roles,
   stacks, progress, technical decisions and challenges. Optional portrait and
   resume may remain absent without broken controls.
4. Select free hosting and approve the origin/repository/deployment separately.
5. Set the correct build variables, regenerate/review social cards if content
   changed, and rebuild with indexing enabled only for the approved launch.
6. Run lint, typecheck, format:check, content tests, Studio checks and full Chrome
   regressions with `VERIFY_LIVE_SANITY=1`; review no-fallback output.
7. Complete the manual accessibility checks and later verify host-specific HTTPS,
   404/trailing-slash/header behavior, social previews and real Lighthouse results.
8. Recheck dependency advisories, hosting quotas and missing content immediately
   before deployment. Leave webhooks disabled pending a separate decision.

Phase 6A is a readiness implementation, not a completed public launch. The public
origin and contact/evidence gaps remain launch blockers. Mobile lab LCP and manual
accessibility/host checks remain explicit limitations. Await approval before any
deployment or Phase 6B work.

## Changed files and verification

Added `src/lib/seo.ts`, `src/app/{robots,sitemap}.ts`, static social PNGs and manifest,
`public/_headers`, `.node-version`, `scripts/{generate-social-images,audit-performance}.mjs`,
`tests/production.spec.ts` and this report. Updated layout/homepage/project metadata,
font tokens, navigation animation, identity/case-study accessible labels, related
tests, root scripts/lockfile/environment example, Playwright artifact location,
README and architecture. Added only free development audit tooling; removed Motion.
No schemas, canonical content fields, archived documents or remote settings changed.

The final typography-correct Chrome suite passed **65 tests** (1.8 minutes), including 13 content
tests, the explicit real-public CMS test, six production-readiness tests and existing
homepage/navigation/export/project regressions. The production tests perform 25
axe page/viewport audits with zero reported violations and check links, targets,
overflow, image alternatives and metadata. All four project HTML files, robots,
sitemap and five social images export. Studio typecheck and production build passed.
Root lint, strict typecheck and formatting were checked. Configured SEO fixture
and unconfigured domain-safe behavior were exercised separately. Test-runner color
warnings and intentional unknown-route 404s do not indicate application failures.
