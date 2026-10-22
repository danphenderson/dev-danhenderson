# Home welcome and speed-dial second pass

## Goal

Let visitors reach the portfolio without acknowledging a sequence of dialogs. Combine the audio, motion, and settings introduction into one optional panel that automatically hands off to the VS Code entrance. Review the prior speed-dial fix and add meaningful regression protection.

## Why

The current welcome hook serializes an audio dialog, a timed customization modal, and an undismissable settings popover. The last step blocks the IDE indefinitely. The hero spiral also ignores the site's motion scale, including motion off.

## Constraints

- Preserve SPA routes, provider order, audio consent, stored preferences, and static hosting.
- Preserve the unrelated IDE sidebar edit, existing output artifacts, and quality-audit plan.
- Use existing dependencies, theme builders, and motion scale. Audio must remain explicitly opt-in.
- Commit task-owned changes on local `fix/app-speed-dial-slot-props` after validation.

## Affected files and responsibilities

- Home welcome hook, welcome presentation, and `Home.tsx`: one nonmodal panel, timed/manual dismissal, optional audio and motion controls, smooth IDE handoff.
- Header: cue settings while the welcome is visible.
- Hero motion and Home transitions: respect motion off and reduced motion; complete the handoff once.
- GitHub profile adapter and CV contribution chips/cards: preserve unavailable star counts instead of inventing zero, and format verified counts consistently.
- Focused unit/integration tests and Home/CV browser tests: timer cleanup, interaction, consent, navigation, keyboard behavior, links and downloads.
- README and choreography documentation: describe the revised entry flow.
- Playwright configuration: explicitly retain Chromium sandboxing for repository tests.

## Proposed approach

Replace the serial surfaces with a compact panel below the header. It disappears after five seconds, pauses while hovered or keyboard-focused, and also dismisses via its button, close control, Escape, or outside interaction. Navigation stays usable throughout. Audio errors and loading never gate the IDE. Keep the onboarding provider's existing API compatible and store completion through it. Reuse the existing IDE entrance and scale it through the shared motion contract.

## Execution steps

1. Review the current branch and trace the welcome/IDE and speed-dial interaction boundaries.
2. Implement the single welcome panel and repair motion-scale findings.
3. Add regression tests for unattended entry, explicit dismissal, pending/failed audio, persistence, keyboard access, and speed-dial consumers.
4. Run focused Jest, typecheck, lint, production/test builds, and relevant sandboxed Playwright checks.
5. Inspect desktop/mobile and light/dark renderings, update evidence, and commit only task files.

## Validation plan

- `CI=true npm test -- --watchAll=false --runInBand --testPathPatterns='Home|Welcome|HeroMotionPath|AppSpeedDial|Header|appStyle|GithubProfile|GitHubContributions'`
- `npm run typecheck`, `npm run lint`, `npm run build`
- `npm run build:e2e` then relevant Chromium Home, navigation, and CV specs.
- Production smoke checks after restoring the production build.
- Screenshots and live browser checks for the merged panel, unattended handoff, refresh, mobile navigation, motion off and reduced motion.
- Final diff checks and commit-scope verification.

## Risks and rollback

Timers must not remove focused controls, survive unmount, or reopen the welcome after completion. Pending audio cannot delay entry or acquire consent automatically. Motion-off handoff must fire without relying on an animation event. Keep speed-dial real-MUI tests to guard against the slot merge regression. Revert only this task's commit if necessary.

## Progress notes

- Baseline is `13ed1bb`; index clean; unrelated sidebar edit and existing untracked artifacts preserved.
- Confirmed three serial gates and an unscaled 3.6-second hero spiral. Prior speed-dial slot fix remains narrowly scoped; keyboard and browser consumer coverage need strengthening.
- User added CV contribution-star correctness to this pass. Both the adapter and UI coerced missing counts to zero. Preserve optional counts, distinguish unknown from verified zero, and test API success/failure/enrichment limits plus both chip/card renderings.
- Replaced the three serial surfaces with one optional, responsive welcome panel. Kept consent and completion in the existing providers and reusable presentation in the theme style builder. The panel neither traps focus nor blocks header navigation, and pending/failed audio never delays dismissal.
- Fixed the hero's motion-off completion and scaled the entrance and Home window transitions through shared motion tokens. Added strict-mode, timer-cleanup, audio-race, keyboard, persistence, and real-MUI speed-dial coverage.
- Corrected missing/invalid/failed GitHub repository metadata handling. Verified counts, including zero, are retained; unknown counts show `★ —` with an accessible explanation. No fallback star values or API access policies were changed.
- Hardened browser coverage for welcome navigation, consent, motion preferences, focus, reload, CV action links/downloads, and mocked GitHub success/failure. Fixed stale CV biography assertions and the terminal fake-clock helper exposed by the expanded suite.

## Validation evidence

- Focused Jest: 21 suites, 159 tests passed.
- Typecheck passed. Lint passed with eight existing warnings in `test/e2e/home.spec.ts`; no errors. `git diff --check` passed.
- Test-runtime and production builds passed. Vite's existing large-chunk advisory remains.
- The full E2E command passed all 60 Chromium tests, then exposed one stale CV biography assertion in production service-worker smoke. After replacing that assertion with a hydrated About-actions control check, the complete production smoke rerun passed all 12 tests.
- After final motion-token/style refinements, ten home/welcome Chromium checks passed against the final production build.
- Sandboxed Playwright visual inspection covered Evergreen dark desktop (1440px), Atlas light mobile (390px and 320px), the automatic 320px IDE handoff, and CV fallback star chips. Screenshots remain local under `output/playwright/` and are not part of the commit.
- The named review browser was closed. The user's existing dev server and unrelated sidebar, output, and quality-plan work remain untouched.

## Outcome

Implementation and validation are complete. Ready to commit only the task-owned files on `fix/app-speed-dial-slot-props`; no push is requested. The onboarding provider's legacy step API is retained for compatibility, although Home now only needs its completion state.

## Completion Status

- [ ] In progress
- [x] Complete
