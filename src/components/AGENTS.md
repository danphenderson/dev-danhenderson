# AGENTS.md

## Scope

These instructions apply to files under `src/components/`.

## Purpose

This directory contains shared UI building blocks and CV-specific presentational components.

Edits here should preserve:

- component reusability
- predictable props and rendering behavior
- consistency with the existing MUI and Emotion patterns
- visual stability across pages that consume shared components

Source-of-truth docs:

- `docs/design-system-reference.md`
- `docs/frontend/component-architecture.md`

## Component design rules

- Prefer minimal, targeted edits to the existing component API.
- Preserve public props and default behavior unless a breaking change is required for correctness or explicitly requested.
- Start with the documented shared primitives before inventing a new pattern: `SectionHeading`, `SectionCard` / `CVSectionCard`, `SectionPanel`, semantic text primitives under `src/components/text/`, and repeated-content primitives such as `AnimatedContentList`, `AnimatedSlideList`, and `SkillsChipList`.
- Prefer composition over widening a component into a highly configurable catch-all.
- Keep components focused on presentation and local interaction; avoid moving route-level orchestration into shared components.
- Prefer semantic text primitives over styling raw `Typography` for standard labels, headings, metadata, and body copy.
- Reuse existing patterns for typography, spacing, cards, section containers, lists, and data display before introducing a new UI pattern.
- Follow existing MUI usage and styling conventions already present in the component family being edited.
- Treat the Home IDE hero as an intentional design-system exception. CV story mode is a bounded exception via `UnsafeTypography`. Blog uses the shared `Text` component with prose roles; photography uses `Text` with inverse-tone overlay context. Do not normalize the IDE hero or CV story mode into the default shared card-and-section system.

## Type handling

- Component-private props interfaces with a single consumer (the component itself) stay in the component file.
- Types consumed by more than one file — including types defined here that pages or hooks also import — belong in `src/types/ui.ts`. Move them there and keep a `export type { ... }` re-export in the component file to preserve existing import paths.
- Do not import types from `src/hooks/` in component files. If a hook-defined type is needed by a component, it belongs in `src/types/` (and the hook can re-export from there).
- Do not define types in component files that are then re-imported by pages or other components without a re-export. That creates hidden cross-layer coupling.

## Stricter UI-edit behavior

- Treat edits to shared components as potentially multi-route changes.
- Before changing markup or styling structure, consider all likely consumers.
- Avoid “cosmetic” tweaks that subtly alter spacing, typography scale, card density, or alignment across the application unless the task calls for it.
- Do not introduce animation, skeletons, hover effects, or transition behavior into shared components unless the change is intentional and validated in all affected contexts.
- Avoid hardcoded route assumptions or page-specific copy in shared components.
- Prefer extending via props or composition only when the added flexibility is clearly needed by current consumers.

## Styling rules

- Prefer local consistency with nearby components over inventing a new styling pattern.
- Do not hardcode theme logic that should come from the existing theme or context.
- Preserve accessibility-relevant states such as focus visibility, readable contrast, semantic heading usage, and keyboard interaction behavior.
- Be careful with one-line typography, truncation, fixed heights, and overflow rules; validate them with realistic content.

## Validation impact rules

A browser validation is required when a shared component change can affect:

- more than one route
- layout or spacing
- typography rendering
- responsive behavior
- interactive states
- loading/empty/error presentation
- cards, lists, grids, or media rendering
- route flows or fallback states already covered by Playwright E2E
- components used on `/cv` or other dense information pages

## Browser validation procedure

For shared component changes:

- validate at least one primary consuming route
- validate one additional consuming route when the component is clearly reused
- check at least one narrow/mobile viewport and one desktop viewport for layout-sensitive edits
- when the affected consumers are covered by Playwright E2E, run the relevant route specs after `npm run build` using the repo-standard Playwright command shape from `docs/engineering/testing-strategy.md`
- prefer validating shared component behavior through consuming route specs rather than adding broad E2E coverage unless a new route flow needs it
- for GitHub-backed CV components, prefer mocked `/cv` Playwright coverage over live API-dependent validation when the helper flow is available
- verify hover, focus, click, expand/collapse, or scroll-triggered behavior if applicable
- verify that surrounding content alignment and spacing still look intentional
- capture screenshots when the task is design-sensitive, review-oriented, or likely to affect visual polish
- close the browser session after validation

## Consumer awareness

Before broadening a shared component:

- identify the current consumers
- prefer adapting the narrowest layer possible
- avoid widening the component API for a one-off page requirement if a wrapper or page-local composition would be cleaner

## Scope control

- Do not rewrite a shared component solely to make it “more generic” unless reuse pressure is real.
- Do not mix styling cleanup, API redesign, and behavior changes in one pass unless required.
- Do not rename stable props, exports, or component files without updating all consumers in the same change.

## Planning alignment

- For shared component work that meets ExecPlan triggers, follow `PLANS.md` and create an ExecPlan before implementation.

## Final response expectations

Include:

- which components changed
- whether any public props or shared behavior changed
- which consuming routes or pages were affected
- what browser validation was actually performed
- any multi-consumer risks or technical debt noticed
