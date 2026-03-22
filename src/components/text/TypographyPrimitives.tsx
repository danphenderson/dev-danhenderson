import type { TypographyProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../../styles/componentStyles';
import type { TextElement, TextRole, TextTone, TextContext } from '../../types/text';
import type { TextProps } from './Text';
import { Text } from './Text';
import { mergeSx } from './textFactory';

/* ────────────────────────────────────────────────────────── *
 *  Typography primitives                                     *
 * ────────────────────────────────────────────────────────── */

type TextPrimitiveProps = Omit<TypographyProps, 'variant'> & {
  sx?: SxProps<Theme>;
};

type ForwardedTextProps = Omit<
  TextProps,
  'role' | 'tone' | 'context' | 'children' | 'sx' | 'component'
>;

type CompatibilityOptions = {
  role: TextRole;
  defaultComponent: TextElement;
  tone?: TextTone;
  context?: TextContext;
  baseSx?: SxProps<Theme> | SxProps<Theme>[];
};

const subtitle2ScaleSx = {
  fontSize: (theme: Theme) => theme.typography.subtitle2.fontSize,
  lineHeight: (theme: Theme) => theme.typography.subtitle2.lineHeight,
};

const displayTitleSx = {
  fontFamily: (theme: Theme) => theme.typography.h1.fontFamily,
  fontSize: (theme: Theme) => theme.typography.h1.fontSize,
  fontWeight: (theme: Theme) => theme.typography.h1.fontWeight,
  lineHeight: (theme: Theme) => theme.typography.h1.lineHeight,
};

const renderCompatibilityText = (
  { role, defaultComponent, tone = 'default', context = 'ui', baseSx = [] }: CompatibilityOptions,
  { children, component, color, sx, ...rest }: TextPrimitiveProps
) => {
  const defaults = Array.isArray(baseSx) ? baseSx : [baseSx];
  const colorSx = color ? [{ color }] : [];

  return (
    <Text
      role={role}
      tone={tone}
      context={context}
      component={(component as TextElement | undefined) ?? defaultComponent}
      sx={mergeSx([...defaults, ...colorSx], sx)}
      {...(rest as unknown as ForwardedTextProps)}
    >
      {children}
    </Text>
  );
};

/**
 * Overline label used by `SectionHeading` and section navigators.
 * Renders as a `<span>` with `variant="overline"`.
 */
export const HeaderLabel = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { overlineSx, supportOverlineSx, sectionHeadingOverlineTextSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'sectionEyebrow',
      defaultComponent: 'span',
      baseSx: [overlineSx, supportOverlineSx, sectionHeadingOverlineTextSx],
    },
    { children, sx, ...rest }
  );
};

/**
 * Section heading title – `variant="h4"`, primary text.
 */
export const HeaderTitle = ({
  children,
  sx,
  subtitle,
  ...rest
}: TextPrimitiveProps & { subtitle?: string }) => {
  const { sectionHeadingTitleSx, sectionHeadingTitleTextSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'sectionTitle',
      defaultComponent: 'h4',
      baseSx: [sectionHeadingTitleSx(subtitle), sectionHeadingTitleTextSx],
    },
    { children, sx, ...rest }
  );
};

/**
 * Section heading subtitle – `variant="subtitle1"`, secondary text.
 */
export const HeaderSubtitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionHeadingSubtitleSx, sectionHeadingSubtitleTextSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'sectionSubtitle',
      defaultComponent: 'h6',
      baseSx: [sectionHeadingSubtitleSx, sectionHeadingSubtitleTextSx],
    },
    { children, sx, ...rest }
  );
};

/** Home hero title – `variant="h1"`. */
export const DisplayTitle = ({ children, sx, ...rest }: TextPrimitiveProps) =>
  renderCompatibilityText(
    {
      role: 'pageTitle',
      defaultComponent: 'h1',
      baseSx: [displayTitleSx],
    },
    { children, sx, ...rest }
  );

/** Entry-level heading – `variant="h6"`, primary color, bold. */
export const EntryTitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionTitleSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'cardTitle',
      defaultComponent: 'h6',
      baseSx: [sectionTitleSx],
    },
    { children, sx, ...rest }
  );
};

/** Dashboard/stat value text – `variant="body2"`, accent-colored and bold. */
export const MetricValueText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { metricValueTextSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'metricValue',
      defaultComponent: 'p',
      baseSx: [metricValueTextSx],
    },
    { children, sx, ...rest }
  );
};

/** Entry-level subtitle – `variant="subtitle1"`, italic secondary text. */
export const EntrySubtitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryItalicSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'sectionSubtitle',
      defaultComponent: 'p',
      baseSx: [secondaryItalicSx],
    },
    { children, sx, ...rest }
  );
};

/** GitHub subsection / nav overline label – `variant="overline"`, accent text. */
export const SectionLabel = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionNavigatorLeadSx, supportOverlineSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'sectionEyebrow',
      defaultComponent: 'span',
      baseSx: [sectionNavigatorLeadSx, supportOverlineSx],
    },
    { children, sx, ...rest }
  );
};

/** Secondary metadata text – `variant="subtitle2"`. */
export const MetaText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryTextSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'meta',
      defaultComponent: 'p',
      baseSx: [subtitle2ScaleSx, secondaryTextSx],
    },
    { children, sx, ...rest }
  );
};

/** Bold secondary metadata – `variant="subtitle2"`, bold. */
export const StrongMetaText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryStrongSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'metaStrong',
      defaultComponent: 'p',
      baseSx: [subtitle2ScaleSx, secondaryStrongSx],
    },
    { children, sx, ...rest }
  );
};

/** Caption-level text – `variant="caption"`. */
export const CaptionText = ({ children, sx, ...rest }: TextPrimitiveProps) =>
  renderCompatibilityText(
    {
      role: 'caption',
      defaultComponent: 'span',
    },
    { children, sx, ...rest }
  );

/** Body copy – `variant="body2"`. */
export const BodyText = ({ children, sx, ...rest }: TextPrimitiveProps) =>
  renderCompatibilityText(
    {
      role: 'body',
      defaultComponent: 'p',
    },
    { children, sx, ...rest }
  );

/** Secondary body copy – `variant="body2"` with secondary text styling. */
export const SecondaryBodyText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  return renderCompatibilityText(
    {
      role: 'bodyMuted',
      defaultComponent: 'p',
    },
    { children, sx, ...rest }
  );
};

/** Secondary caption copy – `variant="caption"` with secondary text styling. */
export const SecondaryCaptionText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  return renderCompatibilityText(
    {
      role: 'caption',
      tone: 'muted',
      defaultComponent: 'span',
    },
    { children, sx, ...rest }
  );
};

/** List item body copy – `variant="body2"`, `component="li"`. */
export const ListItemText = ({ children, sx, ...rest }: TextPrimitiveProps) =>
  renderCompatibilityText(
    {
      role: 'body',
      defaultComponent: 'li',
    },
    { children, sx, ...rest }
  );

/** Section lead/subtitle text – `variant="subtitle2"` with secondary text styling. */
export const SectionLeadText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryStrongSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'metaStrong',
      defaultComponent: 'p',
      baseSx: [subtitle2ScaleSx, secondaryStrongSx],
    },
    { children, sx, ...rest }
  );
};

/** Repeated subsection title – `variant="subtitle2"`, primary text, bold. */
export const SubsectionTitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionTitleSx } = useComponentStyles();

  return renderCompatibilityText(
    {
      role: 'metaStrong',
      defaultComponent: 'h6',
      baseSx: [subtitle2ScaleSx, sectionTitleSx],
    },
    { children, sx, ...rest }
  );
};
