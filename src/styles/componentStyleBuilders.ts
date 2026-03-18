import { alpha, SxProps, Theme } from '@mui/material/styles';
import { ambientPulse, backgroundSweep, breathe, shimmerSweep } from './animations';
import { SPRING_EASING_CSS } from './springEasing';
import { cssDuration } from '../motion/tokens';

type GitHubChipLayout = 'stack' | 'wrap';

export const createComponentStyleMap = (theme: Theme) => {
  const isLight = theme.palette.mode === 'light';
  const { surface, motion, motionScale } = theme.appearanceTreatment;
  const staggerFactor = motionScale.stagger;
  const durationFactor = motionScale.duration;
  const motionTokens = {
    itemOffsetMs: Math.round(120 * staggerFactor),
    itemStaggerMs: Math.round(120 * staggerFactor),
    sectionStaggerMs: Math.round(120 * staggerFactor),
    githubSubsectionStaggerMs: Math.round(120 * staggerFactor),
    accordionChipStaggerMs: Math.round(120 * staggerFactor),
    loadingPulseDurationMs: Math.round(1600 * durationFactor),
    loadingBarStaggerMs: Math.round(200 * staggerFactor),
  } as const;
  const contentListStackSpacing = 2.25;
  const compactSidebarSectionSpacing = 0;
  const cvSectionItemSpacing = 2;
  const accentColor = theme.palette.primary.main;
  const supportAccentColor = theme.palette.secondary.main;
  const supportAccentLight = theme.palette.secondary.light;
  const scaleGlowAlpha = (value: number, strength: number = surface.glowStrength) =>
    Math.min(value * strength, 1);
  const scaleSecondaryGlowAlpha = (
    value: number,
    strength: number = surface.secondaryGlowStrength
  ) => Math.min(value * strength, 1);
  const scaleTextGlowAlpha = (value: number) => Math.min(value * surface.textGlowStrength, 1);
  const cardGradientStart = alpha(
    isLight ? theme.palette.common.white : theme.palette.background.paper,
    surface.cardGradientStartAlpha
  );
  const cardGradientEnd = alpha(
    isLight ? theme.palette.background.paper : theme.palette.background.default,
    surface.cardGradientEndAlpha
  );
  const baseCardBackground = `linear-gradient(145deg, ${cardGradientStart} 0%, ${cardGradientEnd} 100%)`;
  const cardSupportWash = `radial-gradient(120% 120% at 0% 0%, ${alpha(
    supportAccentLight,
    Math.min(surface.secondaryTintAlpha + (isLight ? 0.08 : 0.06), 0.28)
  )} 0%, ${alpha(
    supportAccentColor,
    Math.min(surface.secondaryTintAlpha + (isLight ? 0.02 : 0.04), 0.22)
  )} 30%, ${alpha(supportAccentColor, 0)} 72%)`;
  const cardBackground = `${cardSupportWash}, ${baseCardBackground}`;
  const panelSupportWash = `radial-gradient(140% 140% at 0% 0%, ${alpha(
    supportAccentLight,
    Math.min(surface.secondaryTintAlpha + (isLight ? 0.06 : 0.04), 0.2)
  )} 0%, ${alpha(supportAccentColor, Math.min(surface.secondaryTintAlpha, 0.16))} 26%, ${alpha(
    supportAccentColor,
    0
  )} 72%)`;
  const subtleBorder = `1px solid ${alpha(accentColor, surface.panelBorderAlpha)}`;
  const subtleSurface = alpha(theme.palette.background.paper, surface.panelSurfaceAlpha);
  const subtlePanelBackground = `${panelSupportWash}, linear-gradient(145deg, ${subtleSurface} 0%, ${alpha(
    isLight ? theme.palette.common.white : theme.palette.background.default,
    Math.max(surface.panelSurfaceAlpha - 0.08, 0.18)
  )} 100%)`;
  const supportAccentTint = alpha(supportAccentColor, surface.secondaryTintAlpha);
  const interactiveOutlineColor = alpha(
    accentColor,
    Math.min(surface.panelBorderAlpha + 0.24, 0.9)
  );
  const selectedTabSurface = alpha(accentColor, surface.selectedSurfaceAlpha);
  const compactLabelFontSize = theme.typography.pxToRem(12);
  const compactLabelLineHeight = 1.1;
  const interactiveSurfaceHoverShadow = isLight
    ? `0 0 0 1px ${alpha(
        accentColor,
        Math.min(surface.panelBorderAlpha + 0.12, 0.48)
      )}, 0 8px 20px ${alpha(accentColor, scaleGlowAlpha(0.14))}`
    : `0 0 0 1px ${alpha(
        accentColor,
        Math.min(surface.panelBorderAlpha + 0.16, 0.62)
      )}, 0 10px 24px ${alpha(accentColor, scaleGlowAlpha(0.18))}`;
  const supportInteractiveSurfaceHoverShadow = isLight
    ? `0 0 0 1px ${alpha(
        supportAccentColor,
        Math.min(surface.secondaryBorderAlpha + 0.1, 0.48)
      )}, 0 8px 20px ${alpha(supportAccentColor, scaleSecondaryGlowAlpha(0.16))}`
    : `0 0 0 1px ${alpha(
        supportAccentColor,
        Math.min(surface.secondaryBorderAlpha + 0.14, 0.62)
      )}, 0 10px 24px ${alpha(supportAccentColor, scaleSecondaryGlowAlpha(0.2))}`;
  const githubCalendarBaseTone = alpha(theme.palette.text.primary, isLight ? 0.12 : 0.2);
  const githubCalendarTheme = {
    light: [
      githubCalendarBaseTone,
      alpha(accentColor, scaleGlowAlpha(0.25)),
      alpha(accentColor, scaleGlowAlpha(0.45)),
      alpha(accentColor, scaleGlowAlpha(0.65)),
      alpha(accentColor, scaleGlowAlpha(0.85)),
    ],
    dark: [
      githubCalendarBaseTone,
      alpha(accentColor, scaleGlowAlpha(0.35)),
      alpha(accentColor, scaleGlowAlpha(0.55)),
      alpha(accentColor, scaleGlowAlpha(0.75)),
      accentColor,
    ],
  };

  const getDetailListSx = (marginTop = 1.25, marginBottom = 0): SxProps<Theme> => ({
    pl: 3,
    mt: marginTop,
    mb: marginBottom,
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

  const interactiveAccentTextSx = {
    color: accentColor,
  } satisfies SxProps<Theme>;
  const supportOverlineSx = {
    color: supportAccentColor,
  } satisfies SxProps<Theme>;
  const supportAccentTextSx = {
    color: supportAccentColor,
  } satisfies SxProps<Theme>;
  const supportAccentStrongTextSx = {
    color: supportAccentColor,
    fontWeight: 700,
  } satisfies SxProps<Theme>;
  const supportAccentTitleSx = {
    color: supportAccentColor,
    fontWeight: 700,
  } satisfies SxProps<Theme>;

  const interactiveSurfaceSx = {
    ...theme.typography.button,
    fontFamily: theme.typography.fontFamily,
    ...interactiveAccentTextSx,
    textTransform: 'none',
    transition: `color ${cssDuration.fast} ${SPRING_EASING_CSS}, background-color ${cssDuration.fast} ${SPRING_EASING_CSS}, border-color ${cssDuration.fast} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.fast} ${SPRING_EASING_CSS}`,
    '&:hover': {
      backgroundColor: alpha(
        accentColor,
        Math.max(surface.selectedSurfaceAlpha, isLight ? 0.06 : 0.12)
      ),
      borderColor: alpha(
        accentColor,
        Math.min(surface.cardBorderAlpha + (isLight ? 0.34 : 0.38), 0.84)
      ),
      boxShadow: interactiveSurfaceHoverShadow,
    },
  } satisfies SxProps<Theme>;
  const supportAccentInteractiveSurfaceSx = {
    ...theme.typography.button,
    fontFamily: theme.typography.fontFamily,
    color: supportAccentColor,
    textTransform: 'none',
    borderColor: alpha(supportAccentColor, Math.min(surface.secondaryBorderAlpha + 0.12, 0.72)),
    backgroundColor: alpha(
      supportAccentColor,
      Math.max(surface.secondaryTintAlpha - 0.04, isLight ? 0.06 : 0.12)
    ),
    transition: `color ${cssDuration.fast} ${SPRING_EASING_CSS}, background-color ${cssDuration.fast} ${SPRING_EASING_CSS}, border-color ${cssDuration.fast} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.fast} ${SPRING_EASING_CSS}`,
    '&:hover': {
      backgroundColor: alpha(
        supportAccentColor,
        Math.max(surface.secondaryTintAlpha, isLight ? 0.1 : 0.16)
      ),
      borderColor: alpha(supportAccentColor, Math.min(surface.secondaryBorderAlpha + 0.24, 0.82)),
      boxShadow: supportInteractiveSurfaceHoverShadow,
    },
  } satisfies SxProps<Theme>;

  const getTabPanelSx = () =>
    ({
      border: `1px solid ${interactiveOutlineColor}`,
      backgroundColor: alpha(accentColor, Math.max(surface.selectedSurfaceAlpha - 0.02, 0.04)),
      borderRadius: 2,
      overflow: 'hidden',
    }) satisfies SxProps<Theme>;

  const getTabListSx = (dense: boolean) =>
    ({
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

  const getTabSx = (dense: boolean) =>
    ({
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
      borderRadius: 0,
      ...hoverShimmerSx,
      '&.Mui-selected': {
        ...interactiveAccentTextSx,
        backgroundColor: selectedTabSurface,
        boxShadow: interactiveSurfaceHoverShadow,
        zIndex: 1,
      },
    }) satisfies SxProps<Theme>;

  const getTabPanelBodySx = (dense: boolean, hasTabs: boolean) =>
    ({
      position: 'relative',
      overflow: 'hidden',
      minWidth: 0,
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

  const shimmerGradient = `linear-gradient(90deg, transparent 0%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.04 : 0.08)
  )} 18%, ${alpha(theme.palette.primary.light, scaleGlowAlpha(isLight ? 0.24 : 0.2))} 50%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.12 : 0.16)
  )} 82%, transparent 100%)`;
  const glowShadow = `0 0 12px 2px ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.18 : 0.26)
  )}, 0 0 24px 4px ${alpha(accentColor, scaleGlowAlpha(isLight ? 0.1 : 0.18))}`;
  const supportGlowShadow = `0 0 12px 2px ${alpha(
    supportAccentColor,
    scaleSecondaryGlowAlpha(isLight ? 0.18 : 0.26)
  )}, 0 0 24px 4px ${alpha(supportAccentColor, scaleSecondaryGlowAlpha(isLight ? 0.1 : 0.18))}`;
  const borderGlowShadow = `0 0 18px 2px ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.12 : 0.2)
  )}, 0 0 28px 6px ${alpha(accentColor, scaleGlowAlpha(isLight ? 0.06 : 0.12))}`;
  const chipWaveGradient = `linear-gradient(90deg, transparent 0%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.04 : 0.08)
  )} 18%, ${alpha(theme.palette.primary.light, scaleGlowAlpha(isLight ? 0.18 : 0.16))} 50%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.09 : 0.14)
  )} 82%, transparent 100%)`;
  const cvSectionBorderGradient = `linear-gradient(100deg, ${alpha(accentColor, 0)} 0%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.12 : 0.18)
  )} 18%, ${alpha(theme.palette.primary.light, scaleGlowAlpha(isLight ? 0.52 : 0.4))} 50%, ${alpha(
    accentColor,
    scaleGlowAlpha(isLight ? 0.14 : 0.22)
  )} 82%, ${alpha(accentColor, 0)} 100%)`;
  const cvSectionBottomGlowGradient = `radial-gradient(80% 140% at 50% 100%, ${alpha(
    theme.palette.primary.light,
    scaleGlowAlpha(isLight ? 0.32 : 0.26)
  )} 0%, ${alpha(accentColor, scaleGlowAlpha(isLight ? 0.2 : 0.24))} 38%, ${alpha(
    accentColor,
    0
  )} 100%)`;
  const cvSectionSupportWash = `radial-gradient(130% 130% at 0% 0%, ${alpha(
    supportAccentLight,
    Math.min(surface.secondaryTintAlpha + (isLight ? 0.08 : 0.06), 0.24)
  )} 0%, ${alpha(
    supportAccentColor,
    Math.min(surface.secondaryTintAlpha + 0.02, 0.18)
  )} 24%, ${alpha(supportAccentColor, 0)} 70%)`;
  const hoverShimmerSx =
    motion.tabHoverShimmerMs !== null
      ? {
          position: 'relative' as const,
          zIndex: 0,
          overflow: 'hidden' as const,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: shimmerGradient,
            transform: 'translateX(-100%)',
            opacity: 0,
            transition: `opacity ${cssDuration.normal} ${SPRING_EASING_CSS}`,
            pointerEvents: 'none',
          },
          '&:hover::after': {
            opacity: 1,
            animation: `${shimmerSweep} ${motion.tabHoverShimmerMs}ms linear`,
          },
        }
      : {};

  const sharedPillChipSx = {
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 500,
    color: 'text.primary',
  } satisfies SxProps<Theme>;

  const pillPulseOverlaySx = motion.pillPulseEnabled
    ? {
        position: 'relative' as const,
        overflow: 'visible' as const,
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          boxShadow: glowShadow,
          opacity: 0,
          animation: `${ambientPulse} ${motion.pillPulseMs}ms ease-in-out infinite`,
          pointerEvents: 'none',
        },
      }
    : {};
  const supportPillPulseOverlaySx = motion.pillPulseEnabled
    ? {
        position: 'relative' as const,
        overflow: 'visible' as const,
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -2,
          borderRadius: 'inherit',
          boxShadow: supportGlowShadow,
          opacity: 0,
          animation: `${ambientPulse} ${motion.pillPulseMs}ms ease-in-out infinite`,
          pointerEvents: 'none',
        },
      }
    : {};

  const chipWaveSx = motion.chipWaveEnabled
    ? {
        backgroundImage: chipWaveGradient,
        backgroundSize: '240% 100%',
        backgroundRepeat: 'no-repeat' as const,
        backgroundPosition: '200% center',
        animation: `${backgroundSweep} ${motion.chipWaveMs}ms linear infinite`,
      }
    : {};

  const borderGlowOverlaySx = motion.borderGlowEnabled
    ? {
        position: 'relative' as const,
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -1,
          borderRadius: 'inherit',
          boxShadow: borderGlowShadow,
          opacity: 0,
          animation: `${ambientPulse} ${motion.borderGlowMs}ms ease-in-out infinite`,
          pointerEvents: 'none',
          zIndex: 0,
        },
      }
    : {};

  const textBreatheBaseSx = {
    display: 'inline-block' as const,
    transformOrigin: 'left center',
  } satisfies SxProps<Theme>;

  const statusBreatheSx = motion.statusBreatheEnabled
    ? {
        ...textBreatheBaseSx,
        fontWeight: 600,
        color: supportAccentColor,
        textShadow: `0 0 10px ${alpha(
          supportAccentColor,
          scaleSecondaryGlowAlpha(isLight ? 0.12 : 0.22)
        )}`,
        animation: `${breathe} ${motion.statusBreatheMs}ms ease-in-out infinite`,
      }
    : {
        fontWeight: 600,
        color: supportAccentColor,
      };

  const sectionHeadingTextBreatheSx = motion.headingBreatheEnabled
    ? {
        ...textBreatheBaseSx,
        textShadow: `0 0 8px ${alpha(accentColor, scaleTextGlowAlpha(isLight ? 0.08 : 0.16))}`,
        animation: `${breathe} ${motion.headingBreatheMs}ms ease-in-out infinite`,
      }
    : {};

  const sectionHeadingOverlineTextSx = motion.headingBreatheEnabled
    ? {
        ...sectionHeadingTextBreatheSx,
        animationDelay: '0ms',
      }
    : {};

  const sectionHeadingTitleTextSx = motion.headingBreatheEnabled
    ? {
        ...sectionHeadingTextBreatheSx,
        animationDelay: '120ms',
      }
    : {};

  const sectionHeadingSubtitleTextSx = motion.headingBreatheEnabled
    ? {
        ...sectionHeadingTextBreatheSx,
        animationDelay: '240ms',
      }
    : {};

  const getChipWaveDelaySx = (index: number, interval = motion.chipWaveDelaySeconds) =>
    motion.chipWaveEnabled
      ? {
          animationDelay: `${index * interval}s`,
        }
      : {};

  const getGitHubChipSx = (layout: GitHubChipLayout): SxProps<Theme> => ({
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 600,
    color: 'text.primary',
    width: layout === 'stack' ? '100%' : 'auto',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    ...hoverShimmerSx,
    '& .MuiChip-icon': {
      alignSelf: 'center',
      ml: 0.5,
      mr: 0.5,
      fontSize: 18,
      color: supportAccentColor,
      position: 'relative',
      zIndex: 1,
    },
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      textOverflow: 'clip',
      lineHeight: 1.4,
      px: 1,
      py: 0.25,
      overflowWrap: 'anywhere',
      position: 'relative',
      zIndex: 1,
    },
  });

  return {
    motionTokens,
    contentListStackSpacing,
    contentCardSx: {
      borderRadius: 3,
      border: `1px solid ${alpha(accentColor, surface.cardBorderAlpha)}`,
      background: cardBackground,
      boxShadow: isLight
        ? `0 10px 28px ${alpha(
            theme.palette.text.primary,
            Math.max(surface.cardShadowAlpha, 0.08)
          )}`
        : `0 12px 32px ${alpha(theme.palette.common.black, surface.cardShadowAlpha)}`,
      backdropFilter: `blur(${surface.cardBlurPx}px)`,
      p: { xs: 2, md: 2.5 },
      transition: `border-color ${cssDuration.fast} ${SPRING_EASING_CSS}, transform ${cssDuration.fast} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.fast} ${SPRING_EASING_CSS}`,
      ...borderGlowOverlaySx,
    } satisfies SxProps<Theme>,
    cvSectionCardSx: {
      position: 'relative',
      overflow: 'hidden',
      isolation: 'isolate',
      background: `${cvSectionSupportWash}, ${cardBackground}`,
      '& > *': {
        position: 'relative',
        zIndex: 1,
      },
      ...(surface.sectionBottomGlowOpacity > 0
        ? {
            '&::before': {
              content: '""',
              position: 'absolute',
              left: '10%',
              right: '10%',
              bottom: -14,
              height: 56,
              borderRadius: '999px',
              background: cvSectionBottomGlowGradient,
              filter: `blur(${surface.cardBlurPx + 2}px)`,
              opacity: surface.sectionBottomGlowOpacity,
              ...(motion.sectionBottomGlowAnimated
                ? {
                    animation: `${ambientPulse} ${motion.sectionBottomGlowMs}ms ease-in-out infinite`,
                  }
                : {}),
              pointerEvents: 'none',
              zIndex: 0,
            },
          }
        : {}),
      ...(surface.sectionBorderSweepOpacity > 0
        ? {
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              padding: '1px',
              borderRadius: 'inherit',
              background: cvSectionBorderGradient,
              ...(motion.sectionBorderSweepEnabled
                ? {
                    backgroundSize: '220% 100%',
                    backgroundPosition: '200% center',
                    animation: `${backgroundSweep} ${motion.sectionBorderSweepMs}ms linear infinite`,
                  }
                : {}),
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              opacity: surface.sectionBorderSweepOpacity,
              boxShadow: 'none',
              pointerEvents: 'none',
              zIndex: 0,
            },
          }
        : {}),
    } satisfies SxProps<Theme>,
    sectionNavigatorLeadSx: {
      color: accentColor,
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 30,
      flexShrink: 0,
      whiteSpace: 'nowrap',
      lineHeight: 1,
      textTransform: 'none',
    } satisfies SxProps<Theme>,
    overlineSx: {
      color: accentColor,
      letterSpacing: '0.18em',
      fontWeight: 700,
      textTransform: 'uppercase',
    } satisfies SxProps<Theme>,
    supportOverlineSx,
    sectionHeadingOverlineTextSx: sectionHeadingOverlineTextSx satisfies SxProps<Theme>,
    sectionTitleSx: {
      color: 'text.primary',
      fontWeight: 700,
    } satisfies SxProps<Theme>,
    supportAccentTitleSx,
    secondaryStrongSx: {
      color: 'text.secondary',
      fontWeight: 700,
    } satisfies SxProps<Theme>,
    supportAccentTextSx,
    supportAccentStrongTextSx,
    secondaryItalicSx: {
      color: 'text.secondary',
      fontStyle: 'italic',
    } satisfies SxProps<Theme>,
    secondaryTextSx: { color: 'text.secondary' } satisfies SxProps<Theme>,
    primaryTextSx: { color: 'text.primary' } satisfies SxProps<Theme>,
    sectionHeadingTitleSx: (subtitle?: string) =>
      ({
        mb: subtitle ? 1 : 2,
        color: 'text.primary',
      }) satisfies SxProps<Theme>,
    sectionHeadingTitleTextSx: sectionHeadingTitleTextSx satisfies SxProps<Theme>,
    sectionHeadingSubtitleSx: {
      mb: 2,
      color: 'text.secondary',
    } satisfies SxProps<Theme>,
    sectionHeadingSubtitleTextSx: sectionHeadingSubtitleTextSx satisfies SxProps<Theme>,
    sectionHeadingCompactSx: { mb: 0 } satisfies SxProps<Theme>,
    sectionPanelSx: {
      borderRadius: 1.5,
      border: subtleBorder,
      background: subtlePanelBackground,
      p: 1,
    } satisfies SxProps<Theme>,
    cardResetSx: cardResetSx satisfies SxProps<Theme>,
    compactSidebarSectionSpacing,
    cvSectionItemSpacing,
    wrapItemContainerSx: { width: 'auto' } satisfies SxProps<Theme>,
    minWidthResetSx: { minWidth: 0 } satisfies SxProps<Theme>,
    interactiveSurfaceSx: interactiveSurfaceSx satisfies SxProps<Theme>,
    supportAccentInteractiveSurfaceSx,
    getSectionDelayMs,
    getItemDelayMs,
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
    cvEntryTitleRowSx: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
      alignItems: 'start',
      columnGap: 1.5,
      rowGap: 0.5,
      width: '100%',
    } satisfies SxProps<Theme>,
    cvEntryOrganizationRowSx: {
      display: 'grid',
      gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) auto' },
      alignItems: 'start',
      columnGap: 1.5,
      rowGap: 0.75,
      width: '100%',
    } satisfies SxProps<Theme>,
    cvEntryChipGroupSx: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 0.75,
      alignItems: 'flex-start',
      justifyContent: { xs: 'flex-start', sm: 'flex-end' },
      justifySelf: { xs: 'stretch', sm: 'end' },
      width: { xs: '100%', sm: 'auto' },
      maxWidth: '100%',
      minWidth: 0,
    } satisfies SxProps<Theme>,
    cvEntryChipSx: {
      borderColor: supportAccentColor,
      color: supportAccentColor,
      backgroundColor: supportAccentTint,
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
      ...supportPillPulseOverlaySx,
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
      color: supportAccentColor,
    } satisfies SxProps<Theme>,
    contributionCardSx: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1.5,
      textDecoration: 'none',
      transition: `transform ${cssDuration.fast} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.fast} ${SPRING_EASING_CSS}`,
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
      color: supportAccentColor,
    } satisfies SxProps<Theme>,
    contributionCardBodySx: {
      flex: 1,
      minWidth: 0,
    } satisfies SxProps<Theme>,
    contributionCardMetaRowSx: {
      flexShrink: 0,
    } satisfies SxProps<Theme>,
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
      color: supportAccentColor,
    } satisfies SxProps<Theme>,
    statusBreatheSx,
    chipWaveSx,
    getChipWaveDelaySx,
  };
};
