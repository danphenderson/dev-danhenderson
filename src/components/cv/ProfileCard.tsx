import { Avatar, Chip, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { AboutMe } from '../../data/cv';
import { useCvStyles } from '../../ThemeProvider';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc: string;
};

export const ProfileCard = ({ about, avatarSrc }: ProfileCardProps) => {
  const { accentColor, accentTint } = useCvStyles();
  const theme = useTheme();

  return (
    <Stack spacing={2} alignItems="center">
      <Avatar
        src={avatarSrc}
        alt={about.name}
        sx={{
          width: 96,
          height: 96,
          boxShadow: theme.shadows[6],
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <Stack spacing={0.5} textAlign="center">
        <Typography variant="h5" fontWeight={700}>
          {about.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {about.title}
        </Typography>
      </Stack>
      <Chip
        label={about.location}
        variant="outlined"
        sx={{
          borderColor: accentColor,
          color: 'text.primary',
          backgroundColor: accentTint,
          fontWeight: 600,
        }}
      />
      {about.bio && (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
          {about.bio}
        </Typography>
      )}
    </Stack>
  );
};
