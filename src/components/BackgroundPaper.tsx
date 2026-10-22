import type { Ref } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../styles/appStyles';
import { getDisplayImage } from '../utils/displayImages';
import { mergeSx } from '../utils/sx';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
  intro?: React.ReactNode;
  showShell?: boolean;
  contentAlign?: 'flex-start' | 'center' | 'flex-end';
  contentSx?: SxProps<Theme>;
  contentRef?: Ref<HTMLDivElement>;
  shellSx?: SxProps<Theme>;
  shellWrapper?: (shell: React.ReactNode) => React.ReactNode;
}

const BackgroundPaper: React.FC<BackgroundPaperProps> = ({
  image,
  children,
  intro,
  showShell = true,
  contentAlign = 'flex-start',
  contentSx,
  contentRef,
  shellSx,
  shellWrapper,
}) => {
  const resolvedImage = getDisplayImage(image, 1600).src;
  const smallImage = getDisplayImage(image, 960).src;
  const appStyles = useAppStyles();
  const shell = <Paper sx={mergeSx(appStyles.backgroundShellSx, shellSx)}>{children}</Paper>;

  return (
    <Grid container component="div" sx={appStyles.backgroundRootSx}>
      <Grid size={12} sx={appStyles.getBackgroundImageSx(resolvedImage, smallImage)}>
        <Box
          ref={contentRef}
          sx={mergeSx(appStyles.getBackgroundContentSx(contentAlign), contentSx)}
        >
          {intro}
          {showShell ? (
            shellWrapper ? (
              shellWrapper(shell)
            ) : (
              shell
            )
          ) : (
            <Box sx={appStyles.backgroundChildrenSx}>{children}</Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BackgroundPaper;
