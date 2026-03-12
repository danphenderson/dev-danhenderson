import { alpha, SxProps, Theme } from '@mui/material/styles';
import {
  ambientPulse,
  backgroundSweep,
  breathe,
  reducedMotionSx,
  shimmerSweep,
} from './animations';

type GitHubChipLayout = 'stack' | 'wrap';

export const createComponentStyleMap = (theme: Theme) => {
  const motionTokens = {
    itemOffsetMs: 120,
    itemStaggerMs: 120,
    sectionStaggerMs: 120,
    githubSubsectionStaggerMs: 120,
    accordionChipStaggerMs: 120,
    loadingPulseDurationMs: 1600,
    loadingBarStaggerMs: 200,
  } as const;
  const contentListStackSpacing = 2.25;
  const compactSidebarSectionSpacing = 0;
  const accentColor = theme.palette.primary.main;
  const isLight = theme.palette.mode === 'light';
  const ambientMotion = {
    tabHoverShimmerMs: 400,
    pillPulseMs: 4200,
    chipWaveMs: 7600,
    borderGlowMs: 6800,
    cvSectionBorderSweepMs: 5400,
    cvSectionBottomGlowMs: 4200,
    statusBreatheMs: 2800,
    chipWaveDelaySeconds: 0.55,
  } as const;
  const cardGradientStart = alpha(
    isLight ? theme.palette.common.white : theme.palette.background.paper,
    isLight ? 0.92 : 0.84
  );
  const cardGradientEnd = alpha(
    isLight ? theme.palette.background.paper : theme.palette.background.default,
    isLight ? 0.84 : 0.88
  );
  const cardBackground = `linear-gradient(145deg, ${cardGradientStart} 0%, ${cardGradientEnd} 100%)`;
  const subtleBorder = `1px solid ${alpha(accentColor, isLight ? 0.2 : 0.38)}`;
  const subtleSurface = alpha(theme.palette.background.paper, isLight ? 0.74 : 0.58);
  const accentTint = alpha(accentColor, isLight ? 0.14 : 0.24);
  const interactiveOutlineColor = accentColor;
  const selectedTabSurface = alpha(accentColor, isLight ? 0.1 : 0.2);
  const compactLabelFontSize = theme.typography.pxToRem(12);
  const compactLabelLineHeight = 1.1;
  const interactiveSurfaceHoverShadow = isLight
    ? `0 0 0 1px ${alpha(accentColor, 0.24)}, 0 8px 20px ${alpha(accentColor, 0.14)}`
    : `0 0 0 1px ${alpha(accentColor, 0.34)}, 0 10px 24px ${alpha(accentColor, 0.18)}`;
  const githubCalendarBaseTone = alpha(theme.palette.text.primary, isLight ? 0.12 : 0.2);
  const githubCalendarTheme = {
    light: [
      githubCalendarBaseTone,
      alpha(accentColor, 0.25),
      alpha(accentColor, 0.45),
      alpha(accentColor, 0.65),
      alpha(accentColor, 0.85),
    ],
    dark: [
      githubCalendarBaseTone,
      alpha(accentColor, 0.35),
      alpha(accentColor, 0.55),
      alpha(accentColor, 0.75),
      accentColor,
    ],
  };

  const getDetailListSx = (marginTop = 1.25, marginBottom = 0): SxProps<Theme> => ({
    pl: 3,
    mt: marginTop,
    mb: marginBottom,
  });

  const getGitHubChipSx = (layout: GitHubChipLayout): SxProps<Theme> => ({
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 600,
    color: 'text.primary',
    width: layout === 'stack' ? '100%' : 'auto',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& .MuiChip-icon': {
      alignSelf: 'center',
      ml: 0.5,
      mr: 0.5,
      fontSize: 18,
      color: 'text.secondary',
    },
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      textOverflow: 'clip',
      lineHeight: 1.4,
      px: 1,
      py: 0.25,
      overflowWrap: 'anywhere',
    },
  });

  const getWrapListSx = (gap: number): SxProps<Theme> => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap,
  });

  const getSectionDelayMs = (
    index: number,
    startDelayMs: number = 0,
    staggerMs: number = motionTokens.sectionStaggerMs
  ) => startDelayMs + index * staggerMs;

  const getItemDelayMs = (
    index: number,
    startDelayMs: number = motionTokens.itemOffsetMs,
    staggerMs: number = motionTokens.itemStaggerMs
  ) => startDelayMs + index * staggerMs;

  const getAnimatedZoomItemSx = (delayMs: number): SxProps<Theme> => ({
    transitionDelay: `${delayMs}ms`,
  });

  const interactiveAccentTextSx = {
    color: accentColor,
  } satisfies SxProps<Theme>;

  const interactiveSurfaceSx = {
    ...theme.typography.button,
    fontFamily: theme.typography.fontFamily,
    ...interactiveAccentTextSx,
    textTransform: 'none',
    transition: 'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
    '&:hover': {
      backgroundColor: alpha(accentColor, isLight ? 0.08 : 0.16),
      borderColor: alpha(accentColor, isLight ? 0.72 : 0.84),
      boxShadow: interactiveSurfaceHoverShadow,
    },
  } satisfies SxProps<Theme>;

  const getTabPanelSx = () => ({
    border: `1px solid ${interactiveOutlineColor}`,
    backgroundColor: alpha(accentColor, 0.04),
    borderRadius: 2,
    overflow: 'hidden',
  }) satisfies SxProps<Theme>;

  const getTabListSx = (dense: boolean) => ({
    minHeight: dense ? 36 : 40,
    px: 0,
    backgroundColor: 'transparent',
    '& .MuiTabs-flexContainer': {
      gap: 0,
    },
    '& .MuiTabs-indicator': {
      display: 'none',
    },
    '& .MuiTabs-scrollButtons': {
      color: 'text.secondary',
    },
  }) satisfies SxProps<Theme>;

  const shimmerGradient = `linear-gradient(90deg, transparent 0%, ${alpha(accentColor, isLight ? 0.04 : 0.08)} 18%, ${alpha(theme.palette.primary.light, isLight ? 0.24 : 0.2)} 50%, ${alpha(accentColor, isLight ? 0.12 : 0.16)} 82%, transparent 100%)`;
  const glowShadow = `0 0 12px 2px ${alpha(accentColor, isLight ? 0.18 : 0.26)}, 0 0 24px 4px ${alpha(accentColor, isLight ? 0.10 : 0.18)}`;
  const borderGlowShadow = `0 0 18px 2px ${alpha(accentColor, isLight ? 0.12 : 0.2)}, 0 0 28px 6px ${alpha(accentColor, isLight ? 0.06 : 0.12)}`;
  const chipWaveGradient = `linear-gradient(90deg, transparent 0%, ${alpha(accentColor, isLight ? 0.04 : 0.08)} 18%, ${alpha(theme.palette.primary.light, isLight ? 0.18 : 0.16)} 50%, ${alpha(accentColor, isLight ? 0.09 : 0.14)} 82%, transparent 100%)`;
  const cvSectionBorderGradient = `linear-gradient(100deg, ${alpha(accentColor, 0)} 0%, ${alpha(accentColor, isLight ? 0.12 : 0.18)} 18%, ${alpha(theme.palette.primary.light, isLight ? 0.52 : 0.4)} 50%, ${alpha(accentColor, isLight ? 0.14 : 0.22)} 82%, ${alpha(accentColor, 0)} 100%)`;
  const cvSectionBottomGlowGradient = `radial-gradient(80% 140% at 50% 100%, ${alpha(theme.palette.primary.light, isLight ? 0.32 : 0.26)} 0%, ${alpha(accentColor, isLight ? 0.2 : 0.24)} 38%, ${alpha(accentColor, 0)} 100%)`;

  const getTabSx = (dense: boolean) => ({
    minHeight: dense ? 36 : 40,
    minWidth: 0,
    maxWidth: 'none',
    px: { xs: 1.25, sm: 1.5 },
    py: dense ? 0.75 : 1,
    fontFamily: 'inherit',
    fontSize: compactLabelFontSize,
    lineHeight: compactLabelLineHeight,
    fontWeight: theme.typography.button.fontWeight,
    letterSpacing: theme.typography.button.letterSpacing,
    alignItems: 'flex-start',
    justifyContent: 'center',
    textAlign: 'left',
    ...interactiveAccentTextSx,
    position: 'relative',
    zIndex: 0,
    borderRadius: 0,
    overflow: 'hidden',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: shimmerGradient,
      transform: 'translateX(-100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
    '&:hover::after': {
      opacity: 1,
      animation: `${shimmerSweep} ${ambientMotion.tabHoverShimmerMs}ms linear`,
    },
    '&.Mui-selected': {
      ...interactiveAccentTextSx,
      backgroundColor: selectedTabSurface,
      boxShadow: interactiveSurfaceHoverShadow,
      zIndex: 1,
    },
    ...reducedMotionSx,
  }) satisfies SxProps<Theme>;

  const getTabPanelBodySx = (dense: boolean, hasTabs: boolean) => ({
    px: { xs: 1.25, sm: 1.5 },
    pt: hasTabs ? (dense ? 1.25 : 1.5) : 0,
    pb: dense ? 1.25 : 1.5,
    borderTop: hasTabs ? `1px solid ${interactiveOutlineColor}` : 'none',
  }) satisfies SxProps<Theme>;

  const cardResetSx = {
    p: 0,
    border: 'none',
    background: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
    backdropFilter: 'none',
  };

  const sharedPillChipSx = {
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 500,
    color: 'text.primary',
  } satisfies SxProps<Theme>;

  const pillPulseOverlaySx = {
    position: 'relative' as const,
    overflow: 'visible' as const,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -2,
      borderRadius: 'inherit',
      boxShadow: glowShadow,
      opacity: 0,
      animation: `${ambientPulse} ${ambientMotion.pillPulseMs}ms ease-in-out infinite`,
      pointerEvents: 'none',
    },
    ...reducedMotionSx,
  };

  const chipWaveSx = {
    backgroundImage: chipWaveGradient,
    backgroundSize: '240% 100%',
    backgroundRepeat: 'no-repeat' as const,
    backgroundPosition: '200% center',
    animation: `${backgroundSweep} ${ambientMotion.chipWaveMs}ms linear infinite`,
    ...reducedMotionSx,
  };

  const borderGlowOverlaySx = {
    position: 'relative' as const,
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: -1,
      borderRadius: 'inherit',
      boxShadow: borderGlowShadow,
      opacity: 0,
      animation: `${ambientPulse} ${ambientMotion.borderGlowMs}ms ease-in-out infinite`,
      pointerEvents: 'none',
      zIndex: 0,
    },
    ...reducedMotionSx,
  };

  const textBreatheSx = {
    display: 'inline-block' as const,
    transformOrigin: 'left center',
    animation: `${breathe} ${ambientMotion.statusBreatheMs}ms ease-in-out infinite`,
    ...reducedMotionSx,
  };

  const statusBreatheSx = {
    ...textBreatheSx,
    fontWeight: 600,
    textShadow: `0 0 10px ${alpha(accentColor, isLight ? 0.12 : 0.22)}`,
  };

  const sectionHeadingTextBreatheSx = {
    ...textBreatheSx,
    textShadow: `0 0 8px ${alpha(accentColor, isLight ? 0.08 : 0.16)}`,
  };

  const sectionHeadingOverlineTextSx = {
    ...sectionHeadingTextBreatheSx,
    animationDelay: '0ms',
  };

  const sectionHeadingTitleTextSx = {
    ...sectionHeadingTextBreatheSx,
    animationDelay: '120ms',
  };

  const sectionHeadingSubtitleTextSx = {
    ...sectionHeadingTextBreatheSx,
    animationDelay: '240ms',
  };

  const getChipWaveDelaySx = (index: number, interval = ambientMotion.chipWaveDelaySeconds) => ({
    animationDelay: `${index * interval}s`,
  });

  return {
    motionTokens,
    contentListStackSpacing,
    accentColor,
    accentTint,
    contentCardSx: {
      borderRadius: 3,
      border: `1px solid ${alpha(accentColor, isLight ? 0.26 : 0.4)}`,
      background: cardBackground,
      boxShadow: isLight
        ? `0 10px 28px ${alpha(theme.palette.text.primary, 0.16)}`
        : `0 12px 32px ${alpha(theme.palette.common.black, 0.35)}`,
      backdropFilter: 'blur(10px)',
      p: { xs: 2, md: 2.5 },
      transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
      ...borderGlowOverlaySx,
    } satisfies SxProps<Theme>,
    cvSectionCardSx: {
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      '& > *': {
        position: 'relative',
        zIndex: 1,
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        left: '10%',
        right: '10%',
        bottom: -14,
        height: 56,
        borderRadius: '999px',
        background: cvSectionBottomGlowGradient,
        filter: 'blur(12px)',
        opacity: isLight ? 0.6 : 0.72,
        animation: `${ambientPulse} ${ambientMotion.cvSectionBottomGlowMs}ms ease-in-out infinite`,
        pointerEvents: 'none',
        zIndex: 0,
      },
      '&::after': {
        content: '""',
        position: 'absolute',
        inset: 0,
        padding: '1px',
        borderRadius: 'inherit',
        background: cvSectionBorderGradient,
        backgroundSize: '220% 100%',
        backgroundPosition: '200% center',
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        opacity: isLight ? 0.92 : 0.84,
        boxShadow: 'none',
        animation: `${backgroundSweep} ${ambientMotion.cvSectionBorderSweepMs}ms linear infinite`,
        pointerEvents: 'none',
        zIndex: 0,
      },
      ...reducedMotionSx,
    } satisfies SxProps<Theme>,
    sectionNavigatorRootSx: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 0.75,
      width: '100%',
      borderRadius: 1.5,
      border: subtleBorder,
      backgroundColor: subtleSurface,
      p: 1,
    } satisfies SxProps<Theme>,
    sectionNavigatorLeadSx: {
      color: accentColor,
      whiteSpace: 'nowrap',
      lineHeight: 1,
    } satisfies SxProps<Theme>,
    sectionNavigatorRailSx: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.75,
      alignItems: 'center',
      minWidth: 0,
      width: '100%',
    } satisfies SxProps<Theme>,
    sectionNavigatorChipSx: {
      ...sharedPillChipSx,
      height: 32,
      cursor: 'pointer',
      '& .MuiChip-label': {
        px: 1.25,
        whiteSpace: 'nowrap',
      },
      '&:hover': {
        backgroundColor: alpha(accentColor, isLight ? 0.1 : 0.16),
        borderColor: alpha(accentColor, isLight ? 0.36 : 0.52),
        boxShadow: interactiveSurfaceHoverShadow,
      },
      '&.Mui-focusVisible': {
        outline: `2px solid ${alpha(theme.palette.primary.light, 0.72)}`,
        outlineOffset: 2,
      },
    } satisfies SxProps<Theme>,
    overlineSx: {
      color: accentColor,
      letterSpacing: '0.18em',
      fontWeight: 700,
      textTransform: 'uppercase',
    } satisfies SxProps<Theme>,
    sectionHeadingOverlineTextSx: sectionHeadingOverlineTextSx satisfies SxProps<Theme>,
    sectionTitleSx: {
      color: 'text.primary',
      fontWeight: 700,
    } satisfies SxProps<Theme>,
    secondaryStrongSx: {
      color: 'text.secondary',
      fontWeight: 700,
    } satisfies SxProps<Theme>,
    secondaryItalicSx: {
      color: 'text.secondary',
      fontStyle: 'italic',
    } satisfies SxProps<Theme>,
    secondaryTextSx: { color: 'text.secondary' } satisfies SxProps<Theme>,
    primaryTextSx: { color: 'text.primary' } satisfies SxProps<Theme>,
    sectionHeadingTitleSx: (subtitle?: string) => ({
      mb: subtitle ? 1 : 2,
      color: 'text.primary',
    } satisfies SxProps<Theme>),
    sectionHeadingTitleTextSx: sectionHeadingTitleTextSx satisfies SxProps<Theme>,
    sectionHeadingSubtitleSx: {
      mb: 2,
      color: 'text.secondary',
    } satisfies SxProps<Theme>,
    sectionHeadingSubtitleTextSx: sectionHeadingSubtitleTextSx satisfies SxProps<Theme>,
    sectionHeadingCompactSx: { mb: 0 } satisfies SxProps<Theme>,
    subtleBorder,
    subtleSurface,
    sectionPanelSx: {
      borderRadius: 1.5,
      border: subtleBorder,
      backgroundColor: subtleSurface,
      p: 1,
    } satisfies SxProps<Theme>,
    cardResetSx: cardResetSx satisfies SxProps<Theme>,
    compactSidebarSectionSpacing,
    chipWrapperSx: {
      width: '100%',
      ...cardResetSx,
    } satisfies SxProps<Theme>,
    wrapItemContainerSx: { width: 'auto' } satisfies SxProps<Theme>,
    fullWidthSx: { width: '100%' } satisfies SxProps<Theme>,
    minWidthResetSx: { minWidth: 0 } satisfies SxProps<Theme>,
    interactiveAccentTextSx,
    interactiveSurfaceSx: interactiveSurfaceSx satisfies SxProps<Theme>,
    getSectionDelayMs,
    getItemDelayMs,
    getAnimatedZoomItemSx,
    getGitHubChipSx,
    getWrapListSx,
    profileHeaderRowSx: {
      width: '100%',
      position: 'relative',
      display: { xs: 'block', sm: 'grid' },
      gridTemplateColumns: { sm: 'minmax(0, 1fr) auto' },
      columnGap: { sm: 1.5 },
      rowGap: { sm: 0.75 },
      alignItems: 'start',
    } satisfies SxProps<Theme>,
    profileHeaderContentSx: {
      minWidth: 0,
      pr: { xs: 7, sm: 0 },
    } satisfies SxProps<Theme>,
    profileNameRowSx: { rowGap: 0.5 } satisfies SxProps<Theme>,
    profileMetaRowSx: {
      width: '100%',
      alignItems: 'center',
      flexWrap: 'wrap',
      columnGap: 1,
      rowGap: 0.5,
    } satisfies SxProps<Theme>,
    profileMetaContentSx: {
      flex: '1 1 auto',
      minWidth: 0,
    } satisfies SxProps<Theme>,
    profileInlineActionsSx: {
      display: 'flex',
      alignItems: 'center',
      justifySelf: 'end',
      alignSelf: 'start',
      position: { xs: 'absolute', sm: 'static' },
      top: { xs: 0, sm: 'auto' },
      right: { xs: 0, sm: 'auto' },
      pt: 0.25,
      flexShrink: 0,
    } satisfies SxProps<Theme>,
    profileAvatarSx: {
      width: 96,
      height: 96,
      boxShadow: theme.shadows[6],
      border: `2px solid ${alpha(theme.palette.common.white, isLight ? 0.9 : 0.72)}`,
    } satisfies SxProps<Theme>,
    profileBioSx: { whiteSpace: 'pre-line' } satisfies SxProps<Theme>,
    cvEntryHeaderRowSx: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'start',
      columnGap: 1.5,
      rowGap: 0.5,
      width: '100%',
    } satisfies SxProps<Theme>,
    cvEntryChipSx: {
      borderColor: accentColor,
      ...interactiveAccentTextSx,
      backgroundColor: accentTint,
      fontWeight: 600,
      justifySelf: 'end',
      alignSelf: 'flex-start',
      flexShrink: 0,
      height: 24,
      '& .MuiChip-label': {
        px: 1.125,
        fontSize: compactLabelFontSize,
        lineHeight: compactLabelLineHeight,
      },
      ...pillPulseOverlaySx,
    } satisfies SxProps<Theme>,
    cvEntrySupportingMetaSx: { mt: 0.5 } satisfies SxProps<Theme>,
    experienceDescriptionSx: { mt: 1 } satisfies SxProps<Theme>,
    getDetailListSx,
    detailBlockSx: { mt: 1.5 } satisfies SxProps<Theme>,
    codingExampleLinkSx: {
      color: 'text.primary',
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'underline',
      },
    } satisfies SxProps<Theme>,
    contributionInlineLabelSx: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 0.75,
      flexWrap: 'wrap',
    } satisfies SxProps<Theme>,
    contributionInlineNameSx: {
      fontWeight: 600,
      color: 'text.primary',
      overflowWrap: 'anywhere',
    } satisfies SxProps<Theme>,
    contributionInlineMetaSx: {
      fontWeight: 600,
      color: 'text.secondary',
    } satisfies SxProps<Theme>,
    contributionCardSx: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1.5,
      textDecoration: 'none',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      p: 1.5,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 6,
      },
    } satisfies SxProps<Theme>,
    contributionCardNameSx: {
      color: 'text.primary',
      fontWeight: 700,
      overflowWrap: 'anywhere',
    } satisfies SxProps<Theme>,
    contributionCardMetaSx: {
      fontWeight: 600,
      color: 'text.secondary',
    } satisfies SxProps<Theme>,
    contributionCardBodySx: {
      flex: 1,
      minWidth: 0,
    } satisfies SxProps<Theme>,
    contributionCardMetaRowSx: {
      flexShrink: 0,
    } satisfies SxProps<Theme>,
    contributionCardInsetSx: { p: { xs: 1.5, md: 2 } } satisfies SxProps<Theme>,
    githubCalendarContainerSx: {
      mt: 0.5,
      borderRadius: 1.5,
      border: subtleBorder,
      backgroundColor: subtleSurface,
      p: { xs: 1, md: 1.25 },
      minWidth: 0,
      overflowX: 'auto',
      '& .react-activity-calendar': {
        width: '100%',
        minWidth: 0,
        color: theme.palette.text.primary,
      },
      '& .react-activity-calendar__legend-colors > span': {
        borderRadius: 0.5,
        border: subtleBorder,
      },
      '& .react-activity-calendar__count': {
        color: theme.palette.text.primary,
        fontWeight: 700,
      },
    } satisfies SxProps<Theme>,
    githubCalendarColorScheme: theme.palette.mode,
    githubCalendarTheme,
    githubCalendarSizeSx: { width: '100%', minHeight: 140 } satisfies SxProps<Theme>,
    getTabPanelSx,
    getTabListSx,
    getTabSx,
    getTabPanelBodySx,
    skillsChipSx: {
      ...sharedPillChipSx,
      ...pillPulseOverlaySx,
    } satisfies SxProps<Theme>,
    skillsWrapSx: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.75,
    } satisfies SxProps<Theme>,
    contentCardInsetSx: { p: { xs: 1.5, md: 2 } } satisfies SxProps<Theme>,
    certificateActionSx: {
      mt: 1,
      color: accentColor,
    } satisfies SxProps<Theme>,
    statusBreatheSx,
    chipWaveSx,
    getChipWaveDelaySx,
  };
};
