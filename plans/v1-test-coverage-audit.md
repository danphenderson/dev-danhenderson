# V1 Test Coverage Audit

## Status: Planning

## 1. Goal

Produce a prioritized, actionable test coverage plan for the `v1` branch so that the team understands
which behaviors are unprotected, which tests are brittle or shallow, and what must be done before `v1`
can be considered production-ready from a regression-safety standpoint.

This plan does **not** implement tests. It identifies gaps, prioritizes work, and specifies exact
behaviors and edge cases that require coverage.

---

## 2. Why

The `v1` branch introduces significant new surface area — blog route, CV story mode, updated terminal
hero, photography overhaul, appearance dial expansion, and floating CV navigator — on top of a
pre-existing portfolio. Most of this new surface area is untested, and several critical shared
primitives that underpin the entire UI are either untested or only shallowly tested, leaving `v1`
at material regression risk.

---

## 3. Constraints

- Preserve the current SPA architecture and existing test patterns.
- Do not replace working tests unless they are demonstrably brittle or low-value.
- Keep any new tests narrowly scoped to behavior that is actually at risk.
- Follow existing patterns: RTL + `@testing-library/react`, Jest mocks for MUI/motion, `ThemeProvider` wrapper.
- No new test infrastructure or tooling unless unavoidable (e.g., Playwright E2E setup).

---

## 4. Coverage Audit Summary

### 4a. Audit methodology

The audit compared every production file under `src/` against the test files under `test/unit/`.
Coverage is considered **missing** when no dedicated test file exists. Coverage is considered
**shallow** when a test file exists but only performs render-smoke checks without verifying
behavior, interaction, async states, or conditional branches.

### 4b. Overall assessment

The test suite is **uneven**. Several core CV components, key hooks, and much of the terminal hero
subsystem are well-covered with behavioral tests. But an entire category of features — blog
components, photography components, terminal subcomponents, CV story mode, and critical utilities —
has **zero test coverage**. The suite does not cover any E2E flows, and no Playwright setup exists
on this branch.

**Suite baseline (at time of audit):** 81 suites / ~378 tests with 5 failing (pre-existing stale
blog data assertions). Build passes.

---

## 5. Prioritized List of Missing or Weak Test Areas

### Priority 1 — Critical / Release-blocking

These gaps represent untested behavior on primary user-facing routes or shared primitives that
affect the entire app.

