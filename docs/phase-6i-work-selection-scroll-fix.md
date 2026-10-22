# Phase 6I - Selected Work scroll fix

Date: 2026-10-22. Local implementation only; no commit, push, deployment, CMS write, or configuration change.

## Root cause

The four visually hidden native radio inputs share a position near the top of the project fieldset. Their visible labels occupy separate grid rows. When a label activated its radio, the browser's default focus behavior scrolled the offscreen radio into view. Native arrow-key radio navigation could trigger the same behavior.

Chrome reproduction confirmed an upward jump with unchanged URL, history length, and 640px grid height. Instrumentation found no desktop application call to `focus()` or `scrollIntoView()` during the original click. The existing explicit `scrollIntoView()` is restricted to mobile and remains intentional. Stable keyed entries and fixed preview dimensions ruled out remounting and layout shifts as the cause of this jump.

Before the fix, the new regression failed against the previous production export: a real pointer click moved scrollY from 1415 to 932 (483px). A separate diagnostic recorded 1773 to 932 (841px). Logs are local ignored artifacts under `test-results/phase6i-scroll-fix/`.

## Fix and files

- `src/components/sections/selected-work.tsx`: cancel the label's default activation, explicitly focus its actual radio with `preventScroll: true`, then run the existing selection handler. Handle unmodified radio arrow keys in project order with wrapping and the same scroll-preserving focus.
- `tests/work-selection-scroll.spec.ts`: add six viewport cases covering widths 768/1024/1440 and heights 600/900. Both themes, all four projects, and upper/middle/lower click positions are checked. Real coordinate clicks avoid Playwright's locator auto-scroll hiding the failure. Tests verify scroll samples, focus, checked state, preview, fixed grid height, URL/history stability, no document navigation, and all four arrow directions including wrapping.
- This report.

Native radio semantics, labels, checked state, focus indication, Tab behavior, mouse preview, existing animations, and layout remain intact. Main navigation still scrolls intentionally. Mobile project activation still reveals details, and mobile explicit keyboard activation still moves focus to the detail heading. Without JavaScript, native selection remains available.

The earlier Phase 6I hint-copy change in this component and all other pre-existing gallery/content work were preserved. No gallery files, screenshots, CSS, Sanity records, indexing settings, or Cloudflare configuration were changed by this fix.

## Verification

Production export was rebuilt before the browser checks. Installed Chrome was exercised through Playwright against the static export.

| Check                                                 | Result                                                                                                                             |
| ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `npm.cmd run lint`                                    | Passed                                                                                                                             |
| `npm.cmd run typecheck`                               | Passed                                                                                                                             |
| `npm.cmd run format:check`                            | Passed                                                                                                                             |
| `npm.cmd run build`                                   | Passed; homepage and all four project routes exported                                                                              |
| `npm.cmd run test:content`                            | 13 passed                                                                                                                          |
| Homepage, navigation, UX and new scroll browser tests | 36 passed in 6.0 minutes, including all six new viewport cases                                                                     |
| Separate Chrome click smoke check at 1440x900         | scrollY 1389 before and after; 0px delta; correct focused/checked School radio; URL/history/grid unchanged; no page runtime errors |
| `git diff --check`                                    | Passed                                                                                                                             |

Browser coverage includes mobile widths 320/375/430, tablet and desktop, section heading landing positions, mobile detail reveal, reduced motion, no-JavaScript behavior, active preview/focus styling, and the strict new scroll tests in light/dark modes. This is the relevant selection/navigation regression set, rather than a repeat of the unrelated gallery suite.

## Review boundary

All work remains unstaged and uncommitted. HEAD remains `2d0b29d14086f6632fa79be646169c5de7458f1c`. Existing Phase 6I uncommitted changes remain present.

Local preview: <http://127.0.0.1:4180/>. Reload to use the rebuilt bundle. Owner review is the next step.
