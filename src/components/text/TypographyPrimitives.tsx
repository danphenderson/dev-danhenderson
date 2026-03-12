import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../../styles/componentStyles';
import { mergeSx } from './textFactory';

/* ────────────────────────────────────────────────────────── *
 *  Typography primitives                                     *
 * ────────────────────────────────────────────────────────── */

type TextPrimitiveProps = Omit<TypographyProps, 'variant'> & {
  sx?: SxProps<Theme>;
};

/**
 * Overline label used by `SectionHeading` and section navigators.
 * Renders as a `<span>` with `variant="overline"`.
 */
export const HeaderLabel = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { overlineSx, sectionHeadingOverlineTextSx } = useComponentStyles();

  return (
    <Typography variant="overline" sx={mergeSx([overlineSx, sectionHeadingOverlineTextSx], sx)} {...rest}>
      {children}
    </Typography>
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

  return (
    <Typography
      variant="h4"
      sx={mergeSx([sectionHeadingTitleSx(subtitle), sectionHeadingTitleTextSx], sx)}
      {...rest}
    >
      {children}
    </Typography>
  );
};

/**
 * Section heading subtitle – `variant="subtitle1"`, secondary text.
 */
export const HeaderSubtitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionHeadingSubtitleSx, sectionHeadingSubtitleTextSx } = useComponentStyles();

  return (
    <Typography
      variant="subtitle1"
      sx={mergeSx([sectionHeadingSubtitleSx, sectionHeadingSubtitleTextSx], sx)}
      {...rest}
    >
      {children}
    </Typography>
  );
};

/** Home hero title – `variant="h1"`. */
export const DisplayTitle = ({ children, sx, ...rest }: TextPrimitiveProps) => (
  <Typography variant="h1" sx={sx} {...rest}>
    {children}
  </Typography>
);

/** Entry-level heading – `variant="h6"`, primary color, bold. */
export const EntryTitle = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionTitleSx } = useComponentStyles();

  return (
    <Typography variant="h6" sx={mergeSx([sectionTitleSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};

/** GitHub subsection / nav overline label – `variant="overline"`, accent text. */
export const SectionLabel = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { sectionNavigatorLeadSx } = useComponentStyles();

  return (
    <Typography variant="overline" sx={mergeSx([sectionNavigatorLeadSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};

/** Secondary metadata text – `variant="subtitle2"`. */
export const MetaText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryTextSx } = useComponentStyles();

  return (
    <Typography variant="subtitle2" sx={mergeSx([secondaryTextSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};

/** Bold secondary metadata – `variant="subtitle2"`, bold. */
export const StrongMetaText = ({ children, sx, ...rest }: TextPrimitiveProps) => {
  const { secondaryStrongSx } = useComponentStyles();

  return (
    <Typography variant="subtitle2" sx={mergeSx([secondaryStrongSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};

/** Caption-level text – `variant="caption"`. */
export const CaptionText = ({ children, sx, ...rest }: TextPrimitiveProps) => (
  <Typography variant="caption" sx={sx} {...rest}>
    {children}
  </Typography>
);

/** Body copy – `variant="body2"`. */
export const BodyText = ({ children, sx, ...rest }: TextPrimitiveProps) => (
  <Typography variant="body2" sx={sx} {...rest}>
    {children}
  </Typography>
);

/** List item body copy – `variant="body2"`, `component="li"`. */
export const ListItemText = ({ children, sx, ...rest }: TextPrimitiveProps) => (
  <Typography component="li" variant="body2" sx={sx} {...rest}>
    {children}
  </Typography>
);

/** Section lead/subtitle text – `variant="subtitle2"` with bold secondary styling. */
export const SectionLeadText = ({ children, sx, ...rest }: TextPrimitiveProps) => (
  <Typography variant="subtitle2" sx={sx} {...rest}>
    {children}
  </Typography>
);
