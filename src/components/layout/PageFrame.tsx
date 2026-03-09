import { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../../styles/appStyles';
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
  const appStyles = useAppStyles();
  const sxArray = Array.isArray(containerSx) ? containerSx : containerSx ? [containerSx] : [];

  return (
    <BackgroundPaper image={image} showShell={false}>
      <Box
        sx={[
          {
            ...appStyles.pageFrameContainerSx,
            maxWidth,
          },
          ...sxArray,
        ]}
      >
        {children}
      </Box>
    </BackgroundPaper>
  );
};
