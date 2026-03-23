---
applyTo: 'src/types/**/*.ts'
---

These files are the canonical home for shared TypeScript types used across layers. Preserve the low-level dependency boundary and keep shared types centralized here.

- Keep `src/types/` as the canonical home for cross-layer shared types.
- Keep component-, page-, and hook-private types local when they have only a single consumer.
- Do not import upward from components, hooks, pages, or data into `src/types/`.
- Use `src/types/AGENTS.md` for domain placement and migration steps.

For more detail, follow `src/types/AGENTS.md`.
