import { Avatar } from '@mui/material';
import { AppSpeedDial, AppSpeedDialAction } from '../AppSpeedDial';
import { useAppStyles } from '../../styles/appStyles';

type HeaderPageDialProps = {
  actions: AppSpeedDialAction[];
  avatarSrc: string;
  iconButtonSize: 'small' | 'medium' | 'large';
};

export const HeaderPageDial = ({
  actions,
  avatarSrc,
  iconButtonSize,
}: HeaderPageDialProps) => {
  const appStyles = useAppStyles();

  return (
    <AppSpeedDial
      ariaLabel="Open page navigation"
      icon={<Avatar src={avatarSrc} alt="Daniel Henderson" sx={appStyles.headerAvatarSx} />}
      actions={actions}
      direction="right"
      layer="header"
      actionTooltipPlacement="bottom"
      FabProps={{
        size: iconButtonSize,
        sx: appStyles.headerAvatarButtonSx,
      }}
      sx={appStyles.headerPageDialSx}
    />
  );
};
