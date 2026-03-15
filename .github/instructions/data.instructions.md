---
applyTo: "src/data/**/*.ts"
---

The `src/data/` directory contains source-of-truth content for the site. Keep data edits precise, schema-stable, and consistent with existing entries.

- Prefer editing existing typed objects and arrays over introducing new loading patterns.
- Preserve stable field names, exports, ordering semantics, and high-level shapes unless a schema change is explicitly required.
- When a schema change is necessary, update the corresponding consumers in `src/types/`, hooks, pages, and components in the same change set.
- Do not edit climbing or photography datasets unless the task explicitly requests it.
- Validate that changed data still matches consuming types and renders through existing pages and hooks.

For more detail, follow `src/data/AGENTS.md`.
