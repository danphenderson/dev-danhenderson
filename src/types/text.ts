/**
 * Shared text-system types consumed by the typeset layer, the Text primitive,
 * and composition primitives. Kept in src/types/ so the dependency flows
 * downward (types → styles → components) without circular imports.
 */

/* ── Roles ──────────────────────────────────────────────── */

/** UI-context roles for standard interface text. */
export type TextUiRole =
  | 'pageTitle'
  | 'pageSubtitle'
  | 'sectionEyebrow'
  | 'sectionTitle'
  | 'sectionSubtitle'
  | 'subsectionTitle'
  | 'cardTitle'
  | 'cardSubtitle'
  | 'body'
  | 'bodyMuted'
  | 'meta'
  | 'metaStrong'
  | 'caption'
  | 'label'
  | 'metricValue'
  | 'metricLabel';

/** Prose-context roles for editorial / long-form text. */
export type TextProseRole =
  | 'proseTitle'
  | 'proseLead'
  | 'proseHeading'
  | 'proseSubheading'
  | 'proseParagraph'
  | 'proseCaption'
  | 'proseQuote'
  | 'proseListItem';

/** Every legal role. */
export type TextRole = TextUiRole | TextProseRole;

/* ── Tone ───────────────────────────────────────────────── */

/** Tone controls color intent independently of role. */
export type TextTone = 'default' | 'muted' | 'accent' | 'inverse';

/* ── Context ────────────────────────────────────────────── */

/**
 * Context selects between UI-density and prose-reading optimization.
 * Overlay adjusts for text-on-imagery.
 */
export type TextContext = 'ui' | 'prose' | 'overlay';

/* ── Semantic element ───────────────────────────────────── */

/**
 * Constrained set of semantic HTML elements that Text may render as.
 * This is intentionally smaller than TypographyProps['component'].
 */
export type TextElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'li' | 'dt' | 'dd' | 'label' | 'figcaption';

/* ── UNSAFE_Typography metadata ─────────────────────────── */

/** Required metadata when using the UNSAFE_Typography escape hatch. */
export type UnsafeTypographyMeta = {
  /** Short explanation of why Text cannot be used here. */
  reason: string;
  /** Module or team that owns this exception. */
  owner: string;
  /** ISO date by which this usage should be migrated. */
  expiresBy: string;
};
