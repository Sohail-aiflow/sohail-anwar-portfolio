# Phase 6C — local visual polish

The existing Bright Frosted Editorial layout and Phase 6B theme architecture are preserved. This checkpoint remains local for owner review: no commit, push, deployment, indexing change, environment change, CMS write, dependency addition, or paid service configuration is authorized by this work. Earlier uncommitted Phase 6B files remain in the working tree.

## Problems and changes

**Navigation.** Floating desktop icons crowded the five labels, and the theme control appeared squeezed against Connect. Desktop navigation now uses the labels themselves, retaining icons where they aid discovery in the mobile dock. The desktop shell increases modestly from 420px to 432px; its theme-control gap grows from 4px to 10px. The 44px toggle has a quieter transparent surface and border. Active links retain their sage pill and `aria-current`; other hover states use a lighter tint rather than another equally prominent active-looking pill. Mobile icons remain 19px with consistent stroke treatment, labels, safe-area positioning, and a compact dock. Keyboard focus and the existing section navigation behavior are retained.

**Hero atmosphere.** Four deliberately sized blue, lavender, sage, and peach radial fields replace the diffuse five-field wash. Their positions remain behind the editorial composition, with stronger cool depth beside the curiosity card and warm balance below. Blur decreases from 28px to 16px, with 0.9 opacity; no bitmap or animated background is introduced. Dedicated hero colors leave the established concept-art palette unchanged. The curiosity card gains a subtle theme-specific sheen, a semantic interest list, smaller 40px icon tiles, consistent row gaps, and a divider before its quieter editorial caption.

**Reading hierarchy.** The large headline remains the focal point. Supporting copy uses a narrower 36ch measure, calmer sizing, and more deliberate spacing. The complete Sanity-managed introduction remains visible in a restrained editorial strip with a left rule. It is styled, not replaced, truncated, or hidden. About copy has a 52ch measure and an explicit lead treatment for the optional CMS introduction. Skill-list type increases from 13px to 14px, with stronger group headings. Optional education descriptions now have an explicit readable class rather than browser-default paragraph styling. The existing project selector, previews, experience note, education information, Connect section, and footer retain their content and responsive structure.

**Case studies.** Body copy narrows from 70ch to 60ch, with 1.75 line-height instead of 1.9. The overview receives lead sizing and 1.65 line-height, distinguishing it from technical details. Roles have clearer accent emphasis. The team contribution disclaimer receives one rounded editorial callout with a left rule; its exact CMS text remains unchanged. Functionality lists gain compact dividers, retaining their list semantics, content, and confirmed-versus-development headings. Pending facts, concept-art disclaimers, technologies, live URLs, team/solo ownership, and all four slugs remain unchanged.

**Interactions.** Selected project rows gain a clearer lower border; keyboard focus inside previews accents their border. Shared CTA arrows and project-navigation, back, footer, and hero links receive restrained 2px directional feedback. Text links gain intentional underline treatment, and related-project links gain color/border feedback. Movement is enclosed in `prefers-reduced-motion: no-preference`; the existing reduced-motion rules remain effective. No animation dependency or geometry-changing card effect is added.

## Dark CTA root cause and fix

`globals.css` imports `homepage.css` before defining the base `.link-button` rules. The equally specific base rule therefore overrode the primary button's default background and foreground. On hover, the later `.link-button:hover` replaced the primary hover background with `--accent-soft`, while the primary hover foreground remained `--on-accent`. In dark mode that produced dark green text on a dark green surface. This explains the owner's Explore Work screenshot and why the secondary Connect hover remained readable.

Primary styling now lives beside the base CTA styles in `globals.css` with the explicit `.link-button.link-button-primary` selector. Opaque action tokens define each variant's default and interaction backgrounds. The dark primary keeps a light foreground across default, hover, keyboard-focus, and active states. Secondary actions use the regular foreground on distinct navy or ivory surfaces. Arrow icons inherit text color. Both variants share border/focus behavior while retaining separate visual hierarchy. The obsolete primary declarations in `homepage.css` are removed, so the fix applies throughout the site rather than only to the hero.

## Phase 6C tokens

