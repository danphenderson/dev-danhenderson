import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { Box } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import { motion } from 'motion/react';
import type { MutableRefObject } from 'react';
import { useState } from 'react';
import { type AppAppearanceKey, appAppearanceOptions } from '../../theme/appAppearance';
import { cssDuration } from '../../motion/tokens';
import { SPRING_EASING_CSS } from '../../styles/springEasing';
import { useAppStyles } from '../../styles/appStyles';
import { AppSpeedDial, type AppSpeedDialAction } from '../AppSpeedDial';

/* ------------------------------------------------------------------ */
/*  AppearanceSwatchIcon                                              */
/* ------------------------------------------------------------------ */

type AppearanceSwatchIconProps = {
  primaryColor: string;
  secondaryColor: string;
  selected: boolean;
  dimmed?: boolean;
};

const AppearanceSwatchIcon = ({
  primaryColor,
  secondaryColor,
  selected,
  dimmed = false,
}: AppearanceSwatchIconProps) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'relative',
      width: 22,
      height: 22,
      borderRadius: '50%',
      border: (theme) =>
        `1px solid ${alpha(
          theme.palette.common.white,
          theme.palette.mode === 'light' ? 0.7 : 0.34
        )}`,
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 52%, ${secondaryColor} 52%, ${secondaryColor} 100%)`,
      transform: selected ? 'scale(1.12)' : 'scale(1)',
      transition: [
        `transform ${cssDuration.fast} ${SPRING_EASING_CSS}`,
        `opacity ${cssDuration.fast} ease`,
        `box-shadow ${cssDuration.fast} ease`,
      ].join(', '),
      opacity: dimmed && !selected ? 0.55 : 1,
      boxShadow: (theme) => {
        if (!selected) return 'none';
        const whiteAlpha = alpha(
          theme.palette.common.white,
          theme.palette.mode === 'light' ? 0.88 : 0.5
        );
        const primaryGlow = alpha(
          theme.palette.primary.main,
          theme.palette.mode === 'light' ? 0.4 : 0.55
        );
        return `0 0 0 3px ${whiteAlpha}, 0 0 0 5px ${primaryGlow}`;
      },
    }}
  />
);

/* ------------------------------------------------------------------ */
/*  Dock proximity scale helper                                       */
/* ------------------------------------------------------------------ */

const PROXIMITY_SCALES = [1.38, 1.2, 1.08] as const;

const getProximityScale = (
  actionId: string,
  hoveredId: string | null,
  orderedIds: string[]
): number => {
  if (!hoveredId) return 1;
  const hoveredIdx = orderedIds.indexOf(hoveredId);
  const targetIdx = orderedIds.indexOf(actionId);
  if (hoveredIdx === -1 || targetIdx === -1) return 1;
  const distance = Math.abs(targetIdx - hoveredIdx);
  return distance < PROXIMITY_SCALES.length ? PROXIMITY_SCALES[distance] : 1;
};

/* ------------------------------------------------------------------ */
/*  HeaderAppearanceDial                                              */
/* ------------------------------------------------------------------ */

export type HeaderAppearanceDialProps = {
  appearance: AppAppearanceKey;
  iconButtonSize: 'small' | 'medium' | 'large';
  mode: PaletteMode;
  onChangeAppearance: (appearance: AppAppearanceKey) => void;
  onToggleTheme: () => void;
  controlRef?: MutableRefObject<HTMLElement | null>;
  triggerDescriptionId?: string;
  triggerHighlightSx?: SxProps<Theme>;
};

export const HeaderAppearanceDial = ({
  appearance,
  iconButtonSize,
  mode,
  onChangeAppearance,
  onToggleTheme,
  controlRef,
  triggerDescriptionId,
  triggerHighlightSx,
}: HeaderAppearanceDialProps) => {
  const theme = useMuiTheme();
  const appStyles = useAppStyles();
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

  const orderedIds = ['theme-toggle', ...appAppearanceOptions.map((o) => o.key)];

  const handleContainerRef = (node: HTMLDivElement | null) => {
    if (controlRef) {
      controlRef.current = node;
    }
  };

  const wrapWithDockScale = (id: string, icon: React.ReactNode) => (
    <motion.div
      animate={{ scale: getProximityScale(id, hoveredActionId, orderedIds) }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {icon}
    </motion.div>
  );

  const actions: AppSpeedDialAction[] = [
    {
      id: 'theme-toggle',
      label: `Switch to ${mode === 'light' ? 'dark' : 'light'} mode`,
      icon: wrapWithDockScale(
        'theme-toggle',
        mode === 'light' ? (
          <DarkModeOutlinedIcon fontSize="small" />
        ) : (
          <LightModeOutlinedIcon fontSize="small" />
        )
      ),
      onClick: () => onToggleTheme(),
      onMouseEnter: () => setHoveredActionId('theme-toggle'),
      onMouseLeave: () => setHoveredActionId(null),
    },
    ...appAppearanceOptions.map((option) => {
      const optionPalette = option.palette[theme.palette.mode];
      const isActive = option.key === appearance;
      const isDimmed = !!(hoveredActionId && !isActive && option.key !== hoveredActionId);

      return {
        id: option.key,
        label: isActive
          ? `Use ${option.label} appearance (active)`
          : `Use ${option.label} appearance`,
        icon: wrapWithDockScale(
          option.key,
          <AppearanceSwatchIcon
            primaryColor={optionPalette.primary.main}
            secondaryColor={optionPalette.secondary.main}
            selected={isActive}
            dimmed={isDimmed}
          />
        ),
        onClick: () => onChangeAppearance(option.key),
        onMouseEnter: () => setHoveredActionId(option.key),
        onMouseLeave: () => setHoveredActionId(null),
      };
    }),
  ];

  return (
    <Box ref={handleContainerRef}>
      <AppSpeedDial
        ariaLabel="Open appearance presets"
        icon={<PaletteOutlinedIcon />}
        actions={actions}
        direction="down"
        layer="header"
        actionTooltipPlacement="left"
        FabProps={{
          size: iconButtonSize,
          'aria-describedby': triggerDescriptionId,
          sx: triggerHighlightSx,
        }}
        sx={appStyles.headerAppearanceDialSx}
      />
    </Box>
  );
};
