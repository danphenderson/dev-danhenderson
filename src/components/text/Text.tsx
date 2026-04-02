import Typography from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import type {
  TextRole,
  TextTone,
  TextContext,
  TextElement,
  TextPassthroughProps,
} from '../../types/text';
import { useTextStyles } from '../../styles/textStyles';
import { mergeSx } from '../../utils/sx';

/* ── Default semantic elements per role ─────────────────── */

const defaultElements: Record<TextRole, TextElement> = {
  pageTitle: 'h1',
  pageSubtitle: 'p',
  settingsSectionLabel: 'span',
  sectionEyebrow: 'span',
  sectionTitle: 'h2',
  sectionSubtitle: 'p',
  subsectionTitle: 'h3',
  cardTitle: 'h3',
  cardSubtitle: 'p',
  body: 'p',
  bodyMuted: 'p',
  meta: 'p',
  metaStrong: 'p',
  caption: 'span',
  label: 'span',
  inlineLabel: 'span',
  metricValue: 'p',
  metricLabel: 'span',
  proseTitle: 'h1',
  proseLead: 'p',
  proseHeading: 'h2',
  proseSubheading: 'h3',
  proseMinorHeading: 'h4',
  proseParagraph: 'p',
  proseInlineCode: 'code',
  proseCaption: 'figcaption',
  proseQuote: 'p',
  proseListItem: 'li',
};

/* ── Props ──────────────────────────────────────────────── */

type TextOwnProps = {
  /** The semantic role that selects the typeset. Required. */
  role: TextRole;
  /** Color intent. Defaults to 'default'. */
  tone?: TextTone;
  /** Density context. Defaults to 'ui'. */
  context?: TextContext;
  /** Override the default semantic HTML element for this role. */
  component?: TextElement;
  /** Additional sx. Typography-affecting properties should be avoided. */
  sx?: SxProps<Theme>;
  /** Content. */
  children?: ReactNode;
};

export type TextProps = TextPassthroughProps & TextOwnProps;

/* ── Component ──────────────────────────────────────────── */

/**
 * `Text` is the canonical text primitive for the design system.
 *
 * It renders text using role-based typesets resolved from the current theme
 * and appearance treatment, rather than exposing raw MUI Typography variants.
 *
 * @example
 * ```tsx
 * <Text role="sectionTitle">Projects</Text>
 * <Text role="body" tone="muted">Description text</Text>
 * <Text role="cardTitle" tone="inverse" context="overlay">Album Name</Text>
 * ```
 */
export const Text = ({
  role,
  tone = 'default',
  context = 'ui',
  component,
  sx,
  children,
  ...rest
}: TextProps) => {
  const { resolveTypeset } = useTextStyles();
  const typeset = resolveTypeset(role, tone, context);
  const element = component ?? defaultElements[role];

  return (
    <Typography
      variant={typeset.variant}
      component={element}
      sx={mergeSx(typeset.sx, sx)}
      {...rest}
    >
      {children}
    </Typography>
  );
};