| Area                              | Gap                                                                                                                                                                                                                     |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GlobalCommandPalette`            | Zero coverage. Keyboard shortcut registration, open/close state, search filtering, action dispatch, route navigation, and route-change auto-close are all untested. This is a cross-route feature used by every page.   |
| `CVStoryViewer` + `CVStoryNavBar` | Zero coverage on the CV story mode overlay, which is a full-viewport interaction surface with keyboard navigation (ArrowLeft/ArrowRight/Escape), direction-aware animation, and progress tracking.                      |
| `TerminalHeroContent`             | Zero coverage. The Home page hero orchestrator owns interactive state (explorer visibility, command palette, active tab, toast) and drives the typewriter animation. Page-level tests mock it away.                     |
| `ImmersiveLightbox`               | Zero coverage. Keyboard navigation (ArrowLeft/ArrowRight/Escape), photo index cycling, open/close state, and download link generation are all untested. Used on every photography category page.                        |
| `RouteRecoveryPanel`              | Zero coverage. The NotFound page mounts this component; its command palette integration, contextual suggestions, and recovery actions are untested.                                                                     |
| `commandPaletteSearch.ts`         | Zero coverage. `matchesCommandPaletteAction` is the core search predicate for the command palette, a cross-route feature. Normalization, empty-query behavior, multi-field matching, and case-insensitivity need tests. |
| `recoveryContext.ts`              | Zero coverage. `buildRecoveryContext` drives the NotFound page's route hints and suggestion ranking. Path normalization, scoring, and edge-case inputs (empty path, malformed URL segments) are untested.               |

### Priority 2 — High / Significant regression risk

| Area                        | Gap                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| All blog components         | Zero coverage across 12 components: `BlogTagFilter`, `BlogPostCard`, `BlogPostList`, `BlogHero`, `BlogArticleHeader`, `BlogArticleBody`, `BlogArticleNav`, `BlogMetaChips`, `BlogCodeBlock`, `BlogCallout`, `BlogBlockquote`, `BlogRelatedPosts`. Blog is a new `v1` feature; every interaction path is uncovered. |
| `CVStorySlideRenderer`      | Zero coverage. Renders each `CVStoryItem` kind — about, experience, education, certificate, volunteering, coding, end — with no tests for unknown kind fallback.                                                                                                                                                   |
| `CVStoryProgress`           | Zero coverage. Progress bar calculates filled segments from current index and total count. No tests for boundary values (first, last, single item).                                                                                                                                                                |
| `ClimbingAnalytics`         | Zero coverage. The main analytics visualization for the Climbing page is entirely untested.                                                                                                                                                                                                                        |
| Photography components      | Zero coverage: `AlbumCard`, `AlbumLocationSummary`, `AlbumShareButton`, `TiltCard`. AlbumShareButton exercises the Web Share API and clipboard fallback.                                                                                                                                                           |
| `CommandPaletteProvider`    | Zero unit coverage. State transitions (open, close, setQuery, openWithQuery) and hook contract are untested, though indirectly exercised through App.test.tsx.                                                                                                                                                     |
| `WelcomeOnboardingProvider` | Zero dedicated coverage. Hint lifecycle (open, dismiss, reset) is only exercised indirectly through Home.test.tsx.                                                                                                                                                                                                 |
| `dom.ts`                    | Zero coverage on `getMaxScrollLeft` and `isElementInViewport`. Both are used by scroll-sensitive components.                                                                                                                                                                                                       |

### Priority 3 — Medium / Technical debt and branch coverage

| Area                                                                              | Gap                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Terminal subcomponents (10 files)                                                 | Zero coverage: `VscodeActivityBar`, `VscodeCommandPalette`, `VscodeEditorPane`, `VscodeExplorerSidebar`, `VscodeIntelliSenseTooltip`, `VscodeNotificationToast`, `VscodeStatusBar`, `VscodeTabBar`, `VscodeTerminalPanel`, `VscodeTitleBar`. These are pure presentational, but some have conditional rendering logic. |
| CV story components                                                               | Zero coverage: `CVStoryChapterHeading`, `CVStoryHeader`, `CVCertificatesSection`, `CVCodingSection`, `CVEducationSection`, `CVVolunteeringSection`, `CVSectionStack`.                                                                                                                                                  |
| `cvStoryItems.ts`                                                                 | `parseCVSortDate` has zero test coverage despite complex branching (season prefixes, ordinal suffixes, range strings, "Present"/"Current"). `buildCVStoryItems` sort order is also untested.                                                                                                                           |
| `useWebVitals`                                                                    | Zero coverage. The `supportsWebVitals` environment guard, dynamic `web-vitals` import, and metric accumulation are untested.                                                                                                                                                                                           |
| `githubProfileData.ts`                                                            | Zero direct coverage. The cache module, cache invalidation, and `resetGitHubProfileDataCacheForTests` export are only exercised via `useGithubProfile` tests.                                                                                                                                                          |
| `buildInfo.ts`                                                                    | Zero coverage. Build-time constants are trivial but provide a useful smoke test for the build pipeline.                                                                                                                                                                                                                |
| `easing.ts`                                                                       | Zero coverage for easing utility functions.                                                                                                                                                                                                                                                                            |
| `siteRoutes.ts`                                                                   | Zero coverage. Route map structure, `primaryNavigationRoutes` filter, and `cvStoryModeMetadata` are untested.                                                                                                                                                                                                          |
| Motion system (`tokens.ts`, `variants.ts`, `components.tsx`)                      | Zero coverage. Token values, variant object shapes, and the `MotionCard`/`MotionSection`/`StaggerChildren` component props are untested.                                                                                                                                                                               |
| Styles (`animations.ts`, `appStyles.ts`, `componentStyles.ts`, `springEasing.ts`) | Zero dedicated coverage beyond the builder tests.                                                                                                                                                                                                                                                                      |
| `HeaderNav`                                                                       | Existing test covers render and link presence but misses the active-route highlight and `showInPrimaryNav` filter behavior.                                                                                                                                                                                            |
| `ScrollProgressBar`                                                               | Existing test only checks rendered CSS properties. Motion binding and `scrollYProgress` wiring are not verified.                                                                                                                                                                                                       |
| `CVSectionNavigator`                                                              | Missing test: idle-hide/reappear behavior when mouse leaves and re-enters the floating dial (covered in plan spec but not in suite).                                                                                                                                                                                   |

### Priority 4 — Low / Smoke and schema validation

| Area                                                             | Gap                                                                                                                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data modules (`blog.ts`, `climbs.ts`, `cv.ts`, `photography.ts`) | Zero schema validation tests. Required fields, type guards, and referential integrity (e.g., slug uniqueness, photography album references) are untested. |
| `serviceWorkerRegistration.ts`                                   | Zero coverage. PWA registration is a separate concern from UI, but the `register`/`unregister` paths have no integration test.                            |
| `constants/animation.ts`                                         | Zero coverage. Token values are trivially testable and protect against silent regressions.                                                                |

---

## 6. Specific Files That Need Tests

The table below maps each untested or under-tested file to the specific test file that should be
created or extended. Files are listed in priority order.

### New test files (none exist)

| Source file                                           | Proposed test file                                               | Priority |
| ----------------------------------------------------- | ---------------------------------------------------------------- | -------- |
| `src/components/GlobalCommandPalette.tsx`             | `test/unit/components/GlobalCommandPalette.test.tsx`             | P1       |
| `src/components/cv/CVStoryViewer.tsx`                 | `test/unit/components/cv/CVStoryViewer.test.tsx`                 | P1       |
| `src/components/cv/CVStoryNavBar.tsx`                 | `test/unit/components/cv/CVStoryNavBar.test.tsx`                 | P1       |
| `src/components/TerminalHeroContent.tsx`              | `test/unit/components/TerminalHeroContent.test.tsx`              | P1       |
| `src/components/photography/ImmersiveLightbox.tsx`    | `test/unit/components/photography/ImmersiveLightbox.test.tsx`    | P1       |
| `src/components/RouteRecoveryPanel.tsx`               | `test/unit/components/RouteRecoveryPanel.test.tsx`               | P1       |
| `src/utils/commandPaletteSearch.ts`                   | `test/unit/utils/commandPaletteSearch.test.ts`                   | P1       |
| `src/constants/recoveryContext.ts`                    | `test/unit/constants/recoveryContext.test.ts`                    | P1       |
| `src/components/blog/BlogTagFilter.tsx`               | `test/unit/components/blog/BlogTagFilter.test.tsx`               | P2       |
| `src/components/blog/BlogPostCard.tsx`                | `test/unit/components/blog/BlogPostCard.test.tsx`                | P2       |
| `src/components/blog/BlogPostList.tsx`                | `test/unit/components/blog/BlogPostList.test.tsx`                | P2       |
| `src/components/blog/BlogHero.tsx`                    | `test/unit/components/blog/BlogHero.test.tsx`                    | P2       |
| `src/components/blog/BlogArticleHeader.tsx`           | `test/unit/components/blog/BlogArticleHeader.test.tsx`           | P2       |
| `src/components/blog/BlogArticleBody.tsx`             | `test/unit/components/blog/BlogArticleBody.test.tsx`             | P2       |
| `src/components/blog/BlogArticleNav.tsx`              | `test/unit/components/blog/BlogArticleNav.test.tsx`              | P2       |
| `src/components/blog/BlogMetaChips.tsx`               | `test/unit/components/blog/BlogMetaChips.test.tsx`               | P2       |
| `src/components/blog/BlogCodeBlock.tsx`               | `test/unit/components/blog/BlogCodeBlock.test.tsx`               | P2       |
| `src/components/blog/BlogCallout.tsx`                 | `test/unit/components/blog/BlogCallout.test.tsx`                 | P2       |
| `src/components/blog/BlogBlockquote.tsx`              | `test/unit/components/blog/BlogBlockquote.test.tsx`              | P2       |
| `src/components/blog/BlogRelatedPosts.tsx`            | `test/unit/components/blog/BlogRelatedPosts.test.tsx`            | P2       |
| `src/components/cv/CVStorySlideRenderer.tsx`          | `test/unit/components/cv/CVStorySlideRenderer.test.tsx`          | P2       |
| `src/components/cv/CVStoryProgress.tsx`               | `test/unit/components/cv/CVStoryProgress.test.tsx`               | P2       |
| `src/components/climbing/ClimbingAnalytics.tsx`       | `test/unit/components/climbing/ClimbingAnalytics.test.tsx`       | P2       |
| `src/components/photography/AlbumCard.tsx`            | `test/unit/components/photography/AlbumCard.test.tsx`            | P2       |
| `src/components/photography/AlbumLocationSummary.tsx` | `test/unit/components/photography/AlbumLocationSummary.test.tsx` | P2       |
| `src/components/photography/AlbumShareButton.tsx`     | `test/unit/components/photography/AlbumShareButton.test.tsx`     | P2       |
| `src/components/photography/TiltCard.tsx`             | `test/unit/components/photography/TiltCard.test.tsx`             | P2       |
| `src/CommandPaletteProvider.tsx`                      | `test/unit/CommandPaletteProvider.test.tsx`                      | P2       |
| `src/WelcomeOnboardingProvider.tsx`                   | `test/unit/WelcomeOnboardingProvider.test.tsx`                   | P2       |
| `src/utils/dom.ts`                                    | `test/unit/utils/dom.test.ts`                                    | P2       |
| `src/data/cvStoryItems.ts`                            | `test/unit/data/cvStoryItems.test.ts`                            | P3       |
| `src/hooks/useWebVitals.ts`                           | `test/unit/hooks/useWebVitals.test.ts`                           | P3       |
| `src/constants/siteRoutes.ts`                         | `test/unit/constants/siteRoutes.test.ts`                         | P3       |
| `src/utils/easing.ts`                                 | `test/unit/utils/easing.test.ts`                                 | P3       |
| `src/utils/buildInfo.ts`                              | `test/unit/utils/buildInfo.test.ts`                              | P4       |
| `src/constants/animation.ts`                          | `test/unit/constants/animation.test.ts`                          | P4       |
| `src/data/blog.ts`                                    | `test/unit/data/blog.test.ts`                                    | P4       |
| `src/data/cv.ts`                                      | `test/unit/data/cv.test.ts`                                      | P4       |
| `src/data/photography.ts`                             | `test/unit/data/photography.test.ts`                             | P4       |
| `src/data/climbs.ts`                                  | `test/unit/data/climbs.test.ts`                                  | P4       |

### Existing test files that need extension

| Test file                                             | What to add                                                                                                                                                                                                                                                                                                                            | Priority |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| `test/unit/components/Header.test.tsx`                | Mobile layout: header must remain fixed/sticky at the top of the page even when content overflows (regression: on mobile viewports the header was found to extend into the main page content rather than remaining pinned). Add a viewport/media-query test that verifies the header's sticky positioning and height on small screens. | P1       |
| `test/unit/components/cv/CVSectionNavigator.test.tsx` | Add: idle-hide/reappear on mouse-leave/enter, hover/focus persistence keeping dial open, keyboard navigation from the dial.                                                                                                                                                                                                            | P2       |
| `test/unit/pages/CV.test.tsx`                         | Add: CV story mode entry and exit — story mode toggle renders CVStoryViewer, Escape key dismisses it, URL-driven story mode parameter is honored.                                                                                                                                                                                      | P2       |
| `test/unit/pages/Home.test.tsx`                       | Replace hardcoded terminal `data-lines` value with a snapshot or structure assertion. The current assertion will break silently whenever terminal content changes.                                                                                                                                                                     | P2       |
| `test/unit/pages/NotFound.test.tsx`                   | Verify `RouteRecoveryPanel` props are wired correctly: contextual suggestions match path segments, command palette query matches the route hint.                                                                                                                                                                                       | P2       |
| `test/unit/components/ScrollProgressBar.test.tsx`     | Add motion binding test: verify `scrollYProgress` is connected to `scaleX`. Current test only checks rendered CSS properties.                                                                                                                                                                                                          | P3       |
| `test/unit/components/header/HeaderNav.test.tsx`      | Add active route highlight test: current route link should receive active aria state or active style.                                                                                                                                                                                                                                  | P3       |

---

## 7. Exact Behaviors and Edge Cases to Test

### GlobalCommandPalette (P1)

- `Cmd/Ctrl+K` opens the palette
- Typing in the search field filters the action list
- Empty query shows all actions
- Selecting an action closes the palette and navigates/executes
- `Escape` closes the palette
- Palette auto-closes when the route changes
- Pressing the shortcut inside an input element does not open the palette (`isEditableTarget` guard)
- `scrollToHashTarget` scrolls to the element if it exists; returns false if not found

### CVStoryViewer (P1)

- Renders the current item by index via `CVStorySlideRenderer`
- `ArrowRight`/swipe-forward advances to the next item
- `ArrowLeft`/swipe-back retreats to the previous item
- `Escape` calls `onExit`
- Direction state correctly drives enter/exit animation direction
- Boundary: at first item, left action is disabled or no-ops
- Boundary: at last item, right action is disabled or no-ops
- `goTo` from `CVStoryNavBar` jumps correctly

### CVStoryNavBar (P1)

- Renders one button per `CVStoryItem` kind present in the list
- Clicking a kind button calls `onGoTo` with the correct index
- Active item kind is highlighted
- `end` kind button is always rendered last and calls `onExit`

### ImmersiveLightbox (P1)

- Renders the photo at `initialIndex` when opened
- Next/prev buttons cycle through photos (wraps at boundaries)
- `ArrowRight`/`ArrowLeft` keyboard shortcuts advance/retreat
- `Escape` calls `onClose`
- `initialIndex` prop change while open resets to new index
- Download anchor has the correct filename from `getDownloadFilename`
- `getDownloadFilename` strips query strings and hash fragments

### commandPaletteSearch.ts (P1)

- `normalizeCommandPaletteSearchValue` trims and lowercases
- `matchesCommandPaletteAction` returns true for empty query
- Matches on `label`, `description`, and any element of `keywords`
- Case-insensitive match
- Non-matching query returns false

### recoveryContext.ts (P1)

- `buildRecoveryContext` parses an unmatched path and finds the closest route hint from `siteRouteMap`
- Scores candidate suggestions by keyword overlap
- `safeDecode` handles malformed URI components without throwing
- `normalizeValue` strips slashes and lowercases

### Blog components (P2)

- `BlogTagFilter`: renders tag chips, toggles active state, calls `onTagChange` with null on "All" click, calls with tag name otherwise; returns null when tags array is empty
- `BlogPostCard`: renders title, excerpt, tags as chips; hero image shown when present; link navigates to `/blog/:slug`; `onTagClick` called when a chip is clicked
- `BlogPostList`: renders all posts as cards; returns null when empty; correct grid count
- `BlogHero`: renders featured post title, excerpt, and image; link navigates correctly
- `BlogArticleHeader`: renders title, subtitle, author, publishedAt, readingTime
- `BlogArticleBody`: renders each content block type — `paragraph`, `heading`, `list`, `code`, `blockquote`, `callout`, `image`, `divider`
- `BlogArticleNav`: renders prev/next links; omits missing directions
- `BlogMetaChips`: renders tag chips; calls `onTagClick`; renders reading time and date
- `BlogCodeBlock`: renders highlighted code; copy button copies to clipboard; language badge visible
- `BlogCallout`: renders icon by variant (info, warning, tip, important); renders body text

### CVStorySlideRenderer (P2)

- Renders `about` kind with bio content
- Renders `experience` kind with title, company, date
- Renders `education` kind with degree and institution
- Renders `certificate` kind with name and issuer
- Renders `volunteering` kind with role and org
- Renders `coding` kind with project name and tech
- Renders `end` kind without crashing
- Handles unknown kind without throwing

### AlbumShareButton (P2)

- Calls `navigator.share` when Web Share API is available
- Falls back to `navigator.clipboard.writeText` when share is unavailable
- Shows success state after copy
- Shows error state when share/copy fails

### CommandPaletteProvider (P2)

- `openPalette()` sets `isOpen: true` and `query: ''`
- `openPalette('photo')` sets query to `'photo'`
- `closePalette()` sets `isOpen: false` and resets query
- `setQuery` updates the query without closing
- Hook throws outside provider

### WelcomeOnboardingProvider (P2)

- `openPauseHint` / `dismissPauseHint` toggle `showPauseHint`
- `openDarkModeHint` / `dismissDarkModeHint` toggle `showDarkModeHint`
- `resetHints` sets both to false
- Hook throws outside provider

### cvStoryItems.ts (P3)

- `parseCVSortDate`: "May 2025", "Fall 2024 – Present", "February 5th, 2024", "Present", "Current",
  "Various Periods Starting 2012", empty string, malformed string
- `buildCVStoryItems`: about item is always first; coding item is always last; time-bounded items are
  sorted chronologically oldest→newest; `end` item is appended last

### useWebVitals (P3)

- Returns `{ metrics: empty Map, collected: false }` in environments without PerformanceObserver
- Calls each `web-vitals` reporter on mount
- Accumulates metrics in the Map; `collected` becomes true after the first metric

---

## 8. Duplicate, Brittle, or Low-Value Tests to Improve

| Test                                                   | Issue                                                                                                                                                        | Recommended fix                                                                                                                                         |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Home.test.tsx` — terminal `data-lines` assertion      | Hardcodes the full terminal line string verbatim. Breaks silently when any line changes.                                                                     | Replace with structural assertion: verify the number of lines, or spot-check a single stable command rather than the entire serialized string.          |
| `Blog.test.tsx` — tag count assertions                 | Stale tag counts cause pre-existing failures every time blog content is updated.                                                                             | Drive tag counts from the mocked data inside the test, not from live data, or remove the exact-count assertion in favor of "at least one tag rendered". |
| `CVSectionCard.test.tsx` — single forwarding assertion | Only verifies that `data-delay-ms` and `data-trigger-on-view` are forwarded. No test for the rendered `id` anchor or the section's role in scroll targeting. | Expand to include the `id` attribute presence and at least one `aria-*` role check.                                                                     |
| `ScrollProgressBar.test.tsx` — CSS-only assertion      | Tests `position: fixed` and `top: 0px` but not the Framer Motion binding.                                                                                    | Add a test that verifies the `scaleX` style binding is connected to a `MotionValue`.                                                                    |
| `BackToTopButton.test.tsx` — only two cases            | Covers threshold-gated visibility and smooth scroll. Misses `instant` scroll option and `aria-label` accessibility assertion.                                | Add test for the `instant` prop producing `behavior: 'instant'` scroll.                                                                                 |
| `GitHubContributionCalendar.test.tsx` (350 lines)      | Very large. Possibly over-specified on internal MUI grid cell structure, making it brittle to MUI version bumps.                                             | Audit for assertions tied to internal MUI class names. Rewrite such assertions as aria/role-based.                                                      |

