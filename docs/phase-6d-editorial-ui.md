# Phase 6D — local editorial text presentation

This checkpoint improves how existing text is presented. No CMS copy is shortened, rewritten, hidden, line-clamped, or replaced. Project facts, roles, slugs, technology lists, statuses, contacts, pending-evidence notices, and live URLs retain their existing source values. Phase 6B theme functionality and Phase 6C navigation, gradients, button contrast, interactions, and reading hierarchy remain in place.

All work remains local for owner review. No commit, push, deployment, indexing or environment change, CMS write, reimport, permission change, webhook, dependency addition, or paid service configuration is part of Phase 6D. Historical Phase 6B and 6C documentation is preserved; its earlier copy-shortening suggestions are not applied or carried into this checkpoint.

## Presentation audit and changes

The homepage previously placed several important introductory paragraphs directly on the atmosphere behind the page. Similar paragraph styling made those introductions compete with nearby body text. Case-study overviews had lead typography but little separation from later prose. The solution uses a small set of related surfaces alongside open, ruled text, rather than putting every paragraph in an identical card.

| Section                    | Editorial treatment                                                                                                                  | Content and layout preserved                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                       | One blue-washed panel groups the full two-line supporting text and full introduction. The introduction keeps its finer leading rule. | Existing headline, emphasis, two-column hero composition, curiosity card, and CTA hierarchy. Both CTAs remain outside the prose panel. |
| Selected Work introduction | A low blue strip on a secondary surface, with a delicate leading rule and rounded trailing corners.                                  | Full description, project selector, four previews, links, and interactions.                                                            |
| About                      | The introductory paragraph receives one sage panel; following paragraphs remain open inside a lightly ruled group.                   | Every CMS paragraph, signoff, optional location, portrait, and resume link.                                                            |
| Skills explanation         | An open caption with an accent rule, preserving breathing room above the skill groups.                                               | Full explanation, skill groups, project-experience note, icons, and all skill names.                                                   |
| Education                  | A peach-washed surface groups the complete education content; the existing status becomes a compact word pill.                       | Every record, program, institution, dates, description, and status string. No achievement or qualification is invented.                |
| Connect                    | A lavender-washed panel groups the full invitation and existing contact actions.                                                     | Headline and emphasis, email and profile links, external-link behavior, and the existing empty-contact state.                          |
| Case-study overview        | One blue panel separates the existing lead paragraph from later factual details.                                                     | All four overview strings, lead type treatment, left-hand section headings, and responsive grid.                                       |
| Purpose & scope            | Open prose with a thin sage leading rule.                                                                                            | The existing purpose field on Car Rental, School CMS, and Solo MarketLink; Team MarketLink does not gain an invented purpose.          |

Technical approach, challenges/decisions, and lessons retain their existing optional rendering. If real content populates these fields, technical explanations use one grouped sage surface with internal dividers; decisions stay open with peach leading rules; learnings use one grouped lavender surface. The current portfolio content does not populate these sections, so the implementation does not invent headings, implementation details, challenges, or lessons. The team contribution callout, feature rows, artwork disclaimer, media notice, and still-to-document lists retain their Phase 6C treatment and exact content.

Every current case-study route gains one new overview surface. The three existing purpose sections gain an open rule, not another card. Body prose, feature lists, technologies, project links, and pending information remain visually distinct from that overview.

The real published profile has no separate `aboutIntroduction` value and contains three `about` paragraphs. About therefore presents the first existing paragraph as the sage lead and the other two as open body prose, retaining their original order and every word without duplication. When a separate introduction is present in future content, that introduction becomes the lead and all body paragraphs remain in the open group. This is presentation fallback within the same published profile, not replacement with local content or a CMS edit.

## Shared surface language and both themes

`src/styles/editorial.css` defines the common `.editorial-panel`, color variants, introductory strip, and open caption. A panel uses the existing opaque `--surface` underneath a low-opacity diagonal color wash. This prevents the page atmosphere from changing the panel's text background. Its 1px border, existing medium radius, inset sheen, and responsive padding provide depth without a heavy external shadow or new blur layer.

Blue is the default panel wash, including the explicit blue class used in component markup. Sage, lavender, and peach variants change the wash only. Existing foreground, muted text, accent, type, and spacing tokens remain authoritative. No random keyword bolding, additional fonts, icons, animation system, or dependency is introduced.

Six new tokens are centralized in `src/styles/tokens.css`; the no-script system-dark fallback repeats the same dark values.

