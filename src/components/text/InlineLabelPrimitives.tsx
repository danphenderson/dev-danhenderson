import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../../styles/componentStyles';
import { mergeSx } from './textFactory';

/* ────────────────────────────────────────────────────────── *
 *  Inline label primitives (span-based)                      *
 * ────────────────────────────────────────────────────────── */

type InlineLabelProps = Omit<TypographyProps<'span'>, 'variant' | 'component'> & {
  sx?: SxProps<Theme>;
};

/**
 * Generic interactive label for tabs, speed-dial tooltips, etc.
 * Renders an inline `<span>`.
 */
export const InteractiveLabel = ({ children, sx, ...rest }: InlineLabelProps) => (
  <Typography component="span" variant="inherit" sx={sx} {...rest}>
    {children}
  </Typography>
);

/**
 * Navigation label for header buttons and mobile menu items.
 * Renders an inline `<span>`.
 */
export const NavigationLabel = ({ children, sx, ...rest }: InlineLabelProps) => (
  <Typography component="span" variant="inherit" sx={sx} {...rest}>
    {children}
  </Typography>
);

/**
 * Chip label for skills, navigator chips, and GitHub chip rows.
 * Renders an inline `<span>`.
 */
export const ChipLabel = ({ children, sx, ...rest }: InlineLabelProps) => (
  <Typography component="span" variant="inherit" sx={sx} {...rest}>
    {children}
  </Typography>
);

/**
 * Compound chip meta label – replaces bespoke `Box component="span"` nodes
 * in GitHub contribution chip labels.
 * Renders an inline `<span>` with inline-flex for compound layout.
 */
export const ChipMetaLabel = ({ children, sx, ...rest }: InlineLabelProps) => {
  const { contributionInlineLabelSx } = useComponentStyles();

  return (
    <Typography component="span" variant="inherit" sx={mergeSx([contributionInlineLabelSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};

/**
 * Animated "Open to opportunities" status text inside ProfileCard bio.
 * Renders an inline `<span>` with the breathing animation.
 */
export const StatusInlineText = ({ children, sx, ...rest }: InlineLabelProps) => {
  const { statusBreatheSx } = useComponentStyles();

  return (
    <Typography component="span" variant="inherit" sx={mergeSx([statusBreatheSx], sx)} {...rest}>
      {children}
    </Typography>
  );
};
