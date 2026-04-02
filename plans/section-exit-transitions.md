# ExecPlan: Section-level exit transitions via scroll primitives

**Status:** complete

---

## 1. Goal

Give scroll-triggered section primitives (`MotionSection`, `MotionFadeIn`, `MotionScaleIn`, `StaggerChildren`) the ability to play a distinct _exit_ animation when sections leave the viewport or are conditionally unmounted, rather than snapping back to their initial enter-from state.

Two scenarios are addressed together:

**Scenario A — `AnimatePresence` unmount.** Any conditionally rendered section or list item inside an `AnimatePresence` boundary (e.g., the Home IDE window, future CV story slides) will automatically receive an exit animation once the `exit` key is present on the variant it uses.

**Scenario B — Scroll-out re-animation (`once: false`).** When a consumer opts in with `exitOnLeave={true}`, viewport-mounted sections animate to their `'exit'` variant state when they scroll out of view, rather than resetting to the initial `'hidden'` state (which creates an unintentional reverse-entrance effect).

---

## 2. Why

Currently, the three core entrance variants (`fadeInUp`, `fadeIn`, `scaleIn`) have no `exit` key. This means:

- Sections inside `AnimatePresence` that unmount fade or slide back to their `hidden` state, which is the same direction as the entrance. Content that arrived from below also exits downward — visually incoherent.
- Scroll-triggered sections with `once: false` animate in on scroll down and then silently reset to `hidden` (opacity 0, y +24 for `fadeInUp`) when scrolling back up — a reverse entrance rather than a purposeful exit.

Adding `exit` keys to the core variants and an opt-in `exitOnLeave` prop to the primitives resolves both asymmetries with zero breaking change to existing consumers (all current usages use `once: true` and none are inside `AnimatePresence` via variant-based approach).

---

## 3. Constraints

- All timing must flow through `useMotionScale()`. The `dFactor === 0` guard must be preserved — both the `exit` variant in `variants.ts` must have a `transition.duration` (so `scaleVariantDurations` can scale it) and the `exitOnLeave` early-return path must remain inert when `dFactor === 0`.
- Token imports must come from `src/motion/tokens.ts`. Use `easing.accel` for exit easing (the documented acceleration curve for exiting content) and `duration.fast` for exit timing.
- `exitOnLeave` must default to `false` so all current call sites are unaffected.
- `exitOnLeave` is only meaningful when paired with `once: false`. The ExecPlan does not couple the props — consumers own that combination — but the interaction must be documented.
- The `exit` key in a variant is inert outside `AnimatePresence` unless explicitly driven via `animate="exit"`. The `exitOnLeave` mechanism uses `animate="exit"` (targeting the named variant state) and does **not** require wrapping anything in a new `AnimatePresence`.
- No new dependencies. No changes to how `scaleVariantDurations` works — it already iterates all variant keys generically.
- `src/motion/index.ts` requires no changes – no new public exports.

---

## 4. Affected files and responsibilities

| File                        | Change                                                                                                                                                      |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/motion/variants.ts`    | Add `exit` key to `fadeInUp`, `fadeIn`, and `scaleIn`.                                                                                                      |
| `src/motion/components.tsx` | Add `exitOnLeave?: boolean` prop (default `false`) and `hasBeenInView` tracking to `MotionSection`, `MotionFadeIn`, `MotionScaleIn`, and `StaggerChildren`. |

No changes to `src/motion/tokens.ts`, `src/motion/hooks.ts`, `src/motion/index.ts`, any page, or any other component.

---

## 5. Proposed approach

### 5a. Exit keys in `variants.ts`

Add an `exit` key to each of the three entrance variants. Each exit uses:

- `easing.accel` (`[0.4, 0, 1, 1]`) — the existing acceleration token, matching Material Design exit easing convention.
- `duration.fast` (0.2 s) — shorter than the entrance; exits should disappear quickly.
- A directional offset that mirrors the entrance in reverse:

```ts
// fadeInUp: entered from below (y: 24 → 0) → exits upward (y: 0 → -16)
exit: {
  opacity: 0,
  y: -16,
  transition: { duration: duration.fast, ease: easing.accel },
},

// fadeIn: pure crossfade → exits as pure crossfade
exit: {
  opacity: 0,
  transition: { duration: duration.fast, ease: easing.accel },
},

// scaleIn: entered scaling up (0.92 → 1) → exits scaling down slightly (0 → 0.96)
exit: {
  opacity: 0,
  scale: 0.96,
  transition: { duration: duration.fast, ease: easing.accel },
},
```

The exit offset for `fadeInUp` is `y: -16` (smaller than the `y: 24` entrance) — exits should be subtler, not a full reversal of the entrance distance.

The `scaleIn` exit uses `scale: 0.96` (no overshoot), unlike the spring-based entrance. Exiting content should not bounce.

`scaleVariantDurations` already handles scaling for any key with a `transition.duration`, including `exit`. No change to the helper is needed.

### 5b. `exitOnLeave` in `components.tsx`

Add `exitOnLeave?: boolean` to the interface of each affected primitive.

Inside the component body, add a `hasBeenInViewRef` ref initialized to `false`. When `isInView` becomes `true`, set the ref to `true`. Derive the `animateTarget` from a three-way conditional:

```ts
const hasBeenInViewRef = useRef(false);
if (isInView) hasBeenInViewRef.current = true;

