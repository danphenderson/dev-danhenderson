# Page Choreography

This document explains how each major route is assembled, what motion sequencing it uses, and where page-level orchestration versus shared component concerns live.

For the motion primitive catalog, see [Motion architecture](motion-architecture.md). For the component layer, see [Component architecture](component-architecture.md).

## Route assembly overview

```mermaid
flowchart TB
  subgraph FullBleed["Full-bleed scaffold"]
    Home["/ Home<br/>BackgroundPaper + HeroMotionPath<br/>+ faux-IDE shell"]
    NF["/* NotFound<br/>BackgroundPaper + RouteRecoveryPanel"]
  end

  subgraph Standard["Standard scaffold (PageFrame)"]
    CV["/cv CV<br/>Grid layout: top · main · sidebar<br/>+ story mode"]
    Climbing["/climbing Climbing<br/>DataGrid + analytics"]
    Photo["/photography Photography<br/>StaggerChildren album grid"]
    PhotoCat["/photography/:slug<br/>Quilted grid + lightbox"]
    Blog["/blog Blog<br/>Hero + tag filter + post grid"]
    BlogPost["/blog/:slug BlogPost<br/>Article header + body + nav"]
  end
```

## Home (`/`)

The home page is the most orchestration-heavy route. It renders a faux-VS Code IDE as an interactive hero element.

### Assembly

```mermaid
flowchart TB
  BG["BackgroundPaper<br/>image: home.jpg"]
  HMP["HeroMotionPath<br/>spiral entry animation (3.6s)"]
  DragDiv["motion.div<br/>draggable window chrome"]
  Tilt["MotionTiltCard<br/>3D pointer-follow (desktop)"]
  ACC["AnimatedContentCard<br/>fade-in reveal"]
  THC["TerminalHeroContent<br/>VS Code shell:<br/>title bar · activity bar · explorer<br/>editor pane · terminal · status bar"]
  ScrollP["Scroll parallax<br/>heroScale (1→1.08)<br/>heroOpacity (1→0.6)"]
  Dialog["Welcome audio Dialog<br/>play / no thanks"]
  Portal["Expanded IDE portal<br/>fixed fullscreen"]

  BG --> HMP --> DragDiv --> Tilt --> ACC --> THC
  BG --> ScrollP
  BG -.-> Dialog
  DragDiv -.->|expanded| Portal
```

### Entrance sequence

```mermaid
sequenceDiagram
  participant Mount as Page mount
  participant BG as BackgroundPaper
  participant HMP as HeroMotionPath
  participant Shell as TerminalHeroContent
  participant TW as Terminal typewriter
  participant Audio as Welcome audio prompt

  Mount->>BG: Render background image + overlay
  BG->>HMP: Mount shell inside motion path
  HMP->>HMP: Measure final position
  HMP->>HMP: Spiral path (1.35 turns, 3.6s)
  Note over HMP: Scale: 1→0.85→1.1→0.92→1.04→1<br/>Rotate: 0→10°→-8°→5°→-2°→0
  HMP-->>Shell: onAnimationComplete
  Shell->>TW: Begin typewriter sequence
  TW->>TW: Type: node --version → v22.14.0
  TW->>TW: Type: git log → commit hash
  TW->>TW: Type: npm run build → ✓ Compiled
  TW->>TW: Type: whoami --passions → math · computers · adventures
  Mount->>Audio: Show audio consent dialog (if needed)
```

### Page-owned state

| State              | Purpose                                            |
| ------------------ | -------------------------------------------------- |
| `ideWindowState`   | normal / minimized / expanded                      |
| `ideWindowSize`    | width × height for resize                          |
| Drag constraints   | Bound to hero container via `heroBoundsRef`        |
| Typewriter playing | Triggered by `HeroMotionPath` completion           |
| Scroll transforms  | `heroScale` and `heroOpacity` from scroll progress |
| Welcome sequence   | Managed by `useHomeWelcomeSequence()` hook         |

### IDE window interactions

```mermaid
stateDiagram-v2
  [*] --> Normal: Initial render

  Normal --> Minimized: Click minimize
  Normal --> Expanded: Click expand
  Normal --> Dragging: Pointer down on title bar
  Normal --> Resizing: Pointer down on resize handle

  Minimized --> Normal: Click restore
  Expanded --> Normal: Click collapse
  Dragging --> Normal: Pointer up
  Resizing --> Normal: Pointer up

  Expanded --> Portal: Renders via createPortal to body
```

## CV (`/cv`)

The CV page has two modes: a default grid layout and an immersive story viewer.

### Default mode — assembly

