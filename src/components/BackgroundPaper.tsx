import { Box, Grid, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../styles/appStyles';
import { resolvePublicAssetPath } from '../utils/assets';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
  showShell?: boolean;
  contentAlign?: 'flex-start' | 'center' | 'flex-end';
  contentSx?: SxProps<Theme>;
  shellSx?: SxProps<Theme>;
}

const BackgroundPaper: React.FC<BackgroundPaperProps> = ({
  image,
  children,
  showShell = true,
  contentAlign = 'flex-start',
  contentSx,
  shellSx,
}) => {
  const resolvedImage = resolvePublicAssetPath(image);
  const appStyles = useAppStyles();
  const resolvedContentSx = Array.isArray(contentSx) ? contentSx : contentSx ? [contentSx] : [];
  const resolvedShellSx = Array.isArray(shellSx) ? shellSx : shellSx ? [shellSx] : [];

  return (
    <Grid container component="main" sx={appStyles.backgroundRootSx}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={appStyles.getBackgroundImageSx(resolvedImage)}
      >
        <Box
          sx={[
            appStyles.getBackgroundContentSx(contentAlign),
            ...resolvedContentSx,
          ]}
        >
          {showShell ? (
            <Paper
              elevation={10}
              sx={[
                appStyles.backgroundShellSx,
                ...resolvedShellSx,
              ]}
            >
              {children}
            </Paper>
          ) : (
            <Box sx={appStyles.backgroundChildrenSx}>{children}</Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default BackgroundPaper;
