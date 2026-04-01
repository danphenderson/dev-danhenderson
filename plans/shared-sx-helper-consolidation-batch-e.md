# Shared Sx Helper Consolidation Batch E

## Goal

Establish one canonical helper path for composing default MUI `sx` layers with caller-provided `sx`, while preserving the current rendering behavior of shared text primitives and a small set of shared wrapper components.

## Why

The repository currently has two overlapping patterns for the same job:

- `normalizeSxProp()` in `src/utils/sx.ts` normalizes caller-provided `sx` into an array for spread composition.
- `mergeSx()` in `src/components/text/textFactory.ts` performs a similar merge for text primitives by flattening default layers and appending caller `sx`.

That split makes the intended composition path less clear and leaves the same default-plus-caller merge logic repeated across shared wrappers. Batch E should make `src/utils/sx.ts` the canonical owner of the merge helper, keep compatibility for current text consumers, and convert only the obvious wrapper components that already follow the exact same composition pattern.

## Constraints

- Preserve SPA routing, direct-link behavior, static-hosting compatibility, and `PUBLIC_URL`-safe asset handling.
- Keep changes narrowly scoped to sx helper structure and direct helper consumers.
- Do not redesign the text system, text roles, typography mapping, style builders, or theme tokens.
- Do not widen this cleanup into Home / IDE files, recovery logic, static-data hooks, or unrelated compatibility cleanup.
- Avoid broad mechanical churn across every `normalizeSxProp()` call site.
- Preserve existing public exports used by text consumers unless a compatibility alias is kept.

## Affected files and responsibilities

- `src/utils/sx.ts`: Canonical helper ownership for sx normalization and default-plus-caller composition.
- `src/components/text/textFactory.ts`: Compatibility export surface for `mergeSx` used by text-related imports.
- `src/components/text/Text.tsx`: Shared text primitive that composes resolved typeset `sx` with caller `sx`.
- `src/components/text/TypewriterText.tsx`: Shared typewriter primitive using layered `sx` composition.
- `src/components/text/TypewriterLoopText.tsx`: Looping typewriter primitive using layered `sx` composition.
- `src/components/ContentCard.tsx`: Shared wrapper with a single base style layer plus caller `sx`.
- `src/components/layout/SectionPanel.tsx`: Shared panel wrapper with a single base style layer plus caller `sx`.
- `src/components/BackgroundPaper.tsx`: Shared background shell/content wrapper with base style layers plus caller `sx`.
- `src/components/cv/CVSectionCard.tsx`: Shared CV wrapper over `SectionCard` with base style layer plus caller `sx`.
- `test/unit/utils/sx.test.ts`: Canonical helper behavior coverage.
- `test/unit/components/text/textFactory.test.ts`: Compatibility/export coverage for the text-layer helper surface.
- `test/unit/components/text/Text.test.tsx`: Shared text primitive behavior coverage.
- `test/unit/components/text/TypewriterText.test.tsx`: Shared typewriter primitive behavior coverage.
- `test/unit/components/ContentCard.test.tsx`: Shared wrapper behavior coverage if touched.
- `test/unit/components/layout/SectionPanel.test.tsx`: Shared wrapper behavior coverage if touched.
- `test/unit/components/BackgroundPaper.test.tsx`: Shared wrapper behavior coverage if touched.
- `test/unit/components/cv/CVSectionCard.test.tsx`: Shared wrapper behavior coverage if touched.

## Proposed approach

Make `src/utils/sx.ts` the source of truth for both helpers, with a clear split in responsibilities:

1. `normalizeSxProp()` remains the low-level utility for normalizing arbitrary caller `sx` into an array.
2. `mergeSx()` moves into `src/utils/sx.ts` as the canonical utility for the common pattern of merging one or more default `sx` layers with caller-provided `sx`.
3. `src/components/text/textFactory.ts` stops owning merge logic and instead re-exports the canonical helper so current text imports remain stable.
4. Update only the in-scope shared wrappers that already implement the same `base sx + caller sx` pattern inline.
5. Leave more custom `normalizeSxProp()` uses alone where callers need direct access to normalized arrays or build more complex compositions.

This keeps the change small, clarifies when to use each helper, and avoids bulk rewrites across unrelated components.

## Execution steps

1. Add the ExecPlan and capture the selected narrow scope for helper ownership and wrapper migration.
2. Move `mergeSx()` into `src/utils/sx.ts` and keep `textFactory.ts` as a compatibility re-export.
3. Update the text primitives to import the canonical helper directly.
4. Convert the allowed wrapper components that follow the simple default-plus-caller merge pattern.
5. Update focused tests so utility behavior is owned by `sx.test.ts` and textFactory coverage verifies compatibility.
6. Run the required build, focused Jest coverage, and browser validation on two consuming routes in desktop and narrow/mobile viewports.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watchAll=false --runInBand test/unit/utils/sx.test.ts test/unit/components/text/textFactory.test.ts test/unit/components/text/Text.test.tsx test/unit/components/text/TypewriterText.test.tsx test/unit/components/ContentCard.test.tsx test/unit/components/layout/SectionPanel.test.tsx test/unit/components/BackgroundPaper.test.tsx test/unit/components/cv/CVSectionCard.test.tsx`
- Browser validation on `/cv` and one additional consumer route in one desktop viewport and one narrow/mobile viewport

## Risks and rollback

- The main regression risk is changing `sx` array ordering, which could silently alter precedence in shared wrappers or text primitives.
- A second risk is widening the change too far by converting components that do more than a simple default-plus-caller merge.
- Keep `textFactory.ts` as a compatibility export so rollback remains localized to helper ownership rather than import churn.
- If any wrapper conversion causes style regressions, revert that wrapper to inline array composition while keeping the helper ownership cleanup intact.

## Progress notes

- Initial inspection shows `mergeSx()` is only used in text primitives plus `CVAboutBioTypewriter`, while several shared wrappers duplicate the same default-plus-caller composition pattern with `normalizeSxProp()`.
- `TypewriterLoopText` currently has no direct component test, so the focused validation set will rely on build coverage plus the other text/shared wrapper suites unless implementation reveals a need for a new direct test.
- The chosen scope intentionally leaves more custom `normalizeSxProp()` consumers alone, such as animated list helpers and page frame composition.
- Completed implementation by moving canonical `mergeSx()` ownership into `src/utils/sx.ts`, keeping `src/components/text/textFactory.ts` as a compatibility re-export, and converting only the approved shared wrappers that matched the simple default-plus-caller merge pattern.
- Validation passed with `npm run build`, focused Jest coverage for the touched helper and wrapper suites, and browser checks on `/cv` and `/photography` in both desktop and narrow production viewports with no horizontal overflow detected.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