| Token                  | Light                    | Dark                     |
| ---------------------- | ------------------------ | ------------------------ |
| `--editorial-blue`     | `rgb(152 174 203 / 18%)` | `rgb(126 158 195 / 12%)` |
| `--editorial-sage`     | `rgb(140 175 151 / 20%)` | `rgb(125 167 143 / 12%)` |
| `--editorial-lavender` | `rgb(177 159 200 / 18%)` | `rgb(158 141 187 / 12%)` |
| `--editorial-peach`    | `rgb(213 174 145 / 18%)` | `rgb(197 151 119 / 10%)` |
| `--editorial-border`   | `#BECBC7`                | `#465C68`                |
| `--editorial-sheen`    | `rgb(255 250 240 / 75%)` | `rgb(178 194 213 / 8%)`  |

Light surfaces retain warm ivory, sage, dusty blue, lavender, and peach. Dark surfaces use the existing deep slate base with quieter colored illumination. Panel padding scales from 1.25rem to 2rem, with targeted smaller mobile padding for the hero, About, and Education. The existing fonts, heading sizes, section grids, breakpoints, theme bootstrap, and theme persistence are retained.

## Files changed for Phase 6D

These 15 files describe this checkpoint, not the full working-tree total, which also includes preserved uncommitted Phase 6B and 6C changes.

- `src/app/globals.css`: import the shared editorial styles after the existing homepage and case-study styles.
- `src/styles/tokens.css`: six editorial tokens in light, dark, and system-dark fallback.
- `src/styles/editorial.css`: new shared surfaces, strips, open captions, grouped text, and mobile padding.
- `src/components/sections/hero.tsx`: group the existing supporting text and introduction.
- `src/components/sections/selected-work.tsx`: apply the introduction strip.
- `src/components/sections/about.tsx`: sage lead and open body grouping, using the first existing body paragraph when the optional separate introduction is absent.
- `src/components/sections/skills.tsx`: open caption treatment.
- `src/components/sections/education.tsx`: shared peach surface.
- `src/components/sections/connect.tsx`: group invitation and contacts.
- `src/components/ui/section-heading.tsx`: optional description class for the strip or caption.
- `src/components/projects/case-study-section.tsx`: optional editorial treatments without changing section semantics.
- `src/app/projects/[slug]/page.tsx`: select treatments for the existing content fields.
- `src/styles/case-study.css`: open purpose/decision rules and spacing for real optional explanation groups.
- `tests/editorial.spec.ts`: rendered-prose readability and real public CMS/static-HTML preservation checks.
- `docs/phase-6d-editorial-ui.md`: this report.

## Verification status

The following records actual checks completed on October 14, 2026. Functional, content, and accessibility regression checks passed. Lighthouse measurements completed with a lower measured performance score that was investigated and remains subject to the host limitation below.

| Check                                               | Recorded result                                                  |
| --------------------------------------------------- | ---------------------------------------------------------------- |
| Initial root lint, typecheck, and formatting        | Passed                                                           |
| Rebuilt production export with fresh Sanity content | Passed; all four project routes generated                        |
| Token-free public CMS pre-change snapshot           | 32 canonical documents and revision IDs recorded                 |
| Initial focused editorial geometry checks           | Four passed                                                      |
| Final lint, typecheck, and formatting               | Passed                                                           |
| Separate content suite                              | 13 passed in approximately 3.5 seconds                           |
| Corrected focused editorial suite                   | Five passed in approximately 25.5 seconds                        |
| Complete regression suite                           | 110 passed in approximately 7.8 minutes                          |
| Studio typecheck and production build               | Passed; Studio build approximately 45.6 seconds                  |
| Final public CMS/static HTML prose verification     | Passed real token-free API/DOM/static-HTML comparison            |
| Final canonical revision comparison                 | All 32 revision IDs and complete queried CMS payload unchanged   |
| Complete final 50-image page/theme/viewport matrix  | Passed; all 50 after screenshots captured                        |
| Actual mobile and desktop Lighthouse measurement    | Completed twice: mobile 60/60, desktop 97/97; investigated below |

The new editorial tests inspect the rendered text rectangles at 320px and 1440px in both themes across all five routes. They check visibility, panel bounds, wrapping, clipping ancestors, ellipsis, and line-clamping. The explicit live test uses the public Sanity API without a token and compares published prose with both the rendered DOM and served static HTML; it is run with `VERIFY_LIVE_SANITY=1`. It does not write CMS content. Whitespace normalization permits equivalent HTML line breaks; it does not permit shortened or rewritten sentences.

