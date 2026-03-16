import { alpha, SxProps, Theme } from '@mui/material/styles';
import { SPRING_EASING_CSS } from './springEasing';

type BackgroundContentAlign = 'flex-start' | 'center' | 'flex-end';
type HeaderHighlightTone = 'primary' | 'secondary';
type LoadingBarTone = 'primary' | 'secondary' | 'success';

export const createAppStyleMap = (theme: Theme) => {
  const isLight = theme.palette.mode === 'light';
  const surface = theme.appearanceTreatment.surface;
  const backgroundOverlayColor = alpha(
    theme.palette.common.black,
    surface.backgroundOverlayOpacity
  );
  const shellBackgroundColor = alpha(theme.palette.background.paper, surface.panelSurfaceAlpha);
  const shellBorder = `1px solid ${alpha(theme.palette.divider, surface.panelBorderAlpha)}`;
  const homeHeroShellBackgroundColor = alpha(theme.palette.common.black, isLight ? 0.82 : 0.88);
  const homeHeroShellInnerBorder = `1px solid ${alpha(
    theme.palette.common.white,
    isLight ? 0.1 : 0.08
  )}`;
  const homeHeroShellBlurPx = Math.max(surface.cardBlurPx + 4, 16);
  const homeHeroShellShadow = `0 18px 40px ${alpha(
    theme.palette.common.black,
    isLight ? 0.28 : 0.44
  )}`;
  const photoPlaceholderColor = alpha(theme.palette.text.primary, isLight ? 0.08 : 0.18);
  const photoDownloadShadow = alpha(theme.palette.common.black, isLight ? 0.18 : 0.42);
  const floatingActionBackgroundColor = alpha(
    theme.palette.background.paper,
    Math.min(surface.panelSurfaceAlpha + (isLight ? 0.18 : 0.24), 0.96)
  );
  const floatingActionHoverBackgroundColor = alpha(
    theme.palette.background.paper,
    Math.min(surface.panelSurfaceAlpha + (isLight ? 0.22 : 0.3), 1)
  );
  const floatingActionBorder = `1px solid ${alpha(
    theme.palette.primary.main,
    Math.min(surface.panelBorderAlpha + 0.08, 0.58)
  )}`;
  const floatingActionShadow = isLight
    ? `0 12px 28px ${alpha(theme.palette.common.black, surface.cardShadowAlpha + 0.02)}`
    : `0 14px 30px ${alpha(theme.palette.common.black, surface.cardShadowAlpha)}`;

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

  const getHeaderHighlightSx = (tone: HeaderHighlightTone, animation: string): SxProps<Theme> => {
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

  const getLoadingBarSx = ({
    height,
    trackColor,
    barColor,
    animation,
    animationDelay,
  }: {
    height: number;
    trackColor: string;
    barColor: string;
    animation: string;
    animationDelay: string;
  }): SxProps<Theme> => ({
    height,
    borderRadius: 999,
    backgroundColor: trackColor,
    '& .MuiLinearProgress-bar': {
      borderRadius: 999,
      backgroundColor: barColor,
      animation,
      animationDelay,
    },
  });

  const getLoadingBarToneColors = (tone: LoadingBarTone) => {
    const palette = theme.palette[tone];

    return {
      barColor: palette.main,
      trackColor: alpha(palette.main, theme.palette.mode === 'light' ? 0.16 : 0.25),
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

  const headerSpeedDialSx = {
    position: 'relative',
    overflow: 'visible',
    flexShrink: 0,
  } satisfies SxProps<Theme>;

  const photographyCardSx: SxProps<Theme> = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,
  };

  const photographyGridSx: SxProps<Theme> = {
    display: 'grid',
    gap: 2.5,
    gridTemplateColumns: {
      xs: 'minmax(0, 1fr)',
      sm: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
    alignItems: 'stretch',
  };

  const photographyGridItemSx: SxProps<Theme> = {
    minWidth: 0,
  };

  const photographyCardContentSx: SxProps<Theme> = {
    flexGrow: 1,
  };

  const primaryTextSx: SxProps<Theme> = {
    color: 'text.primary',
  };

  const secondaryTextSx: SxProps<Theme> = {
    color: 'text.secondary',
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
      transition: `transform 180ms ${SPRING_EASING_CSS}`,
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: `linear-gradient(180deg, ${alpha(theme.palette.common.black, 0.58)} 0%, ${alpha(
        theme.palette.common.black,
        0.18
      )} 34%, ${alpha(theme.palette.common.black, 0)} 64%)`,
      opacity: 0,
      pointerEvents: 'none',
      transition: `opacity 180ms ${SPRING_EASING_CSS}`,
    },
    '& .photo-download-action': {
      position: 'absolute',
      top: 1.5,
      right: 1.5,
      zIndex: 1,
      opacity: 0,
      transform: 'translateY(-8px)',
      transition: `opacity 180ms ${SPRING_EASING_CSS}, transform 180ms ${SPRING_EASING_CSS}`,
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
    cvPagePaneSx: {
      height: '100%',
      p: { xs: 2.5, md: 3 },
    } satisfies SxProps<Theme>,
    cvPagePrimaryPaneSx: {
      p: { xs: 2.5, md: 3.5 },
    } satisfies SxProps<Theme>,
    cvDesktopAsideGridItemSx: {
      order: { xs: 2, md: 1 },
    } satisfies SxProps<Theme>,
    cvDesktopMainGridItemSx: {
      order: { xs: 1, md: 2 },
    } satisfies SxProps<Theme>,
    homeHeroContentSx: { pb: 24.25 } satisfies SxProps<Theme>,
    homeHeroShellSx: {
      p: 0,
      backgroundColor: homeHeroShellBackgroundColor,
      backgroundImage: 'none',
      border: homeHeroShellInnerBorder,
      boxShadow: homeHeroShellShadow,
      backdropFilter: `blur(${homeHeroShellBlurPx}px)`,
      WebkitBackdropFilter: `blur(${homeHeroShellBlurPx}px)`,
      borderRadius: 1,
      overflow: 'hidden',
    } satisfies SxProps<Theme>,
    homeHeroTitleSx: {
      color: theme.palette.common.white,
      fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
      lineHeight: 1.5,
    } satisfies SxProps<Theme>,
    headerIconSx,
    photographyGridSx,
    photographyGridItemSx,
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
      ml: 'auto',
    } satisfies SxProps<Theme>,
    headerAppearanceDialSx: {
      ...headerSpeedDialSx,
      '& .MuiSpeedDial-actions': {
        position: 'absolute',
        top: '100%',
        right: 0,
        marginTop: 0,
        flexDirection: 'column',
        [theme.breakpoints.down('md')]: {
          // direction="down" on mobile: drop actions below the FAB
          paddingTop: theme.spacing(1),
        },
        [theme.breakpoints.up('md')]: {
          // direction="down" on desktop: keep actions stacked below the FAB
          paddingTop: theme.spacing(1.5),
        },
      },
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
      color: alpha(theme.palette.common.white, 0.78),
      fontSize: { md: '1.5rem' },
      position: 'relative',
      transition: `color 180ms ${SPRING_EASING_CSS}`,
      '&:hover': {
        color: theme.palette.common.white,
        backgroundColor: alpha(theme.palette.common.white, 0.08),
      },
    } satisfies SxProps<Theme>,
    headerNavButtonActiveSx: {
      color: theme.palette.common.white,
      fontSize: { md: '1.5rem' },
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: 4,
        left: '20%',
        right: '20%',
        height: 2,
        borderRadius: 1,
        backgroundColor: alpha(theme.palette.primary.light, 0.85),
      },
    } satisfies SxProps<Theme>,
    headerAvatarLinkSx: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: '50%',
      transition: `box-shadow 180ms ${SPRING_EASING_CSS}`,
      '&:hover': {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.common.white, 0.3)}`,
      },
      '&:focus-visible': {
        outline: `2px solid ${alpha(theme.palette.primary.light, 0.72)}`,
        outlineOffset: 2,
      },
    } satisfies SxProps<Theme>,
    headerAvatarSx: {
      width: { xs: 36, md: 44 },
      height: { xs: 36, md: 44 },
      border: `2px solid ${alpha(theme.palette.common.white, 0.7)}`,
    } satisfies SxProps<Theme>,
    headerIconButtonSx: {
      color: alpha(theme.palette.common.white, 0.82),
      transition: `color 180ms ${SPRING_EASING_CSS}, background-color 180ms ${SPRING_EASING_CSS}`,
      '&:hover': {
        color: theme.palette.common.white,
        backgroundColor: alpha(theme.palette.common.white, 0.1),
      },
    } satisfies SxProps<Theme>,
    headerAudioControlSx: {
      mr: 0.625,
    } satisfies SxProps<Theme>,
    getHeaderHighlightSx,
    inlineStartSx: { alignSelf: 'flex-start' } satisfies SxProps<Theme>,
    compactSectionHeadingSx: { mb: 0 } satisfies SxProps<Theme>,
    sectionHeadingOffsetSx: { mt: 2 } satisfies SxProps<Theme>,
    sectionLoadingSx: { mt: 1 } satisfies SxProps<Theme>,
    backToTopFabSx: {
      position: 'fixed',
      right: {
        xs: 'calc(env(safe-area-inset-right, 0px) + 16px)',
        md: 'calc(env(safe-area-inset-right, 0px) + 24px)',
      },
      bottom: {
        xs: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        md: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      },
      zIndex: theme.zIndex.appBar - 1,
      color: theme.palette.text.primary,
      backgroundColor: floatingActionBackgroundColor,
      border: floatingActionBorder,
      boxShadow: floatingActionShadow,
      backdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
      WebkitBackdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
      '&:hover': {
        backgroundColor: floatingActionHoverBackgroundColor,
      },
      '&:focus-visible': {
        outline: `2px solid ${alpha(theme.palette.primary.light, 0.72)}`,
        outlineOffset: 3,
      },
    } satisfies SxProps<Theme>,
    cvFloatingDialSx: {
      position: 'fixed',
      right: {
        xs: 'calc(env(safe-area-inset-right, 0px) + 16px)',
        md: 'calc(env(safe-area-inset-right, 0px) + 24px)',
      },
      bottom: {
        xs: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        md: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
      },
      '& .MuiSpeedDial-fab': {
        color: theme.palette.text.primary,
        backgroundColor: floatingActionBackgroundColor,
        border: floatingActionBorder,
        boxShadow: floatingActionShadow,
        backdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
        WebkitBackdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
        '&:hover': {
          backgroundColor: floatingActionHoverBackgroundColor,
        },
      },
      '& .MuiSpeedDialAction-fab': {
        color: theme.palette.text.primary,
        backgroundColor: floatingActionBackgroundColor,
        border: floatingActionBorder,
        boxShadow: floatingActionShadow,
        backdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
        WebkitBackdropFilter: `blur(${surface.cardBlurPx + 2}px)`,
        '&:hover': {
          backgroundColor: floatingActionHoverBackgroundColor,
        },
      },
    } satisfies SxProps<Theme>,
    cvFloatingDialActiveFabSx: {
      '& .MuiSpeedDial-fab': {
        borderColor: alpha(theme.palette.primary.light, isLight ? 0.42 : 0.56),
        boxShadow: `${floatingActionShadow}, 0 0 16px ${alpha(
          theme.palette.primary.main,
          isLight ? 0.18 : 0.28
        )}`,
      },
    } satisfies SxProps<Theme>,
    primaryTextSx,
    secondaryTextSx,
    footerTextSx: {
      color: 'text.secondary',
    } satisfies SxProps<Theme>,
    hintPopoverPaperSx: {
      p: 2,
      maxWidth: 240,
      borderRadius: 2,
      boxShadow: 6,
    } satisfies SxProps<Theme>,
    hintPopoverTitleSx: {
      fontWeight: 600,
    } satisfies SxProps<Theme>,
    hintPopoverBodySx: {
      mt: 1,
      mb: 2,
    } satisfies SxProps<Theme>,
    photographyCardSx,
    photographyCardContentSx,
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
    errorAlertSx: { mb: 1 } satisfies SxProps<Theme>,
    dataGridContainerSx: { width: '100%' } satisfies SxProps<Theme>,
    loadingOverlaySx: { width: '100%', p: 2 } satisfies SxProps<Theme>,
    animatedCardContainerSx: { width: '100%' } satisfies SxProps<Theme>,
    getLoadingBarSx,
    getLoadingBarToneColors,
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
};
