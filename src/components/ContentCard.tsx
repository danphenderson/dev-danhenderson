import { ElementType } from 'react';
import { Box, BoxProps } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCvStyles } from '../styles/cvStyles';
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
  const { contentCardSx } = useCvStyles();

  return (
    <Box sx={[contentCardSx, ...normalizeSxProp(sx)]} {...props}>
      {children}
    </Box>
  );
};
