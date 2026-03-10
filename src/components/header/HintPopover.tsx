import { Button, Popover, Typography } from '@mui/material';
import { useAppStyles } from '../../styles/appStyles';

type HintPopoverProps = {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  title: string;
  body: string;
  onClose: () => void;
};

export const HintPopover = ({
  id,
  open,
  anchorEl,
  title,
  body,
  onClose,
}: HintPopoverProps) => {
  const appStyles = useAppStyles();

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      disableRestoreFocus
      PaperProps={{
        sx: appStyles.hintPopoverPaperSx,
      }}
    >
      <Typography variant="subtitle1" sx={appStyles.hintPopoverTitleSx}>
        {title}
      </Typography>
      <Typography variant="body2" sx={appStyles.hintPopoverBodySx}>
        {body}
      </Typography>
      <Button onClick={onClose} variant="contained" size="small">
        Okay
      </Button>
    </Popover>
  );
};
