# `v1` Production Hardening Patch

## Goal

Address the concrete production-readiness risks identified in the final `v1` review so the branch can be released with stronger runtime resilience, lower initial-load risk, and meaningful automated coverage for critical UX flows.

## Why

The final release review found four categories of risk that should be resolved before production:

- the production bundle is larger than desirable because route pages are eagerly loaded
- service-worker registration and offline recovery paths are under-hardened
- the app still references an external Material Icons stylesheet despite using bundled SVG icons
- critical user flows around motion settings, appearance switching, responsive header behavior, photography lightbox keyboard navigation, and command-palette interaction are not covered deeply enough

There is also unit-test warning noise from a mocked MUI `Collapse` component leaking unsupported props into the DOM.

## Constraints

- Preserve the fully client-side SPA architecture and direct-link routing behavior.
- Keep `PUBLIC_URL` compatibility intact for static hosting.
- Preserve provider nesting order and the route transition contract in `src/App.tsx`.
- Keep route orchestration in `src/pages/`, shared UI in `src/components/`, and pure helpers in `src/utils/`.
- Make narrowly scoped changes only for the reviewed risks; avoid unrelated refactors.

## Affected files and responsibilities

- `src/App.tsx`: route wiring and route-level code splitting.
- `src/utils/serviceWorkerRegistration.ts`: production registration and recovery hardening.
- `public/service-worker.js`: offline/navigation recovery behavior for cached app shell and runtime assets.
- `index.html`: top-level static HTML shell and external asset references.
- `test/unit/components/header/HeaderAppearanceDial.test.tsx`: stronger preset-selection coverage.
- `test/unit/components/header/HeaderMotionDial.test.tsx`: new focused motion-dial coverage.
- `test/unit/components/Header.test.tsx`: responsive header behavior coverage.
- `test/unit/components/photography/ImmersiveLightbox.test.tsx`: keyboard navigation coverage.
- `test/unit/components/GlobalCommandPalette.test.tsx`: keyboard interaction and open/close coverage.
- `test/unit/components/TabPanel.test.tsx`: remove prop-leak warning from mock output.
- `test/e2e/home.spec.ts`: route-level validation for settings interactions when useful.
- `test/e2e/photography.spec.ts`: route-level validation for lightbox keyboard behavior and responsive route behavior when useful.

## Proposed approach

1. Split route pages at the `App.tsx` boundary using `React.lazy` and a lightweight fallback that fits the current architecture, preserving `Routes location={location}` so exit animations remain correct.
2. Harden both service-worker layers:
   - in `serviceWorkerRegistration.ts`, make invalid-service-worker recovery explicitly handled and logged
   - in `public/service-worker.js`, fix the navigation fallback condition and avoid throwing uncaught cache-miss errors in offline/runtime paths
3. Remove the external Material Icons stylesheet from `index.html` if no runtime consumer still depends on the font.
4. Add focused automated coverage for the exact gaps called out in review, favoring the narrowest existing test layers:
   - unit tests for header appearance/motion controls and command-palette interaction logic
   - unit tests for photography lightbox keyboard behavior
   - responsive header tests
   - targeted route-level Playwright coverage only where it meaningfully increases confidence
5. Clean up the warning-producing `Collapse` mock so Jest runs without that known React DOM warning.

## Execution steps

1. Create the plan and verify the exact target files and existing coverage.
2. Implement route-level code splitting in `src/App.tsx` and keep route transition behavior intact.
3. Harden service-worker registration and service-worker runtime recovery behavior.
4. Remove the unused external Material Icons stylesheet from `index.html`.
5. Add and update focused unit tests for the reviewed UX gaps and warning cleanup.
6. Add or adjust targeted Playwright coverage if needed for route-level confidence.
7. Run targeted validation, then full repo validation, then browser checks and screenshots for affected routes.

## Validation plan

- `npm run typecheck`
- `npm run lint`
- targeted Jest runs for touched suites
- `CI=true npm test -- --watchAll=false`
- `npm run build`
- `npm run build:e2e`
- `npm run test:e2e:chromium`
- `npm run build && npm run test:e2e:smoke`
- browser validation on `/`, `/cv`, and `/photography` at desktop and narrow widths with screenshots

## Risks and rollback

- Lazy route loading can interfere with page transitions or introduce loading flashes; if this happens, rollback is isolated to `src/App.tsx`.
- Service-worker changes can break offline recovery or stale-deploy behavior; validate with the existing smoke suite and keep changes localized to the registration/runtime files.
- Test additions can become brittle if they depend on animation timing; prefer reduced-motion or direct callback assertions where possible.
- Removing the stylesheet is safe only if all icons are already SVG-based; verify via search and browser review before relying on the removal.

## Progress notes

- 2026-03-23: Created plan after confirming the task is cross-cutting and touches more than four source files.

## Completion Status

- [ ] In progress
