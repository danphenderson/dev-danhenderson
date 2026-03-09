## Portfolio Correctness + Debt Cleanup + Component Refactor

### Summary- Deliver patches in 4 waves: critical correctness/privacy, GitHub reliability, cruft/performance cleanup, and component refactor.
- Prioritize user-visible correctness first, then reliability, then maintainability and component abstraction.

### Key Changes
- **Wave 1 (critical fixes)**
  - Replace timezone-sensitive date rendering in climbing with a UTC-safe formatter that preserves the source calendar date.
  - Normalize background image resolution so `PUBLIC_URL` is applied exactly once.
  - Defer SoundCloud script+iframe creation until explicit user consent; persist consent choice.
- **Wave 2 (GitHub data quality/resilience)**
  - Restrict contribution repo extraction to contribution-like event types.
  - Add `fallbackGitHubContributions` in `src/data/cv.ts` and wire it into `useGithubProfile` initialization + error fallback.
  - Cap repo enrichment calls (default: 8) and preserve last-known-good data when enrichment partially fails.
- **Wave 3 (cruft + perf debt)**
  - Remove dead components and unused placeholder stylesheet if unneeded.
  - Remove unused npm dependencies and refresh lockfile.
  - Fix low-noise lint issues (`accentTint` unused, unnecessary escapes, invalid width token, bioLink text mismatch).
  - Convert photography slugs to explicit stable slugs (kebab-case) and align sitemap entries; add compatibility handling for old `new%20mexico` link.
  - Remove technical debt.
- **Wave 4 (component refactor)**
  - Extract shared layout primitives (for example `PageFrame`, `SectionCard`, and `SectionPanel`) and migrate `CV`, `Climbing`, `Photography`, and `PhotographyCategory` to reduce repeated wrapper/layout/styling code.
  - Split `src/pages/CV.tsx` into composable sections (`CVSidebar`, `CVMainColumn`, `CVGitHubSection`) so the page file only handles route-level data wiring and responsive composition.
  - Consolidate duplicated GitHub list/chip rendering into a shared component (for example `GitHubLinkChipList`) and reuse it in `GitHubActivityList`, `GitHubContributions`, and `GitHubProjects`.
  - Refactor `Header` into container + presentational subcomponents (`HeaderNav`, `HeaderActions`, `HintPopover`) while preserving existing behavior, a11y attributes, and responsive navigation/audio controls.
  - Move CV-specific style helpers (`useCvStyles`) out of `ThemeProvider.tsx` into a dedicated theme utility module to separate global theme state from CV UI tokens.
  - Add targeted tests for extracted logic/components where practical (at minimum, CV GitHub section rendering and header audio/theme control behavior).
  - Verification gate: run build + manual smoke checks on desktop/mobile for `/cv`, `/climbing`, `/photography`, and `/photography/:slug`, confirming no UX regressions.
### Public Interfaces / Type Changes
- Add `fallbackGitHubContributions` export in `src/data/cv.ts`.
- Add stable `slug` field to photography category data model (or equivalent typed mapping utility).
- Add reusable utility for background image resolution and UTC-safe climbing date formatting.

### Assumptions (defaults chosen)
- Keep CRA for this patch set; toolchain migration (e.g., Vite) is deferred to a separate effort.
- Preserve current UX/content except where needed for correctness/privacy.
- Keep existing production routes functional while introducing canonical slug behavior.
