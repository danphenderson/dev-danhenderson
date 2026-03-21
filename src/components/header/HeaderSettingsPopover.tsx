import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import MotionPhotosAutoOutlinedIcon from '@mui/icons-material/MotionPhotosAutoOutlined';
import MotionPhotosOffOutlinedIcon from '@mui/icons-material/MotionPhotosOffOutlined';
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import {
  Box,
  Divider,
  IconButton,
  Popover,
  Stack,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { type ReactNode, useCallback, useState } from 'react';
import {
  type AppAppearanceKey,
  appAppearancePresets,
  appAppearanceOptions,
  type MotionIntensityLevel,
} from '../../theme/appAppearance';
import { cssDuration } from '../../motion/tokens';
import { useMotionScale } from '../../motion';
import { SPRING_EASING_CSS } from '../../styles/springEasing';

/* ------------------------------------------------------------------ */
/*  Appearance swatch                                                 */
/* ------------------------------------------------------------------ */

type SwatchProps = {
  primaryColor: string;
  secondaryColor: string;
  selected: boolean;
  label: string;
  onClick: () => void;
};

const AppearanceSwatch = ({
  primaryColor,
  secondaryColor,
  selected,
  label,
  onClick,
}: SwatchProps) => (
  <Tooltip title={label} placement="top">
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      tabIndex={selected ? 0 : -1}
      sx={{
        width: 28,
        height: 28,
        p: 0,
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.primary.main}`
            : `1.5px solid ${alpha(theme.palette.divider, 0.3)}`,
        borderRadius: '50%',
        background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 52%, ${secondaryColor} 52%, ${secondaryColor} 100%)`,
        cursor: 'pointer',
        transition: `transform ${cssDuration.fast} ${SPRING_EASING_CSS}, border-color ${cssDuration.fast} ${SPRING_EASING_CSS}, box-shadow ${cssDuration.fast} ${SPRING_EASING_CSS}`,
        transform: selected ? 'scale(1.1)' : 'scale(1)',
        boxShadow: (theme) =>
          selected ? `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}` : 'none',
        '&:hover': {
          transform: 'scale(1.15)',
        },
        '&:focus-visible': {
          outline: (theme) => `2px solid ${theme.palette.primary.main}`,
          outlineOffset: 2,
        },
      }}
    />
  </Tooltip>
);

/* ------------------------------------------------------------------ */
/*  Motion level metadata                                             */
/* ------------------------------------------------------------------ */

const MOTION_LEVELS: {
  key: MotionIntensityLevel;
  label: string;
  icon: ReactNode;
}[] = [
  { key: 'off', label: 'Off', icon: <MotionPhotosOffOutlinedIcon sx={{ fontSize: 16 }} /> },
  { key: 'subtle', label: 'Subtle', icon: <SlowMotionVideoOutlinedIcon sx={{ fontSize: 16 }} /> },
  {
    key: 'default',
    label: 'Default',
    icon: <MotionPhotosAutoOutlinedIcon sx={{ fontSize: 16 }} />,
  },
  {
    key: 'expressive',
    label: 'Expressive',
    icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 16 }} />,
  },
];

/* ------------------------------------------------------------------ */
/*  Section heading                                                   */
/* ------------------------------------------------------------------ */

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <Typography
    variant="overline"
    sx={{
      fontSize: '0.625rem',
      fontWeight: 600,
      letterSpacing: '0.1em',
      color: 'text.secondary',
      lineHeight: 1,
    }}
  >
    {children}
  </Typography>
);

/* ------------------------------------------------------------------ */
/*  HeaderSettingsPopover                                              */
/* ------------------------------------------------------------------ */

export type HeaderSettingsPopoverProps = {
  /* Theme */
  mode: PaletteMode;
  onToggleTheme: () => void;
  /* Appearance */
  appearance: AppAppearanceKey;
  onChangeAppearance: (appearance: AppAppearanceKey) => void;
  /* Motion */
  motionIntensity: MotionIntensityLevel;
  effectiveMotionIntensity: MotionIntensityLevel;
  isSystemMotionOverrideActive: boolean;
  onChangeMotionIntensity: (level: MotionIntensityLevel) => void;
  /* Audio */
  showAudioControl: boolean;
  isPlaying: boolean;
  onToggleAudio: () => void;
};

