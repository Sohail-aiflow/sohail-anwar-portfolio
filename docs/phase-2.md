# Phase 2 — visual system and responsive navigation

## Scope and design

The homepage is a preview shell, with a short student introduction and four
labeled future section targets. No final hero, project cards, About biography,
Skills content, contact form, case studies, CMS requests, or fabricated claims
have been added. Project records remain unchanged.

Existing Newsreader and DM Sans assets are reused. The CSS token system now
includes fluid display/heading/body sizes, muted sage accents, luminous ivory,
charcoal text, blue/pink/sage/peach/lavender glows, surface shadows, navigation
clearance, and page gutters. A static CSS gradient atmosphere uses a restrained
blur. The status note is translucent; the navigation alone uses backdrop blur.

The shared primitives are PageContainer, SectionHeading, GlassSurface,
IconTreatment, LinkButton, EditorialHeader, and FloatingNavigation. Props remain
small and typed. No UI library, paid service, or additional font is introduced.

## Navigation and accessibility

- At 768px and wider, links are integrated into the editorial header. Once the
  header leaves view, the same navigation becomes a compact top-center pill.
- Below 768px, the same links form a fixed bottom dock with visible icons and
  labels. Minimum targets are 44px; device safe areas and final content clearance
  are reserved. The viewport allows safe-area insets without disabling zoom.
- Home, Work, About, Skills, and Connect link to real, labeled homepage targets.
  Root-relative URLs support returning from other routes.
- There is one primary navigation landmark, visible focus, a skip link, logical
  tab order, and aria-current for the active section on the homepage. Clicking a
  destination focuses its section without interrupting normal scrolling. Modified
  clicks retain their normal browser behavior.
- Two lightweight IntersectionObservers replace per-frame scroll handlers;
  they are disconnected on cleanup. A scrollend callback updates once scrolling
  settles; hashchange updates fragment state. Both listeners are removed on
  cleanup. The requested fragment wins only at its scroll destination, including
  clamped final anchors. The reserved header slot prevents content shifts when
  positioning changes.
- Smooth anchors and a short Motion transition respect reduced motion. Native
  links remain functional without JavaScript; floating/active state is enhanced
  after hydration. Decorative layers and icons are hidden from assistive technology.

## Dependency security review — 2026-10-13

Registry audit findings remain five high severity findings through this path:

```text
eslint-config-next@16.4.0
└─ @next/eslint-plugin-next@16.4.0
   └─ fast-glob@3.3.1
      └─ micromatch@4.0.8
         └─ braces@3.0.3
```

The root advisory is
[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): deeply
nested brace patterns can exhaust the stack. Five findings reflect the affected
package and its dependency ancestors; they are not five distinct root bugs.
This chain is development tooling. It could disrupt lint/build tooling processing
hostile patterns; it is not included in the exported site's runtime dependencies.

`npm view braces version` still returns 3.0.3, within the vulnerable range.
The audit suggests eslint-config-next 14.2.35, a major downgrade incompatible
with the preserved lint setup. No force fix, override to an unpatched version,
or framework migration was performed. Monitor upstream fixes and rerun the audit.

ESLint 9.39.5 is deprecated; the registry lists ESLint 10.12.0. Although the
Next.js config declares eslint >=9, its installed plugins declare narrower peers:
eslint-plugin-react 7.37.5 supports through ^9.7, jsx-a11y 6.10.2 through ^9,
and import 2.32.0 through ^9. ESLint 10 is therefore not a safe compatible update
for this installed chain. ESLint 9 is retained and checks complete successfully.

Playwright was added only as development tooling for concrete browser tests.
Production dependencies, Next.js, React, TypeScript, Tailwind, fonts, and framework
configuration were not replaced. No automatic force updates were applied.

## Files

Created:

```text
src/app/icon.svg
src/data/site.ts
src/data/navigation.ts
src/components/layout/atmosphere.tsx
src/components/layout/editorial-header.tsx
src/components/layout/page-container.tsx
src/components/navigation/floating-navigation.tsx
src/components/ui/glass-surface.tsx
src/components/ui/icon-treatment.tsx
src/components/ui/link-button.tsx
src/components/ui/section-heading.tsx
playwright.config.ts
tests/navigation.spec.ts
docs/phase-2.md
```

Modified:

```text
src/app/layout.tsx
src/app/page.tsx
src/app/globals.css
src/styles/tokens.css
src/components/ui/foundation-note.tsx
package.json
package-lock.json
.gitignore
.prettierignore
README.md
docs/architecture.md
```

## Executed verification

- `npm.cmd run lint`: passed, zero errors or warnings.
- `npm.cmd run typecheck`: passed with strict TypeScript.
- `npm.cmd run build`: passed; homepage, not-found page, and icon export statically.
- `npm.cmd run format:check`: passed.
- `npm.cmd run test:browser`: 9 passed against the production export in Chrome.
- `npm.cmd audit --omit=dev`: zero vulnerabilities.

Browser coverage includes 320, 375, 768, 1024, and 1440px widths, a 900px
viewport height, label fit, 44px minimum tap targets, horizontal overflow, all
navigation destinations, heading clearance, active indication, target focus,
unchanged content position across floating transitions, keyboard order/focus,
skip link, direct anchors, manual scrolling, returning from the exported 404
route, reduced motion, and navigation with JavaScript disabled. Desktop, tablet,
mobile, and floating-navigation screenshots were visually inspected. There were
no page JavaScript errors in the five viewport tests. Playwright emitted an
environmental NO_COLOR/FORCE_COLOR warning; it did not affect execution.

## Limitations and owner decisions

Sohail is the working display name inferred from the project folder; confirm or
edit `src/data/site.ts` when preferred. No approval is needed to keep this preview
working. Later-phase content, contact details, evidence, and deployment remain
pending. No GitHub push or hosting deployment was performed.

Chrome testing does not establish Safari/Firefox compatibility, physical iOS
safe-area behavior, or a full screen-reader audit. Safe-area CSS is implemented,
but notch/home-indicator verification on a physical device remains outstanding.
The development-only audit findings and ESLint deprecation remain unresolved.