---

## 9. Final Assessment: Is `src/` Adequately Covered for V1 Release?

**No. `v1` is not adequately covered for production release in its current state.**

### What is well-covered

- Core CV content sections: `CVAboutSection`, `CVExperienceSection`, `CVGitHubSection`,
  `CertificatesList`, `EducationSection`, `ExperienceList`, `VolunteeringList`, `CodingExamplesSection`
- CV floating section navigator (`CVSectionNavigator`) with scroll threshold, section jump, and back-to-top
- GitHub data layer: `useGithubProfile` with live fetch, fallback, cache, and error states
- Animation primitives: `AnimatedContentCard`, `AnimatedContentList`, `AnimatedSlideList`, `AnimatedZoomList`
- Text typewriter system: `useTerminalTypewriter`, `useTypewriterLoop`, `useTypewriterProgress`
- Home page welcome flow with audio consent, hint sequencing, and hero reveal
- Style builders: `appStyleBuilders`, `componentStyleBuilders`
- Core utilities: `assets`, `date`, `sx`
- Route-level pages: `CV`, `Blog`, `BlogPost`, `Home`, `Photography`, `PhotographyCategory`,
  `Climbing`, `NotFound` — all have structural tests

### What is not covered and poses release risk

1. **The blog feature** shipped with zero component-level tests. Twelve blog components are entirely
   uncovered, including the article body renderer, code block copy behavior, and tag filter interactions.
