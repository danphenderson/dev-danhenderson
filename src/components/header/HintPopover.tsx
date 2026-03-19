import { Button, Popover } from '@mui/material';
import { useAppStyles } from '../../styles/appStyles';
import { MotionTiltCard } from '../../motion';
import { BodyText, SubsectionTitle } from '../text';

type HintPopoverProps = {
  id: string;
  open: boolean;
  anchorEl: HTMLElement | null;
  title: string;
  body: string;
  onClose: () => void;
};

export const HintPopover = ({ id, open, anchorEl, title, body, onClose }: HintPopoverProps) => {
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
      <MotionTiltCard intensity={0.5}>
        <SubsectionTitle sx={appStyles.hintPopoverTitleSx}>{title}</SubsectionTitle>
        <BodyText sx={appStyles.hintPopoverBodySx}>{body}</BodyText>
        <Button onClick={onClose} variant="contained" size="small">
          Okay
        </Button>
      </MotionTiltCard>
    </Popover>
  );
};
