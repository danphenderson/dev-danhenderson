# Shared Metric Value Text Primitive

## Goal

Add a shared metric-value text primitive for dashboard-style stat values and replace the current component-local implementation with that primitive wherever the existing UI is expressing the same pattern.

## Why

The design-system audit found that the climbing overview metrics still rely on a component-local large-number treatment. That local pattern is acceptable in isolation, but it leaves a gap in the shared text layer and makes future metric dashboards more likely to duplicate styling instead of reusing a named primitive.

## Constraints

- Keep the change narrowly scoped to the shared text/style layer, current metric-style consumers, and documentation/tests needed to support the new primitive.
- Preserve the current design-system exception boundaries; do not normalize blog, photography overlays, the Home IDE hero, or CV story mode into this primitive unless they already match the same stat-value role.
- Prefer the existing style-builder pipeline over introducing new ad hoc theme logic in components.
- Preserve current route behavior and layout; this is a design-system hardening change, not a page redesign.

## Affected files and responsibilities

- `src/styles/componentStyleBuilders.ts`: define the reusable metric-value text styling in the shared style map.
- `src/components/text/TypographyPrimitives.tsx`: add the new `MetricValueText` primitive.
- `src/components/text/index.ts`: export the new primitive.
- `src/components/climbing/ClimbingAnalytics.tsx`: replace the current local metric-value text styling with the shared primitive.
- `docs/design-system-reference.md`: document the new primitive in the design-system reference.
- `test/unit/components/text/TypographyPrimitives.test.tsx`: cover the new primitive.
- `test/unit/components/climbing/ClimbingAnalytics.test.tsx`: verify the climbing analytics overview uses the shared stat-value pattern.

## Proposed approach

Add a `MetricValueText` primitive in the existing typography primitives module and back it with a shared `metricValueTextSx` entry from the component style builders. Keep the primitive responsible for the default stat-value look while still allowing local `sx` overrides when a consuming surface needs minor presentation differences. Then replace the current local `BodyText + metricValueSx` composition in `ClimbingAnalytics` with the shared primitive. Do not move the inline value rows in `PerformanceScorecard` to the new primitive unless the pattern truly matches the larger dashboard-style metric role.

## Execution steps

1. Add the ExecPlan and confirm the existing metric-style consumers.
2. Add the shared style-builder entry and new `MetricValueText` primitive export.
3. Replace the climbing overview metric values with the new primitive.
4. Update the design-system reference and targeted unit tests.
5. Run focused unit tests, browser validation on the affected route(s), and a production build.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/text/TypographyPrimitives.test.tsx test/unit/components/climbing/ClimbingAnalytics.test.tsx`
- `npm run build`
- Browser validation on `/climbing`
- Secondary browser check on another route only if a second real consumer is introduced

## Risks and rollback

- Risk: choosing a primitive that is too specific to climbing or too broad for unrelated inline values.
- Risk: shifting the visual size or spacing of existing climbing stats if the shared primitive does not preserve the current defaults.
- Rollback: remove the new primitive export and restore the existing local `metricValueSx` usage in `ClimbingAnalytics`.

## Progress notes

- 2026-03-18: Confirmed the existing larger metric-value treatment currently exists in `ClimbingAnalytics`; `PerformanceScorecard` uses a separate inline row-value pattern and is not an automatic consumer.
- 2026-03-18: Added `metricValueTextSx` to the shared component style map and introduced `MetricValueText` in `src/components/text/TypographyPrimitives.tsx`.
- 2026-03-18: Replaced the climbing overview's local stat-value styling with `MetricValueText`; no additional sensible metric-dashboard consumers were found in `src/pages` or `src/components`.
- 2026-03-18: Updated `docs/design-system-reference.md`, added targeted primitive coverage in `TypographyPrimitives.test.tsx`, and tightened `ClimbingAnalytics.test.tsx` to preserve the stat-value contract.
- 2026-03-18: Validation completed: targeted Jest suites passed, `npm run build` compiled successfully, and browser validation on `/climbing` passed at desktop and mobile viewports.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
