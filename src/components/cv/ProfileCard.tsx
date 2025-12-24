import { Avatar, IconButton, Link, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { AboutMe } from '../../data/cv';
import { useCvStyles } from '../../ThemeProvider';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc?: string;
  linkedinUrl?: string;
};

export const ProfileCard = ({ about, avatarSrc, linkedinUrl }: ProfileCardProps) => {
  const { accentColor } = useCvStyles();
  const theme = useTheme();
  const bioLink = about.bioLink;
  const bioText = about.bio;
  const bioLinkIndex = bioLink ? bioText.indexOf(bioLink.text) : -1;
  let bioContent: ReactNode = bioText;

  if (bioLink && bioLinkIndex >= 0) {
    bioContent = (
      <>
        {bioText.slice(0, bioLinkIndex)}
        <Link href={bioLink.url} target="_blank" rel="noopener noreferrer" underline="hover">
          {bioLink.text}
        </Link>
        {bioText.slice(bioLinkIndex + bioLink.text.length)}
      </>
    );
  }

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      {avatarSrc && (
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
      )}
      <Stack spacing={0.75} width="100%">
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={{ rowGap: 0.5 }}>
          <Typography variant="h4" sx={{ color: 'text.primary' }}>
            {about.name}
          </Typography>
          {linkedinUrl && (
            <IconButton
              component="a"
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              size="small"
              sx={{ color: accentColor }}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="subtitle2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
            {about.title}
          </Typography>
          {about.location && (
            <>
              <Typography variant="subtitle2" color="text.secondary">
                •
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {about.location}
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
      {about.bio && (
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line', color: 'text.primary' }}>
          {bioContent}
        </Typography>
      )}
    </Stack>
  );
};
