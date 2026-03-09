import { useMemo } from 'react';
import { alpha, SxProps, Theme, useTheme as useMuiTheme } from '@mui/material/styles';

export const useCvStyles = () => {
  const theme = useMuiTheme();

  const styles = useMemo(() => {
    const accentColor = theme.palette.primary.main;
    const isLight = theme.palette.mode === 'light';
    const cardBackground = isLight
      ? 'linear-gradient(145deg, rgba(255,255,255,0.92) 0%, rgba(242,250,255,0.84) 100%)'
      : 'linear-gradient(145deg, rgba(11,25,46,0.84) 0%, rgba(9,20,37,0.88) 100%)';

    const glassPanelSx: SxProps<Theme> = {
      background: cardBackground,
      border: `1px solid ${alpha(accentColor, isLight ? 0.24 : 0.36)}`,
      boxShadow: isLight
        ? '0 12px 32px rgba(15, 34, 56, 0.18)'
        : '0 14px 36px rgba(0, 0, 0, 0.38)',
      backdropFilter: 'blur(12px)',
      color: theme.palette.text.primary,
    };

    const contentCardSx: SxProps<Theme> = {
      borderRadius: 3,
      border: `1px solid ${alpha(accentColor, isLight ? 0.26 : 0.4)}`,
      background: cardBackground,
      boxShadow: isLight
        ? '0 10px 28px rgba(15, 34, 56, 0.16)'
        : '0 12px 32px rgba(0, 0, 0, 0.35)',
      backdropFilter: 'blur(10px)',
      p: { xs: 2, md: 2.5 },
      transition: 'border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
    };

    const overlineSx: SxProps<Theme> = {
      color: accentColor,
      letterSpacing: '0.18em',
      fontWeight: 700,
      textTransform: 'uppercase',
    };

    const linkStyle = { color: theme.palette.primary.light, textDecoration: 'none' as const };
    const subtleBorder = `1px solid ${alpha(accentColor, isLight ? 0.2 : 0.38)}`;
    const subtleSurface = alpha(theme.palette.background.paper, isLight ? 0.74 : 0.58);
    const accentTint = alpha(accentColor, isLight ? 0.14 : 0.24);

    return {
      accentColor,
      accentTint,
      glassPanelSx,
      contentCardSx,
      overlineSx,
      linkStyle,
      subtleBorder,
      subtleSurface,
    };
  }, [theme]);

  return styles;
};
