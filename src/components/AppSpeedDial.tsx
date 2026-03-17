import { ReactNode, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import type { FabProps } from '@mui/material/Fab';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SpeedDialActionProps } from '@mui/material/SpeedDialAction';
import type { SpeedDialProps } from '@mui/material/SpeedDial';
import { Link } from 'react-router-dom';
import { InteractiveLabel } from './text';
import type { AppSpeedDialAction, AppSpeedDialLayer } from '../types/ui';

export type { AppSpeedDialAction, AppSpeedDialLayer };

type AppSpeedDialProps = {
  ariaLabel: string;
  icon: ReactNode;
  openIcon?: ReactNode;
  actions: AppSpeedDialAction[];
  actionLabelsAlwaysOpen?: boolean;
  actionTooltipPlacement?: SpeedDialActionProps['tooltipPlacement'];
  FabProps?: SpeedDialProps['FabProps'];
  direction?: SpeedDialProps['direction'];
  layer?: AppSpeedDialLayer;
  sx?: SxProps<Theme>;
};

const getLayerSx =
  (layer: AppSpeedDialLayer): SxProps<Theme> =>
  (theme) => ({
    zIndex: layer === 'header' ? theme.zIndex.appBar + 1 : theme.zIndex.appBar - 1,
    '& .MuiSpeedDial-fab, & .MuiSpeedDial-actions': {
      zIndex: 'inherit',
    },
  });

const mergeLayerSx = (layer: AppSpeedDialLayer, sx?: SxProps<Theme>): SxProps<Theme> => {
  const layerSx = getLayerSx(layer);

  if (!sx) {
    return layerSx;
  }

  return [layerSx, ...(Array.isArray(sx) ? sx : [sx])] as SxProps<Theme>;
};

export const AppSpeedDial = ({
  ariaLabel,
  icon,
  openIcon,
  actions,
  actionLabelsAlwaysOpen = false,
  actionTooltipPlacement,
  FabProps,
  direction = 'up',
  layer = 'content',
  sx,
}: AppSpeedDialProps) => {
  const [open, setOpen] = useState(false);

  const handleOpen: NonNullable<SpeedDialProps['onOpen']> = () => {
    setOpen(true);
  };

  const handleClose: NonNullable<SpeedDialProps['onClose']> = () => {
    setOpen(false);
  };

  const getActionFabProps = (action: AppSpeedDialAction): SpeedDialActionProps['FabProps'] => {
    const resolvedFabProps: Partial<FabProps> & Record<string, unknown> = {
      'aria-label': action.label,
      onClick: (event: ReactMouseEvent<HTMLElement>) => {
        action.onClick?.(event);
        setOpen(false);
      },
      ...(action.onMouseEnter && { onMouseEnter: action.onMouseEnter }),
      ...(action.onMouseLeave && { onMouseLeave: action.onMouseLeave }),
    };

    if (action.to) {
      resolvedFabProps.component = Link;
      resolvedFabProps.to = action.to;
    } else if (action.href) {
      resolvedFabProps.component = 'a';
      resolvedFabProps.href = action.href;
    }

    if (action.download) {
      resolvedFabProps.download = action.download;
    }

    if (action.external) {
      resolvedFabProps.target = '_blank';
      resolvedFabProps.rel = 'noopener noreferrer';
    }

    return resolvedFabProps as SpeedDialActionProps['FabProps'];
  };

  return (
    <SpeedDial
      ariaLabel={ariaLabel}
      direction={direction}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      icon={openIcon ? <SpeedDialIcon icon={icon} openIcon={openIcon} /> : icon}
      FabProps={FabProps}
      sx={mergeLayerSx(layer, sx)}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={<InteractiveLabel>{action.label}</InteractiveLabel>}
          tooltipPlacement={actionTooltipPlacement}
          tooltipOpen={actionLabelsAlwaysOpen && open}
          FabProps={getActionFabProps(action)}
        />
      ))}
    </SpeedDial>
  );
};
