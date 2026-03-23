# App Architecture

This document covers the application shell, provider hierarchy, route structure, and page composition model.

## Provider nesting

Providers are ordered from outermost (root) to innermost (content):

```mermaid
flowchart TB
  Root["ReactDOM.createRoot(#root)"]
  TP["ThemeProvider<br/>mode · appearance · motionIntensity<br/>→ MuiThemeProvider + CssBaseline"]
  WO["WelcomeOnboardingProvider<br/>first-visit hint dialogs"]
  WA["WelcomeAudioProvider<br/>SoundCloud widget + consent model"]
  App["App<br/>BrowserRouter + PUBLIC_URL basename"]
  CP["CommandPaletteProvider<br/>global Cmd+K palette state"]
  Shell["Layout shell"]

  Root --> TP --> WO --> WA --> App --> CP --> Shell
```

### Provider responsibilities

| Provider                    | State                                                                                 | Persistence                           | Hook                     |
| --------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------ |
| `ThemeProvider`             | Palette mode (light/dark), appearance preset (6 options), motion intensity (4 levels) | Three independent `localStorage` keys | `useAppTheme()`          |
| `WelcomeOnboardingProvider` | Pause-motion hint, dark-mode hint                                                     | Session-scoped (no persistence)       | `useWelcomeOnboarding()` |
| `WelcomeAudioProvider`      | Audio consent (unknown/granted/declined), playback state, widget lifecycle            | `localStorage` consent key            | `useWelcomeAudio()`      |
| `CommandPaletteProvider`    | Open/close state, search query                                                        | None                                  | `useCommandPalette()`    |

**Key constraint:** `ThemeProvider` must remain outermost because all downstream providers and components depend on MUI's `ThemeProvider` for `useTheme()` access. `CommandPaletteProvider` wraps only `AppContent`, not the root — it doesn't need theme context consumers above it.

## Application shell

Inside `App`, the layout shell contains global chrome that persists across route transitions:

```mermaid
flowchart TB
  subgraph AppContent
    SL["Skip links<br/>#main-content, #site-navigation"]
    SPB["ScrollProgressBar"]
    H["Header<br/>nav · theme toggle · motion dial · audio"]
    Main["main#main-content"]
    F["Footer"]
    CLT["CommonLinkTooltip<br/>global popover"]
    GCP["GlobalCommandPalette<br/>modal overlay"]
  end

  subgraph Main
    PT["PageTransition<br/>AnimatePresence mode='wait'"]
    Routes["Routes<br/>7 route definitions + 1 fallback"]
  end

  PT --> Routes
```

### Shell components

| Component              | Scope          | Purpose                                                                                                                    |
| ---------------------- | -------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `ScrollProgressBar`    | Global         | Thin progress indicator at viewport top, driven by scroll position                                                         |
| `Header`               | Global         | Sticky app bar with primary navigation, theme/appearance toggles, motion intensity dial, audio controls, and mobile drawer |
| `PageTransition`       | Wraps `Routes` | Crossfade + slide-up on route change using `AnimatePresence mode="wait"` — respects motion intensity scaling               |
| `Footer`               | Global         | Site footer below all route content                                                                                        |
| `CommonLinkTooltip`    | Global         | Popper-based tooltip for external links across all pages                                                                   |
| `GlobalCommandPalette` | Global         | Cmd+K modal for site-wide search and navigation                                                                            |

## Route definitions

```mermaid
flowchart LR
  Router["BrowserRouter<br/>basename = PUBLIC_URL"]

  Router --> Home["/ → Home"]
  Router --> CV["/cv → CV"]
  Router --> Climbing["/climbing → Climbing"]
  Router --> Photography["/photography → Photography"]
  Router --> PhotographyCat["/photography/:slug → PhotographyCategory"]
  Router --> Blog["/blog → Blog 🏴"]
  Router --> BlogPost["/blog/:slug → BlogPost 🏴"]
  Router --> NotFound["/* → NotFound"]
```

🏴 = feature-gated via `isFeatureEnabled('blog')` — enabled in development/test, disabled in production.

### Route metadata

Route definitions live in `src/constants/siteRoutes.ts` as `siteRouteMap`. Each route carries:

- `path`, `label`, `title`, `description` — used by navigation, SEO head tags, and command palette
- `image` — OG image reference
- `keywords` — SEO and command palette search targets
- `featureFlag` — optional gating (only `blog` currently)
- `showInPrimaryNav` — whether to show in header navigation
- `action` — command palette entry with `recoveryPriority` for not-found suggestions
- `status` — data source kind (static, remote with fallback)

Filtered exports:

- `siteRoutes` — all routes with active feature flags
- `primaryNavigationRoutes` — routes with `showInPrimaryNav: true`

## Page composition model

Every route page follows one of two scaffold patterns:

