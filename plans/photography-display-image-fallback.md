# Photography display-image fallback

## Goal

Keep photography imagery visible on `/photography` and `/photography/:slug` when a
generated display derivative under `/assets/display/` cannot be loaded, by falling
back to the original photograph that is always shipped at a stable, non-hashed path.

## Why

The reported screenshot shows every image on `/photography` broken: clipped `alt`
text where album covers belong and a black page background.

This was reproduced locally against the production build by making
`/assets/display/**` unavailable while leaving `public/assets/photography/**`
intact. The result matches the report exactly, which confirms the failure mode:

- the originals are present and serve fine
- the hashed display derivatives are the only source the UI ever requests
- no surface recovers, so a single derivative problem blanks the whole page

Real-world triggers for the same state include a stale service-worker cache or an
incomplete deploy of the content-hashed `assets/display/` output. The derivative
filenames embed a source hash, so they change whenever a source photo changes,
while the original path stays stable.

## Constraints

- Preserve responsive WebP selection and `sizes`/`srcSet` behavior on success.
- Preserve original download URLs, `PUBLIC_URL` compatibility, and SPA routing.
- No new dependencies; no changes to media generation or the service worker.
- Never retry more than once; never add a redundant image download.
- Keep `src/utils/` free of React and MUI imports.

## Affected files and responsibilities

- `src/utils/displayImages.ts`: shared one-time fallback helper.
- `src/components/photography/AlbumCard.tsx`: index covers + loading accounting.
- `src/pages/PhotographyCategory.tsx`: album detail cover.
- `src/components/PhotoAlbum.tsx`: album gallery tiles.
- `src/components/photography/ImmersiveLightbox.tsx`: full-screen viewer.
- `src/components/BackgroundPaper.tsx`: CSS page background.
- `test/unit/**`, `test/e2e/photography.spec.ts`: regression coverage.
- `README.md`: document the recovery behavior.

## Proposed approach

Add `applyOriginalImageFallback(image, source, publicUrl?)` to
`src/utils/displayImages.ts`. It resolves the original with the canonical
`resolvePublicAssetPath`, removes `srcset`/`sizes` so they cannot override the new
`src`, assigns the original, and returns whether a retry was started. Comparing the
current `src` against the original bounds it to a single attempt.

Wire it into the `onError` handler of every photography `<img>`. `AlbumCard` keeps
its loading indicator pending during the retry and settles only when the original
also fails, so the indicator continues to track real readiness.

`BackgroundPaper` paints via CSS, which has no error event, so it probes the one
URL the active breakpoint actually uses (chosen with the existing `useMediaQuery`
pattern) and swaps to the original on failure. Probing the same URL the background
requests reuses the browser cache instead of adding a download.

## Execution steps

1. Add the helper to `src/utils/displayImages.ts`.
2. Wire `onError` into the four photography image surfaces.
3. Add the breakpoint-aware probe to `BackgroundPaper`.
4. Add unit coverage for the helper, `AlbumCard`, and `BackgroundPaper`.
5. Add an e2e regression that fails derivatives and asserts decoded originals.
6. Validate, then open a PR onto `main`.

## Validation plan

- `CI=true npm test -- --watchAll=false` (targeted suites first)
- `npm run lint` and `npm run typecheck`
- `npm run media:check` and `npm run build`
- Browser validation of `/photography`, `/photography/landscape`, and `/` with
  derivatives removed and restored, at desktop and narrow viewports.

## Risks and rollback

- Leaving `srcset` set would silently override the fallback `src`; the helper
  removes it. Covered by unit and browser checks.
- Originals are larger, so they are requested only after a derivative fails.
- `BackgroundPaper` is shared, so `/` and not-found were validated as well. Its
  behavior is unchanged while derivatives load normally.
- Roll back the helper and its call sites together to restore prior behavior.

## Progress notes

- Reproduced and fixed; see PR for validation evidence.
- Playwright cannot launch locally (running as root) and the repo intentionally
  keeps `chromiumSandbox: true`, so the new e2e spec is left for CI, and browser
  validation was performed with the Playwright MCP browser instead.
- Known remaining debt, not addressed: `BlogHeroImage` has the same exposure.
  Header and CV avatars already degrade gracefully through MUI `Avatar` fallbacks.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
