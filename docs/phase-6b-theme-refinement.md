# Phase 6B — local theme refinement

Deployment remains paused for visual approval. These changes are local and uncommitted; the existing GitHub `main` and `origin/main` remain at `25a5e3f`. No CMS writes, environment changes, indexing changes, dependency additions, commits, pushes, or deployments were performed.

## Design

The Bright Frosted Editorial layout, typography, content, project identities, navigation placement, and responsive breakpoints are preserved. Light mode uses warmer stone and ivory with more defined glass, sage, dusty blue, lavender, and coral. Dark mode uses midnight navy, distinct elevated surfaces, restrained gradients, and soft sage accents.

All palette values live in `src/styles/tokens.css`, including illustration colors, glass opacity, shadows, and section gradients. The complete token definitions are the source of truth.

| Semantic token            | Light                    | Dark                     |
| ------------------------- | ------------------------ | ------------------------ |
| Background                | `#F0EEE8`                | `#151B28`                |
| Surface                   | `#FAF8F2`                | `#252E3D`                |
| Secondary surface         | `#E7E8E1`                | `#1D2533`                |
| Foreground                | `#222A35`                | `#F3F2EF`                |
| Muted text                | `#505D6C`                | `#B5C2D4`                |
| Accent                    | `#3F6555`                | `#99BBAA`                |
| Accent hover              | `#315342`                | `#B0CBBD`                |
| On accent                 | `#FFFAF0`                | `#142821`                |
| Accent surface            | `#DCE6DC`                | `#293C39`                |
| Blue glow                 | `#BDCADC`                | `#283F5B`                |
| Pink glow                 | `#E4BBB3`                | `#493545`                |
| Sage glow                 | `#C1D3C8`                | `#273D36`                |
| Peach glow                | `#E7C9B6`                | `#44332E`                |
| Lavender glow             | `#D4C9E2`                | `#3B3455`                |
| Border                    | `#C5CDC5`                | `#465365`                |
| Glass                     | `rgb(250 248 242 / 88%)` | `rgb(37 46 61 / 92%)`    |
| Button surface            | `rgb(250 248 242 / 82%)` | `rgb(37 46 61 / 90%)`    |
| Glass border              | `rgb(124 145 131 / 35%)` | `rgb(151 175 194 / 26%)` |
| Illustration blue ink     | `#405A72`                | `#A9BEDF`                |
| Illustration peach ink    | `#77523E`                | `#DAB7A1`                |
| Illustration lavender ink | `#66537D`                | `#C5B4DE`                |
| Glow opacity              | `0.78`                   | `0.9`                    |

## Theme architecture and preferences

A trusted static script in the HTML head sets `data-theme` before body paint. It reads only the validated `light`/`dark` value at localStorage key `portfolio-theme`, otherwise uses `prefers-color-scheme`. No CMS input enters the script. It works in the static export without a server or theme provider.

The controller listens for system changes only without a manual preference. Clicking the sun/moon button saves the manual preference and applies it immediately. Preferences survive reloads and case-study navigation. Storage events synchronize other tabs; clearing the preference restores system selection. Invalid stored values are ignored. Blocked storage is caught: switching and in-memory preference still work, but persistence after a full reload cannot be guaranteed when browser storage is unavailable.

The existing client navigation hosts a 44px button. Its accessible action name changes between “Switch to dark mode” and “Switch to light mode”; a separate accessible description identifies the current theme. CSS controls icon and label visibility, avoiding theme-dependent React hydration output. Root-only hydration suppression accommodates the pre-paint attribute; it does not suppress descendant errors.

CSS sets the appropriate `color-scheme` for native controls. With JavaScript disabled, CSS follows system preference and hides the unavailable toggle. Color transitions take 160ms and are disabled under reduced motion. Theme changes do not alter geometry, typography, or page content. No animation dependency was added.

## Local files changed

- `src/styles/tokens.css`: both semantic palettes, illustration colors, and no-script system fallback.
- `src/styles/homepage.css`: replace fixed colors with semantic tokens.
- `src/app/globals.css`: theme-aware shared surfaces, dock integration, and reduced-motion-aware transitions.
- `src/app/layout.tsx`: static pre-paint bootstrap.
- `src/lib/theme.ts`: validated preference controller.
- `src/components/navigation/theme-toggle.tsx`: accessible sun/moon control.
- `src/components/navigation/floating-navigation.tsx`: integrate the toggle into existing navigation.
- `tests/themes.spec.ts`: 18 automated theme checks.
- `docs/phase-6b-theme-refinement.md`: this report.

## Verification

Completed on October 14, 2026:

