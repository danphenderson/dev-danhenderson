# Photography Metadata, Immersive Mode, and Sharing

## Goal

Expand the photography data model with richer per-photo and per-album metadata (location, date, coordinates, tags), then deliver three UI features on top of that foundation: an immersive lightbox for full-screen photo browsing, a location-aware album summary, and SPA-safe slug-aware sharing surfaces on album pages.

## Why

The current photography module uses a minimal schema (`PhotoItem` with `img`, `title`, `rows`, `cols`; `PhotoCategory` with `slug`, `name`, `description`, `src`, `album`). Photos lack location, date, and coordinate data that would support richer browsing, discoverability, and sharing. The album view has no full-screen viewing mode, no location context, and no way to share a specific album URL from the UI. This is execution step 7 of the v1 stretch-goals integration plan.

## Constraints

- Preserve the fully client-side SPA architecture.
- Schema changes must land before any UI features that depend on them.
- Do not add new runtime dependencies unless the feature cannot be built cleanly with the existing stack.
- Do not modify climbing or CV data modules.
- Preserve existing photography E2E and unit test behavior.
- Keep the immersive lightbox keyboard-accessible and Escape-closable.
- Sharing must be SPA-safe: generate client-side URLs using the existing route model; do not assume server-rendered OG previews.
- Preserve `PUBLIC_URL`-compatible asset resolution.

## Affected files and responsibilities

- `src/types/data.ts`: Extend `PhotoItem` and `PhotoCategory` types with optional metadata fields.
- `src/data/photography.ts`: Populate enriched metadata for existing albums and photos.
- `src/hooks/usePhotographyData.ts`: Derive album-level metadata summaries (photo count, location list, date range).
- `src/components/photography/ImmersiveLightbox.tsx` (new): Full-screen photo viewer with keyboard navigation.
- `src/components/photography/AlbumShareButton.tsx` (new): SPA-safe share/copy-URL button.
- `src/components/photography/AlbumLocationSummary.tsx` (new): Location metadata display for albums.
- `src/pages/PhotographyCategory.tsx`: Wire lightbox, sharing, and location summary into album view.
- `src/pages/Photography.tsx`: Show enriched category metadata (photo count, location hint).
- `src/constants/commandPaletteActions.ts`: Enrich photography album action keywords with new metadata.
- `src/styles/appStyleBuilders.ts`: Add styles for lightbox, share button, and location summary.
- `test/unit/hooks/usePhotographyData.test.ts`: Cover derived metadata.
- `test/unit/components/PhotoAlbum.test.tsx`: Cover lightbox trigger behavior.
- `test/e2e/photography.spec.ts`: Add lightbox and sharing E2E coverage.
- `plans/v1-stretch-goals-integration.md`: Update progress notes.

## Proposed approach

### Slice 1 — Schema expansion (land first)

Add optional fields to `PhotoItem` (`location`, `dateTaken`, `tags`, `coordinates`) and `PhotoCategory` (`location`, `dateRange`, `coordinates`). Populate real metadata for existing albums in `src/data/photography.ts`. All new fields are optional so existing consumers remain compatible without changes.

### Slice 2 — Immersive lightbox

Build `ImmersiveLightbox` as a MUI Dialog-based overlay. It receives the album array and a selected index. Keyboard controls: left/right arrows for navigation, Escape to close. Shows photo metadata (title, location) as an overlay. Download button present. Wired into `PhotographyCategory` via click handler on `QuiltedImageList` items.

### Slice 3 — Location summary

Build `AlbumLocationSummary` to display the album's primary location and unique photo locations. This is a simple metadata display, not a full interactive map — coordinates are stored in the schema for future map integration but the initial UI renders location text and an optional static visual.

### Slice 4 — Slug-aware sharing

Build `AlbumShareButton` using the Web Share API where available, with clipboard-copy fallback. Generates the canonical album URL from the route model. Placed in the album header on `PhotographyCategory`.

