# ExecPlan: Appearance Dial — Active Indicator + Dock Magnification

## Status

Complete. Build passes. Browser validation pending.

---

## 1. Goal

Patch the header appearance speed dial with two UX enhancements:

1. **Active theme indicator** — the currently selected appearance swatch gets a prominent ring + scale-up so the user always knows which theme is active.
2. **Dock magnification ("genie effect")** — hovering any dial action triggers a macOS dock-style proximity scale on the hovered item and its neighbours, creating a fluid, physicsy magnification cascade.

---

## 2. Why

The dial currently shows a thin 2 px white ring around the selected swatch and no other active state cue. There is no hover magnification. Users switching themes often have no clear feedback about which palette is active, and the interaction feels flat compared to the rest of the app's animated surface language.

---

## 3. Constraints

- App remains fully client-side; no new dependencies.
- `motion/react` is already in the stack — use it for spring-animated scales.
- Changes must be backward-compatible: `AppSpeedDialAction` extension is additive (optional fields); no existing callers break.
- Only the three named source files change — no routes, data modules, `appStyleBuilders.ts`, or `ThemeProvider` are touched.
- Existing SpeedDials (CV floating dial, etc.) are unaffected.
- `prefers-reduced-motion` is handled automatically by `motion/react`'s `animate` prop + transition.

---

## 4. Affected files and responsibilities

| File                                             | Role                                                                                                |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `src/types/ui.ts`                                | Add optional `onMouseEnter` / `onMouseLeave` to `AppSpeedDialAction`                                |
| `src/components/AppSpeedDial.tsx`                | Thread the new hover callbacks into `getActionFabProps`                                             |
| `src/components/header/HeaderAppearanceDial.tsx` | All new visual logic: active indicator, proximity scale state, `motion.div` wrappers, `dimmed` prop |

---

## 5. Proposed approach

### Active indicator

`AppearanceSwatchIcon` gains:

- `dimmed?: boolean` → `opacity: 0.55` when dimmed (non-selected, non-hovered state during open dial)
- `selected` ring upgraded to 3 px white + 5 px primary glow (`box-shadow` double ring)
- `transform: scale(1.12)` on the swatch box when selected, CSS-transitioned with `SPRING_EASING_CSS`

### Dock magnification

`HeaderAppearanceDial` gains:

- `hoveredActionId: string | null` state
- `getProximityScale(id)` — index-distance mapping: d=0→1.38, d=1→1.2, d=2→1.08, d≥3→1.0
- Every action icon is wrapped in a `motion.div` with `animate={{ scale }}` + spring transition
- `onMouseEnter` / `onMouseLeave` on each action drive `hoveredActionId`

### Shared infrastructure

`AppSpeedDialAction` gets two optional callbacks; `AppSpeedDial.getActionFabProps` spreads them.

---

## 6. Execution steps

- [x] Write ExecPlan (`plans/appearance-dial-enhancements.md`)
- [x] `src/types/ui.ts` — add `onMouseEnter?` / `onMouseLeave?`
- [x] `src/components/AppSpeedDial.tsx` — thread callbacks in `getActionFabProps`
- [x] `src/components/header/HeaderAppearanceDial.tsx` — active indicator + dock magnification
- [x] `npm run build` — compiles cleanly, no new warnings
- [ ] Browser validation (webdev)

---

## 7. Validation plan

1. `npm run build` — must pass with zero errors
2. Browser `/` — open dial, hover each swatch → progressive scale cascade visible
3. Browser — switch appearance → active swatch shows ring + scale-up; non-active dimmed on open
4. Browser — toggle dark/light → toggle button participates in magnification
5. Mobile viewport ≤ 600 px — dial opens, no viewport clip, usable touch targets
6. Check reduced-motion via DevTools media query override → animations suppressed

---

## 8. Risks and rollback

- **Type extension**: additive only; existing callers not impacted.
- **motion.div inside FAB icon slot**: purely visual wrapper; FAB hit area unchanged.
- **Touch screens**: `onMouseEnter`/`onMouseLeave` silent on touch — dock effect absent on touch, active indicator still works.
- **Rollback**: revert the three files; no migrations or data changes.

---

## 9. Progress notes

_Updated during execution._
