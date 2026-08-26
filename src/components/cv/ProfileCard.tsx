import { Avatar, Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { Text } from '../text';
import { CVAboutBioTypewriter } from './CVAboutBioTypewriter';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc?: string;
  actions?: ReactNode;
  bioRevealed?: boolean;
  bioAnimationStartDelayMs?: number;
  onBioAnimationComplete?: () => void;
};

export const ProfileCard = ({
  about,
  avatarSrc,
  actions,
  bioRevealed = false,
  bioAnimationStartDelayMs = 0,
  onBioAnimationComplete,
}: ProfileCardProps) => {
  const {
    profileHeaderContentSx,
    profileHeaderRowSx,
    profileInlineActionsSx,
    profileMetaContentSx,
    profileMetaRowSx,
    primaryTextSx,
    profileAvatarSx,
    profileBioSx,
    profileNameRowSx,
    cvSectionItemSpacing,
  } = useComponentStyles();

  return (
    <Stack spacing={cvSectionItemSpacing} alignItems="flex-start">
      {avatarSrc && <Avatar src={avatarSrc} alt={about.name} sx={profileAvatarSx} />}
      <Box sx={profileHeaderRowSx}>
        <Stack spacing={0.75} sx={profileHeaderContentSx}>
          <Stack direction="row" sx={profileNameRowSx}>
            <Text role="sectionTitle" sx={[primaryTextSx, { mb: 0 }]}>
              {about.name}
            </Text>
          </Stack>
          <Stack direction="row" sx={profileMetaRowSx}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              sx={profileMetaContentSx}
            >
              <Text role="metaStrong">{about.location}</Text>
            </Stack>
          </Stack>
        </Stack>
        {actions && <Box sx={profileInlineActionsSx}>{actions}</Box>}
      </Box>
      {about.bio && (
        <Text role="body" sx={[primaryTextSx, profileBioSx]}>
          <CVAboutBioTypewriter
            about={about}
            revealed={bioRevealed}
            startDelayMs={bioAnimationStartDelayMs}
            onComplete={onBioAnimationComplete}
          />
        </Text>
      )}
    </Stack>
  );
};
