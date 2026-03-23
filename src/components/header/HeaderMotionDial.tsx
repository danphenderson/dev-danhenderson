import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import MotionPhotosAutoOutlinedIcon from '@mui/icons-material/MotionPhotosAutoOutlined';
import MotionPhotosOffOutlinedIcon from '@mui/icons-material/MotionPhotosOffOutlined';
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { SxProps, Theme } from '@mui/material/styles';
import { motion } from 'motion/react';
import type { MutableRefObject } from 'react';
import { useState } from 'react';
import type { MotionIntensityLevel } from '../../theme/appAppearance';
import { cssDuration } from '../../motion/tokens';
import { SPRING_EASING_CSS } from '../../styles/springEasing';
import { useAppStyles } from '../../styles/appStyles';
import { AppSpeedDial, type AppSpeedDialAction } from '../AppSpeedDial';
import { getProximityScale } from './dockScale';

/* ------------------------------------------------------------------ */
/*  Level icon with active indicator                                  */
/* ------------------------------------------------------------------ */

type MotionLevelIconProps = {
  active: boolean;
  children: React.ReactNode;
};

const MotionLevelIcon = ({ active, children }: MotionLevelIconProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transform: active ? 'scale(1.12)' : 'scale(1)',
      transition: [
        `transform ${cssDuration.fast} ${SPRING_EASING_CSS}`,
        `box-shadow ${cssDuration.fast} ease`,
      ].join(', '),
      boxShadow: (theme) => {
        if (!active) return 'none';
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
      borderRadius: '50%',
      width: 22,
      height: 22,
    }}
  >
    {children}
  </Box>
);

/* ------------------------------------------------------------------ */
/*  Level metadata                                                    */
/* ------------------------------------------------------------------ */

const MOTION_LEVELS: {
  key: MotionIntensityLevel;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: 'off', label: 'Motion off', icon: <MotionPhotosOffOutlinedIcon sx={{ fontSize: 18 }} /> },
  {
    key: 'subtle',
    label: 'Subtle motion',
    icon: <SlowMotionVideoOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    key: 'default',
    label: 'Default motion',
    icon: <MotionPhotosAutoOutlinedIcon sx={{ fontSize: 18 }} />,
  },
  {
    key: 'expressive',
    label: 'Expressive motion',
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 18 }} />,
  },
];

/* ------------------------------------------------------------------ */
/*  HeaderMotionDial                                                  */
/* ------------------------------------------------------------------ */

export type HeaderMotionDialProps = {
  motionIntensity: MotionIntensityLevel;
  onChangeMotionIntensity: (level: MotionIntensityLevel) => void;
  iconButtonSize: 'small' | 'medium' | 'large';
  controlRef?: MutableRefObject<HTMLElement | null>;
  triggerHighlightSx?: SxProps<Theme>;
};

export const HeaderMotionDial = ({
  motionIntensity,
  onChangeMotionIntensity,
  iconButtonSize,
  controlRef,
  triggerHighlightSx,
}: HeaderMotionDialProps) => {
  const appStyles = useAppStyles();
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);
  const orderedIds = MOTION_LEVELS.map((l) => l.key);

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

  const actions: AppSpeedDialAction[] = MOTION_LEVELS.map((level) => {
    const isActive = level.key === motionIntensity;
    return {
      id: level.key,
      label: isActive ? `${level.label} (active)` : level.label,
      icon: wrapWithDockScale(
        level.key,
        <MotionLevelIcon active={isActive}>{level.icon}</MotionLevelIcon>
      ),
      onClick: () => onChangeMotionIntensity(level.key),
      onMouseEnter: () => setHoveredActionId(level.key),
      onMouseLeave: () => setHoveredActionId(null),
    };
  });

  return (
    <Box ref={handleContainerRef}>
      <AppSpeedDial
        ariaLabel="Open motion intensity presets"
        icon={<TuneOutlinedIcon />}
        actions={actions}
        direction="down"
        layer="header"
        actionTooltipPlacement="left"
        FabProps={{
          size: iconButtonSize,
          sx: triggerHighlightSx,
        }}
        sx={appStyles.headerAppearanceDialSx}
      />
    </Box>
  );
};
