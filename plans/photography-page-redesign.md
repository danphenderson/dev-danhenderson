# Photography Page Redesign — Dark Immersive

## Status: IN PROGRESS

## 1. Goal

Redesign the `/photography` index and `/photography/:slug` detail pages with a dark/immersive, image-forward aesthetic. The index page gets a featured hero album card (full-width cinematic aspect ratio) above a 2–3 column supporting grid where all card text is overlaid atop imagery with bottom-anchored dark gradients. Album cards have a perspective-tilt hover interaction. The detail page gains a cinematic full-bleed cover image header with overlaid title and metadata. The broken `QuiltedImageList` (missing `variant="quilted"`) is fixed.

## 2. Why

- The existing photography index stacks five album cards vertically with minimal spacing and traditional card layouts (image above, text below). The visual density and lack of image prominence undercuts a photography portfolio.
- The `ImageList` on album detail pages is rendered without `variant="quilted"`, causing MUI to ignore `cols`/`rows` on `ImageListItem` and produce a single-column vertical stack instead of a quilted grid.
- The existing detail page header is text-heavy and doesn't leverage the album's cover image for visual impact.

## 3. Constraints

- Must preserve SPA routing and `PUBLIC_URL` compatibility.
- Must preserve graceful slug-redirect behavior for `/photography/new%20mexico`.
- Must preserve the not-found `RouteRecoveryPanel` fallback on invalid slugs.
- No new dependencies — uses existing `motion/react`, MUI, and Emotion stack.
- Content flows from `src/data/photography.ts` via `usePhotographyData`.
- Must work in both light and dark MUI theme modes.

## 4. Affected files and responsibilities

| File                                       | Role                                                    |
| ------------------------------------------ | ------------------------------------------------------- |
| `src/types/data.ts`                        | Add `featured?: boolean` to `PhotoCategory`             |
| `src/data/photography.ts`                  | Set `featured: true` on Landscape album                 |
| `src/hooks/usePhotographyData.ts`          | Expose `featuredCategory` derived field                 |
| `src/styles/appStyleBuilders.ts`           | New tokens: hero, immersive card, overlay, detail cover |
| `src/components/photography/TiltCard.tsx`  | NEW — perspective tilt wrapper using motion values      |
| `src/components/photography/AlbumCard.tsx` | NEW — immersive album card (hero/grid variants)         |
| `src/pages/Photography.tsx`                | Full index redesign: hero + supporting grid             |
| `src/pages/PhotographyCategory.tsx`        | Cinematic cover header replaces text header             |
| `src/components/PhotoAlbum.tsx`            | Fix: add `variant="quilted"` + `cols` + `rowHeight`     |

## 5. Validation

- [x] `npm run build` — clean compile
- [ ] `CI=true npm test -- --watch=false` — no regressions
- [ ] Browser `/photography` — hero + grid layout, tilt effect, white overlaid text
- [ ] Browser `/photography/landscape` — cinematic cover, quilted grid with spanning
- [ ] Browser `/photography/action` — quilted fix on non-featured album
- [ ] Browser theme toggle — overlay text readable in both modes
- [ ] Direct navigation `/photography/new-mexico` — redirect still works

## 6. Risks and rollback

- **AlbumLocationSummary styling**: Component was designed for the existing text-header context. Its text color may need `sx` overrides to work against the dark overlay background. If it doesn't render well, it can be replaced with inline location + dateRange rendering.
- **Aspect ratio support**: `aspect-ratio` CSS property requires Safari 15+ / Chrome 88+. The existing `pt: '70%'` hack is preserved in `photographyMediaSx` for any other consumers, but the new tokens use native `aspect-ratio`.
- **Rollback**: Revert all files listed in section 4. The `featured` field on `PhotoCategory` is additive and non-breaking.

## 7. Decisions

- Hero album selected by `featured: true` flag in data, not sort order — editorially controllable.
- `TiltCard` wraps `AlbumCard` at page level (not inside AlbumCard) so `MotionItem` stagger inheritance stays clean.
- `AlbumCard` has `variant: 'hero' | 'grid'` — no separate HeroCard component.
- Old tokens (`photographyCardSx`, `photographyCardContentSx`) retained in the style builder for backward compatibility until all consumers are confirmed migrated.
