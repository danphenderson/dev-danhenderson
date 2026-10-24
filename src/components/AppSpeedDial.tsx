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
import { useMotionScale } from '../motion';
import { Text } from './text';
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

type ActionFabSlotProps = NonNullable<SpeedDialActionProps['slotProps']>['fab'];

const getLayerSx =
  (layer: AppSpeedDialLayer): SxProps<Theme> =>
  (theme) => ({
    zIndex: layer === 'header' ? theme.zIndex.appBar + 1 : theme.zIndex.appBar - 1,
    // The action tray's negative margin overlaps small triggers in WebKit.
    '& .MuiSpeedDial-fab': { zIndex: 1 },
    '& .MuiSpeedDial-actions': { zIndex: 0 },
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
  const { duration: dFactor } = useMotionScale();
  const SPEED_DIAL_BASE_DURATION_MS = 200;
  const speedDialTransitionDuration =
    dFactor === 0 ? 0 : Math.round(SPEED_DIAL_BASE_DURATION_MS * dFactor);

  const handleOpen: NonNullable<SpeedDialProps['onOpen']> = () => {
    setOpen(true);
  };

  const handleClose: NonNullable<SpeedDialProps['onClose']> = () => {
    setOpen(false);
  };

  const getActionFabProps = (action: AppSpeedDialAction): ActionFabSlotProps => {
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

    return resolvedFabProps;
  };

  return (
    <SpeedDial
      ariaLabel={ariaLabel}
      direction={direction}
      open={open}
      onOpen={handleOpen}
      onClose={handleClose}
      transitionDuration={speedDialTransitionDuration}
      icon={openIcon ? <SpeedDialIcon icon={icon} openIcon={openIcon} /> : icon}
      FabProps={FabProps}
      sx={mergeLayerSx(layer, sx)}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.id}
          icon={action.icon}
          tooltipTitle={
            <Text role="inlineLabel" component="span">
              {action.label}
            </Text>
          }
          tooltipPlacement={actionTooltipPlacement}
          tooltipOpen={actionLabelsAlwaysOpen && open}
          slotProps={{ fab: getActionFabProps(action) }}
        />
      ))}
    </SpeedDial>
  );
};
