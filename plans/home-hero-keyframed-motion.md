# Home hero keyframed motion-path entrance

## Goal
Add the requested staged `/home` hero-card entrance so the hero card appears from center, zooms in, travels outward along the circular path, performs synchronized in-flight keyframed transform changes, then settles before the typewriter copy begins.

## Why
The issue requests a follow-up to the existing circular motion-path entrance on `v1`. This branch is behind `v1`, so the work must first restore the current home entrance architecture and then extend it with the new coordinated keyframed transform sequence.

## Constraints
- Preserve the final resting hero layout and lower-left placement on `/`.
- Keep the app client-side and compatible with SPA/static hosting.
- Use Motion for the keyframed in-flight transform sequence.
- Respect reduced-motion preferences by skipping the travel/keyframe sequence while still delaying typewriter start until the simplified entrance completes.
- Keep the change narrowly scoped to the home page and directly related shared components/tests.

## Affected files and responsibilities
- `package.json` / `package-lock.json`: align dependencies/scripts with `v1` home animation support.
- `src/pages/Home.tsx`: compose the staged home hero sequence and typewriter gating.
- `src/components/HeroMotionPath.tsx`: own path travel and synchronized in-flight keyframed shell transforms.
- `src/components/text/TypewriterText.tsx`: render delayed typewriter text once entrance completes.
- `test/unit/...`: cover sequencing and reduced-motion behavior.
- `test/e2e/home.spec.ts`: keep route-level reduced-motion coverage intact.

## Proposed approach
1. Inspect the `FETCH_HEAD` (`v1`) implementation for the existing home motion-path feature.
2. Apply the smallest set of changes needed to align this branch with that baseline.
3. Extend `HeroMotionPath` so an outer motion wrapper owns path travel while an inner motion/card shell owns scale/rotate/border-radius keyframes.
4. Keep `/home` responsible for sequencing hero visibility and typewriter start based on animation completion rather than unrelated fixed delays.
5. Validate with targeted unit tests, route build/tests, and browser inspection/screenshots on `/`.

## Execution steps
1. Inspect the `v1` versions of the home hero files and identify the minimal port needed.
2. Port the existing home motion-path/typewriter baseline into this branch.
3. Add the synchronized in-flight keyframed transform and reduced-motion handling.
4. Update focused tests for sequencing and final settled behavior.
5. Run targeted validation, then broader final validation and review/security checks.

## Validation plan
- `npm run build`
- `CI=true npm test -- --watch=false --runInBand` if needed for stability, otherwise targeted Jest commands first
- narrow unit tests for touched files
- `npx playwright test test/e2e/home.spec.ts`
- browser validation of `/` in desktop and mobile viewports with screenshots

## Risks and rollback
- Home animation timing can easily regress the typewriter sequencing or leave the hero card in an incorrect resting style.
- Reduced-motion handling is coupled to both the zoom card wrapper and Motion path wrapper.
- If the ported baseline introduces unrelated drift, rollback by restoring only the minimal files needed for `/home` and reapplying the keyframed transform change.

## Progress notes
- Current working branch is behind `v1`; `FETCH_HEAD` includes the baseline home motion-path feature referenced by the issue.
- Initial baseline build/test failed before `npm install` because dependencies were not installed in the fresh clone.
