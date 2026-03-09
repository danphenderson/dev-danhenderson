import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  Avatar,
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MutableRefObject } from 'react';
import { Link } from 'react-router-dom';

type HeaderActionsProps = {
  iconButtonSize: 'small' | 'medium' | 'large';
  headerIconSx: SxProps<Theme>;
  showAvatar?: boolean;
  avatarSrc?: string;
  showAudioControl?: boolean;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
  pauseButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  showPauseHint?: boolean;
  pauseHighlightSx?: SxProps<Theme>;
  showThemeControl?: boolean;
  mode?: PaletteMode;
  onToggleTheme?: () => void;
  themeButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  showDarkModeHint?: boolean;
  themeHighlightSx?: SxProps<Theme>;
};

export const HeaderActions = ({
  iconButtonSize,
  headerIconSx,
  showAvatar = false,
  avatarSrc,
  showAudioControl = false,
  isPlaying = false,
  onToggleAudio,
  pauseButtonRef,
  showPauseHint = false,
  pauseHighlightSx,
  showThemeControl = false,
  mode = 'light',
  onToggleTheme,
  themeButtonRef,
  showDarkModeHint = false,
  themeHighlightSx,
}: HeaderActionsProps) => {
  return (
    <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
      {showAvatar && avatarSrc && (
        <Tooltip title="Back to home">
          <IconButton
            component={Link}
            to="/"
            color="inherit"
            aria-label="Go to home"
            size={iconButtonSize}
            sx={{ p: { xs: 0.5, md: 0.625 } }}
          >
            <Avatar
              src={avatarSrc}
              alt="Daniel Henderson"
              sx={{
                width: { xs: 40, md: 50 },
                height: { xs: 40, md: 50 },
                border: '2.5px solid rgba(255,255,255,0.8)',
              }}
            />
          </IconButton>
        </Tooltip>
      )}

      {showAudioControl && (
        <Tooltip title={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}>
          <span>
            <IconButton
              color="inherit"
              size={iconButtonSize}
              ref={pauseButtonRef}
              onClick={onToggleAudio}
              aria-label={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
              aria-describedby={showPauseHint ? 'pause-audio-popover' : undefined}
              sx={{ mr: 0.625, ...(pauseHighlightSx || {}) }}
            >
              {isPlaying ? (
                <PauseCircleOutlineIcon sx={headerIconSx} />
              ) : (
                <PlayCircleOutlineIcon sx={headerIconSx} />
              )}
            </IconButton>
          </span>
        </Tooltip>
      )}

      {showThemeControl && (
        <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton
            color="inherit"
            size={iconButtonSize}
            ref={themeButtonRef}
            onClick={onToggleTheme}
            aria-label="Toggle color theme"
            aria-describedby={showDarkModeHint ? 'dark-mode-popover' : undefined}
            sx={themeHighlightSx}
          >
            {mode === 'light' ? (
              <DarkModeOutlinedIcon sx={headerIconSx} />
            ) : (
              <LightModeOutlinedIcon sx={headerIconSx} />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
};
