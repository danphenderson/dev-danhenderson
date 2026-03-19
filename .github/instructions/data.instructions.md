---
applyTo: 'src/data/**/*.ts'
---

The `src/data/` directory contains source-of-truth content for the site. Keep data edits precise, schema-stable, and consistent with existing entries.

- Keep `src/data/` as typed source-of-truth content.
- Preserve stable field names, exports, and ordering semantics unless a schema change is explicitly required.
- When a schema change is necessary, update all affected consumers in the same change set.
- Respect the file-specific protections and validation expectations in `src/data/AGENTS.md`.

For more detail, follow `src/data/AGENTS.md`.