The initial four focused geometry checks passed. The initial live-copy check failed because its test type incorrectly assumed that the optional `aboutIntroduction` was always a string. The real API returned `null`, matching the existing content model. The test now checks that optional field only when populated and independently checks all three actual `about` paragraphs against rendered DOM and static HTML. The corrected five-test focused run passed in approximately 25.5 seconds, including the real token-free API comparison. This test correction does not alter CMS content.

The complete regression suite passed all 110 checks in approximately 7.8 minutes. It includes the five new editorial checks, 18 theme checks, 22 Phase 6C polish checks, 13 content checks, and the existing navigation, project, and live integration coverage. `VERIFY_LIVE_SANITY=1` enabled both actual public API tests; neither was skipped. Browser coverage includes the existing five-page, two-theme matrix at 320, 375, 768, 1024, and 1440px, automated accessibility checks, runtime/hydration error detection, navigation and CTA interactions, keyboard focus, theme first paint/persistence, reduced motion, and no-JavaScript behavior. These checks detected no regressions in the tested conditions.

The separate content suite also passed its 13 checks in approximately 3.5 seconds. It exercises adapters and configuration, including mocked inputs; those results are distinct from the successful real public API tests. The live editorial test confirms that the published strings are fully present in both the DOM and unhydrated static HTML, rather than being replaced by local text or supplied later by hydration.

The rebuilt production export uses fresh real Sanity content, generates all four case-study routes, and produced no fallback warnings. A separate actual Chrome audit visited all five routes in both themes at 375px and 1440px, for 20 visits. It recorded no console or page errors; evidence is saved in `test-results/phase6d/console-audit.json`. This complements the complete five-width regression matrix rather than replacing it.

The complete public `portfolioQuery` response before and after the work was deeply equal, and all 32 canonical document revision IDs were identical. The token-free snapshot is recorded in `test-results/phase6d/cms-before.json`; it contains no authentication token. These read-only comparisons establish that the queried published content stayed unchanged during this checkpoint. No CMS documents, archived originals, or system records were written.

## Before/after screenshots and performance

Fifty actual before images from the final Phase 6C rendering are stored under `test-results/phase6d/before/`, covering five pages, both themes, and all five widths. Twenty-four targeted review images are stored under `test-results/phase6d/review/`: Hero, About, Education, Connect, Selected Work introduction, and Team MarketLink overview, each in both themes at 375px and 1440px. Examples include `light-hero-1440.png`, `dark-about-375.png`, and `dark-overview-1440.png`.

All 24 targeted review captures were refreshed after the About lead fallback was applied. The About panel now displays the first actual published paragraph when its separate optional introduction is absent.

The final 50-image matrix is stored under `test-results/phase6d/after/`, matching the before set by page, theme, and width. Flat filenames include `light-home-1440.png`, `dark-marketlink-team-375.png`, and `dark-school-website-cms-320.png`. The files were copied from the completed final regression captures and visually inspected across all five pages, both themes, and all five widths. Screenshots and audit artifacts are local test output, not public deployment assets.

### Actual Lighthouse measurements

Lighthouse 13.5 with installed Chrome 155 measured the real local production export using the existing standard mobile and desktop settings. Both full measurements are retained. The lower mobile scores are reported directly; the controls below do not replace them.

| Measurement          | Phase 6C first / repeat | Phase 6D first / repeat |
| -------------------- | ----------------------- | ----------------------- |
| Mobile performance   | 79 / 80                 | 60 / 60                 |
| Desktop performance  | 96 / 99                 | 97 / 97                 |
| Mobile LCP           | 5.493s / 5.293s         | 5.860s / 5.761s         |
| Desktop LCP          | 1.064s / 1.022s         | 1.124s / 1.129s         |
| Mobile TBT           | 110ms / 45ms            | 622.45ms / 622.96ms     |
| Desktop TBT          | 124ms / 0ms             | 90ms / 79ms             |
| Mobile / desktop CLS | 0 / 0 in both runs      | 0 / 0 in both runs      |

Accessibility and best-practices categories scored 100 in both modes in both Phase 6D runs. SEO scored 63: indexing is intentionally disabled and the production origin is unassigned. No indexing, origin, throttling, or audit setting was changed to improve the score. Dark-theme performance was not separately measured by Lighthouse; dark rendering and accessibility were covered by the complete browser matrix.

