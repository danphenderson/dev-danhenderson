---
applyTo: 'src/styles/**/*.ts,src/styles/**/*.tsx'
---

These files define shared style builders, keyframes, and spring easing for CSS- and MUI-driven animation. Preserve the existing theme-to-style boundary.

- Put reusable theme-conditional surfaces in the style builders instead of inline component `sx` objects that read `theme.appearanceTreatment` directly.
- Keep style-builder files pure `Theme`-based functions with no hooks or React state.
- Add reusable keyframes to `animations.ts` instead of defining them inline in components.
- Use duration tokens from `src/motion/tokens.ts` rather than introducing new timing constants here.
- Reserve inline `sx` for one-off spacing or simple conditional visibility, not new shared surface treatments.
- Validate broader CV impact when changing shared component timing tokens.

For more detail, follow `src/styles/AGENTS.md`.
