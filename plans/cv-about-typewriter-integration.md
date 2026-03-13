# CV About Typewriter Integration

## Goal
Add a one-time typewriter animation to the `/cv` About bio so the full multi-paragraph bio types into view after the About card becomes visible, while preserving the current name, title, actions, link semantics, and status styling.

## Why
The home page already uses a typewriter effect, and the CV page needs the same motion language in the About section. The About bio is richer than the home headline because it contains multiline body copy, an embedded link, and a styled status line, so the current plain-text `TypewriterText` is not enough on its own.

## Constraints
- Keep the app fully client-side and preserve SPA routing behavior.
- Keep the change narrowly scoped to the `/cv` About bio; do not redesign the rest of the CV route.
- Preserve `AboutMe` data shape and existing route/component composition.
- Keep the existing `TypewriterText` API backward-compatible for the home route.
- Preserve reduced-motion behavior and do not expose partial character updates to screen readers.
- Avoid visible reserve-text bleed while still preventing layout shift.

## Affected files and responsibilities
- `src/components/text/TypewriterText.tsx`: keep the plain-text wrapper and move shared timing/progress logic out of the component.
- `src/components/text/`: host the extracted shared typewriter engine or hook and its tests.
- `src/components/cv/ProfileCard.tsx`: replace the static bio rendering path with the CV-specific animated bio component.
- `src/components/cv/`: host the new rich-text About bio typewriter component and its tests.
- `src/pages/CV.tsx`: no route-structure change expected; validate existing visibility behavior against the new bio animation.
- `e2e/cv.github.spec.ts`: keep as the narrow regression guard for the `/cv` route.

## Proposed approach
Extract the current character progression and humanized delay logic from `TypewriterText` into a shared engine or hook that can drive both plain and rich-text renderers. Keep `TypewriterText` as the existing plain-text consumer, then add a CV-scoped rich-text bio renderer that converts the current `about.bio` plus `about.bioLink` into ordered display segments and reveals them based on a single visible-character count.

The CV bio renderer should reserve final layout width with fully hidden content, expose a stable full-text accessible representation, and render the animated layer as presentation-only. It should start only once, when the bio first intersects the viewport, using the same IntersectionObserver pattern already used elsewhere in the repo. The embedded degree link and status line should preserve their current styling as soon as their typed characters appear.

## Execution steps
1. Extract reusable typewriter timing/progress logic from `TypewriterText` into a shared helper or hook and add a dedicated body-copy timing preset.
2. Update `TypewriterText` to consume the shared logic without changing its public behavior on the home route.
3. Add a CV-specific rich-text bio typewriter component that:
   - derives ordered segments from `about.bio` and `about.bioLink`
   - types the full bio body once the bio becomes visible
   - keeps the link and status styling during typing
   - reserves space without visible future-text bleed
   - short-circuits to fully rendered content under reduced motion
4. Replace only the bio-content construction in `ProfileCard` with the new CV bio typewriter.
5. Add deterministic tests for the shared engine and the CV bio typewriter, then adjust `ProfileCard` tests to avoid timer-based flakiness while still checking final rendered output.
6. Run the narrow validations for `/cv`, update this plan’s progress notes with any deviations, and keep rollback contained to the new shared engine plus the CV bio component if regressions appear.

## Validation plan
- `npm test -- --watch=false --runTestsByPath src/components/text/useTypewriterProgress.test.ts src/components/cv/CVAboutBioTypewriter.test.tsx src/components/cv/ProfileCard.test.tsx`
- `npm run build`
- `npx playwright test e2e/cv.github.spec.ts`
- Browser validation on `/cv` at one desktop and one mobile viewport with reduced motion disabled, confirming:
  - the About bio starts typing only after the About card becomes visible
  - the animation plays once and stays fully rendered afterward
  - no visible future-text bleed or layout jump appears
  - the inline degree link and final status line keep their styling as characters appear
- Browser validation on `/cv` with reduced motion enabled, confirming the full static bio appears immediately

## Risks and rollback
- The main regression risk is widening the shared typewriter logic in a way that changes the home hero timing or behavior. Keep the shared extraction internal and preserve `TypewriterText` defaults.
- The rich-text bio animation can accidentally expose partial content to assistive tech or create keyboard-inaccessible hidden links. Keep the animated layer `aria-hidden` and provide one stable full-text accessible node.
- Visibility-trigger timing can be wrong if the observer attaches to the wrong element. Gate the animation on the bio block itself and disconnect once it starts.
- If regressions appear, rollback is contained to removing the CV bio typewriter and reusing the previous static `ProfileCard` bio path while leaving the shared plain `TypewriterText` behavior intact.

## Progress notes
- Planned implementation uses a CV-local rich-text typewriter instead of widening `TypewriterText` into a generic renderer.
- Extracted the shared timing/progress logic into `src/components/text/useTypewriterProgress.ts` and kept the home route on the plain `TypewriterText` wrapper.
- Wired the About bio through a new `CVAboutBioTypewriter` component and delayed playback by the card entrance duration so the typing does not start underneath the About card `Zoom`.
- Browser validation showed the first body-copy preset was still too slow for the real `/cv` bio, so the `body` preset was tightened to finish in a more practical window on desktop and mobile.
- `npx playwright test e2e/cv.github.spec.ts` still fails on an existing advisor-tooltip assertion (`View faculty page`) that is unrelated to the About typewriter change; the new About animation behavior itself was validated separately against the production build at desktop, mobile, and reduced-motion settings.
