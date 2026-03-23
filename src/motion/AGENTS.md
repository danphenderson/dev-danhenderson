# AGENTS.md

## Scope

These instructions apply to files under `src/motion/`.

## Purpose

This directory is the unified animation foundation. It provides duration tokens, easing, stagger timings, reusable Motion `Variants` objects, IntersectionObserver defaults, and pre-built animated React primitives.

Source-of-truth doc: `docs/frontend/motion-architecture.md`.

Files:

- `tokens.ts` — `duration` (seconds), `cssDuration` (CSS strings), `easing`, `stagger`, `transition` presets, `DEFAULT_INTERSECTION_THRESHOLD`, and `DEFAULT_INTERSECTION_ROOT_MARGIN`. Import from here instead of hard-coding timing values in components.
- `variants.ts` — Motion `Variants` objects: `fadeInUp`, `fadeIn`, `scaleIn`, `staggerContainer`, `hoverLift`, `tapShrink`, `hoverZoom`, plus CV story-specific variants (`storySlideVariants`, `slideContentContainer`, `slideContentItem`).
- `components.tsx` — animated React primitives built on the above: `MotionSection`, `StaggerChildren`, `MotionItem`, `MotionCard`, `MotionImage`, `MotionFadeIn`, `MotionScaleIn`, and `MotionTiltCard`. These wrap `motion/react` with IntersectionObserver-triggered entry and sensible defaults.
- `index.ts` — re-exports everything above. Always import from `'../motion'` (or `'../../motion'`) rather than deep sub-paths.

## Rules

- All Framer Motion timing must flow through `useMotionScale()`. When motion intensity is `off` — either explicitly or because `prefers-reduced-motion` is active — entrance animations and stagger delays must collapse to instant rendering.
- Import animation tokens from `src/motion/tokens.ts`, not from `src/styles/`. (`SPRING_EASING_CSS` and `SPRING_EASING_MOTION` live in `src/styles/springEasing.ts` and are already used inside `tokens.ts` for the easing constants — do not re-import them independently in components.)
- Do not hard-code duration strings (`'0.35s'`, `350ms`) in component files. Use `cssDuration.*` or `duration.*`.
- Do not hard-code IntersectionObserver `threshold` or `rootMargin` values in components. Use `DEFAULT_INTERSECTION_THRESHOLD` and `DEFAULT_INTERSECTION_ROOT_MARGIN` from `tokens.ts`.
- New reusable `Variants` objects go in `variants.ts`. Page- or component-specific one-off variant objects may stay local only when they are genuinely not reused.
- Prefer the existing primitives (`MotionSection`, `MotionFadeIn`, `MotionScaleIn`, `StaggerChildren`, `MotionItem`, `MotionCard`, `MotionImage`, `MotionTiltCard`) before introducing a new wrapper. New animated primitives (wrappers over `motion/react` elements) go in `components.tsx`.
- Keep `tokens.ts` free of React imports; it must remain plain TypeScript.
- Re-export new additions from `index.ts` so consumers use the unified import path.

## Relationship to `src/styles/`

`src/motion/` handles the Motion library (framer-motion) side: `Variants`, duration tokens, the `motion.*` element primitives. `src/styles/` handles the CSS/MUI side: `transition` string constants, Emotion `keyframes`, and theme-conditioned `sx` maps. The boundary is the animation mechanism: if it uses the Motion library API, it belongs in `src/motion/`; if it uses CSS `transition`, MUI `sx`, or Emotion `keyframes`, it belongs in `src/styles/`.