```mermaid
flowchart TB
  subgraph Standard["Standard pages (most routes)"]
    PF["PageFrame<br/>background image + responsive container"]
    SC["SectionCard<br/>viewport-triggered reveal"]
    SH["SectionHeading"]
    Content["Section content"]

    PF --> SC --> SH --> Content
  end

  subgraph FullBleed["Full-bleed pages (Home, NotFound)"]
    BP["BackgroundPaper<br/>scenic backdrop + content alignment"]
    SW["Shell wrapper<br/>optional overlay panel"]
    HC["Hero content"]

    BP --> SW --> HC
  end
```

### `PageFrame` (standard scaffold)

Used by: Blog, BlogPost, CV, Climbing, Photography, PhotographyCategory

Provides:

- Full-viewport `BackgroundPaper` with configurable background image
- Responsive `Container` (MUI) with route-specific max-width and padding
- Automatic `useDocumentMetadata()` call for SEO

### `BackgroundPaper` (full-bleed scaffold)

Used by: Home, NotFound

Provides:

- Full-height scenic image backdrop with `::before` overlay
- Optional `shellWrapper` render prop for placing content panels over the image
- Content alignment (centered or custom)

### Page-level statefulness

Pages own orchestration state. Shared components are intentionally stateless or accept controlled props:

| Concern                       | Owned by                                   | Not owned by                           |
| ----------------------------- | ------------------------------------------ | -------------------------------------- |
| Section visibility sequencing | Page (via layout metadata + `delayMs`)     | Shared components                      |
| Tab/accordion expanded state  | Feature component (e.g., `ExperienceList`) | Page                                   |
| Story mode navigation         | `CVStoryViewer`                            | `CV.tsx` (delegates)                   |
| IDE window state              | `Home.tsx` (drag/resize/expand)            | `TerminalHeroContent` (receives props) |
| Audio prompt flow             | `useHomeWelcomeSequence()` hook            | Page (consumes)                        |
| Search/filter state           | Page-local state                           | Data hooks (return full datasets)      |

## Feature gating

`src/constants/featureFlags.ts` provides the feature flag system:

```mermaid
stateDiagram-v2
  [*] --> ResolveFlagEnv: isFeatureEnabled(flagId)
  ResolveFlagEnv --> CheckEnv: Read REACT_APP_RUNTIME_ENV<br/>fallback to NODE_ENV
  CheckEnv --> Enabled: Flag's enabledIn includes runtime env
  CheckEnv --> Disabled: Flag's enabledIn excludes runtime env

  state Enabled {
    [*] --> RouteRendered: Route JSX present
    RouteRendered --> NavVisible: Navigation entry shown
    NavVisible --> CommandPalette: Command palette entries active
  }

  state Disabled {
    [*] --> RouteOmitted: Route JSX absent
    RouteOmitted --> NavHidden: Navigation entry removed
    NavHidden --> FallsToNotFound: Path falls through to /* catch-all
  }
```

Currently only `blog` is feature-gated. Blog routes, navigation entries, and command palette actions are fully removed when the flag is off.

## Cross-cutting concerns

| Concern            | Implementation                                                     | Location                                          |
| ------------------ | ------------------------------------------------------------------ | ------------------------------------------------- |
| SPA routing        | Host must rewrite unknown paths to `index.html`                    | `BrowserRouter` with `PUBLIC_URL` basename        |
| SEO metadata       | `useDocumentMetadata()` sets title, description, OG tags per route | `src/hooks/useDocumentMetadata.ts`                |
| Accessibility      | Skip links, keyboard-navigable tab panels, ARIA roles              | App shell + `TabPanel` + components               |
| Error recovery     | `RouteRecoveryPanel` with contextual route suggestions             | NotFound page + blog/photography not-found states |
| GitHub degradation | `useGithubProfile()` falls back to bundled data on API failure     | `src/hooks/useGithubProfile.ts`                   |
| Static assets      | `PUBLIC_URL`-compatible paths via `src/utils/assets.ts`            | All image/PDF references                          |

## Where new features should go

```mermaid
flowchart TB
  Q1{"Is it a new route?"}
  Q2{"Is it shared UI?"}
  Q3{"Is it page-specific?"}
  Q4{"Is it data/content?"}

  Q1 -->|Yes| NewRoute["Add to siteRouteMap<br/>Create page in src/pages/<br/>Add Route in App.tsx"]
  Q1 -->|No| Q2

  Q2 -->|Yes| SharedComp["src/components/<br/>or src/components/layout/"]
  Q2 -->|No| Q3

  Q3 -->|Yes| FeatureComp["src/components/{feature}/<br/>e.g., cv/, blog/"]
  Q3 -->|No| Q4

  Q4 -->|Yes| DataModule["src/data/ + src/types/<br/>Add hook in src/hooks/"]
  Q4 -->|No| Util["src/utils/ or src/constants/"]
```

## Further reading

- [Component architecture](../frontend/component-architecture.md) — how shared and feature components are organized
- [Page choreography](../frontend/page-choreography.md) — route-by-route assembly patterns
- [Motion architecture](../frontend/motion-architecture.md) — how PageTransition and motion scaling work
- [Agent guide](../engineering/agent-guide.md) — operational rules for safe feature extension
