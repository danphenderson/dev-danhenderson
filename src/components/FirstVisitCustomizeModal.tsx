import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import MotionPhotosAutoOutlinedIcon from '@mui/icons-material/MotionPhotosAutoOutlined';
import MotionPhotosOffOutlinedIcon from '@mui/icons-material/MotionPhotosOffOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SlowMotionVideoOutlinedIcon from '@mui/icons-material/SlowMotionVideoOutlined';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import type { MotionIntensityLevel } from '../theme/appAppearance';
import { BodyText, CaptionText } from './text';

const MOTION_LEVELS: { key: MotionIntensityLevel; label: string; icon: ReactNode }[] = [
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

export type FirstVisitCustomizeModalProps = {
  open: boolean;
  onClose: () => void;
  motionIntensity: MotionIntensityLevel;
  onChangeMotionIntensity: (level: MotionIntensityLevel) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
};

export const FirstVisitCustomizeModal = ({
  open,
  onClose,
  motionIntensity,
  onChangeMotionIntensity,
  isAudioPlaying,
  onToggleAudio,
}: FirstVisitCustomizeModalProps) => {
  const handleMotionChange = (
    _event: React.MouseEvent<HTMLElement>,
    value: MotionIntensityLevel | null
  ) => {
    if (value !== null) {
      onChangeMotionIntensity(value);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="customize-experience-title"
      data-testid="customize-experience-dialog"
    >
      <DialogTitle id="customize-experience-title">Customize your experience</DialogTitle>
      <DialogContent>
        <BodyText sx={{ mt: 1, mb: 3 }}>
          Adjust motion and audio preferences to suit your browsing style.
        </BodyText>

        <Stack spacing={2.5}>
          {/* Motion intensity */}
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', color: 'text.secondary', lineHeight: 1 }}
            >
              Motion
            </Typography>
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
                <ToggleButton key={level.key} value={level.key} aria-label={level.label}>
                  {level.icon}
                  {level.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Stack>

          <Divider />

          {/* Audio */}
          <Stack spacing={1}>
            <Typography
              variant="overline"
              sx={{ fontSize: '0.625rem', fontWeight: 600, letterSpacing: '0.1em', color: 'text.secondary', lineHeight: 1 }}
            >
              Audio
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="body2" color="text.primary">
                {isAudioPlaying ? 'Playing' : 'Off'}
              </Typography>
              <Tooltip title={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}>
                <IconButton
                  size="small"
                  onClick={onToggleAudio}
                  aria-label={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
                >
                  {isAudioPlaying ? (
                    <PauseCircleOutlineIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>

        <CaptionText sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
          You can adjust these settings anytime from the ⚙ icon in the header.
        </CaptionText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" aria-label="Get started">
          Get started
        </Button>
      </DialogActions>
    </Dialog>
  );
};
