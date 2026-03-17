# Tilt Effect Expansion — MotionTiltCard System-Wide

## Goal

Centralize the photography-local `TiltCard` into the shared motion system as `MotionTiltCard` — a
generalized, tokenized, accessible 3D pointer-follow tilt primitive — and apply it to five surfaces:

- **CV content cards** (`AnimatedContentList.tiltItems`) — import update only (already wired locally)
- **Photography page** — import update only
- **Home page** — wrap the VSCode mock terminal shell (`TerminalHeroContent`) at the page level
- **HintPopover** — wrap the welcome-sequence hint card content
- **BlogPostCard** — compose as outermost root, keeping `MotionCard` lift/tap inside

After this change, hovering any of these surfaces produces a subtle spring-animated 3D depth tilt that
resets smoothly on mouse leave. The effect is fully suppressed when `prefers-reduced-motion` is set.

## Why

`TiltCard` lives in `src/components/photography/` — a feature-scoped location not intended for
shared primitives. It has already been extended to CV cards via `AnimatedContentList.tiltItems`,
creating an import from a feature component into the shared list component. The effect is desirable on
additional surfaces (home terminal, blog cards, hint popovers), so the right architectural step is to
first promote it into `src/motion/` (per `motion/AGENTS.md`) with a generalized API before expanding
its footprint further.

## Constraints

- App remains fully client-side; no new dependencies (`motion/react` is already in use).
- New Framer Motion primitives belong in `src/motion/components.tsx` and re-export from
  `src/motion/index.ts` — per `motion/AGENTS.md`.
- No hardcoded spring config in components; use `springOptions.tilt` from `src/motion/tokens.ts`.
- `useReducedMotion` from `motion/react` must suppress all pointer-follow updates for accessible
  degradation.
- React hook call order must be unconditional — always call `useMotionValue`, `useSpring`, and
  `useReducedMotion` regardless of `disabled` or reduced-motion state.
- Do not modify `HeroMotionPath.tsx`, `TerminalHeroContent.tsx`, or `AnimatedContentCard.tsx`
  directly; tilt is applied at the page/call-site level.
- Existing `TiltCard` test must continue to pass; mock updated for `useReducedMotion`.
- Do not rename exported types, route names, or stable data fields.
- Browser validation required on each affected route per `AGENTS.md` validation matrix.

## Affected files and responsibilities

- `src/motion/tokens.ts` — Add `springOptions` export (spring physics config for `useSpring`).
- `src/motion/components.tsx` — Add `MotionTiltCard` (canonical implementation with `intensity`,
  `disabled`, and reduced-motion support).
- `src/motion/index.ts` — Re-export `MotionTiltCard` and `springOptions`.
- `src/components/photography/TiltCard.tsx` — Convert to one-line re-export shim; all existing
  consumers keep working until their imports are updated.
- `src/components/AnimatedContentList.tsx` — Update import from photography shim to `MotionTiltCard`
  from `'../motion'`; rename JSX tag.
- `src/pages/Photography.tsx` — Update `TiltCard` import to `MotionTiltCard` from `'../motion'`;
  update JSX.
- `src/pages/Home.tsx` — Add `MotionTiltCard` import; wrap `AnimatedContentCard` at page level.
- `src/components/header/HintPopover.tsx` — Add `MotionTiltCard` import; wrap popover content
  children.
- `src/components/blog/BlogPostCard.tsx` — Add `MotionTiltCard` to import; add as outermost root
  with `MotionCard` staying inside for lift/tap states.
- `test/unit/components/photography/TiltCard.test.tsx` — Add `useReducedMotion` to mock; add
  `intensity` and `disabled` smoke tests.

## Proposed approach

### Tokenize

Add `springOptions = { tilt: { stiffness: 200, damping: 20 } }` to `tokens.ts`. This is a separate
export from `transition` because `useSpring` takes `SpringOptions` (no `type` field), not a
`Transition` object.

### Promote

Add `MotionTiltCard` to `components.tsx`, importing `springOptions.tilt` from `./tokens` and
`useReducedMotion` from `motion/react`. The `intensity` prop multiplies the base
`TILT_DEG * 2` magnitude (default `1`). The `disabled` prop and `prefersReduced` both
short-circuit pointer-follow writes; hooks are always called for React rules compliance.

### Shim

Convert `TiltCard.tsx` to `export { MotionTiltCard as TiltCard } from '../motion'`. Both existing
call sites (`Photography.tsx`, `AnimatedContentList.tsx`) are immediately updated to the canonical
`MotionTiltCard` import, so the shim exists only as a safety net.

### Apply

- **Home:** `<MotionTiltCard intensity={0.7}>` wrapping the `AnimatedContentCard` in `Home.tsx`. The
  outer hero `motion.div` has 2D scroll transforms (scale/opacity); the inner 3D tilt still renders
  correctly as a visual effect.
