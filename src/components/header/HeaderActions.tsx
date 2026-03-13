import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import {
  defaultAppAppearanceKey,
  type AppAppearanceKey,
} from '../../theme/appAppearance';
import {
  IconButton,
  Stack,
  Tooltip,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MutableRefObject } from 'react';
import { useAppStyles } from '../../styles/appStyles';
import { HeaderAppearanceDial } from './HeaderAppearanceDial';

type HeaderActionsProps = {
  iconButtonSize: 'small' | 'medium' | 'large';
  headerIconSx: SxProps<Theme>;
  showAudioControl?: boolean;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
  pauseButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  showPauseHint?: boolean;
  pauseHighlightSx?: SxProps<Theme>;
  showAppearanceControl?: boolean;
  appearance?: AppAppearanceKey;
  onChangeAppearance?: (appearance: AppAppearanceKey) => void;
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
  showAudioControl = false,
  isPlaying = false,
  onToggleAudio,
  pauseButtonRef,
  showPauseHint = false,
  pauseHighlightSx,
  showAppearanceControl = false,
  appearance = defaultAppAppearanceKey,
  onChangeAppearance,
  showThemeControl = false,
  mode = 'light',
  onToggleTheme,
  themeButtonRef,
  showDarkModeHint = false,
  themeHighlightSx,
}: HeaderActionsProps) => {
  const appStyles = useAppStyles();
  const pauseButtonSx = (pauseHighlightSx
    ? [appStyles.headerAudioControlSx, pauseHighlightSx]
    : appStyles.headerAudioControlSx) as SxProps<Theme>;

  return (
    <Stack direction="row" spacing={{ xs: 1, md: 2 }} alignItems="center">
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
              sx={pauseButtonSx}
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

      {showAppearanceControl && onChangeAppearance && (
        <HeaderAppearanceDial
          appearance={appearance}
          iconButtonSize={iconButtonSize}
          onChangeAppearance={onChangeAppearance}
        />
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