2. **CV story mode** — a major `v1` feature — has zero tests for any of its interactive states,
   keyboard shortcuts, navigation, or animation direction logic.
3. **GlobalCommandPalette** is a cross-route shared primitive with no unit coverage. A regression
   here silently breaks navigation across all routes.
4. **ImmersiveLightbox** handles keyboard navigation and async download behavior with no tests.
5. **`commandPaletteSearch.ts`** and **`recoveryContext.ts`** — both utilities used in user-facing
   interactive flows — have no coverage.
6. **TerminalHeroContent** is the Home page's primary feature and is mocked away entirely in
   page-level tests, with no component-level coverage of its interactive state.

### Minimum viable coverage for release

At minimum, the following must be addressed before `v1` is release-ready:

1. Tests for all P1 items: `GlobalCommandPalette`, `CVStoryViewer`, `CVStoryNavBar`,
   `commandPaletteSearch.ts`, `recoveryContext.ts`, `ImmersiveLightbox`, `RouteRecoveryPanel`
2. Tests for the 12 blog components (P2), covering at minimum: render, interaction, and null/empty states
3. Fix the two pre-existing test failures in `Blog.test.tsx` and `useBlogData.test.ts` (stale data assertions)
4. Add the `Header` mobile layout test to protect against the regression where the header extended into the main page content on mobile viewports (observed and fixed in an earlier PR on this branch).

