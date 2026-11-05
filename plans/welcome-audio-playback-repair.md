# Welcome audio playback repair

## Goal

Keep welcome audio paused on entry and start it only after the visitor selects Play in header settings. Make loading and playback failures visible, retain Pause, and verify the real media source in a sandboxed browser.

## Why

Live triage on 2026-11-04 found that the configured SoundCloud track returns `policy: BLOCK` and a regional-unavailability message. The same failure occurs on the pre-cleanup build. The provider resolves `play()` after sending a command rather than confirming playback, while settings only displays Paused/Now playing. Existing mocks always emit successful playback, hiding this case.

## Constraints

- Preserve all existing dirty Home, CV, and cleanup work. Leave changes unstaged.
- Preserve the client-side SPA, provider placement, header accessibility, and `PUBLIC_URL` handling.
- Do not autoplay or silently substitute a different recording. The user selected the existing local `public/assets/verse.mp3` on 2026-11-04.
- Use the selected local file without changing its bytes. Remove the remote player from the active playback path.
- Do not change CV resume-menu behavior or unrelated content.

## Affected files

- `src/WelcomeAudioProvider.tsx`: playback lifecycle and source integration after selection.
- `src/components/Header.tsx`: await playback and present loading/failure state.
- `src/components/header/HeaderSettingsPopover.tsx`: accessible loading status, error explanation, retry control.
- `src/pages/Home.tsx`: contain horizontal overflow from the IDE entrance animation so it cannot widen the mobile layout viewport and displace header settings.
- Corresponding provider/Header/popover unit tests, `test/e2e/welcome.spec.ts`, and `test/e2e/asset-delivery.smoke.spec.ts`: explicit play/pause, default-paused, retry, failed playback, and real MP3 playback at root/subpath across desktop/mobile browsers.
- README and current architecture documentation: reflect the final source and behavior.

## Approach and steps

1. Add shared settings loading/failure feedback while preserving the existing play/pause controls.
2. Use the user-selected local MP3 via `resolvePublicAssetPath`, native media playback promises/events, an eight-second startup timeout, and no preloading/autoplay.
3. Add meaningful regression tests for delayed/rejected playback and source failure, keeping consent/storage compatibility where applicable.
4. Validate default-paused, Play, Pause, retry, route persistence, keyboard control, and narrow/desktop layout with real media in sandboxed browsers.
5. Update this plan with actual results and remaining limitations.

## Validation

- `npm run typecheck` and `npm run lint`.
- Focused provider/Header/popover tests, then full Jest for provider integration.
- Production build and asset/bundle gates.
- Test-runtime build and focused `welcome.spec.ts` / relevant Home tests.
- Real-media browser verification; do not equate mocked control events with audible media availability.
- `git diff --check` and scope comparison against the pre-repair tree.

## Risks and rollback

- Source choice changes audible content; use only the local MP3 the user selected.
- Playback may reject because of browser policy or missing/invalid assets; show a recoverable error rather than an optimistic playing state.
- Ignore late completion after pause/unmount and avoid starting playback after cancellation.
- Revert only this repair's hunks if needed; preserve earlier unstaged work.

## Progress

- The old development-only welcome reset helper and runtime resolver will lose their production caller when SoundCloud initialization is retired. Flag these for a separate cleanup rather than expanding this playback repair into environment/preferences refactoring.

