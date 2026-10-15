# Phase 6E — production verification and source checkpoint

This report starts on October 15, 2026, in Asia/Karachi. It records the verification of the approved local Phase 6B, 6C, and 6D work before any source checkpoint is committed or pushed. Five actual mobile/desktop audit pairs, root/build/content checks, Studio checks, the complete regression suite, and the final CMS comparison have completed. Final documentation/security checks and actual commit/push observations remain pending until performed. Earlier phase measurements are identified as historical evidence, not new passes.

The owner conditionally authorizes committing the reviewed source and making a normal push to the existing `main` branch after successful verification. Stop before pushing if tests fail, a serious performance regression remains unresolved, the remote diverges, or unexpected files appear. No fixed Lighthouse score threshold was specified. Cloudflare deployment/resources, indexing changes, webhooks, paid services, Sanity Studio deployment, CMS writes, and destructive Git operations are outside this checkpoint.

## Baseline and environment

The initial worktree inventory contained 24 pending paths: 15 modified and nine untracked. They include the preserved Phase 6B themes, Phase 6C polish, and Phase 6D editorial presentation. No earlier local work was reset or discarded. This report and the small README maintenance update add two intentional paths, giving the exact 26-file precommit allowlist below. README links this report, covers Phases 1 through 6E, and records that Cloudflare deployment remains pending. No production source optimization was added.

| Baseline item             | Recorded state                                                                         |
| ------------------------- | -------------------------------------------------------------------------------------- |
| Workspace                 | `C:\Sohail-Portfolio`                                                                  |
| Existing repository       | `https://github.com/Sohail-aiflow/sohail-anwar-portfolio`                              |
| Verified origin URL       | `https://github.com/Sohail-aiflow/sohail-anwar-portfolio.git`                          |
| Branch and initial refs   | `main`; local and remotely queried `main` match `25a5e3f`                              |
| Initial pending paths     | 15 modified, nine untracked; staging initially empty                                   |
| Authenticated GitHub user | `Sohail-aiflow`, verified through the actual GitHub API with the existing portable CLI |
| Public CMS target         | Sanity project `xc6vvvsv`, public dataset `production`, API version `2026-10-13`       |
| CMS reads                 | Token-free, published perspective, `useCdn: false`; explicit Sanity source             |
| Production shape          | Fresh real-CMS static export; 10 generated pages including all four case-study routes  |
| Indexing                  | `SITE_URL` unset; indexing false; no public origin or indexing configuration changed   |

| Current audit environment  | Actual observation                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------------------- |
| Operating system and shell | Windows; PowerShell                                                                                       |
| CPU                        | Intel Core i5-1145G7 at 2.6GHz; four cores, eight logical processors                                      |
| Node and npm               | Node 24.21; npm 11.19                                                                                     |
| Chrome and Lighthouse      | Installed headless Chrome 155; Lighthouse 13.5.0                                                          |
| Production preview         | Fresh real-CMS build served with Python at `http://127.0.0.1:4173/`                                       |
| Sequence and preference    | Five sequential mobile/desktop pairs; fresh Chrome instance per measurement; default light preference     |
| Run window                 | October 15, 2026, approximately 20:51-20:53 Asia/Karachi; exact UTC fetch times retained in raw artifacts |
| Background workload        | No concurrent builds, regression tests, or parallel Lighthouse audits; process sample retained            |
| Host benchmark             | Across all ten observations, 1407.5-2587; mobile median 2011, desktop median 2411                         |

The actual `scripts/audit-performance.mjs` implementation was inspected and used without an audit-setting change. Mobile uses simulated throttling, 4x CPU slowdown, 150ms RTT, 1638.4Kbps throughput, and a 412x823 viewport at device scale factor 1.75. Desktop uses the imported preset: simulated throttling, 1x CPU slowdown, 40ms RTT, 10240Kbps throughput, and a 1350x940 viewport at device scale factor 1. Both use a fresh headless Chrome instance. Serialized effective settings, user agents, fetch timestamps, individual observations, and calculated medians are recorded in `test-results/phase6e/lighthouse-measurements.json`.

All ten audits measured the same unchanged artifact: 791,049 transferred bytes per run. The recorded SHA-256 is the generated homepage HTML fingerprint, independently matched to `out/index.html`: `c07f3d61c8b744e475e28a4f8bab2eb52d278a98c7c05a6cf3ef9519969db339`. It is not described as a hash of the entire export.

## Performance evidence and investigation

Historical Phase 6C measured mobile performance 79/80 and desktop 96/99 across its first/repeat runs. Historical Phase 6D measured mobile 60/60 and desktop 97/97. Its independent host benchmark fell to approximately 733-837. That finding motivated this fresh production check; it does not substitute for the new measurements or establish that the presentation has zero cost.

