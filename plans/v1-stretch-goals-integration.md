# v1 Stretch-Goals Integration

## Goal
Deliver the remaining v1 stretch-goal features that enhance the portfolio site with richer data presentation and analytics across key routes.

## Why
The base v1 site ships functional route pages, but several planned enhancements were deferred to stretch goals. This plan tracks their incremental delivery.

## Constraints
- App remains fully client-side
- SPA routing and direct-link behavior remain intact
- Static asset usage remains compatible with `PUBLIC_URL`
- Content flows from existing TypeScript data modules only
- No new third-party visualization libraries in this phase
- Changes stay narrowly scoped per execution step

## Execution Steps

### Step 6 — Climbing Analytics and Freshness

**Scope (refined):** Freshness modeling is already implicit in the bundled tick data (most-recent tick date). This step extends the climbing hook with derived analytics (overview totals, grade profile, destination profile) and renders those analytics plus the data-freshness indicator on `/climbing`.

**Touched files:**
- `src/hooks/useClimbingData.ts` — added `analytics` (ClimbingAnalytics) and `status` (ClimbingStatus) to the hook return value; added `normalizeGrade` helper and grade/location aggregation logic
- `src/components/climbing/ClimbingAnalytics.tsx` — new climbing-specific presentation component rendering overview metrics, grade chips, destination lists, and freshness copy; reuses SectionPanel, SubsectionTitle, MetaText, CaptionText primitives
- `src/pages/Climbing.tsx` — destructures `analytics` and `status` from the hook; places `ClimbingAnalytics` between the lead text and the tick DataGrid
- `src/hooks/useClimbingData.test.ts` — extended with analytics derivation tests (overview totals, grade-bucket grouping, grade ordering, top-location ranking, freshness) and `normalizeGrade` unit tests
- `src/pages/Climbing.test.tsx` — updated hook mock to include `analytics` and `status`; added assertions for analytics headings, metric labels, grade chips, destination sections, and freshness text
- `e2e/climbing.spec.ts` — added E2E tests for analytics overview, grade profile, destination profile, and data freshness sections

**Validation run:**
- `CI=true npm test -- --watch=false --testPathPattern='(useClimbingData|Climbing)'` — 17 tests pass
- `npm run build` — clean
- `npx playwright test e2e/climbing.spec.ts` — browser validation
- Browser screenshot on desktop and mobile viewports

## Risks and rollback
- Analytics are derived entirely from existing bundled data; no API calls or schema changes, so rollback is a simple revert of the touched files
- The new component is isolated under `src/components/climbing/` with no shared-component changes

## Progress notes
- Step 6 executed with all planned files touched
- Tests co-located per existing repository convention (hook test next to hook, page test next to page)
- Types kept local to the hook as planned; no expansion of `src/types/data.ts`
