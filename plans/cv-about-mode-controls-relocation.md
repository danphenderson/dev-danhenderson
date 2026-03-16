# CV About Mode Controls Relocation

## Goal

Move the CV mode UI elements currently rendered above the CV page into the About section card so the Full CV chip and Read my story toggle appear in the card's bottom-right area, visually aligned with the existing action speed dial and polished for production.

## Why

The current layout splits related controls across two visual regions: the About card holds profile actions while CV mode controls sit above the page. Bringing the mode controls into the About card improves cohesion and matches the intended UI direction shown in the reference screenshot.

## Constraints

- Preserve the existing client-side SPA architecture and route behavior.
- Keep story-mode toggle behavior driven by existing search-param logic.
- Avoid absolute-position hacks that are brittle across breakpoints.
- Keep the change narrowly scoped to the CV route and CV-specific components.
- Preserve existing About card content hierarchy and speed-dial behavior.

## Affected files and responsibilities

- `src/pages/CV.tsx`: removes page-level placement of the mode header and passes mode controls into the About section.
- `src/components/cv/CVAboutSection.tsx`: owns About section composition and will place the mode controls in the card footer area.
- `src/components/cv/ProfileCard.tsx`: keeps existing top-right actions placement for the speed dial.
- `src/components/cv/CVStoryHeader.tsx`: adapts the mode control presentation for embedded card usage.
- `src/styles/componentStyleBuilders.ts`: supplies any shared style tokens needed for the new footer layout.

## Proposed approach

Keep the speed dial where it already belongs in `ProfileCard`, and move the mode controls into `CVAboutSection` as a second control region rendered after the opportunities/workflow rows. Reuse `CVStoryHeader` as the presentation layer, but add a compact embedded variant that renders without the intro copy and supports right-aligned layout inside the card footer. This keeps the toggle logic in the page, preserves the existing CTA copy source, and avoids duplicating UI markup.

## Execution steps

1. Update `CVStoryHeader` to support an embedded/footer presentation suitable for the About card.
2. Extend `CVAboutSection` to accept and render mode controls in a footer area aligned to the card's right edge.
3. Update `CV.tsx` to pass the header into the About section and remove the old page-level rendering.
4. Add or adjust component style tokens needed for spacing/alignment consistency.
5. Run targeted validation for compile safety and browser rendering on the CV route.

## Validation plan

- `npm run build`
- Browser validation of `/cv` on desktop and mobile viewports
- Verify default mode and story-mode toggle still switch correctly and the speed dial remains usable

## Risks and rollback

- Moving controls into the About card can create cramped mobile layouts if alignment is too rigid.
- Reusing `CVStoryHeader` in a second layout mode can unintentionally alter story-view behavior.
- Rollback is isolated to the CV page and CV-specific components; restoring the prior page-level placement is straightforward.

## Progress notes

- Plan created before implementation.
- Implemented an embedded `CVStoryHeader` variant and rendered it in the `CVAboutSection` footer instead of above the page.
- Kept the existing speed dial in `ProfileCard`; desktop validation confirmed the speed dial, Full CV chip, and Read my story button share the same right edge.
- `npm run build` passed.
- Browser validation on the production build at `/cv` passed on desktop and mobile. Story-mode toggle still updates the page title to `My Story | Daniel Henderson`.
- Browser console showed existing GitHub API resource failures during CV page loads; these are unrelated to the control relocation and consistent with the page's fallback-aware GitHub sections.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
