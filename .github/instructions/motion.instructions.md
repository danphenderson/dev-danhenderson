---
applyTo: 'src/motion/**/*.ts,src/motion/**/*.tsx'
---

These files are the shared Motion foundation for animation tokens, variants, and animated primitives. Keep motion values centralized and reusable.

- Keep motion timing, stagger, and reduced-motion behavior flowing through `useMotionScale()`.
- Centralize reusable tokens, `Variants`, and animated primitives in `tokens.ts`, `variants.ts`, and `components.tsx`.
- Keep `tokens.ts` plain TypeScript and re-export new additions from `index.ts`.
- Respect the Motion-versus-CSS boundary documented in `src/motion/AGENTS.md`.

For more detail, follow `src/motion/AGENTS.md`.
