import { Box, Stack, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

type BlogCalloutProps = {
  variant: 'note' | 'tip' | 'warning';
  title?: string;
  text: string;
};

const calloutConfig = {
  note: {
    icon: InfoOutlinedIcon,
    defaultTitle: 'Note',
    color: 'info.main',
    bgLight: 'rgba(33, 150, 243, 0.06)',
    bgDark: 'rgba(33, 150, 243, 0.08)',
    borderColor: 'info.main',
  },
  tip: {
    icon: TipsAndUpdatesOutlinedIcon,
    defaultTitle: 'Tip',
    color: 'success.main',
    bgLight: 'rgba(76, 175, 80, 0.06)',
    bgDark: 'rgba(76, 175, 80, 0.08)',
    borderColor: 'success.main',
  },
  warning: {
    icon: WarningAmberIcon,
    defaultTitle: 'Warning',
    color: 'warning.main',
    bgLight: 'rgba(255, 152, 0, 0.06)',
    bgDark: 'rgba(255, 152, 0, 0.08)',
    borderColor: 'warning.main',
  },
} as const;

export function BlogCallout({ variant, title, text }: BlogCalloutProps) {
  const config = calloutConfig[variant];
  const Icon = config.icon;

  return (
    <Box
      role="note"
      sx={{
        my: 2.5,
        p: 2.5,
        borderRadius: 2,
        borderLeft: '3px solid',
        borderColor: config.borderColor,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? config.bgDark : config.bgLight),
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
        <Icon sx={{ fontSize: 18, color: config.color }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: config.color }}>
          {title ?? config.defaultTitle}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.secondary' }}>
        {text}
      </Typography>
    </Box>
  );
}
