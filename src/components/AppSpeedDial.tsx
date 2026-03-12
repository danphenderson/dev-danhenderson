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

export type AppSpeedDialAction = {
  id: string;
  label: string;
  icon: ReactNode;
  to?: string;
  href?: string;
  download?: string | boolean;
  external?: boolean;
  onClick?: (event: ReactMouseEvent<HTMLElement>) => void;
};

type AppSpeedDialProps = {
  ariaLabel: string;
  icon: ReactNode;
  openIcon?: ReactNode;
  actions: AppSpeedDialAction[];
  actionLabelsAlwaysOpen?: boolean;
  actionTooltipPlacement?: SpeedDialActionProps['tooltipPlacement'];
  FabProps?: SpeedDialProps['FabProps'];
  direction?: SpeedDialProps['direction'];
  sx?: SxProps<Theme>;
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
      sx={sx}
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
