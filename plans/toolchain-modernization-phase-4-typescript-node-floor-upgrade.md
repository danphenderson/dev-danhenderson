# Toolchain Modernization Phase 4 TypeScript Node Floor Upgrade

## Goal

Raise the main app to a current TypeScript 5.6 baseline and declare Node 20 as the supported toolchain floor, now that the CRA-era build, test, and lint constraints are gone.

## Why

The repo already runs CI on Node 20 and the docs site already uses TypeScript 5.6, but the main app still carries TypeScript 4.9, Node 16 type definitions, and an `es5` compiler target. This phase aligns the main app with the repo's actual platform baseline without expanding into a broader Vite or Jest ecosystem refresh.

## Constraints

- Keep the app fully client-side.
- Preserve SPA routing, direct-link behavior, and `PUBLIC_URL` compatibility.
- Keep this phase narrow: language/platform floor raise only.
- Do not fold in broader Vite, Jest, React, Router, or MUI major-version upgrades.
- Keep the current source-focused `typecheck` scope in place.
- Treat only TypeScript 5 / Node 20 fallout in app source and tooling as in-scope.

## Affected files and responsibilities

- `package.json`: raise `typescript`, raise `@types/node`, and declare the Node 20 engine floor.
- `package-lock.json`: lockfile refresh for the new TypeScript and Node type packages.
- `tsconfig.json`: raise the compiler target from `es5` to a modern baseline.
- `README.md`: document the Node 20 / TypeScript 5.6 main app baseline.
- `AGENTS.md`: align the repo stack/runtime note with the main app toolchain floor.
- `docs/project/overview.md`: reflect the main app TypeScript baseline in the project summary.

## Proposed approach

Upgrade only the main app's language/platform floor and the minimum metadata that should move with it. Keep the current standalone Jest, ESLint, and Vite configuration structure intact. Verify whether `ts-jest` remains compatible with TypeScript 5.6 during validation and only adjust it if the upgrade exposes a real incompatibility.

## Execution steps

1. Add this ExecPlan and keep it updated during implementation.
2. Raise `typescript` to the 5.6 line, raise `@types/node` to the Node 20 line, and add `engines.node` in `package.json`.
3. Raise the compiler target in `tsconfig.json` to a modern baseline while preserving the current strictness and module settings.
4. Align the small set of repo docs that should explicitly reflect the new floor.
5. Validate `npm run typecheck`, `npm run lint`, a focused standalone Jest pass, `npm run build`, `npm run build:e2e`, and `npm run build && npm run test:e2e:smoke`.

## Validation plan

- `npm run typecheck`
- `npm run lint`
- `npm test -- --watchAll=false --runInBand --testPathPattern=test/unit/utils/appEnvironment.test.ts test/unit/utils/buildInfo.test.ts test/unit/constants/featureFlags.test.ts test/unit/components/AppErrorBoundary.test.tsx`
- `npm run build`
- `npm run build:e2e`
- `npm run build && npm run test:e2e:smoke`

## Risks and rollback

- Risk: TypeScript 5.6 can surface new app-source type errors that were previously tolerated under 4.9.
- Risk: `ts-jest` compatibility may require a small companion bump even though the phase is otherwise narrow.
- Risk: raising the compiler target can expose code that accidentally depended on older transpilation behavior.
- Rollback is contained to the files above; if the floor raise regresses the repo, restore the previous TypeScript, Node type, and `tsconfig` baseline without disturbing the completed Vite/Jest/ESLint cutovers.

## Progress notes

- 2026-03-22: Started the main app TypeScript / Node floor raise after completing the standalone Jest/ESLint/typecheck cutover.
- 2026-03-22: Raised the main app to TypeScript 5.6, upgraded `@types/node` to the Node 20 line, changed the compiler target from `es5` to `es2020`, and added an explicit `engines.node` floor of `>=20`.
- 2026-03-22: Kept the scope narrow by leaving Vite and Jest major versions unchanged; the only companion config change was suppressing the stale unsupported-TypeScript banner inherited from the `react-app` ESLint preset.
- 2026-03-22: Validated the floor raise with `npm run typecheck`, `npm run lint`, focused standalone Jest coverage, `npm run build:e2e`, and `npm run build && npm run test:e2e:smoke`.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
