# Broad `src/` Maintainability Patch

## Goal

Reduce concentrated complexity in the client app without changing routes, content schemas, or the current visual intent.

## Why

The strongest debt is clustered in a few orchestration-heavy modules:

- welcome audio startup can stall indefinitely
- onboarding hint state is coupled to audio state
- GitHub/CV page composition is overly manual
- some hooks pretend to be async over static data
- style and theme modules are oversized
- one test suite is currently brittle and failing

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing and `PUBLIC_URL` asset compatibility.
- Do not change route paths or stable data schemas.
- Do not add dependencies.
- Keep the change narrowly scoped to the maintainability patch.

## Affected files and responsibilities

- `src/WelcomeAudioProvider.tsx`: split durable audio concerns from onboarding hint state and harden widget bootstrap.
- `src/hooks/useHomeWelcomeSequence.ts`, `src/pages/Home.tsx`, `src/components/Header.tsx`: rewire onboarding interactions to the new hint state boundary.
- `src/hooks/useGithubProfile.ts`, `src/pages/CV.tsx`, `src/pages/cvPageLayout.ts`: simplify GitHub loading and CV section composition.
- `src/hooks/useClimbingData.ts`, `src/hooks/usePhotographyData.ts`, route tests/pages: remove fake async structure around static data.
- `src/styles/`, `src/ThemeProvider.tsx`: split large style/theme modules into smaller domain-focused modules.
- `src/components/TabPanel.test.tsx` and shared route tests: replace brittle style assertions and remove router warning noise.

## Proposed approach

1. Extract SoundCloud startup into a timeout-aware helper and keep `useWelcomeAudio` focused on consent/playback/error state.
2. Add a dedicated onboarding provider/hook for pause/theme hints used by Home and Header.
3. Split `useGithubProfile` into pure helpers plus a small fetch coordinator with in-memory caching and request deduplication.
4. Replace the manual CV section registry with typed section definitions that derive placement and motion metadata from layout config once.
5. Simplify static data hooks so their API matches the fact that the data is local and synchronous.
6. Break oversized style/theme modules into smaller files while preserving existing component behavior.
7. Replace brittle jsdom-computed-style assertions with stable behavioral assertions and opt tests into React Router future flags.

## Execution steps

1. Add the onboarding provider and harden the audio bootstrap path.
2. Rewire Home/Header to the new onboarding state and keep current UX behavior.
3. Refactor GitHub loading helpers and normalize CV section composition.
4. Simplify static data hooks and update affected routes/tests.
5. Split style/theme modules and update touched consumers.
6. Stabilize TabPanel/router tests.
7. Validate with build, tests, and browser checks.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false`
- Browser validation for `/` on mobile and desktop
- Browser validation for `/cv` on mobile and desktop
- Browser smoke checks for `/climbing`, `/photography`, and `/photography/:slug`

## Risks and rollback

- Audio and onboarding state changes can introduce subtle UX regressions. Keep playback consent and hint state separate and preserve the existing user-visible sequence.
- CV section refactors can alter ordering or layout. Keep existing layout config as the source of truth and assert current section order in tests.
- Style module extraction can change spacing or motion unintentionally. Preserve existing `sx` output and verify affected routes in the browser.
- If a slice regresses, revert that slice independently because the work is organized by subsystem.

## Progress notes

- Completed the welcome-audio/onboarding split: onboarding hints now live in `src/WelcomeOnboardingProvider.tsx`, while `src/WelcomeAudioProvider.tsx` focuses on consent, playback, and timeout-aware SoundCloud bootstrap.
- Completed the GitHub/CV/static-data refactors: `src/hooks/useGithubProfile.ts` is now a thin coordinator over `src/hooks/githubProfileData.ts`, CV section composition is derived from typed definitions, and the climbing/photography hooks now match their synchronous local data sources.
- Completed the style/theme extraction: `src/theme/createAppTheme.ts`, `src/styles/appStyleBuilders.ts`, and `src/styles/componentStyleBuilders.ts` now hold the construction logic, leaving the provider/hooks as thin wrappers.
- Stabilized tests: `src/components/TabPanel.test.tsx` now asserts selected-state behavior instead of brittle jsdom style parsing, and route tests use shared React Router future flags from `src/routerFuture.ts`.
- Validation passed:
  - `CI=true npm test -- --watch=false --runTestsByPath src/ThemeProvider.test.tsx src/App.test.tsx src/components/TabPanel.test.tsx src/components/Header.test.tsx src/pages/CV.test.tsx`
  - `CI=true npm test -- --watch=false`
  - `CI=true npm test -- --watch=false --runTestsByPath src/WelcomeAudioProvider.test.tsx`
  - `npm run build`
- Browser validation passed against the local dev server on `http://localhost:3001`:
  - Desktop `/`: decline flow opens the dark-mode hint; grant flow reaches the pause hint and no longer remains stuck in loading state.
  - Mobile `/` and `/cv`: header, section navigation, and hint overlays render correctly at a narrow viewport.
  - Desktop `/cv`, `/photography`, and `/photography/landscape`: route content, album navigation, and asset links render correctly.
  - Desktop `/climbing`: climbing content is present in the DOM and renders after the animated section enters view in-headless.
- Residual debt not addressed in this patch:
  - Create React App still emits the known `babel-preset-react-app` maintenance warning during `npm run build`.
  - Once SoundCloud is initialized, the third-party widget emits console warnings/errors in-browser about encrypted-media permissions and an `IndexSizeError`; the patch ensures the app does not hang on startup, but it does not change the vendor widget behavior.
