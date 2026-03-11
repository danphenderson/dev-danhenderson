import { ReactNode } from 'react';
import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../../styles/appStyles';
import { normalizeSxProp } from '../../utils/sx';
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

  return (
    <BackgroundPaper image={image} showShell={false}>
      <Box
        sx={[
          appStyles.pageFrameContainerSx,
          { maxWidth },
          ...normalizeSxProp(containerSx),
        ]}
      >
        {children}
      </Box>
    </BackgroundPaper>
  );
};
