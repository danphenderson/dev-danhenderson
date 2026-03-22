import type { TypographyProps } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../../styles/componentStyles';
import type { TextProps } from './Text';
import { Text } from './Text';
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

type ForwardedInlineTextProps = Omit<
  TextProps,
  'role' | 'tone' | 'context' | 'children' | 'sx' | 'component'
>;

const inheritTypographySx = {
  color: 'inherit',
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  letterSpacing: 'inherit',
  lineHeight: 'inherit',
};

const InlineLabel = ({ children, sx, color, ...rest }: InlineLabelProps) => (
  <Text
    role="body"
    component="span"
    sx={mergeSx([inheritTypographySx, ...(color ? [{ color }] : [])], sx)}
    {...(rest as unknown as ForwardedInlineTextProps)}
  >
    {children}
  </Text>
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
    <Text
      role="body"
      component="span"
      sx={mergeSx([inheritTypographySx, contributionInlineLabelSx], sx)}
      {...(rest as unknown as ForwardedInlineTextProps)}
    >
      {children}
    </Text>
  );
};

/**
 * Animated "Open to opportunities" status text inside ProfileCard bio.
 * Renders an inline `<span>` with the breathing animation.
 */
export const StatusInlineText = ({ children, sx, ...rest }: InlineLabelProps) => {
  const { supportAccentTextSx, statusBreatheSx } = useComponentStyles();

  return (
    <Text
      role="body"
      component="span"
      sx={mergeSx([inheritTypographySx, supportAccentTextSx, statusBreatheSx], sx)}
      {...(rest as unknown as ForwardedInlineTextProps)}
    >
      {children}
    </Text>
  );
};
