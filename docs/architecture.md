# Portfolio architecture

The App Router produces a static export in `out/`. There are no API routes,
server actions, custom backend, database, or persistent Next.js server.
`trailingSlash` creates directory-based routes; images are unoptimized because
the runtime image optimizer is unavailable on static hosting.

## Content boundary

Phase 3 composes Hero, SelectedWork, About, Skills, Education (inside Skills),
Connect, and SiteFooter. Personal copy, education, skill exposure, optional real
portrait, and contact links live in `src/content/profile.ts`. Verified contacts
are currently empty, so Connect renders an honest noninteractive pending state.
No forms, API routes, runtime CMS requests, or contact services have been introduced.

`src/types/project.ts` defines the shared content contract. Local records in
`src/data/projects.ts` contain only supplied facts. `unconfirmed` collaboration,
omitted roles, and empty technology arrays express missing information rather
than inventing it. The MarketLink team URL is supplied but not independently
verified. No screenshot, repository, result, or case study evidence is invented.

`src/lib/projects.ts` provides the content access boundary. Phase 4 implements
`/projects/[slug]`, exports `generateStaticParams` using `getProjectStaticParams()`,
sets `dynamicParams = false`, and resolves known projects at build time.
Per-page metadata derives from the same records. No runtime generation is used.
`notFound()` handles unresolved records, and the exported not-found page provides
accessible return navigation. A static host must serve `404.html` with a 404 status
for unknown files; no fallback project slugs or blanket SPA rewrites are generated.

SelectedWork receives the same project records through `getProjects()`. One
local selected-ID state adds pointer-hover/focus behavior to a native radio
group. CSS `:checked` controls preview visibility, preserving selection without
JavaScript. Desktop places the list beside a fixed-size preview; mobile places
that preview directly below the selection group. All panels share the same
position and dimensions at each breakpoint. The DOM contains every project,
while inactive previews are hidden by CSS and unavailable to assistive technology.
Titles, descriptions, status, role/context, stacks, and external links derive
from the typed data. Skills' collaborative experience also uses the same team
record. CSS/Lucide artwork is explicitly conceptual, never presented as a real
application screenshot. Case-study actions now link to generated internal routes.
External new-tab links use noopener and noreferrer.

Project.caseStudy is a structured optional object containing overview, optional
purpose/responsibilities, typed confirmed/development functionality, optional
verified approach/challenge sections, evidence notes, and an explicit pending list.
Screenshots require dimensions and meaningful alt text, with optional captions.
The server-rendered ProjectMedia gallery reserves image proportions and shows a
pending state when no evidence exists. No CMS client or account is required.

