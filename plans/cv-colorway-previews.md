# CV Colorway Previews

## Goal
Add a `/cv`-local appearance preview system so the page can switch between a few concrete colorway and typography directions in-browser without changing the rest of the site.

## Why
The current CV styling is tightly centered on one cyan-forward palette and one typography pairing. That makes it hard to evaluate alternative directions, and the CV route currently inherits that single visual identity across links, borders, chips, and animated accents.

## Constraints
- Keep the app fully client-side.
- Preserve SPA routing and direct navigation for `/cv`.
- Keep the change narrowly scoped to the requested CV styling work.
- Do not change the existing global light/dark theme toggle behavior for the rest of the site.
- Prefer route-local composition over broad shared-component API churn.
- Validate `/cv` in the browser at desktop and mobile sizes.

## Affected files and responsibilities
- `src/pages/CV.tsx`: own route-level composition for the CV page, including route-local appearance state and nested theming.
- `src/theme/createAppTheme.ts`: support deriving a theme from an optional CV appearance preset while preserving the current default behavior.
- `src/theme/cvAppearance.ts`: define the available CV appearance presets and any persisted preference key.
- `src/components/cv/CVAppearanceSelector.tsx`: render the CV-local selector UI for previewing appearance options.
- `src/pages/CV.test.tsx`: cover rendering and basic selection/persistence behavior at the route level.

## Proposed approach
Introduce a small set of named CV appearance presets that each define a palette direction and typography pairing. Keep the global app theme provider unchanged, but nest a route-local MUI theme provider inside `/cv` so only the CV route adopts the selected preset. Surface the selector inside the existing About section footer near the section navigator so the preview control feels native to the page instead of becoming a global app setting.

## Execution steps
1. Add an appearance preset module with 3 concrete options and a storage key for the selected preset.
2. Extend theme creation so it can accept an optional preset key while preserving the current theme when no preset is supplied.
3. Add a CV-specific selector component that lets the user switch among the presets.
4. Update the CV page to manage the selected preset, persist it locally, and wrap the route content in a nested theme provider.
5. Add or update focused tests for the selector and route-level persistence/rendering.

## Validation plan
- `npm test -- --watch=false --runInBand src/pages/CV.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation of `/cv` at desktop and mobile viewports, including direct navigation and appearance switching

## Risks and rollback
- Nested theming could accidentally affect route-adjacent layout if applied too high in the tree.
- Shared CV components rely on theme tokens heavily, so a preset with poor contrast could make chips or tabs harder to read.
- Persisting a bad preset choice could create confusion if the selector UI fails to render; keep the default fallback stable.
- Rollback is straightforward: remove the CV-local selector and nested theme provider, then fall back to the existing single theme path.

## Progress notes
- Initial review showed the current cyan accent is reused across most interactive and decorative states, which is the main hierarchy problem to address.
- Implemented the appearance previews as a nested `/cv` theme so the site-wide theme toggle and other routes remain unchanged.
- Added three route-local presets: Atlas, Evergreen, and Ember.
- Tightened `e2e/cv.github.spec.ts` to target the `Recent Activity` heading by role after the existing text locator proved ambiguous during validation.
