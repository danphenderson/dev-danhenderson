import { useCallback, useEffect, useRef, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import {
  Button,
  ClickAwayListener,
  Fade,
  IconButton,
  Paper,
  Portal,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import type { MotionIntensityLevel } from '../theme/appAppearance';
import { duration, useMotionScale } from '../motion';
import { useAppStyles } from '../styles/appStyles';
import { HEADER_SETTINGS_TRIGGER_ID } from './header/HeaderSettingsPopover';
import { Text } from './text';

type FirstVisitWelcomeProps = {
  open: boolean;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  onInteractionChange: (interacting: boolean) => void;
  motionIntensity: MotionIntensityLevel;
  onChangeMotionIntensity: (level: MotionIntensityLevel) => void;
  isAudioPlaying: boolean;
  isAudioLoading: boolean;
  audioError?: string;
  onToggleAudio: () => void;
};

const motionLevels: MotionIntensityLevel[] = ['off', 'subtle', 'default', 'expressive'];

export const FirstVisitWelcome = ({
  open,
  returnFocusRef,
  onClose,
  onInteractionChange,
  motionIntensity,
  onChangeMotionIntensity,
  isAudioPlaying,
  isAudioLoading,
  audioError,
  onToggleAudio,
}: FirstVisitWelcomeProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { duration: dFactor } = useMotionScale();
  const { welcomePanelSx } = useAppStyles();

  useEffect(() => {
    if (!open) {
      setHovered(false);
      setFocused(false);
    }
  }, [open]);

  useEffect(() => {
    onInteractionChange(open && (hovered || focused));
  }, [open, hovered, focused, onInteractionChange]);

  const dismiss = useCallback(() => {
    if (panelRef.current?.contains(document.activeElement)) {
      const target = returnFocusRef?.current ?? document.getElementById(HEADER_SETTINGS_TRIGGER_ID);
      target?.focus();
    }
    onClose();
  }, [onClose, returnFocusRef]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, dismiss]);

  return (
    <Portal>
      <ClickAwayListener
        mouseEvent="onMouseDown"
        touchEvent="onTouchStart"
        onClickAway={() => {
          if (open) dismiss();
        }}
      >
        <Fade in={open} timeout={duration.fast * dFactor * 1000} unmountOnExit>
          <Paper
            ref={panelRef}
            component="section"
            role="region"
            aria-labelledby="home-welcome-title"
            data-testid="first-visit-welcome"
            elevation={0}
            sx={welcomePanelSx}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Text role="subsectionTitle" component="h2" id="home-welcome-title">
                  Make yourself at home
                </Text>
                <IconButton size="small" aria-label="Dismiss welcome" onClick={dismiss}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Stack>
              <Text role="body" tone="muted">
                Explore at your own pace. Choose a little motion or a welcome verse, if you like.
              </Text>
              <Stack spacing={0.75}>
                <Text role="settingsSectionLabel" component="span">
                  Motion
                </Text>
                <ToggleButtonGroup
                  value={motionIntensity}
                  exclusive
                  fullWidth
                  size="small"
                  aria-label="Motion intensity"
                  onChange={(_event, value: MotionIntensityLevel | null) => {
                    if (value) onChangeMotionIntensity(value);
                  }}
                  sx={{
                    '& .MuiToggleButton-root': {
                      textTransform: 'capitalize',
                      px: 1,
                      minHeight: 40,
                    },
                  }}
                >
                  {motionLevels.map((level) => (
                    <ToggleButton
                      key={level}
                      value={level}
                      aria-label={level[0].toUpperCase() + level.slice(1)}
                    >
                      {level}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Stack>
              <Button
                variant="outlined"
                onClick={onToggleAudio}
                disabled={isAudioLoading}
                aria-label={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
                startIcon={isAudioPlaying ? <PauseCircleOutlineIcon /> : <PlayCircleOutlineIcon />}
              >
                {isAudioLoading
                  ? 'Loading audio…'
                  : isAudioPlaying
                    ? 'Pause welcome audio'
                    : 'Play welcome audio'}
              </Button>
              {audioError && (
                <Text
                  role="caption"
                  component="span"
                  aria-live="polite"
                  sx={{ color: 'error.main' }}
                >
                  {audioError}
                </Text>
              )}
              <Stack direction="row" spacing={1} alignItems="center">
                <SettingsOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Text role="caption" tone="muted">
                  Motion and audio are always in header settings.
                </Text>
              </Stack>
              <Button variant="contained" onClick={dismiss}>
                Explore now
              </Button>
              <Text role="caption" tone="muted" sx={{ textAlign: 'center' }}>
                {hovered || focused
                  ? 'Take your time — this stays open while you choose.'
                  : 'Closes automatically · Esc to dismiss'}
              </Text>
            </Stack>
          </Paper>
        </Fade>
      </ClickAwayListener>
    </Portal>
  );
};