| Resource transfer | Phase 6C | Phase 6D | Change                      |
| ----------------- | -------- | -------- | --------------------------- |
| Total bytes       | 785,131  | 791,049  | +5,918, approximately 0.75% |
| Script bytes      | 494,655  | 494,725  | +70                         |
| CSS bytes         | 38,579   | 43,828   | +5,249                      |
| Font bytes        | 160,103  | 160,103  | Unchanged                   |
| Requests          | 16       | 16       | Unchanged                   |

### Performance investigation and limits

The standard performance drop is material and is not dismissed as harmless noise. Investigation found substantially slower host execution: Lighthouse's independent benchmark index was 3013.5 in the recorded baseline, versus 837.5 and 733.5 during the two new standard measurements. Several unchanged JavaScript parsing, HTML, and layout tasks took roughly 2.5–3.6 times longer. Six of the seven JavaScript chunks retained identical hashed URLs and byte counts; the DOM increased from 431 to 434 elements and retained depth 13. The transfer increase is predominantly CSS, with no new fonts or dependencies.

The installed benchmark implementation is `node_modules/lighthouse/core/gather/driver/environment.js`, which calls `computeBenchmarkIndex` and uses the resulting index to identify slow hosts. These independent host observations support an inference that slower host execution was the dominant measured influence. They do not identify the precise external cause or prove that the new presentation has zero performance cost. Lighthouse's primary documentation describes hardware and resource contention as sources of measurement variability and recommends repeated measurements under controlled conditions. [Lighthouse score variability](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md).

A read-only control neutralized editorial classes in the responses served to the audit browser. It did not alter source files or generated output, and it did not reconstruct the historical Phase 6C build. The first control scored 64 on mobile, with a benchmark index of 890.5. A further same-server sequence measured full presentation, neutralized control, then restored full presentation under unchanged standard mobile audit settings:

| Paired mobile observation | Full presentation | Editorial classes neutralized | Full presentation restored |
| ------------------------- | ----------------- | ----------------------------- | -------------------------- |
| Performance               | 60                | 65                            | 65                         |
| Benchmark index           | 839.5             | 844                           | 894.5                      |
| LCP                       | 5.896s            | 5.822s                        | 5.773s                     |
| TBT                       | 627.5ms           | 535ms                         | 517.89ms                   |
| CLS                       | 0                 | 0                             | 0                          |

Neutralizing the editorial treatments did not recover the earlier score of 80, and the restored full presentation matched the control's score of 65. No isolated, consistent editorial-style cause was established by these observations. A reliable Phase 6C versus Phase 6D comparison remains limited by the changed host conditions. The actual standard result remains mobile 60 and desktop 97; mobile LCP and TBT require a repeat on a stable local host before launch. A faster control or restored run is not substituted for the standard result or presented as proof that performance did not regress.

Evidence is retained under `test-results/audits/`: `phase6d-*`, `phase6d-repeat-*`, `phase6d-control-no-editorial-mobile.json`, `phase6d-control-summary.json`, `phase6d-paired-*.json`, and `phase6d-paired-summary.json`. Recheck with the existing audit settings after host conditions stabilize; no paid service or audit-throttling change is needed for that check.

## Local review and remaining limits

For an editable local preview, run `npm.cmd run dev` from `C:\Sohail-Portfolio` and open the URL printed by Next.js. The static export can be reviewed at `http://127.0.0.1:4173/` while its local preview server is running. This is a local URL, not a deployment.

Final Git verification found 24 changed/untracked paths: 15 modified and nine untracked, including preserved Phase 6B and 6C work. The staging area is empty and all work remains uncommitted. `HEAD` and `origin/main` were both verified at `25a5e3f`. No prior uncommitted work was reset or discarded, and no commit, push, deployment, environment/SEO/schema change, or CMS write occurred.

Automated checks and screenshots cannot establish complete WCAG compliance or substitute for physical-device and assistive-technology review. Blocked browser storage retains the existing theme-persistence limitation after a full reload. Optional technical/challenge/learning surfaces cannot be visually assessed against real published content until those fields contain confirmed facts. Existing pending project evidence remains intentionally explicit. Mobile LCP was an existing limitation; the new standard measurements also show elevated TBT and lower performance scores. Stable-host performance verification remains necessary before launch, rather than declaring that comparison resolved.

Stop after local implementation and testing. Owner visual approval is required before resuming GitHub or Cloudflare deployment work.