These additions and the light muted-text correction are sourced from `src/styles/tokens.css`. Phase 6B background, surface, illustration, and theme-controller values remain intact. The no-script system-dark fallback includes the same new dark values.

| Token                       | Light                    | Dark                     |
| --------------------------- | ------------------------ | ------------------------ |
| `--muted` (light corrected) | `#45515F`                | `#B5C2D4` (unchanged)    |
| `--hero-blue`               | `#A8BDD5`                | `#304C6A`                |
| `--hero-lavender`           | `#B4A3C9`                | `#4C4064`                |
| `--hero-sage`               | `#ABC5B2`                | `#2D4D43`                |
| `--hero-peach`              | `#E5BDA8`                | `#604735`                |
| `--hero-note-sheen`         | `rgb(255 250 240 / 30%)` | `rgb(153 187 170 / 6%)`  |
| `--navigation-hover`        | `rgb(63 101 85 / 8%)`    | `rgb(153 187 170 / 10%)` |
| `--action-primary-bg`       | `#3F6555`                | `#335549`                |
| `--action-primary-hover`    | `#315342`                | `#3E6657`                |
| `--action-primary-text`     | `#FFFAF0`                | `#F3F2EF`                |
| `--action-primary-border`   | `#3F6555`                | `#557C69`                |
| `--action-secondary-bg`     | `#FAF8F2`                | `#252E3D`                |
| `--action-secondary-hover`  | `#E7EEE4`                | `#2C3D39`                |

## CMS copy suggestions — not applied

Actual CMS copy remains authoritative. Further shortening needs the owner's approval and a separate Studio edit/publication; no remote write is part of Phase 6C. Suggested wording, to compare against the owner's current published fields before approval:

- `profile.shortIntroduction`: “Studying ACCP AI / Software Engineering at Aptech, learning through software, design, and collaborative projects.”
- The first `profile.about` paragraph, if it still expresses the inspected local text: “I’m a student software developer at Aptech, learning through practical projects. I’m interested in how interfaces, application logic, and data work together.”
- A closing About paragraph, if it still expresses the inspected local text: “Independent and collaborative projects are helping me strengthen my foundation as I study, practise, and build.”

The original two-line Hero Supporting Text and all project facts remain untouched. These proposals do not invent professional experience, client work, results, metrics, or completed features.

## Local files changed for this checkpoint

- `src/app/globals.css`: navigation, hero atmosphere, shared CTA variants, and restrained arrow interactions.
- `src/styles/tokens.css`: dedicated hero, navigation-hover, and opaque action tokens in both themes and the no-script fallback; darker light-mode secondary text for the richer gradient.
- `src/styles/homepage.css`: hierarchy, curiosity card, selected-project feedback, About/Skills type, education description, and link treatment.
- `src/styles/case-study.css`: prose measure, overview lead, contribution callout, functionality dividers, and project-navigation feedback.
- `src/components/sections/hero.tsx`: semantic interest-list markup; CMS copy preserved.
- `src/components/sections/about.tsx`: explicit CMS introduction class.
- `src/components/sections/education.tsx`: explicit optional description class.
- `src/app/projects/[slug]/page.tsx`: contribution-note class; CMS text preserved.
- `tests/visual-polish.spec.ts`: dedicated spacing, CTA state contrast, keyboard, reduced-motion, and static-export interaction checks.
- `docs/phase-6c-visual-polish.md`: this report.

The pending Phase 6B layout bootstrap, theme controller, navigation/toggle components, `tests/themes.spec.ts`, and Phase 6B report remain part of the uncommitted working tree. Their presence in Git status is not evidence of a reset or discarded work.

## Verification status

Final source verification and Lighthouse measurements completed on October 14, 2026, after the manual gradient-contrast correction.