The build runs `scripts/normalize-static-export.mjs` after Next.js exports. It
copies nested `__next.*` text payloads into the dotted filenames requested by
the browser, working around the documented Windows path-separator issue. It only
touches generated files inside out/, preserves originals, detects conflicting
targets, and is idempotent. It is a no-op for exports already using flat names.
See the [upstream issue](https://github.com/vercel/next.js/issues/92339).

## Sanity integration — Phase 5

`src/lib/content/repository.ts` is server-only and caches normalized published
content per build worker. It supplies async project utilities, static params,
metadata, layout, and homepage props. UI components depend on frontend types,
never Sanity-specific field names. Profile, homepage copy, skills, education,
projects, optional verified links, and image metadata cross this boundary.

No configuration means no CMS request and the unchanged local baseline records.
Configured public-dataset reads use @sanity/client with perspective=published,
useCdn=false, a pinned API date, and no token. GROQ also excludes drafts and
release versions. Zod rejects malformed content and unsafe HTTPS links.
Missing documents/fields preserve local verified facts with build warnings;
unexpected configured network/access failures or invalid data stop the build.
Explicit PORTFOLIO_CONTENT_SOURCE=local is the documented offline policy.
The four original project identities/slugs remain preserved; complete new
published projects generate additional static routes. Visibility/featured flags
are explicit controls, with a dynamic selector row count.

`studio/` has its own npm package, lockfile, schemas, singleton structure,
configuration, and separately deployable dist/. Root TS/lint exclude editor
sources; Studio has its own typecheck. Editor dependencies do not enter out/.
The Studio uses normal Sanity authentication, not custom auth or a dashboard.
Phase 5.5 connected the owner's Free project and performed approved seed/migration
writes. Canonical IDs are dot-free; archived dotted originals remain untouched and
excluded from normal editing and published queries. No deployment or webhook exists.

Sanity images use intrinsic dimensions, lazy loading, and native responsive srcset
with capped CDN transforms; local assets retain unoptimized Next.js Image.
Images may load from the asset CDN, while content never loads from the CMS in the
browser. No image-optimization server is required. Publishing still requires a
fresh portfolio build and deployment. See docs/phase-5.md for setup and policies.

## Design and accessibility

Bright Frosted Editorial uses locally bundled OFL fonts (Newsreader and DM Sans),
dark ink, sage accents, quiet pastel glows, and selective glass surfaces. CSS variables
define colors, typography, spacing, radii, borders, shadows, and motion. Tailwind
v4 uses its PostCSS plugin and CSS-first theme mapping. Semantic landmarks, a
skip link, visible focus, responsive typography, and reduced-motion support form
the accessibility baseline. Phase 2 adds a single semantic navigation landmark:
desktop header links become a fixed top pill after the header leaves the viewport;
mobile uses a bottom dock with safe-area clearance. The header slot reserves space
to prevent content shifts. Intersection observers track the header and section
reading region; they disconnect on route changes and unmount. A scrollend listener
updates active state once scrolling settles, and hashchange handles fragment
changes. Both listeners are removed on cleanup. There is no continuous scroll
listener. The requested fragment is honored at its destination, including when
short final sections share a clamped scroll position.

Root-relative fragment links return to homepage sections from future routes.
Targets are named sections and programmatically focusable. Future page templates
must keep one `main` landmark with `id="main"` for the shared skip link.
Motion is limited to a short opacity/transform navigation transition; there is no
parallax or scroll manipulation. Reduced motion disables animated scrolling and
the CSS transition. Motion was removed in Phase 6A. The dock remains usable without client JavaScript;
desktop floating state and scroll-based active indication require hydration.
The static atmosphere is noninteractive and hidden from assistive technology.
Only floating navigation uses backdrop-filter, keeping other surfaces inexpensive.
Homepage styles live separately in `src/styles/homepage.css`; obsolete Phase 2
preview-shell styles and the unused FoundationNote component were removed.
Native HTML is
sufficient, so Radix is deferred until an interactive component needs it.

## Hosting and budget

Cloudflare Pages configuration: build command `npm run build`, output directory
`out`, Node 24.21.0 pinned in `.node-version`. Use static hosting, not an SSR adapter.
All installed libraries and fonts are free/open source. No billing-enabled
service has been provisioned. Git is initialized locally; a GitHub remote and
deployment require the owner's repository/account information.

References: [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports)
and [Tailwind Next.js setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs).

## Phase 6A launch boundary

`SITE_URL` explicitly configures the public HTTPS origin, while `SITE_INDEXABLE`
separately gates indexing. Without the origin, production canonical/social URLs
are omitted, robots blocks crawling and sitemap contains no URLs. With it, each
page receives distinct canonical/Open Graph/Twitter metadata and factual escaped
JSON-LD. Static App Router metadata routes export robots and sitemap without a
runtime backend. Local Chrome tooling generates committed social PNG title cards;
hosting builds copy them without generating images at runtime. Local fonts use
Next's local font loader. Accessibility, link and metadata tests supplement the
existing CMS/navigation/export regressions. See [Phase 6A](phase-6a.md) for measured
results, remaining launch inputs and free static hosting preparation.
