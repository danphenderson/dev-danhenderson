# Component Architecture

This document explains how the component layer is organized: what is shared, what is feature-specific, how composition works, and where new components should go.

For the concrete catalog of existing surfaces, text primitives, and selection guidance, see the [Design system reference](../design-system-reference.md).

## Component layering

```mermaid
flowchart TB
  subgraph PageLayer["Page layer — src/pages/"]
    Pages["Route pages<br/>Home · CV · Climbing · Photography · Blog · NotFound"]
  end

  subgraph SharedLayer["Shared components — src/components/"]
    Layout["Layout primitives<br/>PageFrame · BackgroundPaper<br/>SectionCard · SectionPanel · SectionHeading"]
    Cards["Card surfaces<br/>ContentCard · AnimatedContentCard<br/>MotionTiltCard · MotionCard"]
    Lists["List orchestrators<br/>AnimatedContentList · AnimatedSlideList<br/>AnimatedZoomList · SkillsChipList"]
    Text["Text primitives<br/>TypographyPrimitives · InlineLabelPrimitives<br/>TypewriterText · TypewriterLoopText"]
    Global["Global chrome<br/>Header · Footer · ScrollProgressBar<br/>GlobalCommandPalette · CommonLinkTooltip<br/>PageTransition · RouteRecoveryPanel"]
  end

  subgraph FeatureLayer["Feature components — src/components/{feature}/"]
    CV["cv/<br/>25 components<br/>sections · lists · story mode · GitHub"]
    Blog["blog/<br/>13 components<br/>hero · article · code · navigation"]
    Photo["photography/<br/>5 components<br/>album card · lightbox · share"]
    IDE["ide/<br/>14 files<br/>VS Code chrome for home hero"]
    HeaderSub["header/<br/>7 files<br/>nav · dials · hints · scroll"]
  end

  subgraph Foundation["Foundation — src/motion/ · src/styles/ · src/theme/"]
    Motion["Motion primitives<br/>MotionSection · StaggerChildren<br/>MotionItem · MotionFadeIn · MotionScaleIn"]
    Styles["Style builders<br/>componentStyleBuilders · appStyleBuilders"]
    Theme["Theme<br/>createAppTheme · appAppearance"]
  end

  Pages --> SharedLayer
  Pages --> FeatureLayer
  SharedLayer --> Foundation
  FeatureLayer --> SharedLayer
  FeatureLayer --> Foundation
```

## Shared primitives vs feature components

### Shared primitives (`src/components/` + `src/components/layout/` + `src/components/text/`)

These are reusable across multiple routes. They define the site's shared visual language:

| Primitive               | Purpose                                                             | Consumers                                                          |
| ----------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `PageFrame`             | Route-level scaffold with background image and responsive container | Blog, BlogPost, CV, Climbing, Photography, PhotographyCategory     |
| `BackgroundPaper`       | Full-bleed scenic backdrop with optional shell overlay              | Home, NotFound, also used internally by PageFrame                  |
| `SectionCard`           | Viewport-triggered reveal card for content sections                 | Blog, Climbing, Photography, PhotographyCategory                   |
| `CVSectionCard`         | Extended section card with CV-specific surface treatment            | All CV section wrappers                                            |
| `SectionPanel`          | Flat inset panel for nested dense data                              | ClimbingAnalytics, CVGitHubSection, AnimatedContentList panel mode |
| `SectionHeading`        | Overline + title + subtitle composition                             | Blog, Photography, Climbing, CV sections                           |
| `ContentCard`           | Base frosted card surface (no animation)                            | BlogHero, BlogPostCard, GitHub sections                            |
| `AnimatedContentCard`   | Viewport-triggered fade-in card with optional tilt                  | CV repeated-card lists (via AnimatedContentList)                   |
| `AnimatedContentList`   | Staggered card list orchestrator                                    | 5 CV list renderers                                                |
| `AnimatedSlideList`     | Direction-aware slide reveal for tab/accordion content              | CV tab panels                                                      |
| `AnimatedZoomList`      | Zoom-in stagger list                                                | Supplemental lists                                                 |
| `SkillsChipList`        | Skill/tool chip wrap list                                           | CV about, experience, education, coding, story slides              |
| `TabPanel`              | Collapsible tab panel wrapper                                       | CV experience, education, coding, volunteering                     |
| `TypographyPrimitives`  | Semantic text components (HeaderLabel, EntryTitle, BodyText, etc.)  | Site-wide                                                          |
| `InlineLabelPrimitives` | Span-based label components for chips/tabs                          | AppSpeedDial, TabPanel, SkillsChipList                             |

