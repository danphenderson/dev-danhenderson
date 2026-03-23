---
applyTo: 'src/styles/**/*.ts,src/styles/**/*.tsx'
---

These files define shared style builders, keyframes, and spring easing for CSS- and MUI-driven animation. Preserve the existing theme-to-style boundary.

- Keep reusable appearance-driven surfaces in the style builders rather than inline `sx`.
- Keep style-builder modules pure `Theme`-based functions.
- Put shared keyframes in `animations.ts` and use duration tokens from `src/motion/tokens.ts`.
- Follow `src/styles/AGENTS.md` for builder ownership and CV-wide timing impact.

For more detail, follow `src/styles/AGENTS.md`.