Every actual Phase 6E observation is retained below. Times are rounded for readability; raw JSON retains full precision. Artifact paths are relative to `test-results/audits/`.

| Run | Mode    | Performance | FCP    | LCP    | TBT       | CLS      | Host benchmark | Raw artifact                 |
| --- | ------- | ----------- | ------ | ------ | --------- | -------- | -------------- | ---------------------------- |
| 1   | Mobile  | 52          | 1.458s | 5.831s | 1427.5ms  | 0.000905 | 1407.5         | `phase6e-run-1-mobile.json`  |
| 1   | Desktop | 99          | 0.285s | 1.009s | 0ms       | 0        | 1471           | `phase6e-run-1-desktop.json` |
| 2   | Mobile  | 65          | 1.217s | 5.765s | 540.5ms   | 0        | 1583.5         | `phase6e-run-2-mobile.json`  |
| 2   | Desktop | 99          | 0.291s | 1.025s | 0ms       | 0        | 2086           | `phase6e-run-2-desktop.json` |
| 3   | Mobile  | 80          | 1.208s | 5.442s | 86ms      | 0        | 2223.5         | `phase6e-run-3-mobile.json`  |
| 3   | Desktop | 82          | 0.365s | 1.297s | 334ms     | 0        | 2411           | `phase6e-run-3-desktop.json` |
| 4   | Mobile  | 80          | 1.209s | 5.296s | 44.5ms    | 0        | 2587           | `phase6e-run-4-mobile.json`  |
| 4   | Desktop | 99          | 0.286s | 1.017s | 0ms       | 0        | 2549           | `phase6e-run-4-desktop.json` |
| 5   | Mobile  | 75          | 1.215s | 5.558s | 244.391ms | 0        | 2011           | `phase6e-run-5-mobile.json`  |
| 5   | Desktop | 99          | 0.286s | 1.012s | 0ms       | 0        | 2537.5         | `phase6e-run-5-desktop.json` |

| Aggregate | Samples | Performance median | FCP median | LCP median | TBT median | CLS median |
| --------- | ------- | ------------------ | ---------- | ---------- | ---------- | ---------- |
| Mobile    | Five    | 75                 | 1.215s     | 5.558s     | 244.391ms  | 0          |
| Desktop   | Five    | 99                 | 0.286s     | 1.017s     | 0ms        | 0          |

These are metric-wise medians, not a selected best run or an invented representative run. Mobile maximum CLS was approximately 0.000904867; the other nine runs recorded zero. Accessibility and best-practices scores were 100, and SEO was 63, in all ten measurements. The known SEO limitation remains intentional: indexing is disabled and a production origin is unassigned.

| Investigation area                      | Observations and conclusion                                                                                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CPU and background workload             | Independent benchmark indices improved from Phase 6D but varied materially between current runs. No deliberate concurrent builds/tests/audits were running. This supports broad host variability, not proof of its exact cause or that CPU alone explains every outlier.                                                                                               |
| Effective CPU/network throttling        | Standard simulated settings and viewports remained unchanged across the five matching pairs. No reduced throttle, device substitution, or audit-category change was used to raise scores.                                                                                                                                                                              |
| Hero gradients, blur, and editorial CSS | Mobile run 1 had approximately 1654ms modeled style/layout work and 413ms unattributed forced reflow. Run 2 was slow for different reasons and had no equivalent forced-reflow finding. The unchanged approved presentation reached 80 twice; no persistent gradient/blur/CSS-only cause was isolated.                                                                 |
| Fonts and font loading                  | Font transfer remains 160,103 bytes. Observed font-download spikes included approximately 303ms in mobile run 1 and 129ms in desktop run 3. Scheduling and network/font timing are plausible contributors, not an established single root cause.                                                                                                                       |
| JavaScript                              | Scripts remain 494,725 bytes; no new dependency or source change was introduced for Phase 6E. Mobile run 1 showed approximately 479ms modeled parsing; run 2 showed approximately 1316ms modeled evaluation and a roughly 640ms unchanged-framework long task. Mobile run 3 had approximately 192ms observed tasks, close to the earlier approximately 191ms baseline. |
| Largest contentful paint                | Run 3 mobile identified `.hero-story > p.hero-introduction` as the LCP node, a text paragraph, not an image. Its observed breakdown was approximately 3.861ms TTFB and 328.017ms render delay; these observed subparts are distinct from the 5.442s simulated LCP. Overall mobile LCP remains above five seconds.                                                      |
| Task variability                        | Desktop run 1 recorded approximately 2646ms observed tasks despite a score of 99; desktop run 3 scored 82 with a layout spike. These observations caution against attributing the score to any one raw task total or selecting only favorable traces.                                                                                                                  |
| Stability and repeated measurements     | Mobile scores range 52-80, median 75; desktop scores range 82-99, median 99. The lower observations remain visible and are not discarded.                                                                                                                                                                                                                              |