```mermaid
flowchart TB
  PF["PageFrame<br/>background: cv.jpg"]
  Speed["AppSpeedDial<br/>download · contact actions"]

  subgraph Desktop["Desktop grid"]
    Top["top region<br/>About (order 0, delay 0ms)"]
    Main["main column<br/>Experience (delay 120ms)<br/>Education (delay 240ms)<br/>Volunteering (delay 360ms)<br/>Coding (delay 480ms)"]
    Sidebar["sidebar column<br/>GitHub (delay 120ms)<br/>Certificates (delay 240ms)"]
  end

  subgraph Mobile["Mobile stack"]
    Stack["CVSectionStack<br/>All sections in order 0–6<br/>All triggerOnView except About"]
  end

  PF --> Desktop
  PF --> Mobile
  PF --> Speed
```

### Section layout metadata

`src/pages/cvPageLayout.ts` defines per-section placement and motion timing:

| Section      | Desktop region | Desktop delay | Desktop triggerOnView | Mobile order |
| ------------ | -------------- | ------------- | --------------------- | ------------ |
| about        | top            | 0ms           | false (immediate)     | 0            |
| experience   | main           | 120ms         | true                  | 1            |
| education    | main           | 240ms         | true                  | 2            |
| volunteering | main           | 360ms         | true                  | 3            |
| github       | sidebar        | 120ms         | true                  | 4            |
| certificates | sidebar        | 240ms         | true                  | 5            |
| coding       | main           | 480ms         | true                  | 6            |

On mobile, all sections stack vertically with `delayMs: 0` and most use `triggerOnView: true` (viewport-triggered reveal).

### Within each section

Each `CVSection*` component wraps a `CVSectionCard` which contains:

1. `SectionHeading` (overline + title)
2. Feature content (list, profile card, GitHub panel, etc.)
3. Internal `AnimatedContentList` for repeated entries (with per-item stagger)
4. Optional `TabPanel` / `AnimatedSlideList` for expandable detail

### Story mode (`?mode=story`)

Activated via query parameter. Replaces the grid layout with `CVStoryViewer`:

```mermaid
sequenceDiagram
  participant Nav as CVStoryNavBar
  participant Viewer as CVStoryViewer
  participant Slide as CVStorySlideRenderer
  participant Content as Slide content

  Nav->>Viewer: Next / Previous
  Viewer->>Viewer: Update slide index + direction
  Viewer->>Slide: AnimatePresence swap
  Note over Slide: Enter: scale 0.88, blur 4px, x ±60<br/>Center: scale 1, blur 0, x 0<br/>Exit: scale 0.88, blur 4px, x ∓60
  Slide->>Content: Stagger content reveals
  Note over Content: 1. Label (x -30→0)<br/>2. Title (scale+blur→clear)<br/>3. Meta (x +20→0)<br/>4. Body (y +12→0)<br/>5. Chips (scale 0.9→1)<br/>6. Bullets (x -16→0, 60ms stagger)
```

## Climbing (`/climbing`)

### Assembly

```mermaid
flowchart TB
  PF["PageFrame<br/>background: climbing.jpg"]
  MS1["MotionSection"]
  SH1["SectionHeading<br/>Ticked Routes"]
  SC1["SectionCard<br/>MUI X DataGrid (ticks)"]
  MS2["MotionSection"]
  SH2["SectionHeading<br/>Wish List"]
  SC2["SectionCard<br/>MUI X DataGrid (todos)"]
  MS3["MotionSection"]
  Analytics["ClimbingAnalytics<br/>SectionPanel dashboard"]

  PF --> MS1 --> SH1 --> SC1
  PF --> MS2 --> SH2 --> SC2
  PF --> MS3 --> Analytics
```

- `useFuzzySearch()` provides route/location filtering across both DataGrid tables
- `MotionSection` wraps each major block for viewport-triggered fade-in-up
- Analytics panels use `SectionPanel` for dense data display

## Photography (`/photography`)

### Assembly

```mermaid
flowchart TB
  PF["PageFrame<br/>background: photography.jpg"]
  SH["SectionHeading<br/>Gallery"]
  Featured["StaggerChildren<br/>Featured category<br/>→ MotionItem → AlbumCard"]
  Grid["StaggerChildren<br/>Album grid<br/>→ MotionItem → AlbumCard"]

  PF --> SH --> Featured --> Grid
```

- `AlbumCard` wraps in `MotionTiltCard` on desktop for 3D tilt parallax
- `StaggerChildren` orchestrates sequential reveal across album cards
- Image load state tracked to prevent layout shift during loading

### Category detail (`/photography/:slug`)

