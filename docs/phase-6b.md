# Phase 6B — Deployment preparation and approval checkpoint

Status: **not deployed**. Live URL: **not assigned**. Repository URL: **not created**.
Repository creation, committing/pushing main and Cloudflare Pages Free deployment
are explicitly owner-approved. No remote repository, Cloudflare resource, agent
CMS mutation, push or website publication has completed yet.

## Confirmed identity and required Studio edits

The owner confirmed Sohail Anwar, public email `sohailanwar.ai@gmail.com`, and
GitHub `https://github.com/Sohail-aiflow`. Local defaults, seed defaults and static
social cards now reflect that identity. LinkedIn is omitted. No project facts changed.

The owner has now published the confirmed name, email and GitHub link. Token-free
API reads verify all three and all 32 canonical records. The CMS remains
authoritative; local defaults do not override published fields.
Do not reimport the updated seed to change an already edited document.

In local Studio (`http://localhost:3333/`, run `npm.cmd run studio:dev` if needed):

1. Open **Personal profile**, canonical document ID `profile`.
2. In **Identity**, change **Display name** to `Sohail Anwar`.
3. In **Contact**, set **Public contact email** to `sohailanwar.ai@gmail.com`.
4. In **Professional links**, add one entry: label `GitHub`, URL
   `https://github.com/Sohail-aiflow`. Preserve any other genuine existing links;
   do not add a LinkedIn placeholder.
5. Keep all other fields unchanged. Publish, then confirm publication in chat.

After confirmation, token-free API reads, the CMS build and rendered output must
verify the new identity and both contact links. All four routes and current project
facts remain preserved. Remote CMS edits are user-controlled; no automatic write
is authorized by this preparation step.

## Git and public-repository audit

The existing Git repository has no commits, no tracked files, no remotes and an
unborn `master` branch. Project source, public social cards, tests and documentation
are untracked pending approval. Reuse this local repository; create an initial
reviewed commit and `main` branch only as part of the approved repository plan.
Official portable GitHub CLI 2.102.0 is prepared under ignored `.tools/gh/`, verified
against the official SHA-256 checksum. It has no authenticated session yet. Browser
automation failed twice with a sandbox helper error, so dashboard access is
unavailable. Sign-in must occur locally, never by pasting credentials into chat.

The candidate-file scan found no supported private-key, GitHub token, AWS key or
Sanity/Cloudflare environment-token patterns. Pattern scans are not exhaustive
proof; review the final staged file list and GitHub's secret alerts before push.
Both actual env files, node_modules, `.next`, `out`, Studio build/cache, logs and
test artifacts are Git-ignored. Only `.env.example` files with public configuration
placeholders are candidates. Existing docs describe public portfolio facts,
public CMS IDs, architecture and verification, not private account credentials.
The confirmed contact details are intentionally public as instructed by the owner.

Proposed GitHub repository: `Sohail-aiflow/sohail-anwar-portfolio`, **public**, subject
to availability and explicit approval. If it already exists, stop and inspect it;
never overwrite or force-push. Repository creation/pushing have not occurred.

## Cloudflare Pages approval plan

Preferred project name: `sohail-anwar-portfolio`, subject to availability. Use
Cloudflare Pages Free with GitHub integration, no Workers SSR adapter, Functions,
paid domain or paid services. The existing build script exports static files and
runs the Windows-safe payload normalizer; use it rather than plain `next build`.

| Setting           | Proposed value                                                |
| ----------------- | ------------------------------------------------------------- |
| Git repository    | Proposed repository above; not yet created                    |
| Production branch | `main`                                                        |
| Root directory    | Repository root                                               |
| Framework preset  | Next.js (Static HTML Export)                                  |
| Build command     | `npm run build`                                               |
| Build output      | `out`                                                         |
| Node version      | `24.21.0`, pinned in `.node-version`; also set `NODE_VERSION` |