| Check                                                                      | Status                                                                     |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Root lint, typecheck, and formatting check                                 | Passed final checks                                                        |
| Production build using real Sanity content                                 | Passed corrected final build                                               |
| Separate content tests                                                     | 13 passed                                                                  |
| Complete Chrome regression suite                                           | 105 passed in approximately 4.9 minutes, including 22 visual-polish checks |
| Studio typecheck and production build                                      | Passed                                                                     |
| Token-free Sanity identity, contacts, counts, and no-fallback verification | Passed real public API verification                                        |
| Four generated case-study routes                                           | Present in corrected final static export                                   |
| All five pages, both themes, all five widths                               | Passed all 50 page/theme/viewport combinations                             |
| Interactive CTA contrast, focus, reduced motion, and navigation spacing    | Passed final interactive-state and pixel-sampling checks                   |
| Browser errors, hydration, overflow, clipping, and geometry checks         | No failures detected in the final tested routes/states                     |
| Lighthouse mobile and desktop                                              | Two actual paired runs completed; results below                            |

The live test queried the actual public Sanity API without a token. It verified Sohail Anwar, `sohailanwar.ai@gmail.com`, `https://github.com/Sohail-aiflow`, the exact original two-line Hero Supporting Text, and 32 canonical documents: 1 profile, 1 homepage, 4 projects, 25 skills, and 1 education record. No fallback warning occurred in that verification. All four final export routes were present: `marketlink-team`, `marketlink-solo`, `car-rental-system`, and `school-website-cms`. A final public API comparison found all 32 canonical revision IDs unchanged from the recorded mid-task snapshot. No CMS writes were performed. These are real API/build observations; the separate 13-test content suite exercises adapters and configuration, including mocked inputs.

The first focused visual-polish run passed 16 checks and reported two arrow-position failures. Hovering had scrolled the page by 24px, so comparing absolute viewport coordinates misidentified scroll movement as arrow movement. The test was corrected to compare arrow geometry relative to its link; both failed checks then passed on rerun. This was a test-measurement correction, not a hidden UI change.

Existing `tests/themes.spec.ts` covers 320, 375, 768, 1024, and 1440px for all five pages in both themes, producing 50 full-page screenshots and auditing automated accessibility rules. Phase 6C tests exercise CTA foreground/background contrast through default, hover, focus, active, and transition states; navigation spacing; arrow inheritance/movement; keyboard focus; reduced motion; and static-export interaction. The final 105-test suite passed, including 22 visual-polish checks. The previous 101-test run also passed before the manual gradient review added four pixel-sampling checks.

Final automated WCAG A/AA checks detected no violations in the tested page/theme/viewport matrix. Runtime and hydration error detectors reported no failures; overflow and navigation bounds/target checks passed. Keyboard activation, visible focus, system/manual theme behavior, storage limitations, and reduced-motion checks passed. Correct first contentful paint was observed in both themes with application JavaScript bundles blocked, and the tested theme switch preserved hero geometry. These results describe the tested installed-Chrome conditions, not every browser or extension configuration.

### Gradient contrast finding

Manual sampling found a real issue that automated axe checks had not reported. The stronger light-mode sage wash placed the previous muted text `#505D6C` against sampled backgrounds `rgb(195 211 196)`, `rgb(189 207 192)`, and `rgb(186 205 190)`, with contrast ratios approximately 4.30:1, 4.11:1, and 4.02:1. These fail the 4.5:1 requirement for normal text. The light `--muted` value was darkened to `#45515F`; dark mode remains unchanged. The same three background samples now yield approximately 5.18:1, 4.95:1, and 4.84:1.

Four rendered-pixel regression checks passed on the final export, sampling nine blank-gutter points beside the hero introduction for each tested theme/width. They compare the computed foreground to actual screenshot background pixels decoded in native canvas. Cropped evidence images are retained under `test-results/browser/visual-polish-*/hero-introduction-*.png`. These checks sample adjacent rendered backgrounds rather than every glyph or every possible gradient position. A passing axe result alone is not presented as proof that every gradient composition was accessible.

A final independent smoke audit used installed Chrome 155.0.8059.40 across all five routes, both themes, and 375px/1440px viewports (20 visits). It captured every console error, page error, and HTTP response error: none occurred. Evidence is saved in `test-results/phase6c/browser-console-audit.json`. This complements the complete five-width regression matrix rather than replacing it.

## Screenshots and performance

