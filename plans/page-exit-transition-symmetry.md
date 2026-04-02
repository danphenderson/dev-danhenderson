# ExecPlan: Page exit transition symmetry

**Status:** complete

---

## 1. Goal

Give every route-level exit a directional animation that mirrors the existing entrance.

Currently, navigating away from a page produces a bare opacity fade (`{ opacity: 0 }`). After this change, the exiting page slides _up and out_ (`{ opacity: 0, y: -ENTER_Y_OFFSET }`) using an acceleration easing curve, producing a balanced enter-from-below / exit-upward choreography.

---

## 2. Why

The entrance in `PageTransition` already uses `{ opacity: 0, y: ENTER_Y_OFFSET }` as its `initial` state, giving a slide-up-into-view effect. The exit is asymmetric — it fades out with no spatial movement. This breaks the visual contract implied by the entrance: users see content arrive from below but disappear in place. Adding the matching exit offset makes the transition feel intentional and directional.

---

## 3. Constraints

- All timing must flow through `useMotionScale()`. The `dFactor` guard (`dFactor === 0 ? undefined : …`) must be preserved so the component is fully inert when motion is disabled or when the OS `prefers-reduced-motion` media query is active.
- Duration tokens must come from `src/motion/tokens.ts`. The exit may use a shorter duration than the entrance (it is less prominent) but must use `scaleDuration()`.
- Easing must use a token from `src/motion/tokens.ts`. The exit should use `easing.accel` (`[0.4, 0, 1, 1]`), which is the documented acceleration curve for exiting content.
- The existing `AnimatePresence mode="wait"` and `key={routePathname}` must not change.
- No new dependencies.
- The change must be narrowly scoped to `PageTransition.tsx`.

---

## 4. Affected files and responsibilities

| File                                | Role                                                                                                                               |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/components/PageTransition.tsx` | The only file changed. Adds `y: -ENTER_Y_OFFSET` to the `exit` prop and embeds an exit-specific `transition` using `easing.accel`. |

---

## 5. Proposed approach

Framer Motion supports per-state `transition` overrides by nesting a `transition` object inside the `exit` prop. This avoids splitting into `Variants` (which would be over-engineering for two states) and keeps the component's existing imperative-style props unchanged.

```tsx
// Before
exit={dFactor === 0 ? undefined : { opacity: 0 }}
transition={{ duration: scaledDuration, ease: SPRING_EASING_MOTION }}

// After
exit={
  dFactor === 0
    ? undefined
    : {
        opacity: 0,
        y: -ENTER_Y_OFFSET,
        transition: {
          duration: scaleDuration(duration.fast, dFactor),
          ease: easing.accel,
        },
      }
}
transition={{ duration: scaledDuration, ease: SPRING_EASING_MOTION }}
```

The top-level `transition` continues to govern the entrance. The nested `transition` inside `exit` overrides it only for the exit phase. `easing.accel` is already imported from `src/motion/tokens.ts` and is the canonical acceleration curve. `duration.fast` (0.2 s) is used for the exit — shorter than the entrance's `duration.quick` (0.18 s scaled) — to keep the outgoing page from lingering.

`easing` must be added to the `import` statement from `'../motion'`.

---

## 6. Execution steps

1. **Add `easing` to the import** in `src/components/PageTransition.tsx`.
2. **Update the `exit` prop** to include `y: -ENTER_Y_OFFSET` and an embedded `transition` using `easing.accel` and `duration.fast`.
3. **Run `npm run build`** to confirm no type or compile errors.
4. **Browser-validate** the transition on at least two route navigations (e.g., `/` → `/cv` → `/climbing`) using the webdev browser tool.

---

## 7. Validation plan

- `npm run build` — must pass with no new errors or warnings.
- Browser: navigate `/` → `/cv`. The home page should slide upward and fade out; the CV page should slide up and fade in.
- Browser: navigate `/cv` → `/climbing`. Same directional symmetry.
- Browser: set motion intensity to `off` in the settings popover. No animation should play; the transition must be instant.
- Targeted Jest run: `CI=true npm test -- --watchAll=false --testPathPattern=PageTransition` — existing PageTransition tests capture `exit` props and must continue to pass with the updated exit value.
