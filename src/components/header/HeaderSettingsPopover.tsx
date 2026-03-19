import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
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
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import { alpha, type SxProps, type Theme } from '@mui/material/styles';
import { type MutableRefObject, type ReactNode, useState } from 'react';
import {
  type AppAppearanceKey,
  appAppearanceOptions,
  type MotionIntensityLevel,
} from '../../theme/appAppearance';
import { cssDuration } from '../../motion/tokens';
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

const AppearanceSwatch = ({ primaryColor, secondaryColor, selected, label, onClick }: SwatchProps) => (
  <Tooltip title={label} placement="top">
    <Box
      component="button"
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
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
  onChangeMotionIntensity: (level: MotionIntensityLevel) => void;
  /* Audio */
  showAudioControl: boolean;
  isPlaying: boolean;
  onToggleAudio: () => void;
  /* Refs & hints */
  settingsButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  triggerHighlightSx?: SxProps<Theme>;
};

export const HeaderSettingsPopover = ({
  mode,
  onToggleTheme,
  appearance,
  onChangeAppearance,
  motionIntensity,
  onChangeMotionIntensity,
  showAudioControl,
  isPlaying,
  onToggleAudio,
  settingsButtonRef,
  triggerHighlightSx,
}: HeaderSettingsPopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMotionChange = (_event: React.MouseEvent<HTMLElement>, value: MotionIntensityLevel | null) => {
    if (value !== null) {
      onChangeMotionIntensity(value);
    }
  };

  return (
    <>
      <Tooltip title="Settings">
        <IconButton
          ref={settingsButtonRef}
          onClick={handleOpen}
          aria-label="Open settings"
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          size="small"
          sx={[
            {
              color: (theme) => alpha(theme.palette.common.white, 0.82),
              transition: `color ${cssDuration.quick} ${SPRING_EASING_CSS}, background-color ${cssDuration.quick} ${SPRING_EASING_CSS}`,
              '&:hover': {
                color: 'common.white',
                backgroundColor: (theme) => alpha(theme.palette.common.white, 0.1),
              },
            },
            ...(triggerHighlightSx
              ? Array.isArray(triggerHighlightSx)
                ? triggerHighlightSx
                : [triggerHighlightSx]
              : []),
          ]}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
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
                `0 8px 32px ${alpha(theme.palette.common.black, theme.palette.mode === 'light' ? 0.12 : 0.4)}`,
            },
          },
        }}
      >
        <Stack spacing={2.5} data-testid="settings-popover-content">
          {/* ---- Theme mode ---- */}
          <Stack spacing={1}>
            <SectionLabel>Theme</SectionLabel>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.primary">
                {mode === 'dark' ? 'Dark mode' : 'Light mode'}
              </Typography>
              <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
                <IconButton
                  size="small"
                  onClick={onToggleTheme}
                  aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
                >
                  {mode === 'light' ? (
                    <DarkModeOutlinedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <LightModeOutlinedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          <Divider />

          {/* ---- Appearance presets ---- */}
          <Stack spacing={1}>
            <SectionLabel>Appearance</SectionLabel>
            <Stack
              direction="row"
              spacing={1}
              role="radiogroup"
              aria-label="Appearance presets"
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
                    label={
                      option.key === appearance
                        ? `${option.label} (active)`
                        : option.label
                    }
                    onClick={() => onChangeAppearance(option.key)}
                  />
                );
              })}
            </Stack>
          </Stack>

          <Divider />

          {/* ---- Motion intensity ---- */}
          <Stack spacing={1}>
            <SectionLabel>Motion</SectionLabel>
            <ToggleButtonGroup
              value={motionIntensity}
              exclusive
              onChange={handleMotionChange}
              aria-label="Motion intensity"
              size="small"
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  py: 0.5,
                  gap: 0.5,
                },
              }}
            >
              {MOTION_LEVELS.map((level) => (
                <ToggleButton
                  key={level.key}
                  value={level.key}
                  aria-label={level.label}
                >
                  {level.icon}
                  {level.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          {/* ---- Audio control ---- */}
          {showAudioControl && (
            <>
              <Divider />
              <Stack spacing={1}>
                <SectionLabel>Audio</SectionLabel>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                  <Typography variant="body2" color="text.primary">
                    {isPlaying ? 'Playing' : 'Paused'}
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
