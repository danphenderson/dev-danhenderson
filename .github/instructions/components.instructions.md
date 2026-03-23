---
applyTo: 'src/components/**/*.ts,src/components/**/*.tsx'
---

These files are shared UI building blocks and CV-specific presentational components. Preserve component reusability, predictable props, and the documented design-system defaults before introducing a new pattern.

- Prefer minimal, targeted edits to existing public props and default behavior.
- Start with the documented shared primitives: text wrappers in `src/components/text`, `SectionHeading`, `SectionCard` / `CVSectionCard`, `SectionPanel`, and repeated-content primitives like `AnimatedContentList`, `AnimatedSlideList`, and `SkillsChipList`.
- Treat shared component changes as potentially multi-route changes and validate likely consumers before broadening an API.
- Keep route-level orchestration in pages and data adaptation in hooks; avoid moving that logic into shared components.
- Reuse nearby typography, spacing, card, list, and section-container patterns before introducing a new UI pattern.
- Treat the Home IDE hero, blog editorial surfaces, photography overlays, and CV story mode as intentional subsystem exceptions, not defaults to normalize into shared components.
- For layout, interaction, animation, or responsive changes, validate affected consumers using `src/components/AGENTS.md` and `docs/engineering/testing-strategy.md`.

For the concrete UI pattern catalog, see `docs/design-system-reference.md`. For more detail, follow `src/components/AGENTS.md`.