### Slice 5 — Hook and palette enrichment

Extend `usePhotographyData` to return derived album metadata (unique locations, date range, total photos). Update command palette actions with enriched keywords from the new metadata.

## Execution steps

1. [x] Extend `PhotoItem` and `PhotoCategory` types in `src/types/data.ts`.
2. [x] Populate metadata in `src/data/photography.ts` for all existing albums.
3. [x] Build immersive lightbox component and wire into album view.
4. [x] Build album location summary component and wire into album header.
5. [x] Build slug-aware share button and wire into album header.
6. [x] Extend `usePhotographyData` with derived metadata.
7. [x] Enrich command palette photography actions with new keywords.
8. [x] Update unit tests and E2E tests.
9. [x] Validate with build, tests, and browser.

## Validation plan

- `npm run build`
- `CI=true npm test -- --watch=false`
- `npx playwright test test/e2e/photography.spec.ts`
- Browser validation on `/photography` and `/photography/landscape` at desktop and mobile viewports.
- Verify lightbox opens on photo click, navigates with arrow keys, closes with Escape.
- Verify share button copies URL or triggers Web Share API.
- Verify location summary renders for albums with location data.

## Risks and rollback

- Schema additions are all optional fields, so rollback is safe: remove new fields and UI consumers independently.
- Lightbox keyboard shortcuts could conflict with command palette (`/` and `Cmd+K`). Mitigation: lightbox captures only arrow keys and Escape; other shortcuts remain global.
- Static image assets are unchanged; no risk to existing photo rendering.
- If any slice breaks build or tests, revert that slice's files independently since each feature is additive.

## Progress notes

- Status: Complete
- Slice 1 complete: Extended `PhotoItem` with `location`, `dateTaken`, `tags`, `coordinates` (all optional); extended `PhotoCategory` with `location`, `dateRange`, `coordinates` (all optional); added `PhotoCoordinates` type. Populated metadata for all 4 existing albums (landscape, action, astronomy, new-mexico) with real location data, tags, and coordinates.
- Slice 2 complete: Built `ImmersiveLightbox` as a full-screen MUI Dialog with keyboard navigation (←/→ arrows, Escape to close), photo counter, metadata overlay (title, location), and download button. Wired into `PhotographyCategory` via `onPhotoClick` on `QuiltedImageList` items. Photos are now clickable with button role and keyboard support (Enter/Space).
- Slice 3 complete: Built `AlbumLocationSummary` showing album-level location, date range, and unique per-photo location chips. Renders nothing gracefully when no location data is present.
- Slice 4 complete: Built `AlbumShareButton` using Web Share API with clipboard-copy fallback. Generates canonical album URL from route model and `PUBLIC_URL`. Shows copied feedback with icon swap and tooltip change.
- Slice 5 complete: Extended `usePhotographyData` with `albumMeta` (derived unique locations, photo count, date range per album) and `totalPhotos`. Enriched command palette photography actions with location keywords and tag keywords from metadata.
- Photography index page now shows location, date range, and photo count per category card.
- Fixed pre-existing test assertion in `PhotographyCategory.test.tsx` (overline text was "Photography album" not "Photography").
- Validation actually run: `npm run build` (compiled successfully), `CI=true npm test -- --watch=false` (photography suites all pass; pre-existing CV and reduced-motion failures unrelated), `npx playwright test test/e2e/photography.spec.ts` (5/5 passed), browser validation on `/photography` and `/photography/landscape` at desktop viewport with lightbox open/close/navigate, share button, and location summary verified.
- Map view scope note: Coordinates are stored in the schema for future interactive map integration. The initial UI renders a location-text summary with per-photo location chips rather than a full mapping library, keeping the dependency footprint minimal. A mapping library (e.g., Leaflet) can be added later if desired.

## Completion Status

- [ ] Not started
- [ ] In progress
- [x] Complete
