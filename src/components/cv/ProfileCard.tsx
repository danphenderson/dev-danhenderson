import { Avatar, IconButton, Link, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import type { AboutMe } from '../../data/cv';
import { useCvStyles } from '../../styles/cvStyles';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc?: string;
  linkedinUrl?: string;
};

export const ProfileCard = ({ about, avatarSrc, linkedinUrl }: ProfileCardProps) => {
  const {
    linkedinButtonSx,
    primaryTextSx,
    profileAvatarSx,
    profileBioSx,
    profileNameRowSx,
    secondaryStrongSx,
    secondaryTextSx,
  } = useCvStyles();
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
          sx={profileAvatarSx}
        />
      )}
      <Stack spacing={0.75} width="100%">
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" sx={profileNameRowSx}>
          <Typography variant="h4" sx={primaryTextSx}>
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
              sx={linkedinButtonSx}
            >
              <LinkedInIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          <Typography variant="subtitle2" sx={secondaryStrongSx}>
            {about.title}
          </Typography>
          {about.location && (
            <>
              <Typography variant="subtitle2" sx={secondaryTextSx}>
                •
              </Typography>
              <Typography variant="subtitle2" sx={secondaryTextSx}>
                {about.location}
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
      {about.bio && (
        <Typography variant="body2" sx={[primaryTextSx, profileBioSx]}>
          {bioContent}
        </Typography>
      )}
    </Stack>
  );
};
