# Home Hero Typewriter Animation

## Goal

Replace the static home hero headline on `/` with a one-way typewriter animation that starts only after the existing welcome/onboarding sequence reveals the hero card, while preserving the page's current structure and heading semantics.

## Why

The home page currently swaps from hidden to fully rendered hero copy in one step. A typewriter entrance adds motion to the headline, but it needs to do so without changing the onboarding flow, causing layout shift, or degrading accessibility and reduced-motion behavior.

## Constraints

- Keep the app fully client-side and preserve SPA routing behavior.
- Keep the change narrowly scoped to the home hero headline and a focused shared text component.
- Do not modify `DisplayTitle` or widen route-level orchestration logic in `Home`.
- Reuse the existing `usePrefersReducedMotion` hook instead of adding another media-query path.
- Preserve current heading semantics, visual styling, and `PUBLIC_URL` compatibility.
- Do not add dependencies or introduce a generalized rotating-typewriter API.

## Affected files and responsibilities

- `src/components/text/TypewriterText.tsx`: own the one-line typing animation, width reservation, cursor rendering, and reduced-motion fallback.
- `src/components/text/index.ts`: export the new component through the existing text barrel.
- `src/pages/Home.tsx`: keep `DisplayTitle` as the `h1` wrapper and render the typewriter text only once `isHeroAnimationReady` is true.
- `src/components/text/TypewriterText.test.tsx`: add deterministic timer-driven coverage for typing, completion, cursor cleanup, and reduced-motion fallback.
- `src/pages/Home.test.tsx`: keep the welcome-sequence tests focused on orchestration by mocking the new typewriter component to static text.

## Proposed approach

Add a narrow `TypewriterText` component under `src/components/text/` that is derived from the provided example but trimmed to the home-page need: a single string that types once and then stays visible. The component should expose the full sentence to assistive technology, reserve width using a hidden copy to avoid layout shift, render only the animated glyphs and cursor visually, and skip animation entirely when `prefers-reduced-motion` is enabled.

Wire that component into `Home` inside the existing `DisplayTitle` so the route remains declarative and the `h1` ownership does not move. Mount the typewriter only when `isHeroAnimationReady` turns true so the sentence starts typing after the onboarding flow instead of behind it.

## Execution steps

1. Add the ExecPlan and confirm the smallest file set for the component-local implementation.
2. Implement `TypewriterText` with single-string typing behavior, humanized delays, width reservation, accessible full-text output, and reduced-motion fallback.
3. Export `TypewriterText` from the text barrel and update `Home` to render it inside `DisplayTitle` only when the hero is ready.
4. Add deterministic component tests and adapt the existing home tests to mock the typewriter component.
5. Run targeted Jest coverage, `npm run build`, the home Playwright spec, and direct browser checks for desktop and mobile home-page rendering.

## Validation plan

- `npm test -- --watch=false --runTestsByPath src/components/text/TypewriterText.test.tsx src/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test e2e/home.spec.ts`
- Browser validation on `/` at one desktop viewport and one narrow/mobile viewport:
- confirm the welcome sequence still gates hero visibility
- confirm the headline types once and then remains fully visible
- confirm no obvious overflow, clipping, or line-wrap jitter occurs while typing
- confirm reduced-motion rendering remains immediate and stable where applicable

## Risks and rollback

- Timer-driven typing behavior can make tests flaky unless timing randomness is fixed or stubbed; keep unit tests deterministic.
- Accessibility can regress if the heading exposes partial text instead of the full sentence while animating; keep the animated text `aria-hidden` and expose one full accessible string.
- Width reservation can cause styling drift if it does not inherit the same typography styles as the visible text; ensure both copies share the same styling hooks.
- If the animation introduces regressions, rollback is isolated to `TypewriterText`, its barrel export, and the `Home` consumption point.

## Progress notes

- Implemented `src/components/text/TypewriterText.tsx` as a focused inline animation component derived from the provided example’s delay logic, but trimmed to single-string, type-once behavior with reduced-motion fallback and width reservation.
- Kept `DisplayTitle` unchanged and wired the new component into `src/pages/Home.tsx`, mounting it only when `isHeroAnimationReady` is true so the headline does not animate behind the welcome flow.
- Used `aria-label` on the inline typewriter root plus `aria-hidden` visual text so the heading exposes the full sentence accessibly without duplicating DOM text in Playwright selectors.
- Tuned the home-page usage through the shared `headline` timing preset so the hero finishes in a reasonable time window while preserving the humanized delay profile.
- Reverted the experimental glyph-based guide layer after browser review showed that it leaked future characters during typing; the reserve-width layer is hidden again so upcoming text is never visible before it is typed.
- Added deterministic unit coverage in `src/components/text/TypewriterText.test.tsx` and updated `src/pages/Home.test.tsx` to mock the new component and keep those tests focused on welcome-sequence orchestration.
- Validation completed:
- `CI=true npm test -- --watch=false --runTestsByPath src/components/text/TypewriterText.test.tsx src/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test e2e/home.spec.ts`
- Browser validation against the local production build on `http://127.0.0.1:3100/` at desktop `1440x1100` and mobile `390x844`:
- verified the sentence starts as a cursor-only state, expands by `220ms`, and reaches the full headline after the onboarding flow
- verified the final heading box stayed within the viewport (`1173x60` on desktop, `332x108` on mobile) with no obvious clipping or overflow
- captured screenshots at `/tmp/home-typewriter-desktop.png` and `/tmp/home-typewriter-mobile.png`
- Additional browser review identified a regression in the experimental guide layer: future characters were faintly visible before they were typed. The guide layer was removed so the reserve-width copy remains fully hidden during the animation.
- Regression revalidation after removing the guide layer:
- desktop `1440x1100` at `220ms`: confirmed only the typed prefix and cursor are visible, with no leaked future characters
- mobile `390x844` at `220ms`: confirmed only the typed prefix and cursor are visible, with no duplicate or ghosted upcoming text
- captured screenshots at `/tmp/home-typewriter-regression-desktop-220ms.png` and `/tmp/home-typewriter-regression-mobile-220ms.png`
- Home-shell style cleanup:
- added a dedicated `homeHeroShellSx` surface override so the hero panel uses a denser, darker backdrop treatment than the generic translucent page shell
- desktop `1440x1100`: verified the rounded shell edges no longer pick up warm image bleed from the portrait background
- mobile `390x844`: verified the same home-specific shell treatment remains stable around the wrapped heading
- captured screenshots at `/tmp/home-shell-desktop.png` and `/tmp/home-shell-mobile.png`
