import { useMemo } from 'react';
import { alpha, SxProps, Theme, useTheme } from '@mui/material/styles';

type BackgroundContentAlign = 'flex-start' | 'center' | 'flex-end';
type HeaderHighlightTone = 'primary' | 'secondary';

export const useAppStyles = () => {
  const theme = useTheme();

  return useMemo(() => {
    const isLight = theme.palette.mode === 'light';
    const backgroundOverlayColor = alpha(theme.palette.common.black, isLight ? 0.4 : 0.6);
    const shellBackgroundColor = alpha(theme.palette.background.paper, isLight ? 0.72 : 0.6);
    const shellBorder = `1px solid ${alpha(theme.palette.divider, 0.5)}`;
    const photoPlaceholderColor = alpha(theme.palette.text.primary, isLight ? 0.08 : 0.18);
    const photoDownloadShadow = alpha(theme.palette.common.black, isLight ? 0.18 : 0.42);

    const getBackgroundImageSx = (resolvedImage: string): SxProps<Theme> => ({
      backgroundImage: `url('${resolvedImage}')`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      minHeight: '100vh',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        backgroundColor: backgroundOverlayColor,
      },
    });

    const getBackgroundContentSx = (contentAlign: BackgroundContentAlign): SxProps<Theme> => ({
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: contentAlign,
      minHeight: '100vh',
      width: '100%',
      py: 6.25,
    });

    const getHeaderHighlightSx = (
      tone: HeaderHighlightTone,
      animation: string
    ): SxProps<Theme> => {
      const palette = tone === 'primary' ? theme.palette.primary : theme.palette.secondary;
      const ringColor = alpha(palette.light, tone === 'secondary' ? 0.95 : 0.9);
      const glowColor = alpha(palette.main, 0.35);

      return {
        position: 'relative',
        overflow: 'visible',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: `2px solid ${ringColor}`,
          animation,
          pointerEvents: 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          boxShadow: `0 0 0 3px ${glowColor}`,
          pointerEvents: 'none',
        },
      };
    };

    const pageFrameContainerSx: SxProps<Theme> = {
      mx: 'auto',
      px: { xs: 1.5, md: 3 },
      py: { xs: 2, md: 3 },
    };

    const cvPageContainerSx: SxProps<Theme> = {
      px: { xs: 1.5, md: 5 },
      py: { xs: 2, md: 4 },
    };

    const headerIconSx: SxProps<Theme> = {
      fontSize: { xs: 26, md: 30 },
    };

    const photographyCardSx: SxProps<Theme> = {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 1.5,
    };

    const quiltedImageItemSx: SxProps<Theme> = {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      '& img': {
        display: 'block',
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 180ms ease',
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.58)} 0%, ${alpha(theme.palette.common.black, 0.18)} 34%, ${alpha(theme.palette.common.black, 0)} 64%)`,
        opacity: 0,
        pointerEvents: 'none',
        transition: 'opacity 180ms ease',
      },
      '& .photo-download-action': {
        position: 'absolute',
        top: 1.5,
        right: 1.5,
        zIndex: 1,
        opacity: 0,
        transform: 'translateY(-8px)',
        transition: 'opacity 180ms ease, transform 180ms ease',
      },
      '&:hover img, &:focus-within img': {
        transform: 'scale(1.02)',
      },
      '&:hover::after, &:focus-within::after': {
        opacity: 1,
      },
      '&:hover .photo-download-action, &:focus-within .photo-download-action': {
        opacity: 1,
        transform: 'translateY(0)',
      },
      '@media (hover: none), (pointer: coarse)': {
        '&::after': {
          opacity: 0.74,
        },
        '& .photo-download-action': {
          opacity: 1,
          transform: 'translateY(0)',
        },
      },
    };

    return {
      backgroundRootSx: { minHeight: '100vh' } satisfies SxProps<Theme>,
      getBackgroundImageSx,
      getBackgroundContentSx,
      backgroundShellSx: {
        backgroundColor: shellBackgroundColor,
        p: 2,
        borderRadius: 2,
        border: shellBorder,
        boxShadow: theme.shadows[6],
      } satisfies SxProps<Theme>,
      backgroundChildrenSx: { width: '100%' } satisfies SxProps<Theme>,
      pageFrameContainerSx,
      cvPageContainerSx,
      resumeDownloadContainerSx: {
        display: 'flex',
        justifyContent: 'flex-end',
        mb: { xs: 1.5, md: 2 },
      } satisfies SxProps<Theme>,
      resumeDownloadButtonSx: {
        width: { xs: '100%', sm: 'auto' },
      } satisfies SxProps<Theme>,
      cvSidebarPaneSx: {
        height: '100%',
        p: { xs: 2.5, md: 3 },
      } satisfies SxProps<Theme>,
      cvMainPaneSx: {
        p: { xs: 2.5, md: 3.5 },
      } satisfies SxProps<Theme>,
      homeHeroContentSx: { pb: 24.25 } satisfies SxProps<Theme>,
      homeHeroShellSx: { p: 1.5, pb: 0.5 } satisfies SxProps<Theme>,
      homeHeroTitleSx: {
        color: theme.palette.common.white,
        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
        lineHeight: 1.5,
      } satisfies SxProps<Theme>,
      headerIconSx,
      headerToolbarSx: {
        px: { xs: 1.5, md: 2.5 },
        gap: { xs: 1.5, md: 2.5 },
        minHeight: { xs: 64, md: 80 },
      } satisfies SxProps<Theme>,
      headerOffsetToolbarSx: {
        minHeight: { xs: 64, md: 80 },
      } satisfies SxProps<Theme>,
      headerActionsContainerSx: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexShrink: 0,
        ml: { xs: 'auto', md: 0 },
      } satisfies SxProps<Theme>,
      headerNavLeadSx: {
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 0.5, md: 1 },
        flexShrink: 0,
      } satisfies SxProps<Theme>,
      headerNavDesktopSx: {
        flexGrow: 1,
        display: { xs: 'none', md: 'flex' },
        justifyContent: 'center',
        minWidth: 0,
      } satisfies SxProps<Theme>,
      headerNavButtonSx: {
        color: theme.palette.common.white,
        fontSize: { md: '1.5rem' },
      } satisfies SxProps<Theme>,
      headerAvatarButtonSx: {
        p: { xs: 0.5, md: 0.625 },
      } satisfies SxProps<Theme>,
      headerAvatarSx: {
        width: { xs: 40, md: 50 },
        height: { xs: 40, md: 50 },
        border: `2.5px solid ${alpha(theme.palette.common.white, 0.8)}`,
      } satisfies SxProps<Theme>,
      headerAudioControlSx: {
        mr: 0.625,
      } satisfies SxProps<Theme>,
      getHeaderHighlightSx,
      inlineStartSx: { alignSelf: 'flex-start' } satisfies SxProps<Theme>,
      compactSectionHeadingSx: { mb: 0 } satisfies SxProps<Theme>,
      sectionLoadingSx: { mt: 1 } satisfies SxProps<Theme>,
      photographyCardSx,
      photographyMediaSx: {
        position: 'relative',
        borderRadius: 1.5,
        overflow: 'hidden',
        pt: '70%',
        backgroundColor: photoPlaceholderColor,
      } satisfies SxProps<Theme>,
      photographyImageSx: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      } satisfies SxProps<Theme>,
      albumSectionSx: { p: { xs: 1.5, md: 2 } } satisfies SxProps<Theme>,
      climbingCardSx: { p: { xs: 2.5, md: 3.5 } } satisfies SxProps<Theme>,
      sectionLeadSx: {
        color: 'text.secondary',
        fontWeight: 700,
      } satisfies SxProps<Theme>,
      dataGridContainerSx: { width: '100%' } satisfies SxProps<Theme>,
      loadingOverlaySx: { width: '100%', p: 2 } satisfies SxProps<Theme>,
      quiltedImageItemSx,
      photoDownloadButtonSx: {
        color: theme.palette.text.primary,
        backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.9 : 0.82),
        border: `1px solid ${alpha(theme.palette.primary.main, isLight ? 0.28 : 0.5)}`,
        boxShadow: `0 10px 24px ${photoDownloadShadow}`,
        backdropFilter: 'blur(12px)',
        '&:hover': {
          backgroundColor: alpha(theme.palette.background.paper, isLight ? 0.98 : 0.92),
        },
        '&:focus-visible': {
          outline: `2px solid ${alpha(theme.palette.primary.light, 0.7)}`,
          outlineOffset: 2,
        },
      } satisfies SxProps<Theme>,
    };
  }, [theme]);
};