export const HeaderSettingsPopover = ({
  mode,
  onToggleTheme,
  appearance,
  onChangeAppearance,
  motionIntensity,
  effectiveMotionIntensity,
  isSystemMotionOverrideActive,
  onChangeMotionIntensity,
  showAudioControl,
  isPlaying,
  onToggleAudio,
}: HeaderSettingsPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const { duration: dFactor } = useMotionScale();

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMotionChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: MotionIntensityLevel | null
  ) => {
    if (value !== null) {
      onChangeMotionIntensity(value);
    }
  };

  const activePreset = appAppearancePresets[appearance];
  const effectiveMotionLevel =
    MOTION_LEVELS.find((level) => level.key === effectiveMotionIntensity) ?? MOTION_LEVELS[0];
  const POPOVER_BASE_DURATION_MS = 200;
  const popoverTransitionDuration =
    dFactor === 0 ? 0 : Math.round(POPOVER_BASE_DURATION_MS * dFactor);

  /* Arrow-key navigation for the appearance radiogroup */
  const handleSwatchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keys: Record<string, number> = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1,
      };
      const delta = keys[event.key];
      if (delta === undefined) return;

      event.preventDefault();
      const currentIndex = appAppearanceOptions.findIndex((o) => o.key === appearance);
      const nextIndex =
        (currentIndex + delta + appAppearanceOptions.length) % appAppearanceOptions.length;
      const nextKey = appAppearanceOptions[nextIndex].key;
      onChangeAppearance(nextKey);

      /* Move focus to the newly selected swatch */
      const group = event.currentTarget;
      const radios = group.querySelectorAll<HTMLElement>('[role="radio"]');
      radios[nextIndex]?.focus();
    },
    [appearance, onChangeAppearance]
  );

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          onClick={handleOpen}
          aria-label="Open settings"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          size="small"
          sx={{
            color: (theme) => alpha(theme.palette.common.white, 0.82),
            transition: `color ${cssDuration.quick} ${SPRING_EASING_CSS}, background-color ${cssDuration.quick} ${SPRING_EASING_CSS}`,
            '&:hover': {
              color: 'common.white',
              backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
            },
          }}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        transitionDuration={popoverTransitionDuration}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2.5,
              minWidth: 260,
              maxWidth: 300,
              p: 2.5,
              boxShadow: (theme) =>
                `0 8px 32px ${alpha(
                  theme.palette.common.black,
                  theme.palette.mode === 'light' ? 0.12 : 0.4
                )}`,
            },
          },
        }}
      >
        <Stack spacing={2.5} data-testid="settings-popover-content">
          {/* ---- Theme mode ---- */}
          <Stack spacing={1}>
            <SectionLabel>Theme</SectionLabel>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                {mode === 'dark' ? (
                  <DarkModeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                ) : (
                  <LightModeOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                )}
                <Typography variant="body2" color="text.primary" id="theme-switch-label">
                  Dark mode
                </Typography>
              </Stack>
              <Switch
                checked={mode === 'dark'}
                onChange={onToggleTheme}
                size="small"
                inputProps={{
                  'aria-labelledby': 'theme-switch-label',
                  'aria-label': 'Toggle dark mode',
                }}
              />
            </Stack>
          </Stack>

          <Divider />

          {/* ---- Appearance presets ---- */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <SectionLabel>Appearance</SectionLabel>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}
                data-testid="active-appearance-label"
              >
                {activePreset.label}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              spacing={1}
              role="radiogroup"
              aria-label="Appearance presets"
              onKeyDown={handleSwatchKeyDown}
              sx={{ flexWrap: 'wrap', gap: 1 }}
            >
              {appAppearanceOptions.map((option) => {
                const optionPalette = option.palette[mode];
                return (
                  <AppearanceSwatch
                    key={option.key}
                    primaryColor={optionPalette.primary.main}
                    secondaryColor={optionPalette.secondary.main}
                    selected={option.key === appearance}
                    label={option.key === appearance ? `${option.label} (active)` : option.label}
                    onClick={() => onChangeAppearance(option.key)}
                  />
                );
              })}
            </Stack>
          </Stack>

          <Divider />

          {/* ---- Motion intensity ---- */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="baseline" justifyContent="space-between">
              <SectionLabel>Motion</SectionLabel>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', fontSize: '0.6875rem' }}
                data-testid="active-motion-label"
              >
                {effectiveMotionLevel.label}
              </Typography>
            </Stack>
            <ToggleButtonGroup
              value={motionIntensity}
              exclusive
              onChange={handleMotionChange}
              aria-label="Motion intensity"
              size="small"
              disabled={isSystemMotionOverrideActive}
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                '& .MuiToggleButton-root': {
                  width: 36,
                  minWidth: 36,
                  height: 32,
                  p: 0,
                  borderRadius: 1.25,
                  border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.45),
                  },
                  '&.Mui-selected:hover': {
                    backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.14),
                  },
                },
                '& .MuiToggleButtonGroup-grouped': {
                  margin: 0,
                },
              }}
            >
              {MOTION_LEVELS.map((level) => {
                const tooltipLabel =
                  level.key === motionIntensity ? `${level.label} (active)` : level.label;

                return (
                  <Tooltip key={level.key} title={tooltipLabel} placement="top">
                    <span>
                      <ToggleButton value={level.key} aria-label={level.label}>
                        {level.icon}
                      </ToggleButton>
                    </span>
                  </Tooltip>
                );
              })}
            </ToggleButtonGroup>
            {isSystemMotionOverrideActive && (
              <Stack
                direction="row"
                spacing={0.5}
                alignItems="flex-start"
                data-testid="reduced-motion-notice"
              >
                <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary', mt: '1px' }} />
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                  Reduced motion is active (OS&nbsp;setting)
                </Typography>
              </Stack>
            )}
          </Stack>

          {/* ---- Audio control ---- */}
          {showAudioControl && (
            <>
              <Divider />
              <Stack spacing={1}>
                <SectionLabel>Welcome audio</SectionLabel>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.primary">
                    {isPlaying ? 'Now playing' : 'Paused'}
                  </Typography>
                  <Tooltip title={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}>
                    <IconButton
                      size="small"
                      onClick={onToggleAudio}
                      aria-label={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
                    >
                      {isPlaying ? (
                        <PauseCircleOutlineIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
            </>
          )}
        </Stack>
      </Popover>
    </>
  );
};