- Triage complete: live SoundCloud restriction reproduced before and after cleanup; 43 existing focused tests passed but did not cover silent playback failure.
- Found a valid local MP3, approximately 54 seconds, originally committed for intro music. User selected it. Use a hidden native audio element, assign its URL only during explicit Play, await the native playback promise with an 8-second timeout, and preserve looping/pause/resume. Publish a consumed playback-error field for asynchronous media errors; keep request loading feedback in Header.
- Implemented Header loading/error state and accessible settings feedback without changing the provider API or selected source. Typecheck and 35 focused Header/popover tests passed, including pending playback, rejected playback, and retry. Test-runtime build, lint, and 23 Home/welcome browser checks passed for the feedback layer. Source integration now follows.
- Replaced the active SoundCloud widget with the selected native local MP3. Preserved `play`/`pause`/`isPlaying`, added the consumed `error` field, and retained explicit-play consent writes without autoplay. Typecheck and all 48 provider/Header/popover tests pass. Media mocks now dispatch events inside the owning test's `act` scope and unmount before restoring mocks.
- In addition to the unused reset/helper chain, `isAudioConsent` has no callers after replacing SoundCloud consent initialization. Leave this unrelated preference/type cleanup for a separate pass.
- Production browser validation exposed a second interaction bug: the Home IDE's spiral entrance temporarily widens mobile Chromium's layout viewport (for example, 531px inside a 412px visual viewport), moving the fixed header anchor and settings popover offscreen. Pause then becomes unreachable despite successful media playback. This failed 4/5 isolated repeats. Live DOM measurements identify the overflowing hero transform; clipping horizontal overflow on the existing Home wrapper kept the viewport at 412px and Play/Pause usable in 3/3 experiments. Add that page-local containment without changing animation, header anchoring, or shared popover transitions, then rerun Home and mobile coverage.
- Implemented the Home containment. The actual mobile Chromium audio test then passed 5/5 repeated runs. The existing IDE drag/resize/expand/restore and motion-setting tests also pass. Error text uses the normal readable text color and an accessible alert rather than relying on color.

## Final validation and remaining findings

- Static checks: `npm run lint`, `npm run typecheck`, and `git diff --check` pass. Production build and its 305 CV/media asset checks pass; the eager bundle passes its budget (883,574 bytes raw / 274,004 bytes gzip). Vite's existing single-chunk size warning remains.
- Full Jest after the final source changes: **131 suites / 1,011 tests passed**. The provider/Header/popover focused suite has **48 passing tests**.
- Test-runtime Home/welcome validation before the containment fix: **24 passed**. Final production Home/welcome plus the complete root asset spec across desktop Chromium, mobile Chromium, and mobile WebKit: **47 passed / 1 failed**. All 24 Home/welcome checks and all three native-audio cases passed. The failure was a mobile Chromium CV certificate test waiting for a PDF request after a tap, not an audio failure.
- Isolated unchanged CV certificate test: **2/2 passed**. Treat the earlier timeout as intermittent with unresolved cause, not as a fully passing broad gate. Its screenshot/context are in `output/playwright/audio-validation/certificate-timeout/`. CV source and pre-existing test bodies were preserved. Previously documented CV resume-menu failures also remain a separate investigation; both menu controls passed in this root run.
- Manual sandboxed browser checks: desktop Home keyboard Play (Enter), Pause (Space), Escape/focus return; narrow Photography settings in light Ember with motion off; failed MP3 request, readable error, successful retry, and Pause. Native playback advanced with a 53.94-second duration. Screenshots are in `output/playwright/audio-local-*.png`; browser/preview sessions were closed.
- The source MP3 is unchanged byte-for-byte and the production copy matches it. Tracked-file hashes confirm unrelated CV/content/cleanup work was preserved; changes remain unstaged.
- Remaining cleanup candidates: unused `welcomeSequenceEnvironment.ts`, its `runtimeEnvironment.ts` resolver chain, and `isAudioConsent`. Keep their removal separate from this repair. No SoundCloud runtime references remain.
- Real `PUBLIC_URL=/portfolio` deployment: **23 passed / 1 failed**, including native audio playback/pause in all three browser configurations. The sole failure is the already documented mobile WebKit CV menu resume download (tap became unstable/hidden), previously reproduced on the pre-cleanup snapshot. No CV changes were made to mask it. The runner restored the normal production build and removed its temporary deployment.
- Logs and failure artifacts are retained in `output/playwright/audio-validation/`. Full production browser gates remain qualified by the unrelated CV certificate/menu findings above; the requested audio and mobile settings regressions pass.

## Completion status

Follow-up on 2026-11-04: the remaining CV interaction findings and unused helper chain were addressed in [CV actions and audio debt follow-up](cv-actions-and-audio-debt-followup.md). Its complete 149-case browser workflow passes; the earlier failure evidence above is retained as historical context.

- [x] Triage and identify the media availability and feedback gaps.
- [x] Implement loading/failure feedback.
- [x] Confirm source and restore playback.
- [x] Complete validation and document limitations.