No performance optimization, visual redesign, font change, dependency change, or audit-setting adjustment was implemented in Phase 6E. Investigation did not establish a persistent serious new site-only regression: the same full artifact reached 80 twice on mobile and 99 in four desktop runs. There is no fixed 80-point acceptance threshold in the request. This supports continuing the conditional source-checkpoint workflow if remaining tests, diff, and remote checks pass; it is not a claim of perfect recovery or good mobile Core Web Vitals.

The mobile median of 75 remains below the historical repeat score of 80, median LCP is 5.558s, and median TBT is 244.391ms. Existing framework execution and font/network timing remain prelaunch performance limitations. Host variability is supported by independent observations but is not proven to be the sole cause. Preserve the approved design and report these limitations rather than making speculative optimizations or hiding slower runs.

Raw reports are retained as `test-results/audits/phase6e-run-{1..5}-{mobile,desktop}.json`, with matching pair summaries. Consolidated observations, effective settings, medians, and the artifact fingerprint are in `test-results/phase6e/lighthouse-measurements.json`; background observations are in `test-results/phase6e/process-sample.json`.

## Production, CMS, and regression verification

The project scripts were inspected before choosing the check commands. The current root build runs `next build` followed by the existing static-export normalizer. The separate content configuration exercises adapters and configuration, including mocked inputs; real API checks must be reported separately.

| Check                                            | Command or method                                               | Actual Phase 6E result                                                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Lint                                             | `npm.cmd run lint`                                              | Passed initial Phase 6E check                                                                                                |
| Typecheck                                        | `npm.cmd run typecheck`                                         | Passed initial Phase 6E check                                                                                                |
| Formatting                                       | `npm.cmd run format:check`; write formatting only where needed  | Passed initial Phase 6E check; final documentation check pending                                                             |
| Production build                                 | `npm.cmd run build`                                             | Passed fresh real-CMS build; 10 static pages and all four case-study routes                                                  |
| Complete regression suite                        | `npm.cmd run test` with `VERIFY_LIVE_SANITY=1`                  | 110 passed in approximately 5.4 minutes; no skips, including both real public API checks                                     |
| Separate content tests                           | `npm.cmd run test:content`                                      | 13 passed in approximately 2.1 seconds                                                                                       |
| Studio typecheck                                 | `npm.cmd run studio:typecheck`                                  | Passed                                                                                                                       |
| Studio production build                          | `npm.cmd run studio:build`                                      | Passed in approximately 24.482 seconds                                                                                       |
| Live Sanity identity and contacts                | Real public API without a token                                 | Passed actual token-free published API verification                                                                          |
| Live CMS content in exported HTML                | Public API comparison with served static HTML and rendered DOM  | Passed actual published API/DOM/unhydrated static-HTML regression checks                                                     |
| No local fallback warnings                       | Build and live content verification                             | None in the real-CMS production build or live regression verification                                                        |
| Themes and manual persistence                    | Browser checks across all five pages                            | Passed complete browser checks across all five pages and both themes                                                         |
| Navigation, project links, and static routes     | Browser/static export checks                                    | Passed; four generated routes and complete browser link/navigation checks                                                    |
| Runtime/hydration errors and overflow            | Actual browser instrumentation                                  | No failures detected in the complete actual browser suite                                                                    |
| SEO/indexing safeguards                          | Local configuration and generated export review                 | Passed configuration/export/browser checks; SITE_URL unset, indexing false, protected configuration unchanged                |
| Credential exposure and generated-file exclusion | Complete diff and candidate-file review without logging secrets | 24 intended Phase 6B-D paths reviewed; 115 text files scanned with zero secret candidates; outputs/environment files ignored |

The four generated routes are `marketlink-team`, `marketlink-solo`, `car-rental-system`, and `school-website-cms`. The verified public identity is Sohail Anwar with `sohailanwar.ai@gmail.com` and `https://github.com/Sohail-aiflow`. Team MarketLink retains its Project Manager & Backend Developer role and `https://aptechmetrostargate.com:190/` URL. Identity, contacts, role, and URL were verified through the real token-free published API with `useCdn: false`. The current public response contained 32 canonical documents: one profile, one homepage, four projects, 25 skills, and one education record. Both real public API checks passed in the complete 110-test suite, including comparisons with rendered DOM and unhydrated static HTML. A final separate token-free, published, no-CDN read found the complete portfolioQuery payload deeply equal to the baseline and all 32 canonical revision IDs unchanged. Evidence is retained in `test-results/phase6e/cms-before.json` and `test-results/phase6e/cms-after.json`.