The P3 and P4 items (terminal subcomponents, data module schema, motion tokens, utility smoke tests)
can follow in a subsequent hardening pass.

---

## 10. Affected Files and Responsibilities

This is a planning document. No source files are modified.

Files that would be created or modified by implementing this plan:

- All test files listed in Section 6
- Existing test files listed in Section 6 (extensions)

---

## 11. Approach (for implementation phase)

1. Fix pre-existing failures in `Blog.test.tsx` and `useBlogData.test.ts` first so the baseline is green.
2. Implement P1 tests (7 new files) and the `Header` mobile layout extension.
3. Implement P2 blog component tests (10 new files), then remaining P2 items.
4. Implement P3 behavioral coverage (cvStoryItems, useWebVitals, dom.ts, etc.).
5. Add P4 schema smoke tests last.
6. Set up Playwright E2E (currently absent) for route flows after unit coverage is stable.

---

## 12. Validation Plan (for implementation phase)

- `npm test -- --watch=false --runInBand` (green baseline before and after each phase)
- `npm run build` (confirm no regressions introduced by test setup changes)
- `npx playwright test` after Playwright setup when that phase is reached

---

## 13. Risks and Rollback

- Some untested components (especially terminal subcomponents) use complex Emotion + MUI + Framer Motion
  composition. Tests that assert too deeply on internal structure will be brittle. Prefer role/aria
  assertions and behavioral prop-level testing over internal DOM structure.
- `GlobalCommandPalette` tests require careful mocking of `useNavigate` and `useLocation` to avoid
  test pollution.
- Rolling back: this plan does not modify source files, so rollback is limited to not merging the
  test implementation branches.

---

## Progress Notes

- 2026-03-17: Initial audit completed. Plan created from full `src/` scan.
  - 81 test suites found; 5 pre-existing failures (stale blog data assertions).
  - Build passes.
  - E2E directory is absent from the branch.
- 2026-03-17: Step 1 started by fixing the stale blog assertions called out in the proposed approach.
  - Updated `test/unit/pages/Blog.test.tsx` and `test/unit/hooks/useBlogData.test.ts` to resolve the stale blog assertions called out in step 1.
  - `CI=true npm test -- --watch=false --runInBand test/unit/pages/Blog.test.tsx test/unit/hooks/useBlogData.test.ts` passes.
  - Full-suite validation still reports unrelated failures in `test/unit/styles/appStyleBuilders.test.ts`, `test/unit/constants/commandPaletteActions.test.ts`, and `test/unit/pages/CV.test.tsx`; the blog-related pre-existing failures are resolved.
