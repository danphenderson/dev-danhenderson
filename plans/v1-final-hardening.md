# ExecPlan: v1 Final Hardening — E2E and Smoke Test Readiness

**Status**: Ready for execution

---

## 1. Goal

Produce the minimum high-confidence test suite and CI configuration that makes the `v1` branch safe to merge to production. Every change in this plan either fixes a known regression, closes a coverage gap on a critical user journey, or eliminates a flake vector. Nothing speculative.

---

## 2. Why

The `v1` branch is a 400+ file, 282-commit rewrite touching every route, the full motion system, the theme/appearance pipeline, the home hero, a new blog feature, CV story mode, and the entire test layer. Current state:

- **36 E2E tests: all pass** (as of 2026-03-18, local chromium, `build:e2e` variant)
- **810 unit tests: 10 failures across 4 suites** — all stale test assertions, not component bugs
- **CI runs E2E but does not gate merge** — failures are advisory only
- **No cross-route navigation E2E** — every spec tests its own route in isolation
- **No production-build smoke** — E2E uses `build:e2e` (blog enabled); production build (blog disabled) is never exercised by Playwright
- **Screenshot baseline is platform-divergent** — one macOS snapshot exists; CI runs Linux
- **No mobile viewport E2E** — only one responsive overflow check on photography

These gaps would let regressions in navigation, production feature-gating, and mobile layout ship undetected.

---

## 3. Constraints

- App remains fully client-side; no backend
- SPA direct-link routing and `PUBLIC_URL` asset paths must work post-merge
- Blog routes **must not** render in the production build
- Existing E2E helper patterns (`waitForAnimatedSectionReadiness`, GitHub mocks) are the vocabulary — no new abstractions
- Changes scoped to test files, CI config, and the 4 failing unit test files — no production source changes
- Playwright single-project (chromium) — do not add Firefox/Safari without explicit request

---

## 4. Affected files and responsibilities

| File                                                        | Role                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `test/e2e/smoke.spec.ts`                                    | **New.** Minimum-viable production smoke suite                            |
| `test/e2e/navigation.spec.ts`                               | **New.** Cross-route header navigation coverage                           |
| `test/e2e/helpers/routeReadiness.ts`                        | Existing animation readiness helper — no changes, reused                  |
| `test/e2e/helpers/github.ts`                                | Existing GitHub mocking helper — no changes, reused                       |
| `test/unit/components/blog/BlogPostCard.test.tsx`           | Fix: add missing `MotionTiltCard` mock                                    |
| `test/unit/components/blog/BlogPostList.test.tsx`           | Fix: add missing `MotionTiltCard` mock                                    |
| `test/unit/components/header/HeaderAppearanceDial.test.tsx` | Fix: update assertion for `(active)` suffix on selected appearance        |
| `test/unit/pages/CV.test.tsx`                               | Fix: move `cv-github-status-tooltip-trigger` assertions to GitHub section |
| `playwright.config.ts`                                      | Minor: add production-build project for smoke suite                       |
| `.github/workflows/build.yml`                               | Harden: add production-build smoke step, enforce E2E as required check    |

---

## 5. Current health baseline

### E2E (Playwright) — 36/36 pass

| Spec                  | Tests | Status |
| --------------------- | ----- | ------ |
| `home.spec.ts`        | 10    | Pass   |
| `blog.spec.ts`        | 9     | Pass   |
| `cv.github.spec.ts`   | 6     | Pass   |
| `climbing.spec.ts`    | 5     | Pass   |
| `photography.spec.ts` | 5     | Pass   |
| `not-found.spec.ts`   | 2     | Pass   |

### Unit (Jest) — 800/810 pass, 10 failures in 4 suites

| Suite                           | Failures | Root cause                                                                      |
| ------------------------------- | -------- | ------------------------------------------------------------------------------- |
| `BlogPostCard.test.tsx`         | 5        | Missing `MotionTiltCard` in motion mock                                         |
| `BlogPostList.test.tsx`         | 2        | Cascading from BlogPostCard's missing mock                                      |
| `HeaderAppearanceDial.test.tsx` | 1        | Test expects label without `(active)` suffix                                    |
| `CV.test.tsx`                   | 2        | Test looks for tooltip in wrong container (`cv-story-header` vs GitHub section) |

All 10 are **stale assertions** — the components are correct, the tests are behind.

---

## 6. Priority E2E scenarios (what to add)

### P0 — Production smoke suite (`smoke.spec.ts`)

**Rationale**: The production build (`npm run build`) disables blog routes. No existing E2E validates this. A single missed feature flag would expose `/blog` in production.

| Test                               | Assertion                                                  |
| ---------------------------------- | ---------------------------------------------------------- |
| `/ loads and renders hero content` | Home hero text visible, no console errors                  |
| `/cv loads core sections`          | Profile, Experience, Education headings present            |
| `/climbing loads route tables`     | Climbing analytics overview visible                        |
| `/photography loads album cards`   | ≥ 4 album cards rendered                                   |
| `/blog is not routable`            | Navigating to `/blog` lands on 404 recovery panel          |
| `/blog/:slug is not routable`      | Navigating to `/blog/any-slug` lands on 404 recovery panel |
| `Header does not show Blog link`   | Blog nav item absent from header                           |
| `* catches unknown routes`         | `/unknown` renders recovery panel                          |
| `Direct links resolve via SPA`     | `/cv` direct navigation renders correctly (not 404)        |

