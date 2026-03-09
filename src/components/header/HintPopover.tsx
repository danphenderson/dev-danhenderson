import { Button, Popover, Typography } from '@mui/material';

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
        sx: {
          p: 2,
          maxWidth: 240,
          borderRadius: 2,
          boxShadow: 6,
        },
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
        {body}
      </Typography>
      <Button onClick={onClose} variant="contained" size="small">
        Okay
      </Button>
    </Popover>
  );
};
