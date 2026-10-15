# Phase 6E — production verification and source checkpoint

Phase 6E verified the approved Phase 6B, 6C, and 6D source on October 15, 2026, in Asia/Karachi. Five actual mobile/desktop audit pairs, root/build/content checks, Studio checks, the complete regression suite, final formatting/security review, and the unchanged-CMS comparison completed. The reviewed 26-file source checkpoint was committed, normally pushed to the existing `main`, and verified independently through Git and the authenticated GitHub API.

Source promotion followed the owner's conditional authorization: functional checks passed, the remote had no divergence, the intended files were reviewed, and the performance investigation did not establish a persistent serious new site-only regression. No fixed Lighthouse score threshold was specified. Mobile performance remains qualified, with median 75 and the limitations below; the source checkpoint is not a claim that mobile performance is ideal or deployment is approved. Cloudflare deployment/resources, indexing changes, webhooks, paid services, Studio deployment, CMS writes, and destructive Git operations were not performed.

The Phase 6B-D reports remain unchanged historical snapshots. Their earlier local-only or uncommitted status describes those checkpoints; this Phase 6E source/push record supersedes that workflow status without replacing their technical results.

## Baseline and environment

The initial worktree inventory contained 24 pending paths: 15 modified and nine untracked. They include the preserved Phase 6B themes, Phase 6C polish, and Phase 6D editorial presentation. No earlier local work was reset or discarded. This report and the small README maintenance update added two intentional paths, giving the exact 26 committed files below. README links this report, covers Phases 1 through 6E, and retains the separate owner-approval boundary for Cloudflare deployment. No production source optimization was added.

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

| Check                                            | Command or method                                               | Actual Phase 6E result                                                                                                                              |
| ------------------------------------------------ | --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lint                                             | `npm.cmd run lint`                                              | Passed Phase 6E check                                                                                                                               |
| Typecheck                                        | `npm.cmd run typecheck`                                         | Passed Phase 6E check                                                                                                                               |
| Formatting                                       | `npm.cmd run format:check`; write formatting only where needed  | Passed initial and final root checks before the source commit; report follow-up formatted separately                                                |
| Production build                                 | `npm.cmd run build`                                             | Passed fresh real-CMS build; 10 static pages and all four case-study routes                                                                         |
| Complete regression suite                        | `npm.cmd run test` with `VERIFY_LIVE_SANITY=1`                  | 110 passed in approximately 5.4 minutes; no skips, including both real public API checks                                                            |
| Separate content tests                           | `npm.cmd run test:content`                                      | 13 passed in approximately 2.1 seconds                                                                                                              |
| Studio typecheck                                 | `npm.cmd run studio:typecheck`                                  | Passed                                                                                                                                              |
| Studio production build                          | `npm.cmd run studio:build`                                      | Passed in approximately 24.482 seconds                                                                                                              |
| Live Sanity identity and contacts                | Real public API without a token                                 | Passed actual token-free published API verification                                                                                                 |
| Live CMS content in exported HTML                | Public API comparison with served static HTML and rendered DOM  | Passed actual published API/DOM/unhydrated static-HTML regression checks                                                                            |
| No local fallback warnings                       | Build and live content verification                             | None in the real-CMS production build or live regression verification                                                                               |
| Themes and manual persistence                    | Browser checks across all five pages                            | Passed complete browser checks across all five pages and both themes                                                                                |
| Navigation, project links, and static routes     | Browser/static export checks                                    | Passed; four generated routes and complete browser link/navigation checks                                                                           |
| Runtime/hydration errors and overflow            | Actual browser instrumentation                                  | No failures detected in the complete actual browser suite                                                                                           |
| SEO/indexing safeguards                          | Local configuration and generated export review                 | Passed configuration/export/browser checks; SITE_URL unset, indexing false, protected configuration unchanged                                       |
| Credential exposure and generated-file exclusion | Complete diff and candidate-file review without logging secrets | Final scan of 116 text files found zero credential patterns; only the 26 reviewed source paths were committed; generated/environment files excluded |

The four generated routes are `marketlink-team`, `marketlink-solo`, `car-rental-system`, and `school-website-cms`. The verified public identity is Sohail Anwar with `sohailanwar.ai@gmail.com` and `https://github.com/Sohail-aiflow`. Team MarketLink retains its Project Manager & Backend Developer role and `https://aptechmetrostargate.com:190/` URL. Identity, contacts, role, and URL were verified through the real token-free published API with `useCdn: false`. The current public response contained 32 canonical documents: one profile, one homepage, four projects, 25 skills, and one education record. Both real public API checks passed in the complete 110-test suite, including comparisons with rendered DOM and unhydrated static HTML. A final separate token-free, published, no-CDN read found the complete portfolioQuery payload deeply equal to the baseline and all 32 canonical revision IDs unchanged. Evidence is retained in `test-results/phase6e/cms-before.json` and `test-results/phase6e/cms-after.json`.

