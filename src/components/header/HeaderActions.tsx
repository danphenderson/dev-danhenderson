import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Stack, Tooltip, IconButton } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { MutableRefObject } from 'react';
import { useAppStyles } from '../../styles/appStyles';
import { HeaderAppearanceDial, type HeaderAppearanceDialProps } from './HeaderAppearanceDial';

type HeaderActionsProps = {
  iconButtonSize: 'small' | 'medium' | 'large';
  headerIconSx: SxProps<Theme>;
  showAudioControl?: boolean;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
  pauseButtonRef?: MutableRefObject<HTMLButtonElement | null>;
  showPauseHint?: boolean;
  pauseHighlightSx?: SxProps<Theme>;
  appearanceDial?: Omit<HeaderAppearanceDialProps, 'iconButtonSize'>;
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
  appearanceDial,
}: HeaderActionsProps) => {
  const appStyles = useAppStyles();
  const pauseButtonSx = (
    pauseHighlightSx
      ? [appStyles.headerIconButtonSx, appStyles.headerAudioControlSx, pauseHighlightSx]
      : [appStyles.headerIconButtonSx, appStyles.headerAudioControlSx]
  ) as SxProps<Theme>;

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

      {appearanceDial && (
        <HeaderAppearanceDial iconButtonSize={iconButtonSize} {...appearanceDial} />
      )}
    </Stack>
  );
};
