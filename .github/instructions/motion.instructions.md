---
applyTo: 'src/motion/**/*.ts,src/motion/**/*.tsx'
---

These files are the shared Motion foundation for animation tokens, variants, and animated primitives. Keep motion values centralized and reusable.

- Honor the global intensity contract through `useMotionScale()` so motion can collapse to instant rendering when intensity is `off` or reduced motion is requested.
- Import durations, easing, and IntersectionObserver defaults from `tokens.ts` instead of hardcoding them in consumers.
- Prefer the existing animated primitives (`MotionSection`, `MotionFadeIn`, `MotionScaleIn`, `StaggerChildren`, `MotionItem`, `MotionCard`, `MotionImage`, `MotionTiltCard`) before adding a new wrapper.
- Put reusable `Variants` objects in `variants.ts` and reusable animated wrappers in `components.tsx`.
- Keep `tokens.ts` plain TypeScript and re-export new motion additions from `index.ts`.
- Respect the boundary with `src/styles/`: Motion-library concerns live here, CSS/MUI animation concerns live there.

For more detail, follow `src/motion/AGENTS.md`.
