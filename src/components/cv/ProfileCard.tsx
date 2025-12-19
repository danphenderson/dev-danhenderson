import { Avatar, Chip, Stack, Typography } from '@mui/material';
import type { AboutMe } from '../../data/cv';
import { useCvStyles } from '../../ThemeProvider';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc: string;
};

export const ProfileCard = ({ about, avatarSrc }: ProfileCardProps) => {
  const { accentColor } = useCvStyles();

  return (
    <Stack spacing={2} alignItems="center">
      <Avatar
        src={avatarSrc}
        alt={about.name}
        sx={{
          width: 96,
          height: 96,
          boxShadow: '0 10px 30px rgba(15,23,42,0.3)',
          border: '2px solid rgba(255,255,255,0.9)',
        }}
      />
      <Stack spacing={0.5} textAlign="center">
        <Typography variant="h5" fontWeight={700}>
          {about.name}
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          {about.title}
        </Typography>
      </Stack>
      <Chip
        label={about.location}
        variant="outlined"
        sx={{
          borderColor: accentColor,
          color: '#0f172a',
          backgroundColor: 'rgba(14,165,233,0.12)',
          fontWeight: 600,
        }}
      />
      {about.bio && (
        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', color: '#0f172a' }}>
          {about.bio}
        </Typography>
      )}
    </Stack>
  );
};