- **HintPopover:** `<MotionTiltCard intensity={0.5}>` wrapping the three content children inside
  `<Popover>`. Intensity capped at 0.5 to limit max rotation to ±3° per axis, avoiding corner
  clipping from the parent Paper's overflow.
- **BlogPostCard:** `<MotionTiltCard intensity={0.8} style={{ height: '100%' }}>` as outermost root;
  existing `<MotionCard hoverState={hoverLift} tapState={tapShrink} style={{ height: '100%' }}>` stays
  inside. The Y-translate (lift) and rotateX/Y (tilt) operate on independent CSS transform properties
  and compose cleanly.

## Execution steps

1. Add `springOptions` export to `src/motion/tokens.ts`.
2. Add `MotionTiltCard` component to `src/motion/components.tsx` (update imports, add component).
3. Re-export `MotionTiltCard` and `springOptions` from `src/motion/index.ts`.
4. Convert `src/components/photography/TiltCard.tsx` to re-export shim.
5. Update `src/components/AnimatedContentList.tsx`: import `MotionTiltCard` from `'../motion'`; rename JSX.
6. Update `src/pages/Photography.tsx`: import `MotionTiltCard` from `'../motion'`; rename JSX.
7. Wrap terminal card in `src/pages/Home.tsx`.
8. Wrap content in `src/components/header/HintPopover.tsx`.
9. Compose `src/components/blog/BlogPostCard.tsx` with `MotionTiltCard`.
10. Update `test/unit/components/photography/TiltCard.test.tsx`: add `useReducedMotion` mock; add
    `intensity` and `disabled` smoke tests.
11. `npm run build` — confirm no TypeScript errors.
12. `CI=true npm test -- --testPathPattern=TiltCard` — confirm tests pass.
13. Browser-validate `/photography`, `/cv`, `/`, `/blog`, and hint popover.

## Validation plan

- `npm run build`
- `CI=true npm test -- --testPathPattern=TiltCard`
- Browser: `/photography` — both TiltCard usages unchanged visually; no tilt regression.
- Browser: `/cv` — CV content cards tilt on hover; panel surface and layout intact.
- Browser: `/` — Terminal shell tilts after entrance animation completes; scroll parallax unaffected.
- Browser: `/blog` — BlogPostCard tilt + hover lift compose cleanly; no stutter or axis conflict.
- Browser: hint popover (trigger welcome sequence) — tilt fires on hover; no corner clipping.
- Mobile (375px): all routes — tilt is no-op on touch; cards render correctly.
- DevTools `prefers-reduced-motion: reduce`: tilt fully suppressed on all surfaces.

## Risks and rollback

- **Shim import chain validity:** `TiltCard.tsx` → `'../motion'` → `src/motion/index.ts` →
  `components.tsx`. Not circular. Both consumers are updated to the canonical import simultaneously,
  so the shim is a belt-and-suspenders safety net, not a long-term dependency.
- **Spring config type narrowness:** `springOptions.tilt` infers literal types
  `{ readonly stiffness: 200; readonly damping: 20 }`. These are assignable to `SpringOptions`; no
  cast needed. Add `as { stiffness: number; damping: number }` only if compilation fails.
- **Ancestor 2D transform flattening (Home hero):** The outer scroll-driven `motion.div` applies
  `scale`/`opacity`, which technically creates a 2D stacking context. The inner `MotionTiltCard`'s
  `preserve-3d` is flattened by this ancestor, but `rotateX`/`rotateY` still render visually as
  perspective tilt. Acceptable for the intended subtle effect.
- **HintPopover corner clipping:** MUI Paper has `overflow: hidden` by default; at `intensity={0.5}`
  the max rotation is ±3° per axis — negligible overflow. If clipping is observed, add
  `overflow: 'visible'` to `PaperProps.sx`.
- **BlogPostCard height contract:** `style={{ height: '100%' }}` added to both `MotionTiltCard` and
  `MotionCard` to ensure the height propagation chain from the containing grid cell is preserved.
- **Rollback:** Restore `TiltCard.tsx` to original implementation; restore original import lines in
  `AnimatedContentList.tsx` and `Photography.tsx`; remove `MotionTiltCard` wrappers from `Home.tsx`,
  `HintPopover.tsx`, and `BlogPostCard.tsx`; remove `MotionTiltCard`/`springOptions` additions from
  `src/motion/`.

## Progress notes

- Plan written 2026-03-17. Proceeding with implementation.
- Implementation complete 2026-03-17.
  - Shim path fixed: `src/components/photography/TiltCard.tsx` re-exports from `'../../motion'` (not `'../motion'`).
  - `npm run build` passes cleanly.
  - All 8 TiltCard unit tests pass including new `intensity`, `disabled`, and will-change coverage checks.
  - All 29 Playwright E2E tests pass across `/`, `/cv`, `/blog`, `/photography`, `/climbing`, and 404 routes.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
