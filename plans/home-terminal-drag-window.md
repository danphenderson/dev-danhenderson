# Home Terminal Drag Window

## Goal

Allow the home-route VS Code hero window to be repositioned by dragging only its title bar, while keeping the window bounded to the BackgroundPaper content area.

## Why

The terminal hero currently presents as a desktop-style window, but it is fixed in place. Adding bounded title-bar dragging makes the UI behave more like the VS Code window it visually represents and satisfies the requested interaction without changing route structure or content.

## Constraints

- Preserve the current client-side SPA architecture and direct-link routing behavior.
- Keep the change narrowly scoped to the home hero and terminal component family.
- Do not introduce persistence; the window position resets on refresh.
- Support desktop fine-pointer devices only; touch and coarse-pointer layouts remain static.
- Preserve the existing HeroMotionPath entrance animation, typewriter sequence, command-palette toggle, and MotionTiltCard behavior.

## Affected files and responsibilities

- `src/components/BackgroundPaper.tsx`: expose an optional ref to the background content region used as the drag constraint container.
- `src/pages/Home.tsx`: own the draggable shell wrapper around the hero window and connect the title-bar drag handle to Motion drag controls.
- `src/components/TerminalHeroContent.tsx`: forward optional title-bar drag props into the terminal window chrome.
- `src/components/terminal/VscodeTitleBar.tsx`: act as the drag handle while preserving command-palette clicks and other no-drag interaction islands.
- `test/unit/components/TerminalHeroContent.test.tsx`: verify drag-handle props are forwarded and interactive behavior remains intact.
- `test/e2e/home.spec.ts`: verify the home hero can be dragged by the title bar and remains on screen.

## Proposed approach

Use Motion drag controls on an outer shell wrapper in `Home` so the full hero window moves together without being clipped by the shell's overflow handling. Pass a pointer-down drag-start handler into `TerminalHeroContent` and `VscodeTitleBar`, and stop propagation inside the command-palette trigger and action cluster so those controls remain clickable. Constrain dragging to the BackgroundPaper content box via a ref.

## Execution steps

1. Add a `contentRef` prop to `BackgroundPaper` and pass a ref from `Home`.
2. Wrap the animated home hero shell in a Motion draggable container using `dragControls`, bounded to the background content ref.
3. Pass drag-handle props from `Home` through `TerminalHeroContent` into `VscodeTitleBar`.
4. Add desktop-only gating and drag-state-driven cursor/tilt behavior.
5. Update targeted unit and Playwright coverage for drag behavior.

## Validation plan

- `CI=true npm test -- --watch=false --runTestsByPath test/unit/components/TerminalHeroContent.test.tsx test/unit/pages/Home.test.tsx`
- `npm run build`
- `npx playwright test test/e2e/home.spec.ts`
- Browser validation on `/` at desktop and narrow/mobile widths.

## Risks and rollback

- Dragging the wrong layer could cause clipping because the home shell currently uses overflow handling for the entrance animation.
- MotionTiltCard pointer tracking may conflict with drag if tilt is not disabled while dragging.
- If drag constraints feel unstable with the entrance animation wrapper, the safest rollback is to remove the draggable wrapper from `Home` and keep the title bar prop additions isolated.

## Progress notes

- Plan created before implementation.
- Implementation will target the outer home hero shell instead of the inner terminal root to avoid shell clipping.
- Implemented bounded title-bar dragging through the Home route wrapper, with drag props forwarded through TerminalHeroContent into VscodeTitleBar.
- Stabilized the hero window width by switching the shell to a fixed computed width plus max-width cap, avoiding shrink-to-fit drift during tab changes.
- Validated with targeted Jest, production build, Playwright home-route coverage, and live browser checks for desktop fine-pointer drag plus coarse-pointer drag suppression.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
