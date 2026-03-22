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
} from '@mui/material';
import type { ReactNode } from 'react';
import type { MotionIntensityLevel } from '../theme/appAppearance';
import { BodyText, CaptionText, Text } from './text';

const sectionLabelSx = {
  fontSize: '0.625rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'text.secondary',
  lineHeight: 1,
} as const;

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
  isAudioLoading?: boolean;
  audioError?: string;
  onToggleAudio: () => void;
};

export const FirstVisitCustomizeModal = ({
  open,
  onClose,
  motionIntensity,
  onChangeMotionIntensity,
  isAudioPlaying,
  isAudioLoading = false,
  audioError,
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
            <Text role="sectionEyebrow" component="span" sx={sectionLabelSx}>
              Motion
            </Text>
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
            <Text role="sectionEyebrow" component="span" sx={sectionLabelSx}>
              Audio
            </Text>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Text role="body" component="span">
                {isAudioLoading ? 'Loading…' : isAudioPlaying ? 'Playing' : 'Off'}
              </Text>
              <Tooltip title={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}>
                <span>
                  <IconButton
                    size="small"
                    onClick={onToggleAudio}
                    aria-label={isAudioPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
                    disabled={isAudioLoading}
                  >
                    {isAudioPlaying ? (
                      <PauseCircleOutlineIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <PlayCircleOutlineIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            {audioError ? (
              <CaptionText color="error" sx={{ display: 'block' }}>
                {audioError}
              </CaptionText>
            ) : null}
          </Stack>
        </Stack>

        <CaptionText sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
          You can adjust these settings anytime from the ⚙ icon in the header.
        </CaptionText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" aria-label="Okay">
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};
