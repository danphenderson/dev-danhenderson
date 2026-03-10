import { useMemo } from 'react';
import { alpha, SxProps, Theme, useTheme as useMuiTheme } from '@mui/material/styles';

type GitHubChipLayout = 'stack' | 'wrap';

export const useCvStyles = () => {
  const theme = useMuiTheme();

  return useMemo(() => {
    const motionTokens = {
      itemOffsetMs: 120,
      itemStaggerMs: 120,
      sectionStaggerMs: 120,
      githubSubsectionStaggerMs: 120,
      accordionChipStaggerMs: 120,
    } as const;
    const contentListStackSpacing = 2.25;
    const compactSidebarSectionSpacing = 0;
    const accentColor = theme.palette.primary.main;
    const isLight = theme.palette.mode === 'light';
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
      minHeight: dense ? 44 : 52,
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

    const getTabSx = (dense: boolean) => ({
      minHeight: dense ? 44 : 52,
      minWidth: 0,
      maxWidth: 'none',
      px: { xs: 1.25, sm: 1.5 },
      py: dense ? 1 : 1.25,
      fontFamily: 'inherit',
      fontSize: 'inherit',
      lineHeight: 'inherit',
      fontWeight: theme.typography.button.fontWeight,
      letterSpacing: theme.typography.button.letterSpacing,
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      ...interactiveAccentTextSx,
      position: 'relative',
      zIndex: 0,
      borderRadius: 0,
      '&.Mui-selected': {
        ...interactiveAccentTextSx,
        backgroundColor: selectedTabSurface,
        boxShadow: interactiveSurfaceHoverShadow,
        zIndex: 1,
      },
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
      } satisfies SxProps<Theme>,
      overlineSx: {
        color: accentColor,
        letterSpacing: '0.18em',
        fontWeight: 700,
        textTransform: 'uppercase',
      } satisfies SxProps<Theme>,
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
      sectionHeadingTitleSx: (subtitle?: string): SxProps<Theme> => ({
        mb: subtitle ? 1 : 2,
        color: 'text.primary',
      }),
      sectionHeadingSubtitleSx: {
        mb: 2,
        color: 'text.secondary',
      } satisfies SxProps<Theme>,
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
      profileNameRowSx: { rowGap: 0.5 } satisfies SxProps<Theme>,
      profileAvatarSx: {
        width: 96,
        height: 96,
        boxShadow: theme.shadows[6],
        border: `2px solid ${alpha(theme.palette.common.white, isLight ? 0.9 : 0.72)}`,
      } satisfies SxProps<Theme>,
      profileBioSx: { whiteSpace: 'pre-line' } satisfies SxProps<Theme>,
      experienceHeaderRowSx: {
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        alignItems: 'start',
        columnGap: 1.5,
        rowGap: 0.5,
        width: '100%',
      } satisfies SxProps<Theme>,
      experienceIndustryChipSx: {
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
          fontSize: theme.typography.pxToRem(12),
          lineHeight: 1.1,
        },
      } satisfies SxProps<Theme>,
      experienceDescriptionSx: { mt: 1 } satisfies SxProps<Theme>,
      getDetailListSx,
      detailBlockSx: { mt: 1.5 } satisfies SxProps<Theme>,
      educationProgramSx: { mt: 0.75 } satisfies SxProps<Theme>,
      educationMetaSx: { mt: 0.5 } satisfies SxProps<Theme>,
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
        border: subtleBorder,
        backgroundColor: subtleSurface,
        fontWeight: 500,
        color: 'text.primary',
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
      volunteeringMetaSx: {
        textAlign: { xs: 'left', sm: 'right' },
      } satisfies SxProps<Theme>,
    };
  }, [theme]);
};
