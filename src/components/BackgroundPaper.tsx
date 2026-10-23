import type { Ref } from 'react';
import { useEffect, useState } from 'react';
import { Box, Grid, Paper, useMediaQuery, useTheme } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { useAppStyles } from '../styles/appStyles';
import { resolvePublicAssetPath } from '../utils/assets';
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

/**
 * CSS backgrounds have no error event, so probe the derivative the active
 * breakpoint actually paints and fall back to the original photograph if it
 * fails. Probing that same URL reuses the browser cache instead of adding a
 * download.
 */
const useBackgroundImageFallback = (image: string) => {
  const theme = useTheme();
  const isMedium = useMediaQuery(theme.breakpoints.up('md'));
  const resolvedImage = getDisplayImage(image, 1600).src;
  const smallImage = getDisplayImage(image, 960).src;
  const original = resolvePublicAssetPath(image);
  const paintedImage = isMedium ? resolvedImage : smallImage;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);

    if (paintedImage === original) {
      return;
    }

    const probe = new Image();
    let active = true;
    probe.onerror = () => {
      if (active) setFailed(true);
    };
    probe.src = paintedImage;

    return () => {
      active = false;
      probe.onerror = null;
    };
  }, [paintedImage, original]);

  return failed
    ? { resolvedImage: original, smallImage: original }
    : { resolvedImage, smallImage };
};

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
  const { resolvedImage, smallImage } = useBackgroundImageFallback(image);
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
