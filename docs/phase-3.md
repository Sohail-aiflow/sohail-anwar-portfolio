# Phase 3 — complete homepage

## Delivered sections

1. Hero: editorial headline, explicit software-development/student identity,
   Explore Work and Connect links, pastel atmosphere, and an interests note.
2. Selected Work: four factual project entries and category-based abstract art.
3. About: three editorial paragraphs based on supplied background; an optional
   real-portrait field does not leave an empty visual slot when absent.
4. Skills & Experience: all supplied categories and technologies, framed as
   exposure/practice; project-based MarketLink team experience from project data.
5. Education: Aptech, ACCP AI / Software Engineering, currently studying.
6. Connect: invitation and truthful pending contact state; verified email and
   professional profiles can be supplied through the content file.
7. Footer: identity, closing line, and working back-to-top link.

No employment history, certifications, proficiency percentages, metrics,
testimonials, graduation dates, fake portrait, dashboard, or contact form was
added. The two MarketLink projects remain distinct. No case study routes, Sanity
integration, deployment, framework replacement, or new dependencies were added.

## Showcase behavior and accessibility

The selector is a native fieldset/legend radio group. Project labels include
status and accurate role, collaboration, or supplied stack context. Click/touch
selects a project; arrow keys move through the group. Keyboard focus and mouse
hover update the matching concept. Visually hidden radios remain accessible;
focus is visibly outlined on their labels. No hover is required on touch devices.

At desktop/tablet widths the list is on the left, with the preview in a stable
right-hand grid area. On mobile the same preview is placed immediately below the
selection group. A consistent panel height avoids selection-induced layout jumps.
CSS :checked handles preview visibility, so native selection also works without
JavaScript. Hidden panels do not expose links to keyboard or screen-reader users.

Artwork is static CSS geometry and Lucide category icons, labeled "Abstract
concept" and "Preview pending", with an additional screenshot-pending note.
There are no simulated application screens. Team MarketLink has a real Live Demo
link using the supplied URL, target=_blank, and rel=noopener noreferrer. Its public
access remains unverified. GitHub links appear only when a real project URL is
provided; currently none exist. Case studies use plain pending text, not links.

The Phase 2 navigation behavior is preserved. Five named, focusable targets now
contain real content. Education remains part of Skills. Native anchors, semantic
headings/landmarks, visible focus, responsive spacing, mobile dock clearance,
and reduced-motion settings remain in place. No new animation loops are added.

## Files

Created:

```text
src/content/profile.ts
src/components/layout/site-footer.tsx
src/components/sections/hero.tsx
src/components/sections/selected-work.tsx
src/components/sections/project-preview.tsx
src/components/sections/about.tsx
src/components/sections/skills.tsx
src/components/sections/education.tsx
src/components/sections/connect.tsx
src/styles/homepage.css
tests/homepage.spec.ts
docs/phase-3.md
```

Modified:

```text
src/app/page.tsx
src/app/layout.tsx
src/app/globals.css
src/components/layout/editorial-header.tsx
README.md
docs/architecture.md
```

Removed: `src/components/ui/foundation-note.tsx` (obsolete placeholder).
Project records, navigation logic, design tokens, framework settings, and
dependencies remain unchanged.

## Executed verification

- `npm.cmd run lint`: passed with zero errors/warnings.
- `npm.cmd run typecheck`: passed with strict TypeScript.
- `npm.cmd run build`: passed; static homepage, not-found page, and icon exported.
- `npm.cmd run format:check`: passed.
- `npm.cmd run test:browser`: all 18 Chrome tests passed against `out/`.

Coverage includes 320, 375, 768, 1024, and 1440px widths, navigation destinations,
focus/keyboard order, heading clearance from navigation, horizontal overflow,
unchanged content placement during navigation transitions, all project selections,
constant preview/grid dimensions, hover/focus/arrow-key selection, reduced motion,
native selection and navigation without JavaScript, factual external link
attributes, direct anchors, manual scrolling, and returning from another route.
The Live Demo test checks its URL and safe link attributes; it does not test the
remote site's availability. Browser runs emitted only the environmental
NO_COLOR/FORCE_COLOR warning. Desktop/mobile screenshots were visually inspected.

Screenshots are generated under ignored `test-results/` folders:

```text
homepage-project-selection-and-homepage-at-1440px/homepage-1440.png
homepage-project-selection-and-homepage-at-375px/homepage-375.png
homepage-project-selection-and-homepage-at-320px/homepage-320.png
homepage-project-selection-and-homepage-at-1440px/work-1440.png
```

The five responsive tests also generate work and homepage captures at every
requested width. Full-page captures reset to the page top so fixed navigation
appears in its initial position.

## Missing information and limitations

- Confirm the working display name, currently Sohail.
- Supply verified email, GitHub, LinkedIn, or other professional links.
- Supply genuine project screenshots, repository links, and case-study evidence.
- Confirm the team MarketLink stack and the car-rental/school roles and
  collaboration details. Those facts remain absent or unconfirmed.
- A real portrait is optional; none was invented or required.
- The MarketLink URL is supplied but its public accessibility was not tested.
- Chrome checks do not establish Safari/Firefox compatibility, physical iOS
  safe-area behavior, or a full screen-reader audit.
- The previously documented five development-only dependency findings and ESLint
  deprecation remain unresolved. No dependency changes were made in this phase.

Phase 4, detailed case studies, Sanity, and deployment require a later instruction.
