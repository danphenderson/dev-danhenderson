---
applyTo: 'src/types/**/*.ts'
---

These files are the canonical home for shared TypeScript types used across layers. Preserve the low-level dependency boundary and keep shared types centralized here.

- Move cross-layer types here without reshaping them during the move.
- Keep component-, page-, and hook-private types local when they only have a single consumer.
- Do not import from components, hooks, pages, or data into `src/types/`.
- Update all consumers in the same change set when making breaking type edits.

For more detail, follow `src/types/AGENTS.md`.