These browser results came from the executed complete suite. The original two-line Hero Supporting Text, published copy, project ownership, and canonical content identity passed the applicable live/static comparisons. The 13 separate content tests use adapter/configuration fixtures and mocks; those are distinct from the two real token-free API tests. No remote content mutation was performed.

## Candidate source review and Git checkpoint

The preserved Phase 6B-D changes were reviewed, with 115 text files scanned and zero secret candidates found. README received only a maintenance update linking this report, covering Phases 1 through 6E, and retaining the owner-approval boundary for Cloudflare deployment. No performance source change was made. A read-only worktree inspection confirmed the following exact 26 intended paths; they are an allowlist for the upcoming source commit, not a claim that a commit has already happened:

```text
README.md
docs/phase-6b-theme-refinement.md
docs/phase-6c-visual-polish.md
docs/phase-6d-editorial-ui.md
docs/phase-6e-production-verification.md
src/app/globals.css
src/app/layout.tsx
src/app/projects/[slug]/page.tsx
src/components/navigation/floating-navigation.tsx
src/components/navigation/theme-toggle.tsx
src/components/projects/case-study-section.tsx
src/components/sections/about.tsx
src/components/sections/connect.tsx
src/components/sections/education.tsx
src/components/sections/hero.tsx
src/components/sections/selected-work.tsx
src/components/sections/skills.tsx
src/components/ui/section-heading.tsx
src/lib/theme.ts
src/styles/case-study.css
src/styles/editorial.css
src/styles/homepage.css
src/styles/tokens.css
tests/editorial.spec.ts
tests/themes.spec.ts
tests/visual-polish.spec.ts
```

Final formatting/security review and the actual commit/push have not yet been performed. Actual committed filenames and hashes must be confirmed from the resulting commit rather than inferred from this precommit allowlist.

Exclude local environment files, credentials, generated exports/builds, Studio output, screenshots, raw Lighthouse reports, test results, browser profiles, tools, and caches. Required Markdown documentation is intentional reviewed source; ignored measurement artifacts are not committed. Inspect secret-bearing configuration by presence/name or redacted checks rather than displaying values.

| Git action or safeguard                                         | Actual result                                                                                                                                                             |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing origin URL and authenticated repository owner verified | Passed: GitHub API user Sohail-aiflow; existing public, non-archived repository; main default branch; admin/push permissions verified                                     |
| Latest remote `main` checked for divergence                     | Fetch of origin/main completed; local main and remote main at 25a5e3f, zero ahead and zero behind                                                                         |
| Complete diff and intentional file list reviewed                | 24 preserved Phase 6B-D paths reviewed; README and this report complete the 26-file allowlist; final security review pending                                              |
| Tests and performance gate cleared                              | All functional/build/Studio/CMS checks passed; performance supports qualified continuation with median 75/mobile LCP limitations retained; final precommit checks pending |
| Exact files committed                                           | No Phase 6E commit performed yet                                                                                                                                          |
| Actual source commit hash                                       | Not yet created                                                                                                                                                           |
| Normal push to existing `main`                                  | Not yet performed                                                                                                                                                         |
| Remote hash matches source commit                               | Not yet verified                                                                                                                                                          |
| Final report commit/hash, if separately needed                  | Not yet created                                                                                                                                                           |
| Final worktree and staging state                                | Precommit observation: 16 modified and 10 untracked allowed paths, all unstaged; staging empty; post-push state pending                                                   |

This report must be updated with actual hashes and push observations after those operations complete. A created local commit is not evidence of a successful push; verification must read the resulting remote branch. Do not use force push, replace the remote, or create another repository.

## Remaining limitations and completion gate

Production verification is complete apart from final documentation/security review. All 110 regression checks, 13 separate content checks, Studio checks, root checks, the fresh real-CMS build, five actual audit pairs, public identity verification, and final unchanged-CMS comparison have completed. The remote fetch shows no divergence, and the 26 intended files are explicitly allowlisted. Qualified source-checkpoint continuation is supported by the performance investigation, while median mobile performance remains 75 and existing LCP/host-variability limitations remain. Actual commit, push, and post-push verification have not happened yet and are not claimed. A failed final check, unexpected file, new remote divergence, or newly established serious unresolved performance finding stops the source promotion.

Automated accessibility checks cannot establish complete WCAG compliance. Existing pending project evidence remains explicit, and blocked browser storage retains its known full-reload persistence limitation. Stable audit conditions and comparable effective settings are required to interpret performance changes responsibly.

After successful checks and the authorized source push, stop. Cloudflare setup, deployment, webhooks, public-origin configuration, and enabling indexing remain outside this checkpoint.
