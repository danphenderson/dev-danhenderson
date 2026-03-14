# Typewriter Shared Timing Preset

## Goal

Remove the home-route literal typewriter timing and replace it with a shared preset that can be reused by multiple routes, including `/` now and `/cv` later, without changing current animation behavior.

## Why

The initial home hero implementation tuned the typing speed with a route-local `typingBaseMs={4}` override. That solves the immediate UX issue, but it leaves the timing choice duplicated at the call site and makes future reuse on `/cv` depend on remembering a magic number.

## Constraints

- Keep the app fully client-side and preserve SPA routing behavior.
- Keep this change narrowly scoped to the shared typewriter API and its current home-page consumer.
- Do not introduce new CV UI or content in this pass; only prepare the shared timing contract for future `/cv` use.
- Preserve reduced-motion behavior, heading semantics, and current home-page animation feel.
- Maintain backward compatibility for existing `TypewriterText` usage by keeping `typingBaseMs` available.

## Affected files and responsibilities

- `src/components/text/TypewriterText.tsx`: define and apply shared timing presets while preserving existing override behavior.
- `src/components/text/TypewriterText.test.tsx`: add deterministic coverage for preset resolution and keep existing timing tests green.
- `src/pages/Home.tsx`: switch the home hero from a literal timing override to the shared preset.
- `plans/typewriter-shared-timing-preset.md`: record the implementation and validation for this follow-up change.

## Proposed approach

Add a narrow `timingPreset` prop to `TypewriterText` with a small internal preset map, using a reusable preset name that fits both the home hero and future CV usage, such as `headline`. Keep `typingBaseMs` as an escape hatch and let it override the preset value if a consumer needs a one-off timing.

Update `Home` to use the preset instead of the literal number. Validate the shared component with deterministic timer tests so the preset stays documented in behavior rather than only in code comments.

## Execution steps

1. Add the ExecPlan and confirm the current shared component and home-route consumption shape.
2. Refactor `TypewriterText` to resolve timing from a shared preset map plus optional explicit override.
3. Update the home hero to consume the shared preset instead of a hardcoded base timing.
4. Extend the component test coverage to prove the preset resolves faster than the default profile and rerun focused validation.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath src/components/text/TypewriterText.test.tsx src/pages/Home.test.tsx`
- `npm run build`

## Risks and rollback

- A preset refactor can accidentally change the current home-page typing speed. Keep the preset mapped to the same effective base timing as the existing home usage.
- Adding a new prop can complicate the component API if it overlaps unclearly with `typingBaseMs`; keep the precedence explicit and test it.
- If the refactor regresses behavior, rollback is isolated to `TypewriterText`, its focused tests, and the `Home` call site.

## Progress notes

- Added a `timingPreset` prop to `src/components/text/TypewriterText.tsx` with a small internal preset map (`default`, `headline`) while keeping `typingBaseMs` as an explicit override for one-off consumers.
- Updated `src/pages/Home.tsx` to use `timingPreset="headline"` instead of the prior route-local `typingBaseMs={4}` literal, preserving the existing animation feel through the shared preset path.
- Extended `src/components/text/TypewriterText.test.tsx` with deterministic coverage for preset resolution and override precedence.
- Updated `src/pages/Home.test.tsx` to assert the home route now passes the shared preset, while keeping the typewriter itself mocked so the route test remains focused on onboarding orchestration.
- Intentionally did not modify `/cv` yet because there is no existing `TypewriterText` consumer on that route; this pass only removes the home-specific timing debt and prepares the shared contract for the future CV usage.
- Validation completed:
- `CI=true npm test -- --watch=false --runTestsByPath src/components/text/TypewriterText.test.tsx src/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test e2e/home.spec.ts`
- Direct browser validation against the local production build on `http://127.0.0.1:3100/` at desktop `1440x1100` and mobile `390x844`:
- verified the preset path still starts with a cursor-only state, expands by `220ms`, and reaches the full headline
- verified the final heading box stayed within the viewport (`1173x60` on desktop, `332x108` on mobile)
- captured screenshots at `/tmp/home-typewriter-desktop.png` and `/tmp/home-typewriter-mobile.png`