Cloudflare installs the root npm dependencies; Studio is a separate package and
must not be built/deployed with the public portfolio. Committed social PNGs avoid
a Chrome dependency in the Cloudflare build. No GitHub remote or hosting adapter
has been added. See the current
[official static-export guide](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

Build variables (public identifiers, no Sanity token):

```dotenv
NODE_VERSION=24.21.0
PORTFOLIO_CONTENT_SOURCE=sanity
SANITY_PROJECT_ID=xc6vvvsv
SANITY_DATASET=production
SANITY_API_VERSION=2026-10-13
SITE_INDEXABLE=false
```

Leave `SITE_URL` unset until Cloudflare confirms the actual assigned origin. Expected
format is `https://<assigned-project-subdomain>.pages.dev`; the preferred project
name is not a verified hostname. If a project can be provisioned without publishing,
obtain its assigned subdomain first. If the dashboard necessarily starts a
deployment before confirming the assigned origin, pause before that action and
request explicit approval for a noindex provisioning build. Do not guess the URL
or treat a staging build as the final production launch. The final launch must
use the confirmed `SITE_URL`, correct CMS identity, validated metadata and only
then `SITE_INDEXABLE=true`.

Required owner dashboard actions after approval: sign in to GitHub and Cloudflare;
authorize Cloudflare's GitHub integration for this repository only; choose Pages
Free; confirm project name/settings/variables before starting the deployment.
No password, token or recovery code belongs in chat. If authenticated dashboards
are unavailable to the agent, the owner performs the clicks and reports the
assigned URL; the agent then verifies the actual public endpoint.

## Pending production verification

Production build, complete regressions and live QA must be rerun after the profile
is published and the real origin is configured. Existing static configuration,
dot-free published GROQ filters and fresh native Node reads remain unchanged.
Configured CMS failures stop the build; missing-record warnings must be reviewed
before release, never silently treated as full CMS success.

Live QA must cover HTTPS homepage and four direct case-study routes, refresh/deep
links, unknown-path 404 status/body, CSS/JS/fonts/social assets and content types,
headers/cache behavior, professional name, mailto/GitHub links, canonical origin,
robots/sitemap, no drafts/archived records, mobile/desktop/keyboard navigation and
runtime exceptions. `public/_headers` prepares compatible security headers; no
untested CSP is added. Run real public mobile/desktop Lighthouse after deployment;
there are **no live hosting measurements yet**. Phase 6A lab reference: mobile 80,
desktop 99, mobile LCP 5.39 s. No result may be marked passed before execution.

## Future updates and rollback (after hosting selection)

Publish verified edits in local Sanity Studio, then manually trigger a new build
from the Pages project's **Deployments** controls (retry/redeploy the production
build if offered). A new source push to the connected production branch also
triggers a build. Verify that the resulting deployment fetched the new published
value and passed checks. Publishing in Sanity alone does not trigger Pages.
No webhook or deploy hook is created in this phase.

If a build fails, keep the last successful deployment. If a published release
regresses, select the previous successful production deployment and use Pages'
rollback control, then verify its public pages. This rolls back the static site,
not Sanity content; restore CMS content through Studio separately if necessary.
Exact dashboard controls and availability need confirmation on the real account.

Cloudflare documents the rollback action as the previous successful production
deployment's three-dot menu → **Rollback to this deployment**, followed by
confirmation. Preview deployments are not rollback targets.
[Official rollback instructions](https://developers.cloudflare.com/pages/configuration/rollbacks/).

Remaining limitations: genuine screenshots and repository evidence, optional
portrait/resume and LinkedIn remain absent; known development/Studio advisories
remain documented in Phase 6A. Public origin and account access are pending.
Remote identity correction and explicit deployment approval are complete.

## Executed preapproval checks

Root lint, strict typecheck, formatting, all 13 content tests, and a deliberately
offline local review build passed. Its rendered HTML contains the confirmed full
name, mailto and GitHub links, omits LinkedIn, and remains noindex. All four project
pages export. The complete local review browser suite passed **64 tests** (1.9
minutes), with the opt-in real CMS test intentionally skipped; the local review
must not be described as a live CMS identity update. Studio typecheck and
production build passed without deployment. A token-free read separately verified
that the remote Profile still has the old name and no contacts.

The generated `out/` at this checkpoint is an offline review artifact, not an
approved production package. After the owner publishes the Profile edits, rebuild
in explicit Sanity mode, enable the real CMS test, and perform final launch checks
with the assigned origin. No live Cloudflare QA or Lighthouse run has occurred.

## Approved release preparation

After owner publication and deployment approval, real token-free API assertions
verified the full name, email, exact GitHub link and all 32 canonical records. The
real Sanity production build passed without fallback warnings and generated four
case-study routes. Its HTML contains both contacts and the full name. Indexing
remains disabled without a canonical URL until Cloudflare confirms the origin.

Lint, typecheck, formatting, 13 standalone content tests and the complete **65-test
real-CMS browser suite** passed (1.9 minutes). Studio checks passed in preparation.
No live hosting QA or production Lighthouse result is claimed. The approved
reviewed source is being committed locally on `main`; the commit identifier is
available in Git history. Secrets, actual env files, artifacts and portable tools
are excluded from the commit.

Next owner action in local PowerShell:

```powershell
cd C:\Sohail-Portfolio
.\.tools\gh\bin\gh.exe auth login --hostname github.com --git-protocol https --web
```

Complete browser sign-in/authorization locally using `Sohail-aiflow`. Confirm that
authentication is complete without sending a code or token. The agent can then
check repository conflicts and create/push only the approved repository. Sign in
to Cloudflare locally as well; if browser automation remains unavailable, Pages
project creation and GitHub integration will be guided for the owner to perform.