**Execution**: Runs against `npm run build` (production variant, not `build:e2e`). Requires a second Playwright project or a separate config/script that serves the production build.

### P1 — Cross-route navigation (`navigation.spec.ts`)

**Rationale**: Every current spec navigates directly to its own route. No test clicks a header link from one route to another. A broken `<Link>` or `PageTransition` would be invisible.

| Test                                    | Assertion                                                        |
| --------------------------------------- | ---------------------------------------------------------------- |
| `Home → CV via header`                  | Click CV link, verify `/cv` URL, core section visible            |
| `CV → Climbing via header`              | Click Climbing link, verify `/climbing` URL, content visible     |
| `Climbing → Photography via header`     | Click Photography link, verify `/photography` URL, cards visible |
| `Photography → Home via logo/home link` | Navigate back, verify `/` URL, hero visible                      |
| `Back button returns to previous route` | Navigate CV → Climbing, browser back, verify `/cv`               |

**Execution**: Runs against `build:e2e` variant (alongside existing specs).

### P2 — Fix 10 baseline unit test failures

These are not regressions — they're tests that fell behind component changes. But they add noise that masks real failures in CI. Fixing them restores the unit suite to green.

---

## 7. Anti-flake recommendations

### Existing flake vectors (observed in specs)

| Vector                       | Location                                       | Risk                                            | Mitigation                                                                            |
| ---------------------------- | ---------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------- |
| `waitForTimeout(500)`        | `home.spec.ts` `moveMouseAwayFromHero`         | Timing-dependent; may fail on slow CI           | Replace with `waitForAnimatedSectionReadiness` or `expect.poll` on a stable condition |
| 20s terminal animation waits | `home.spec.ts` lines 92-93, 127, 131, 146, 172 | Slow but not flaky (typewriter must finish)     | Acceptable — these are real content waits, not arbitrary delays                       |
| Screenshot cross-platform    | `home.spec.ts` line 152                        | macOS snapshot vs Linux CI = pixel drift        | Current `maxDiffPixelRatio: 0.05` mitigates this; monitor for CI-specific failures    |
| `page.clock` for screenshots | `home.spec.ts`                                 | Clock frozen at specific timestamp              | Stable pattern; no change needed                                                      |
| RAF-based motion measurement | `routeReadiness.ts`                            | Under extreme CI load, 2-frame window may batch | Current 10s poll timeout is sufficient; monitor                                       |

### Recommendations for new specs

1. **Never use `waitForTimeout`**. Always poll for a visible DOM condition.
2. **Use `waitForAnimatedSectionReadiness`** for any scroll-animated content before asserting.
3. **Use `toBeVisible()` over `toBeInTheDocument()`** when checking rendered content — catches `display: none` regressions.
4. **Use route URL assertions** (`expect(page).toHaveURL(...)`) after navigation, not just content checks.
5. **Do not assert on animation intermediate states** — only assert on final stable state.

---

## 8. CI execution strategy

### Current CI (`build.yml`)

```
build job:    npm run build → upload artifact
e2e job:      npm run build:e2e → playwright install → playwright test → upload on failure
```

### Proposed changes

```
build job:    npm run build → upload artifact (unchanged)
e2e job:      npm run build:e2e → playwright test (feature-gated specs) → upload on failure
smoke job:    needs: build → download build artifact → playwright test --project=smoke → upload on failure
```

**Key changes**:

1. **Add `smoke` job** that downloads the production build artifact from the `build` job and runs only `smoke.spec.ts` against it. This validates the _actual_ production output — blog routes blocked, all non-gated routes functional.

2. **Make E2E + smoke required status checks** on the PR. Move from advisory to blocking. This is the single highest-leverage CI change.

3. **Keep `workers: 1` in CI**. The suite is 36+ tests finishing in ~45s. Sequential execution eliminates port contention and resource flakes. Not worth parallelizing until the suite exceeds 2 minutes.

4. **Keep `retries: 2` in CI**. The animation-heavy nature of the site makes 2 retries appropriate. Monitor retry rate — if > 5% of runs retry, investigate the specific spec.

### Proposed `smoke` job (for `build.yml`)

```yaml
smoke:
  needs: build
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: ./.github/actions/setup
    - uses: actions/download-artifact@v4
      with:
        name: build
        path: build
    - name: Install Playwright
      run: npx playwright install --with-deps chromium
    - name: Production smoke tests
      run: npx playwright test test/e2e/smoke.spec.ts
    - uses: actions/upload-artifact@v4
      if: failure()
      with:
        name: smoke-results
        path: |
          e2e-results/
          playwright-report/
        retention-days: 14
        if-no-files-found: ignore
```

---

## 9. Ship / no-ship criteria

### Ship (all must be true)