Sixteen actual before screenshots are stored under `test-results/phase6c/before/`: light/dark homepage, navigation, default CTA, and hovered CTA at 375px and 1440px. Thirty-six final-source after screenshots were refreshed under `test-results/phase6c/after/`: all five pages in both themes at those two widths (20 full-page images), four hero viewport images, eight default/hover CTA images, and four navigation detail images. The complete 50 final theme/page/viewport screenshots are retained under `test-results/browser/themes-*`. The before set represents the existing Phase 6B design; the after set includes the corrected light muted-text token.

Actual Lighthouse 13.5.0 measured the local production export while browser regression work was idle, using the existing mobile and desktop audit modes with the default light system preference. Both actual runs are retained rather than presenting only the higher repeat scores.

| Measurement          | Phase 6B baseline | Phase 6C first run | Phase 6C repeat |
| -------------------- | ----------------- | ------------------ | --------------- |
| Mobile performance   | 80                | 79                 | 80              |
| Desktop performance  | 99                | 96                 | 99              |
| Mobile LCP           | 5.42s             | 5.493s             | 5.293s          |
| Desktop LCP          | —                 | 1.064s             | 1.022s          |
| Mobile FCP           | —                 | 1.206s             | 1.208s          |
| Desktop FCP          | —                 | 0.314s             | 0.294s          |
| Mobile TBT           | —                 | 110ms              | 45ms            |
| Desktop TBT          | —                 | 124ms              | 0ms             |
| Mobile / desktop CLS | 0                 | 0 / 0              | 0 / 0           |

Accessibility and best-practices categories scored 100 in both modes in both runs. SEO scored 63 consistently; indexing remains intentionally disabled, so `noindex` and the unconfigured public origin are not altered to improve this score. No dark-theme Lighthouse score was measured; dark rendering and accessibility were verified separately in the complete browser matrix.

The first run had more blocking work attributed largely to the unchanged shared Next.js JavaScript: an observed mobile long task was about 235ms compared with roughly 120ms in the recorded baseline. The repeat recovered the Phase 6B performance scores with no intervening source change. This is observed timing variability; a precise external cause was not established. It does not justify suppressing the first measurement or guarantee scores on another machine. Mobile LCP remains above the good threshold and is an existing limitation, despite the faster repeat.

| Transfer measurement | Phase 6B | Phase 6C | Change               |
| -------------------- | -------- | -------- | -------------------- |
| JavaScript bytes     | 494,655  | 494,655  | Unchanged            |
| CSS bytes            | 34,607   | 38,579   | +3,972               |
| Total resource bytes | 780,944  | 785,131  | +4,187 (about 0.54%) |
| Requests             | 16       | 16       | Unchanged            |

Font transfers are unchanged and no dependency was added. Raw evidence is retained as `test-results/audits/phase6c-mobile.json`, `phase6c-desktop.json`, and `phase6c-summary.json`, with the corresponding `phase6c-repeat-*` files for the second run.

## Review and limitations

The generated static export is currently served locally at `http://127.0.0.1:4173/` for owner review; the homepage returned HTTP 200. The server must remain running while that URL is used. For an editable development preview, run `npm.cmd run dev` from `C:\Sohail-Portfolio` and use the URL printed by Next.js. No public hosting was created.

Final Git review found 16 changed/untracked files, including preserved Phase 6B work. All changes remain unstaged and uncommitted; `HEAD` and `origin/main` remain at `25a5e3f`. No reset, commit, push, deployment, production environment change, CMS/schema change, SEO behavior change, or webhook configuration was performed.

Automated accessibility tests cannot establish complete WCAG compliance. Physical-device, assistive-technology, and owner visual review remain useful. Blocked browser storage still permits an in-memory manual theme choice but cannot guarantee persistence after a full reload. Case studies intentionally retain pending evidence and unconfirmed implementation details rather than replacing them with invented claims. Mobile LCP and Lighthouse timing variability remain measured limitations; complete glyph-by-glyph gradient contrast and dark-theme Lighthouse performance were not measured.

The owner must approve the final local visual result before GitHub or Cloudflare deployment work resumes. No deployment origin, indexing change, or published CMS modification is introduced by this checkpoint.