```mermaid
flowchart TB
  PF["PageFrame<br/>background: category hero"]
  SH["SectionHeading<br/>Album title + location"]
  Grid["PhotoAlbum<br/>quilted image list"]
  LB["ImmersiveLightbox<br/>full-screen overlay"]
  Share["AlbumShareButton"]
  Recovery["RouteRecoveryPanel<br/>if slug not found"]

  PF --> SH --> Grid
  Grid -.->|click| LB
  PF --> Share
  PF -.->|invalid slug| Recovery
```

- Quilted layout uses MUI `ImageList` with responsive column counts
- `ImmersiveLightbox` is a full-screen overlay with keyboard navigation, download, and close
- Legacy slug redirects handled in the component for backward compatibility

## Blog (`/blog`)

Feature-gated: only rendered when `isFeatureEnabled('blog')` is true (dev/test builds).

### Assembly

```mermaid
flowchart TB
  PF["PageFrame<br/>background: blog.jpg"]
  SH["SectionHeading<br/>Blog"]
  Hero["BlogHero<br/>featured post with image"]
  Tags["BlogTagFilter<br/>chip-based filtering"]
  List["BlogPostList<br/>post card grid"]

  PF --> SH --> Hero --> Tags --> List
```

- `BlogHero` uses `ContentCard` with display-scale typography (editorial exception)
- `BlogPostList` renders `BlogPostCard` items in a responsive grid
- Tag filtering is page-local state driven by `useBlogData().tags`

### Post detail (`/blog/:slug`)

```mermaid
flowchart TB
  PF["PageFrame"]
  Header["BlogArticleHeader<br/>title · excerpt · meta chips"]
  Body["BlogArticleBody<br/>typed content blocks"]
  Related["BlogRelatedPosts<br/>related post cards"]
  Nav["BlogArticleNav<br/>previous / next navigation"]
  Recovery["RouteRecoveryPanel<br/>if slug not found"]

  PF --> Header --> Body --> Related --> Nav
  PF -.->|invalid slug| Recovery
```

- `BlogArticleBody` renders typed `BlogContentBlock[]`: text, code, image, callout, blockquote
- `BlogCodeBlock` provides syntax highlighting with copy-to-clipboard
- Not-found slugs render `RouteRecoveryPanel` with contextual suggestions

## NotFound (`/*`)

### Assembly

```mermaid
flowchart TB
  BP["BackgroundPaper<br/>scenic image"]
  SC["StaggerChildren"]
  MI1["MotionItem<br/>heading text"]
  MI2["MotionItem<br/>subheading text"]
  RRP["RouteRecoveryPanel<br/>contextual route suggestions"]

  BP --> SC --> MI1 --> MI2 --> RRP
```

- No `PageFrame` — uses `BackgroundPaper` directly for full-bleed treatment
- `StaggerChildren` + `MotionItem` animate the text reveal
- `RouteRecoveryPanel` provides contextual navigation suggestions based on the attempted path

## Page-level vs component-level concerns

| Concern                           | Belongs at page level           | Belongs in component      |
| --------------------------------- | ------------------------------- | ------------------------- |
| Section ordering and delay timing | ✓                               |                           |
| `delayMs` for each section        | ✓ (via layout metadata)         |                           |
| `triggerOnView` per section       | ✓ (via layout metadata)         |                           |
| Tab/accordion open state          |                                 | ✓ (feature component)     |
| Search/filter state               | ✓ (page-local state)            |                           |
| Stagger timing within a section   |                                 | ✓ (`AnimatedContentList`) |
| Hover/tilt interactions           |                                 | ✓ (motion primitives)     |
| Window drag/resize (Home)         | ✓                               |                           |
| Story mode slide navigation       |                                 | ✓ (`CVStoryViewer`)       |
| Background image selection        | ✓ (passed to `PageFrame`)       |                           |
| SEO metadata                      | ✓ (via `useDocumentMetadata()`) |                           |

## Choreography rules for new pages

1. **Use `PageFrame`** as the scaffold unless the page needs a full-bleed background (then use `BackgroundPaper`)
2. **Wrap sections** in `MotionSection` or `SectionCard` for viewport-triggered reveals
3. **Define section delays** in a layout metadata object (not inline) if the page has multiple sections with staggered timing
4. **Let shared components handle their internal animation** — don't override stagger timing from the page
5. **Use `SectionHeading`** for section intros — don't build custom title stacks
6. **Keep page-level state minimal** — filters, search, expanded mode — and pass data down as props
7. **Follow the data flow**: hook → page → section component → list → card

## Further reading

- [Motion architecture](motion-architecture.md) — token system, variants, intensity scaling
- [Component architecture](component-architecture.md) — shared primitives and feature components
- [App architecture](../architecture/app-architecture.md) — route definitions and page composition model
- [Design system reference](../design-system-reference.md) — surface and layout primitive catalog
