import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PaletteOutlinedIcon from '@mui/icons-material/PaletteOutlined';
import { Box } from '@mui/material';
import type { PaletteMode } from '@mui/material';
import type { SpeedDialProps } from '@mui/material/SpeedDial';
import type { SxProps, Theme } from '@mui/material/styles';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { MutableRefObject } from 'react';
import { type AppAppearanceKey, appAppearanceOptions } from '../../theme/appAppearance';
import { useAppStyles } from '../../styles/appStyles';
import { AppSpeedDial, type AppSpeedDialAction } from '../AppSpeedDial';

type AppearanceSwatchIconProps = {
  primaryColor: string;
  secondaryColor: string;
  selected: boolean;
};

const AppearanceSwatchIcon = ({
  primaryColor,
  secondaryColor,
  selected,
}: AppearanceSwatchIconProps) => (
  <Box
    aria-hidden="true"
    sx={{
      position: 'relative',
      width: 22,
      height: 22,
      borderRadius: '50%',
      border: (theme) => `1px solid ${alpha(theme.palette.common.white, theme.palette.mode === 'light' ? 0.7 : 0.34)}`,
      background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor} 52%, ${secondaryColor} 52%, ${secondaryColor} 100%)`,
      boxShadow: (theme) =>
        selected
          ? `0 0 0 2px ${alpha(theme.palette.common.white, theme.palette.mode === 'light' ? 0.82 : 0.42)}`
          : 'none',
    }}
  />
);

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
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const direction: SpeedDialProps['direction'] = isMobile ? 'down' : 'left';
  const handleContainerRef = (node: HTMLDivElement | null) => {
    if (controlRef) {
      controlRef.current = node;
    }
  };
  const actions: AppSpeedDialAction[] = [
    {
      id: 'theme-toggle',
      label: `Switch to ${mode === 'light' ? 'dark' : 'light'} mode`,
      icon: mode === 'light'
        ? <DarkModeOutlinedIcon fontSize="small" />
        : <LightModeOutlinedIcon fontSize="small" />,
      onClick: () => onToggleTheme(),
    },
    ...appAppearanceOptions.map((option) => {
      const optionPalette = option.palette[theme.palette.mode];

      return {
        id: option.key,
        label: `Use ${option.label} appearance`,
        icon: (
          <AppearanceSwatchIcon
            primaryColor={optionPalette.primary.main}
            secondaryColor={optionPalette.secondary.main}
            selected={option.key === appearance}
          />
        ),
        onClick: () => onChangeAppearance(option.key),
      };
    }),
  ];

  return (
    <Box ref={handleContainerRef}>
      <AppSpeedDial
        ariaLabel="Open appearance presets"
        icon={<PaletteOutlinedIcon />}
        actions={actions}
        direction={direction}
        layer="header"
        actionTooltipPlacement={isMobile ? 'left' : 'bottom'}
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
