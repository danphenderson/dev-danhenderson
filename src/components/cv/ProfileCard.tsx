import { Avatar, Box, Link, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';
import type { AboutMe } from '../../types/cv';
import { useCvStyles } from '../../styles/cvStyles';

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
    profileInlineActionsSx,
    profileMetaContentSx,
    profileMetaRowSx,
    primaryTextSx,
    profileAvatarSx,
    profileBioSx,
    profileNameRowSx,
    secondaryStrongSx,
    secondaryTextSx,
    statusBreatheSx,
  } = useCvStyles();
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
          <Box component="span" sx={statusBreatheSx}>{statusLine}</Box>
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
          <Box component="span" sx={statusBreatheSx}>{bioText.slice(lineStart)}</Box>
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
      <Stack spacing={0.75} width="100%">
        <Stack direction="row" sx={profileNameRowSx}>
          <Typography variant="h4" sx={primaryTextSx}>
            {about.name}
          </Typography>
        </Stack>

        <Stack direction="row" sx={profileMetaRowSx}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={profileMetaContentSx}>
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
          {actions && <Box sx={profileInlineActionsSx}>{actions}</Box>}
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
