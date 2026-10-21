# Phase 6H - Final accuracy and production release

Date: October 19, 2026, Asia/Karachi. The owner approved the 21 local Phase 6F/6G paths for normal main-branch publication and the existing connected Cloudflare Pages deployment. This report is the additional intentional documentation path. No design or published content change is authorized beyond the approved source refinements.

## Confirmed ownership and proposed CMS wording

The owner explicitly confirms independent frontend, backend, and database development for both Car Rental System and School Website & CMS. Team MarketLink remains a three-person team with the owner's Project Manager and Backend Developer role; Solo remains independently developed and in progress. These are project contributions, not employment, paid-client use, achievements, or feature-completion metrics.

Actual token-free published query: Car/School both currently have `role:null`, `collaboration:"unconfirmed"`, and no responsibilities array. Their metadata says "Role details awaiting confirmation" and "Collaboration details pending"; their contribution says "My specific role and collaboration details are awaiting confirmation." Team and Solo already match the confirmed ownership distinction. Local fallback records match the currently published uncertainty for Car/School.

**Proposed only; separate CMS-write approval required. No migration, patch, publish, or fallback-data edit is performed in Phase 6H.** On each of `project-car-rental-system` and `project-school-website-cms`, propose exactly:

```json
{
  "collaboration": "solo",
  "role": "Independent developer",
  "caseStudy.responsibilities": [
    "Independently developed the frontend.",
    "Independently developed the backend.",
    "Independently developed the database."
  ]
}
```

These are field paths for a future reviewed edit, not a JSON document to import. Preserve every other field and all canonical IDs/slugs. Keep status `complete` for both and retain ASP.NET Core MVC/SQL Server versus PHP/MySQL stacks respectively.

For `project-car-rental-system`, propose the exact `caseStudy.pending` array:

```json
[
  "Data model and implementation details",
  "Verified technical decisions and challenges",
  "Screenshots and repository evidence"
]
```

For `project-school-website-cms`, propose the exact `caseStudy.pending` array:

```json
[
  "Content model and implementation details",
  "Verified technical decisions and challenges",
  "Screenshots and repository evidence"
]
```

Only the now-confirmed ownership/context pending item would be removed after approval. Documentation/evidence gaps still remain. No Team edit is necessary: `role:"Project Manager & Backend Developer"`, `collaboration:"team"`, `teamSize:3`, and the shared-contribution caveat remain. No Solo edit is necessary: `role:"Independent developer"`, `collaboration:"solo"`, `status:"in-progress"`; retain the development-area and no-public-launch caveats. Future CMS edits require another build/deployment and matching approved fallback/test maintenance; this release intentionally leaves the published pending-role labels intact.

## Release preparation

- Existing repository: `Sohail-aiflow/sohail-anwar-portfolio`, branch `main`. GitHub API confirms authenticated identity `Sohail-aiflow`.
- Initial HEAD and fetched origin/main both `7041f1f95484b1509a59ca572b03bd08a53be065`, with zero divergence. No reset or force-push.
- The 21 expected paths were inspected; Phase 6F/6G behavior is preserved. README is updated only to record current approval/ownership and point to this report.
- Root `.env.local` is ignored, contains the approved public Pages origin and `SITE_INDEXABLE=false`, and is not committed. No portfolio token is used.
- Existing static export remains `output:"export"`, build command `npm run build`, output `out`. No Workers/OpenNext migration, new Pages project, webhook, paid resource, or Studio deployment.
- Owner confirmed Production `SITE_URL=https://sohail-anwar-portfolio.pages.dev`, `SITE_INDEXABLE=false`, and unchanged build/output settings during this checkpoint. Dashboard tools cannot independently inspect those settings because their trusted Node/browser helper fails to initialize (`helper_unknown_error: setup refresh had errors`). GitHub Cloudflare checks and public HTML provide independent deployment evidence where available.

## Verified release preflight

| Check                  | Result before publication                                                                                                                                                         |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint / TypeScript      | Both passed on the approved source.                                                                                                                                               |
| Formatting             | Format workflow and format:check passed, including release documentation.                                                                                                         |
| Production build       | Real Sanity build passed; all four case-study pages and normalized nested payloads generated, with no content/fallback warning.                                                   |
| Browser regression     | 132 passed in 9.5 minutes with VERIFY_LIVE_SANITY=1, including the two real public API checks and six-width/both-theme coverage.                                                  |
| Separate content tests | 13 passed (783ms); these repeat content cases in the full suite, not 13 extra unique UI tests.                                                                                    |
| Studio                 | Typecheck and production build passed (4.7s); no Studio deployment or editing.                                                                                                    |
| CMS safety             | All 32 canonical public document payloads and revision IDs match the initial snapshot after local verification. No authenticated system-record audit is claimed.                  |
| Source scan            | 122 publishable text files scanned, zero credential-pattern flags, zero tracked private environment files. Heuristic check only; no credentials printed.                          |
| Scope                  | Exactly the 21 approved paths plus this intentional release/role-proposal report. Environment files, tool binaries, test screenshots, generated exports, and logs remain ignored. |

The first regression launch was blocked by an earlier loopback preview on port 4173; no tests ran. That known preview was stopped and the complete fresh suite above passed. No failed application test was suppressed.

## Publication verification boundary

This document records the committed preflight and exact proposed CMS edits. The source commit is created after these checks; GitHub/Cloudflare publication and live QA are verified after pushing and are reported in the Phase 6H completion response and ignored local verification artifacts. This preflight document alone does not assert a successful future deployment. Check the Cloudflare Pages check on the release commit in the existing GitHub repository.

The owner confirmed production origin/indexing/build settings. Dashboard tooling is unavailable as noted above, so actual deployment verification uses the Cloudflare GitHub app result for the precise pushed commit plus the production hostname's rendered behavior and metadata. Raw logs, screenshots, API comparisons, and post-push release-result.json remain local under test-results/phase6h/. Historical Phase 6F/6G reports describe their earlier local-only checkpoints.

No published role wording changes during this release. Separate CMS approval remains required for the proposed Car/School edits; genuine screenshot/repository evidence remains pending. Search indexing must remain disabled.