- Root lint, typecheck, formatting check, and production build passed.
- Separate content suite: 13 passed. These are adapter/configuration tests, including injected fetchers, rather than all real API tests.
- Complete regression suite with `VERIFY_LIVE_SANITY=1`: **83 passed**, including 18 theme checks. The real token-free public Sanity query passed with 1 profile, 1 homepage, 4 canonical projects, 25 skills, 1 education record, and no adapter fallback warnings.
- Studio typecheck and production build passed. Studio was not deployed or used to write content.
- Static export contains `index.html` for `marketlink-team`, `marketlink-solo`, `car-rental-system`, and `school-website-cms`.
- No automated accessibility violations, browser runtime errors, hydration errors, horizontal overflow, undersized navigation targets, or overlapping navigation controls were found in the 50 theme/page/viewport combinations.
- Keyboard Space/Enter, visible focus, both action labels and current-theme descriptions, reduced motion, reload/navigation persistence, system changes, invalid storage, and blocked storage passed.
- Initial paint tests observed the correct light/dark root theme at first contentful paint with application JavaScript bundles blocked. Theme switching preserved the tested hero geometry.

The initial focused theme run passed 17 checks and exposed an invalid axe selector in the new test (`:visible` is a Playwright selector, not a browser CSS selector). It was corrected to target the visible preview's actual ID; the complete 83-check run then passed. An initial formatting check similarly identified the new test file; formatting was corrected and the final check passed.

Theme tests exercise all five pages in both themes at 320, 375, 768, 1024, and 1440px in actual installed Chrome. They check automated WCAG A/AA rules, overflow, 44px touch targets, non-overlapping navigation, runtime/hydration errors, and capture 50 full-page screenshots. Other tests cover first contentful paint with application bundles blocked, system changes, manual override, persistence, keyboard operation, reduced motion, unavailable storage, and all four project-preview palettes.

Automated accessibility results are evidence for the tested pages and states, not a claim of complete WCAG compliance. Dedicated assistive-technology testing and physical-device review remain advisable. Browser first-paint tests cover installed Chrome under controlled conditions; they cannot guarantee every browser or extension configuration.

## Measured performance

Actual Lighthouse 13.5.0 measurements against the local production export, using the existing mobile/desktop audit script and default light system preference:

| Run                            | Mobile performance | Desktop performance | Mobile LCP | Mobile TBT | Mobile / desktop CLS |
| ------------------------------ | ------------------ | ------------------- | ---------- | ---------- | -------------------- |
| Previous Phase 6A              | 80                 | 99                  | 5.39s      | 35.5ms     | 0 / 0                |
| Initial theme run              | 55                 | 91                  | 6.43s      | 863.9ms    | 0 / 0.0045           |
| Theme repeat                   | 61                 | 98                  | 5.82s      | 692ms      | 0 / 0                |
| Fresh unchanged-source control | 80                 | 98                  | 5.45s      | 41.5ms     | 0 / 0                |
| Theme paired comparison        | **80**             | **99**              | **5.42s**  | **35ms**   | **0 / 0**            |

The two low initial runs were investigated rather than discarded. Long-task data attributed much of their blocking time to the unchanged shared Next.js chunk. A fresh export of pushed `25a5e3f` was built with the same current Sanity content and indexing settings, then compared sequentially with the restored theme export on the same machine. The slowdown did not reproduce in that paired comparison. This suggests local timing variability; it does not establish a precise cause for the initial outliers or guarantee scores on other machines. All reports remain available in `test-results/audits/` under `theme-refinement`, `theme-refinement-repeat`, `theme-control`, and `theme-comparison`.

In the paired comparison, Lighthouse accessibility and best practices were 100 in both modes. SEO was 63 because indexing is intentionally disabled; no SEO or indexing behavior was changed to raise that score. Desktop theme LCP was 1.03s with zero TBT. Mobile LCP remains above the good Core Web Vitals threshold, consistent with the previous baseline; launch performance work should account for this existing limitation.

The paired theme page transferred 780,944 bytes versus the control's 771,446 bytes: +9,498 bytes (about 1.2%) on the uncompressed local Python host. Script transfer rose from 493,083 to 494,655 bytes: +1,572 bytes. Request count remained 16, fonts were unchanged, and no dependency was added. These are measured local transfer sizes, not estimates of Cloudflare compressed delivery. Both themes received Chrome/axe checks; Lighthouse scores here refer to the default light palette.

The comparison used ignored `.tools` helpers and an isolated baseline export. Source buffers were restored in a `finally` block, and the final theme production build succeeded afterward. The temporary baseline output and helpers were then removed. A lint run before that cleanup scanned the generated baseline bundles and failed; lint and typecheck passed again after cleanup. These temporary artifacts are not proposed repository changes.

## Visual review

Run `npm.cmd run dev`, then open `http://localhost:3000`. Use the moon/sun button in the desktop pill or mobile dock. Review all four case studies in both themes. Screenshots from the complete suite are stored under `test-results/browser/themes-*`.

Four additional viewport screenshots make the initial desktop/mobile presentation easier to review without scaling an entire long page: `test-results/theme-review/light-1440.png`, `dark-1440.png`, `light-375.png`, and `dark-375.png`. The full-page set contains 50 screenshots. The temporary static preview is served at `http://127.0.0.1:4173` while its local process remains running.

Wait for the owner's visual approval before creating a reviewed commit, pushing to the existing repository, or resuming Cloudflare deployment. Existing deployment documentation and SEO/indexing logic remain unchanged.
