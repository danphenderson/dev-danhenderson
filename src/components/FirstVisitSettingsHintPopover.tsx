import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Button, Popover, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { BodyText, Text } from './text';

const sectionLabelSx = {
  fontSize: '0.625rem',
  fontWeight: 600,
  letterSpacing: '0.1em',
  color: 'text.secondary',
  lineHeight: 1,
} as const;

export type FirstVisitSettingsHintPopoverProps = {
  open: boolean;
  anchorEl: HTMLElement | null;
  onGetStarted: () => void;
};

export const FirstVisitSettingsHintPopover = ({
  open,
  anchorEl,
  onGetStarted,
}: FirstVisitSettingsHintPopoverProps) => {
  if (!open || !anchorEl) {
    return null;
  }

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={() => {}}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      data-testid="first-visit-settings-hint-root"
      slotProps={{
        paper: {
          sx: {
            mt: 1.25,
            width: { xs: 'calc(100vw - 24px)', sm: 320 },
            maxWidth: 'calc(100vw - 24px)',
            p: 2.5,
            borderRadius: 2.5,
            boxShadow: (theme) =>
              `0 8px 32px ${alpha(
                theme.palette.common.black,
                theme.palette.mode === 'light' ? 0.14 : 0.4
              )}`,
          },
        },
      }}
    >
      <Stack spacing={1.75} data-testid="first-visit-settings-hint-popover">
        <Stack direction="row" spacing={1} alignItems="center">
          <SettingsOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Text role="sectionEyebrow" component="span" sx={sectionLabelSx}>
            Global settings
          </Text>
        </Stack>

        <BodyText>
          You can always update motion and welcome audio from the settings button in the header.
        </BodyText>

        <Button onClick={onGetStarted} variant="contained" fullWidth aria-label="Get started">
          Get started
        </Button>
      </Stack>
    </Popover>
  );
};
