import { Box } from '@mui/material';
import type { BoxProps } from '@mui/material';
import type { ElementType } from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { useComponentStyles } from '../styles/componentStyles';
import { normalizeSxProp } from '../utils/sx';

export type ContentCardProps<RootComponent extends ElementType = 'div'> = BoxProps<RootComponent> & {
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
  const { contentCardSx } = useComponentStyles();

  return (
    <Box sx={[contentCardSx, ...normalizeSxProp(sx)]} {...props}>
      {children}
    </Box>
  );
};
