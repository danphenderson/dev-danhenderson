import { ElementType } from 'react';
import { Box, BoxProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCvStyles } from '../ThemeProvider';

type ContentCardProps<RootComponent extends ElementType = 'div'> = BoxProps<RootComponent> & {
  sx?: SxProps<Theme>;
  href?: string;
  target?: string;
  rel?: string;
};

export const ContentCard = <RootComponent extends ElementType = 'div'>({
  children,
  sx,
  ...props
}: ContentCardProps<RootComponent>) => {
  const { contentCardSx } = useCvStyles();
  const sxArray = Array.isArray(sx) ? sx : sx ? [sx] : [];

  return (
    <Box sx={[contentCardSx, ...sxArray]} {...props}>
      {children}
    </Box>
  );
};