### Feature components (`src/components/{feature}/`)

These belong to a specific route or feature area. They compose shared primitives but add domain-specific logic:

```mermaid
flowchart LR
  subgraph cv["cv/ — 25 components"]
    Sections["Section wrappers<br/>CVAboutSection · CVExperienceSection<br/>CVEducationSection · CVCertificatesSection<br/>CVCodingSection · CVVolunteeringSection<br/>CVGitHubSection"]
    Lists["List renderers<br/>ExperienceList · EducationSection<br/>CertificatesList · CodingExamplesSection<br/>VolunteeringList"]
    Story["Story mode<br/>CVStoryViewer · CVStoryNavBar<br/>CVStorySlideRenderer · CVStoryProgress<br/>CVStoryHeader · CVStoryChapterHeading"]
    GitHub["GitHub integration<br/>GitHubContributions · GitHubContributionCalendar<br/>GitHubActivityList · GitHubLinkChipList<br/>CVGitHubStatusTooltip"]
    Shared["Shared CV<br/>ProfileCard · CVEntryHeader<br/>CVSectionCard · CVSectionStack<br/>CVSectionNavigator · cvSectionMetadata"]
  end

  subgraph blog["blog/ — 13 components"]
    BlogParts["BlogHero · BlogHeroImage<br/>BlogArticleHeader · BlogArticleBody<br/>BlogArticleNav · BlogRelatedPosts<br/>BlogPostCard · BlogPostList<br/>BlogTagFilter · BlogMetaChips<br/>BlogCodeBlock · BlogCallout · BlogBlockquote"]
  end

  subgraph photo["photography/ — 5 components"]
    PhotoParts["AlbumCard · AlbumLocationSummary<br/>AlbumShareButton · ImmersiveLightbox<br/>TiltCard"]
  end

  subgraph ide["ide/ — 14 files"]
    IDEParts["VscodeTitleBar · VscodeTabBar<br/>VscodeEditorPane · VscodeTerminalPanel<br/>VscodeActivityBar · VscodeExplorerSidebar<br/>VscodeStatusBar · VscodeCommandPalette<br/>VscodeIntelliSenseTooltip · VscodeNotificationToast<br/>VscodeResizeHandle · vscodeTokens<br/>vscodeEditorTabs · vscodeSyntaxHelpers"]
  end
```

## Intentional design-system exceptions

Four subsystems intentionally bypass the shared design-system primitives. These are not drift — they are purpose-built alternative design languages:

| Subsystem                        | Components                                               | Why it differs                                                                                                                                                                        |
| -------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home faux-VS Code hero**       | `TerminalHeroContent` + `src/components/ide/*`           | Simulates a desktop IDE chrome; uses its own token file (`vscodeTokens.ts`), custom window controls, and terminal typewriter — none of this belongs in the shared card/section system |
| **Blog editorial surfaces**      | `BlogHero`, `BlogArticleBody`, `BlogArticleHeader`       | Uses display-scale typography, image-first hero treatment, and custom content block rendering that doesn't fit the standard `SectionCard` + `SectionHeading` pattern                  |
| **Photography overlay/lightbox** | `ImmersiveLightbox`, `AlbumCard`, `PhotoAlbum`           | Image-first surfaces with full-bleed overlays, quilted layouts, and download/share actions — intentionally not wrapped in standard card surfaces                                      |
| **CV story mode**                | `CVStoryViewer`, `CVStorySlideRenderer`, `CVStoryNavBar` | Full-screen immersive slide experience with directional enter/exit animations, progress bar, and cinematic variants                                                                   |

**Rule:** Do not attempt to "normalize" these into the shared primitive system. They exist for a reason.

## Composition patterns

### Pages compose; components render

Pages are declarative assemblers. They:

- Import data via hooks
- Arrange sections using layout primitives
- Pass data down as props
- Own orchestration timing (section delays, stagger offsets)

Components are reusable renderers. They:

