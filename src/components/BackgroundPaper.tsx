import type { Ref } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../styles/appStyles';
import { resolvePublicAssetPath } from '../utils/assets';
import { mergeSx } from '../utils/sx';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
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
  showShell = true,
  contentAlign = 'flex-start',
  contentSx,
  contentRef,
  shellSx,
  shellWrapper,
}) => {
  const resolvedImage = resolvePublicAssetPath(image);
  const appStyles = useAppStyles();
  const shell = <Paper sx={mergeSx(appStyles.backgroundShellSx, shellSx)}>{children}</Paper>;

  return (
    <Grid container component="main" sx={appStyles.backgroundRootSx}>
      <Grid item xs={12} sm={12} md={12} sx={appStyles.getBackgroundImageSx(resolvedImage)}>
        <Box
          ref={contentRef}
          sx={mergeSx(appStyles.getBackgroundContentSx(contentAlign), contentSx)}
        >
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
