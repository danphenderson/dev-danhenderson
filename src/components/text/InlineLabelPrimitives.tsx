import Typography from '@mui/material/Typography';
import type { TypographyProps } from '@mui/material/Typography';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../../styles/componentStyles';
import { mergeSx } from './textFactory';

/* ────────────────────────────────────────────────────────── *
 *  Inline label primitives (span-based)                      *
 *                                                            *
 *  InteractiveLabel, NavigationLabel, and ChipLabel share    *
 *  the same implementation today. They exist as separate     *
 *  exports so call-sites express *why* a label is used       *
 *  (interactive control vs navigation vs chip). This allows  *
 *  each surface to diverge in the future without a           *
 *  cross-cutting refactor.                                   *
 * ────────────────────────────────────────────────────────── */

type InlineLabelProps = Omit<TypographyProps<'span'>, 'variant' | 'component'> & {
  sx?: SxProps<Theme>;
};

const InlineLabel = ({ children, sx, ...rest }: InlineLabelProps) => (
  <Typography component="span" variant="inherit" sx={sx} {...rest}>
    {children}
  </Typography>
);

/** Generic interactive label for tabs, speed-dial tooltips, etc. */
export const InteractiveLabel = InlineLabel;

/** Navigation label for header buttons and mobile menu items. */
export const NavigationLabel = InlineLabel;

/** Chip label for skills, navigator chips, and GitHub chip rows. */
export const ChipLabel = InlineLabel;

/**
 * Compound chip meta label – replaces bespoke `Box component="span"` nodes
 * in GitHub contribution chip labels.
 * Renders an inline `<span>` with inline-flex for compound layout.
 */
export const ChipMetaLabel = ({ children, sx, ...rest }: InlineLabelProps) => {
  const { contributionInlineLabelSx } = useComponentStyles();

  return (
    <Typography
      component="span"
      variant="inherit"
      sx={mergeSx([contributionInlineLabelSx], sx)}
      {...rest}
    >
      {children}
    </Typography>
  );
};

/**
 * Animated "Open to opportunities" status text inside ProfileCard bio.
 * Renders an inline `<span>` with the breathing animation.
 */
export const StatusInlineText = ({ children, sx, ...rest }: InlineLabelProps) => {
  const { supportAccentTextSx, statusBreatheSx } = useComponentStyles();

  return (
    <Typography
      component="span"
      variant="inherit"
      sx={mergeSx([supportAccentTextSx, statusBreatheSx], sx)}
      {...rest}
    >
      {children}
    </Typography>
  );
};