- Accept data via props
- Handle their own presentation and interaction state (tabs, accordions, hover)
- Do not fetch data or own routing concerns
- Do not contain page-level orchestration logic

### Card composition chain

The most common composition pattern for content sections:

```mermaid
flowchart TB
  Page["Page<br/>owns section order + delay timing"]
  SC["SectionCard / CVSectionCard<br/>viewport reveal + surface"]
  SH["SectionHeading<br/>overline + title + subtitle"]
  ACL["AnimatedContentList<br/>stagger orchestrator"]
  ACC["AnimatedContentCard<br/>per-item reveal + optional tilt"]
  Render["renderItem callback<br/>feature-specific content"]

  Page --> SC --> SH
  SC --> ACL --> ACC --> Render
```

### Animated list variants

| Component             | Trigger                        | Animation                   | Use case                       |
| --------------------- | ------------------------------ | --------------------------- | ------------------------------ |
| `AnimatedContentList` | Viewport intersection per card | Zoom-in with optional tilt  | CV repeated sections           |
| `AnimatedSlideList`   | Boolean `in` prop              | Slide-up with stagger       | Tab/accordion expanded content |
| `AnimatedZoomList`    | Boolean `in` prop              | Scale-in with stagger delay | Supplemental reveal lists      |

### Hook → page → component data flow

```mermaid
sequenceDiagram
  participant Data as src/data/cv.ts
  participant Hook as useGithubProfile()
  participant Page as CV.tsx
  participant Section as CVExperienceSection
  participant List as ExperienceList
  participant Card as AnimatedContentCard

  Data->>Hook: Import static content
  Hook->>Hook: Merge with GitHub API (or fallback)
  Hook->>Page: Return { profile, contributions, status }
  Page->>Section: Pass section data + delayMs
  Section->>List: Pass items array + renderItem
  List->>Card: Render per item with stagger
```

## Component ownership boundaries

### What shared components should NOT do

- Fetch data or call hooks that fetch data
- Know about specific routes or route parameters
- Own page-level orchestration timing
- Contain page-specific business logic
- Hardcode content strings

### What feature components CAN do

- Compose shared primitives with domain-specific props
- Own feature-specific interaction state (tab selection, drawer toggle)
- Define feature-specific rendering logic (e.g., how a CV entry's detail panel works)
- Import from their own data hooks

### What pages should do

- Wire up data hooks
- Declare section ordering and delay timing
- Compose feature sections into the page scaffold
- Own page-specific state (filters, search, expanded mode)

## Safe extension points

### Adding a new shared component

1. Check the [Design system reference](../design-system-reference.md) first — the pattern you need may already exist
2. Place it in `src/components/` (top-level) or `src/components/layout/` (layout primitive)
3. Accept controlled props; avoid internal state unless it's presentation-only (hover, focus)
4. Use existing motion primitives from `src/motion/components.tsx` for animation — do not create parallel wrappers
5. Use typography primitives from `src/components/text/` — do not style raw `Typography` for standard roles
6. Style via the existing style builder system or inline `sx` from theme tokens

### Adding a new feature component

1. Place it in `src/components/{feature}/` alongside related components
2. Compose shared primitives (cards, lists, headings) as the rendering surface
3. Keep orchestration logic in the consuming page, not in the feature component
4. If the component needs motion, wrap with an existing motion primitive — do not define new variants inline

### Adding a new page

1. Create the page in `src/pages/`
2. Add route metadata to `src/constants/siteRoutes.ts`
3. Add the `<Route>` in `App.tsx`
4. Use `PageFrame` as the scaffold unless the page needs full-bleed treatment (then use `BackgroundPaper`)
5. Compose sections from shared layout primitives (`SectionCard`, `SectionHeading`)
6. Wire data through a hook in `src/hooks/`
7. Follow existing motion patterns — viewport-triggered reveals with stagger timing

## Further reading

- [Design system reference](../design-system-reference.md) — concrete catalog of surfaces, text primitives, and selection guide
- [Motion architecture](../frontend/motion-architecture.md) — how animation primitives compose with components
- [Page choreography](../frontend/page-choreography.md) — how pages assemble and sequence their sections
- [Agent guide](../engineering/agent-guide.md) — operational rules for safe component extension
