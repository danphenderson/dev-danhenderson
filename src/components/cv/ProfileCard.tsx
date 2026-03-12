import { Avatar, Box, Link, Stack } from '@mui/material';
import type { ReactNode } from 'react';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { HeaderTitle, StatusInlineText, StrongMetaText, MetaText, BodyText } from '../text';

type ProfileCardProps = {
  about: AboutMe;
  avatarSrc?: string;
  actions?: ReactNode;
};

const STATUS_MARKER = 'Open to opportunities';

/** Return the index of the line start containing `markerIndex`. */
const getLineStart = (text: string, markerIndex: number): number => {
  const lastNewline = text.lastIndexOf('\n', markerIndex);
  return lastNewline >= 0 ? lastNewline + 1 : markerIndex;
};

export const ProfileCard = ({ about, avatarSrc, actions }: ProfileCardProps) => {
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
  const bioLink = about.bioLink;
  const bioText = about.bio;
  const bioLinkIndex = bioLink ? bioText.indexOf(bioLink.text) : -1;
  let bioContent: ReactNode = bioText;

  if (bioLink && bioLinkIndex >= 0) {
    const beforeLink = bioText.slice(0, bioLinkIndex);
    const afterLink = bioText.slice(bioLinkIndex + bioLink.text.length);
    const statusIdx = afterLink.indexOf(STATUS_MARKER);

    if (statusIdx >= 0) {
      const lineStart = getLineStart(afterLink, statusIdx);
      const beforeStatus = afterLink.slice(0, lineStart);
      const statusLine = afterLink.slice(lineStart);

      bioContent = (
        <>
          {beforeLink}
          <Link href={bioLink.url} target="_blank" rel="noopener noreferrer" underline="hover">
            {bioLink.text}
          </Link>
          {beforeStatus}
          <StatusInlineText>{statusLine}</StatusInlineText>
        </>
      );
    } else {
      bioContent = (
        <>
          {beforeLink}
          <Link href={bioLink.url} target="_blank" rel="noopener noreferrer" underline="hover">
            {bioLink.text}
          </Link>
          {afterLink}
        </>
      );
    }
  } else {
    const statusIdx = bioText.indexOf(STATUS_MARKER);
    if (statusIdx >= 0) {
      const lineStart = getLineStart(bioText, statusIdx);
      bioContent = (
        <>
          {bioText.slice(0, lineStart)}
          <StatusInlineText>{bioText.slice(lineStart)}</StatusInlineText>
        </>
      );
    }
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
      <Box sx={profileHeaderRowSx}>
        <Stack spacing={0.75} sx={profileHeaderContentSx}>
          <Stack direction="row" sx={profileNameRowSx}>
            <HeaderTitle sx={[primaryTextSx, { mb: 0 }]}>
              {about.name}
            </HeaderTitle>
          </Stack>

          <Stack direction="row" sx={profileMetaRowSx}>
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={profileMetaContentSx}>
              <StrongMetaText>
                {about.title}
              </StrongMetaText>
              {about.location && (
                <>
                  <MetaText>
                    •
                  </MetaText>
                  <MetaText>
                    {about.location}
                  </MetaText>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
        {actions && <Box sx={profileInlineActionsSx}>{actions}</Box>}
      </Box>
      {about.bio && (
        <BodyText sx={[primaryTextSx, profileBioSx]}>
          {bioContent}
        </BodyText>
      )}
    </Stack>
  );
};
