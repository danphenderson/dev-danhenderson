import { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import BackgroundPaper from '../BackgroundPaper';

type PageFrameProps = {
  image: string;
  children: ReactNode;
  maxWidth?: number;
  containerSx?: SxProps<Theme>;
};

export const PageFrame = ({
  image,
  children,
  maxWidth = 1400,
  containerSx,
}: PageFrameProps) => {
  const sxArray = Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [];

  return (
    <BackgroundPaper image={image} showShell={false}>
      <Box
        sx={[
          {
            maxWidth,
            mx: 'auto',
            px: { xs: 1.5, md: 3 },
            py: { xs: 2, md: 3 },
          },
          ...sxArray,
        ]}
      >
        {children}
      </Box>
    </BackgroundPaper>
  );
};