These browser results came from the executed complete suite. The original two-line Hero Supporting Text, published copy, project ownership, and canonical content identity passed the applicable live/static comparisons. The 13 separate content tests use adapter/configuration fixtures and mocks; those are distinct from the two real token-free API tests. No remote content mutation was performed.

## Committed source and verified Git checkpoint

The preserved Phase 6B-D changes were reviewed. The final scan covered 116 text files and found zero credential patterns. README received only a maintenance update linking this report, covering Phases 1 through 6E, and retaining the owner-approval boundary for Cloudflare deployment. No performance source change was made. The actual source commit contains exactly these 26 reviewed files:

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

The final root formatting check and staged `git diff --check` passed before the source commit. No environment files, screenshots, generated exports/build reports, Studio output, local tools, or caches were staged. The credential review evidence is retained in ignored `test-results/phase6e/source-security-review.json`.

The committed files exclude local environment files, credentials, generated exports/builds, Studio output, screenshots, raw Lighthouse reports, test results, browser profiles, local tools, and caches. Required Markdown documentation is reviewed source; measurement artifacts remain ignored. No secret values were logged or published.

Source commit: [77dae30d052d60cd3e4ad26051502bbb69e38fa8](https://github.com/Sohail-aiflow/sohail-anwar-portfolio/commit/77dae30d052d60cd3e4ad26051502bbb69e38fa8), titled `Refine portfolio themes, navigation, and editorial presentation`.

| Git action or safeguard                       | Actual result                                                                                                                                             |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Existing origin and repository owner          | Verified original origin; authenticated API user `Sohail-aiflow`; public, non-archived repository; `main` default branch; admin/push permissions verified |
| Pre-push divergence check                     | Fetch completed; local/remote `main` matched `25a5e3f`, with zero ahead and zero behind                                                                   |
| Complete diff, file list, and security review | Passed; exact 26-file source commit; final formatting and staged diff check passed; 116-text-file credential-pattern scan found zero matches              |
| Functional and performance gate               | Root/build/content/Studio/CMS/browser checks passed; qualified performance assessment retained median 75 and existing mobile LCP/variability limitations  |
| Actual source commit                          | `77dae30d052d60cd3e4ad26051502bbb69e38fa8`; all 26 files listed above                                                                                     |
| Normal source push                            | Completed successfully to original `origin/main`, advancing `25a5e3f` to `77dae30`; no force push, replacement remote, or new repository                  |
| Remote hash verification                      | Both `git ls-remote` for `main` and authenticated GitHub `commits/main` returned the full source hash above                                               |
| Source synchronization and worktree           | `HEAD` and `origin/main` matched with zero ahead/behind; worktree and index were clean at source-push verification                                        |
| Verification time                             | October 15, 2026, at `21:10:06.9371759+05:00` (Asia/Karachi)                                                                                              |

Actual source-push verification evidence is retained in ignored `test-results/phase6e/git-source-push.json`. A completed local commit alone was not treated as evidence of a successful remote push: both remote checks completed before this result was recorded.

This documentation-only follow-up records the already verified source commit and push; it changes no production source, CMS content, or audit artifact. A commit cannot contain its own subsequently calculated hash. The report-update commit can be identified with `git log -1 --format="%H" -- docs/phase-6e-production-verification.md`; the final user-facing completion message supplies the final branch hash after its separate push verification. The full hash above always identifies the verified 26-file source checkpoint.

## Completion and remaining limitations

The Phase 6E production verification and authorized source checkpoint are complete. All 110 regression checks, 13 separate content checks, Studio checks, root checks, the fresh real-CMS build, five audit pairs, public identity verification, unchanged published payload/revisions, final source review, normal source push, and independent remote-hash checks completed. The approved presentation and all factual CMS content were preserved.

Mobile performance remains a prelaunch limitation: median performance 75, median LCP 5.558s, and median TBT 244.391ms. Two unchanged full-artifact mobile observations reached 80 and four desktop observations reached 99; this does not erase the lower results or prove host variability is the sole cause. No speculative design reduction or audit-setting change was used to promote the source checkpoint.

Automated accessibility checks cannot establish complete WCAG compliance. Physical-device and assistive-technology review remain useful. Existing project-evidence gaps remain explicit, and blocked browser storage retains its known full-reload theme-persistence limitation. Stable comparable audit conditions remain important before launch.

No public deployment, Cloudflare resource, webhook, paid service, CMS change, Studio deployment, production-origin configuration, or indexing enablement was performed. Cloudflare setup/deployment and its separate owner approval remain outside this completed source checkpoint.
