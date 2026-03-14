import { Avatar, Box, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { HeaderTitle, StrongMetaText, MetaText, BodyText } from '../text';
import { CVAboutBioTypewriter } from './CVAboutBioTypewriter';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc?: string;
  actions?: ReactNode;
  bioAnimationStartDelayMs?: number;
  onBioAnimationComplete?: () => void;
};

export const ProfileCard = ({
  about,
  avatarSrc,
  actions,
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
  } = useComponentStyles();

  return (
    <Stack spacing={1.5} alignItems="flex-start">
      {avatarSrc && <Avatar src={avatarSrc} alt={about.name} sx={profileAvatarSx} />}
      <Box sx={profileHeaderRowSx}>
        <Stack spacing={0.75} sx={profileHeaderContentSx}>
          <Stack direction="row" sx={profileNameRowSx}>
            <HeaderTitle sx={[primaryTextSx, { mb: 0 }]}>{about.name}</HeaderTitle>
          </Stack>

          <Stack direction="row" sx={profileMetaRowSx}>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              flexWrap="wrap"
              sx={profileMetaContentSx}
            >
              <StrongMetaText>{about.title}</StrongMetaText>
              {about.location && (
                <>
                  <MetaText>•</MetaText>
                  <MetaText>{about.location}</MetaText>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
        {actions && <Box sx={profileInlineActionsSx}>{actions}</Box>}
      </Box>
      {about.bio && (
        <BodyText sx={[primaryTextSx, profileBioSx]}>
          <CVAboutBioTypewriter
            about={about}
            startDelayMs={bioAnimationStartDelayMs}
            onComplete={onBioAnimationComplete}
          />
        </BodyText>
      )}
    </Stack>
  );
};