const animateTarget =
  exitOnLeave && hasBeenInViewRef.current && !isInView ? 'exit' : isInView ? 'visible' : 'hidden';
```

Use `animateTarget` as `animate={animateTarget}` on the `motion.div`.

When `dFactor === 0`, the early plain-`<div>` return path already bypasses all of this.

`StaggerChildren` uses `animate={animate ?? animateTarget}` to preserve its existing prop-override behavior.

---

## 6. Execution steps

1. **`src/motion/variants.ts` — add `exit` key to `fadeInUp`, `fadeIn`, `scaleIn`.**

   - Keep the existing `hidden` and `visible` keys unchanged.
   - Verify the `exit` objects use `duration.fast` and `easing.accel` from the existing imports.

2. **`src/motion/components.tsx` — add `exitOnLeave` prop to `MotionSection`.**

   - Extend the interface with `exitOnLeave?: boolean`.
   - Add `hasBeenInViewRef` and the three-way `animateTarget` derivation.
   - Replace the hardcoded `animate={isInView ? 'visible' : 'hidden'}` with `animate={animateTarget}`.

3. **`src/motion/components.tsx` — add `exitOnLeave` prop to `MotionFadeIn`.**

   - Same change as `MotionSection`.

4. **`src/motion/components.tsx` — add `exitOnLeave` prop to `MotionScaleIn`.**

   - Same change.

5. **`src/motion/components.tsx` — add `exitOnLeave` prop to `StaggerChildren`.**

   - Same ref + `animateTarget` logic. Keep the existing `animate={animate ?? animateTarget}` override path.

6. **`npm run build`** — confirm no type or compile errors.

7. **Targeted Jest run** — `CI=true npm test -- --watchAll=false --testPathPatterns=motion|MotionSection` to confirm no regressions.

8. **Browser validation** — in the dev server (`npm start`), navigate to `/climbing` or `/blog` (a page with `StaggerChildren` + `MotionSection`), add `once={false} exitOnLeave` to one section temporarily, and scroll to verify the exit animation fires.

---

## 7. Validation plan

- `npm run build` — must pass with no new errors or warnings.
- `CI=true npm test -- --watchAll=false --testPathPatterns=PageTransition|motion` — confirm no existing tests fail. There are no direct unit tests for `MotionSection` variants; the blog `BlogPostList.test.tsx` mocks `fadeInUp: {}` and must still pass.
- Dev server browser check: `once={false} exitOnLeave` on any `MotionSection`-wrapped section — scroll it in, scroll it out, and verify the `'exit'` animation plays rather than the element resetting to its initial `hidden` position.
- Motion-off check: set motion intensity to `off` in the settings panel. Sections must render immediately, no animation, no flicker.
- `prefers-reduced-motion` check: in browser devtools, emulate reduced motion. Same result as motion-off.

---

## 8. Risks and rollback

| Risk                                                                 | Mitigation                                                                                                                                                                                                                     |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `exitOnLeave` fires prematurely on initial load (before first enter) | The `hasBeenInViewRef` guard prevents `'exit'` from being targeted until `isInView` has been `true` at least once.                                                                                                             |
| `StaggerChildren` prop-override path breaks                          | The `animate={animate ?? animateTarget}` pattern preserves the existing external override.                                                                                                                                     |
| Framer Motion treats `animate="exit"` as a special unmount signal    | `animate="exit"` is a string prop driving a named variant state; Framer Motion only intercepts the `exit` prop (not the `animate` string) for unmount choreography. No conflict.                                               |
| `scaleVariantDurations` doesn't scale the new `exit` transition      | Already confirmed — the helper iterates all variant keys generically. The `exit` key has a `transition.duration` and will be scaled.                                                                                           |
| Bidirectional scroll animation on `StaggerChildren` looks choppy     | Stagger delays during exit are inherited from the container variant; the container's `'exit'` key has no stagger (it is on `fadeInUp` items directly). This is acceptable — a sequential exit stagger is a future improvement. |

Rollback: removing the `exitOnLeave` prop from any call site immediately disables the exit behavior. All default values are `false` so no existing caller is affected without opt-in.

---

## 9. Progress notes

- 2026-04-01: Added `exit` states to `fadeInUp`, `fadeIn`, and `scaleIn`, plus `exitOnLeave` support for `MotionSection`, `MotionFadeIn`, `MotionScaleIn`, and `StaggerChildren`.
- 2026-04-01: Added focused Jest coverage for exit-target selection, stagger override preservation, the motion-off early return, and exit-duration scaling.
- 2026-04-01: `npm run build` passed.
- 2026-04-01: `CI=true npm test -- --watchAll=false --testPathPatterns=test/unit/motion/components.test.tsx` passed.
- 2026-04-01: Browser validation passed on `/climbing` and `/photography`, including motion intensity `off` and Playwright-emulated `prefers-reduced-motion: reduce`. No current route opts into `exitOnLeave`, so that opt-in path was validated through the focused Jest coverage rather than a temporary live call site edit.
