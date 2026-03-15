---
applyTo: "src/components/**/*.ts,src/components/**/*.tsx"
---

These files are shared UI building blocks and CV-specific presentational components. Preserve component reusability, predictable props, and existing MUI + Emotion styling patterns.

- Prefer minimal, targeted edits to existing public props and default behavior.
- Treat shared component changes as potentially multi-route changes and validate likely consumers before broadening an API.
- Keep route-level orchestration in pages and data adaptation in hooks; avoid moving that logic into shared components.
- Reuse nearby typography, spacing, card, list, and section-container patterns before introducing a new UI pattern.
- For layout, interaction, animation, or responsive changes, validate at least one primary consuming route and one additional consumer when reuse is obvious.

For more detail, follow `src/components/AGENTS.md`.
