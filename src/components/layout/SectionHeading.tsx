import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import { HeaderLabel, HeaderTitle, HeaderSubtitle } from '../text';

type SectionHeadingProps = BoxProps & {
  overline: string;
  title?: string;
  subtitle?: string;
};

export const SectionHeading = ({ overline, title, subtitle, sx, ...props }: SectionHeadingProps) => (
  <Box sx={sx} {...props}>
    <HeaderLabel>{overline}</HeaderLabel>
    {title && <HeaderTitle subtitle={subtitle}>{title}</HeaderTitle>}
    {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
  </Box>
);