- [ ] `npm run build` succeeds (production variant)
- [ ] `npm run build:e2e` succeeds (test variant)
- [ ] All 36 existing E2E tests pass on `build:e2e`
- [ ] All production smoke tests pass on `build` output (blog routes blocked, all other routes functional)
- [ ] Cross-route navigation tests pass (header links work between all primary routes)
- [ ] Unit test suite is green (0 failures) — the 10 baseline failures are fixed
- [ ] No `test.only` or `test.skip` in committed specs
- [ ] CI enforces E2E + smoke as required checks (not advisory)

### No-ship (any one blocks merge)

- Blog routes are accessible in the production build
- Any primary route (`/`, `/cv`, `/climbing`, `/photography`) returns a blank page or 404 on direct navigation
- Header navigation between primary routes is broken
- GitHub-backed CV sections crash instead of showing fallback content
- Unit test suite has failures beyond the known 10 (indicates a new regression)
- E2E suite requires `test.skip` to pass (indicates unresolved flake)
- `npm run build` fails

---

## 10. Execution steps

### Step 1: Fix 10 baseline unit test failures

**Files**: 4 test files (no source changes)

| File                                                        | Fix                                                                      |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ |
| `test/unit/components/blog/BlogPostCard.test.tsx`           | Add `MotionTiltCard` to motion mock                                      |
| `test/unit/components/blog/BlogPostList.test.tsx`           | Add `MotionTiltCard` to motion mock                                      |
| `test/unit/components/header/HeaderAppearanceDial.test.tsx` | Update button label assertion to include `(active)` suffix               |
| `test/unit/pages/CV.test.tsx`                               | Move tooltip-trigger assertions from `cv-story-header` to GitHub section |

**Validation**: `CI=true npm test -- --watch=false` → 0 failures

### Step 2: Add production smoke spec (`test/e2e/smoke.spec.ts`)

Write ~9 tests covering every non-gated route renders, blog routes are blocked, header nav omits blog, and direct-link SPA routing works. Use existing `waitForAnimatedSectionReadiness` helper. No screenshots.

**Validation**: `npm run build && npx playwright test test/e2e/smoke.spec.ts` → all pass

### Step 3: Add cross-route navigation spec (`test/e2e/navigation.spec.ts`)

Write ~5 tests that navigate between routes via header links and verify URL + visible content on each destination. Include one browser-back test.

**Validation**: `npm run build:e2e && npx playwright test test/e2e/navigation.spec.ts` → all pass

### Step 4: Update CI to add smoke job and enforce checks

- Add `smoke` job to `.github/workflows/build.yml` that runs against the production build artifact
- Document that both `e2e` and `smoke` should be configured as required status checks in the repository settings

**Validation**: Push to PR, verify both jobs appear in the checks UI

### Step 5: Full suite validation

- `npm run build` → succeeds
- `npm run build:e2e` → succeeds
- `npx playwright test` → all specs pass (existing 36 + new smoke + navigation)
- `CI=true npm test -- --watch=false` → 0 failures

---

## 11. Validation plan

```bash
# Step 1 validation
CI=true npx react-scripts test --watch=false --passWithNoTests --roots test/unit src

# Step 2 validation
npm run build
npx playwright test test/e2e/smoke.spec.ts

# Step 3 validation
npm run build:e2e
npx playwright test test/e2e/navigation.spec.ts

# Full suite
npm run build:e2e
npx playwright test
```

---

## 12. What this plan does NOT cover (and why)

| Excluded                      | Reason                                                                                                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mobile viewport E2E           | Only photography has a responsive test; adding mobile tests across all routes is valuable but not a merge blocker. The site is primarily desktop-targeted. |
| Accessibility (axe-core)      | No existing axe infrastructure. Adding it is a separate feature, not a hardening gate.                                                                     |
| Visual regression screenshots | One screenshot exists with adequate tolerance. Expanding screenshot coverage risks cross-platform flakes that block CI without clear signal.               |
| Firefox/Safari projects       | Single-browser Playwright is the current contract. Multi-browser is a follow-up.                                                                           |
| Error boundary addition       | No error boundaries exist in the app. Adding them is a feature, not a test hardening task.                                                                 |
| Service worker validation     | Production-only registration; not something that affects merge safety for a portfolio site.                                                                |
| Performance / Lighthouse      | Useful but not a regression gate.                                                                                                                          |

---

## 13. Risk assessment

| Risk                                              | Likelihood                        | Impact | Mitigation                                                          |
| ------------------------------------------------- | --------------------------------- | ------ | ------------------------------------------------------------------- |
| Smoke tests flake due to animation timing         | Low                               | Medium | Reuse proven `waitForAnimatedSectionReadiness` helper               |
| Production build serves blog routes               | Low (feature flag is well-tested) | High   | Smoke spec explicitly asserts `/blog` → 404                         |
| Screenshot test fails on Linux CI                 | Medium                            | Low    | Already tolerant at 5% pixel ratio; fail is non-blocking for smoke  |
| Navigation tests break on `PageTransition` timing | Low                               | Medium | Wait for URL change + content visibility, not animation frames      |
| CV unit test fix is insufficient                  | Very low                          | Low    | Root cause confirmed by reading component source; fix is mechanical |
