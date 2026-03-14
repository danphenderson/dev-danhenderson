import type { ReactNode } from 'react';
import { Stack } from '@mui/material';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ProfileCard } from './ProfileCard';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';
import { ANIMATED_CARD_DURATION_MS } from '../AnimatedContentCard';

type CVAboutSectionProps = {
  about: AboutMe;
  actions?: ReactNode;
  footer?: ReactNode;
  delayMs?: number;
  triggerOnView?: boolean;
  sectionId?: string;
};

export const CVAboutSection = ({
  about,
  actions,
  footer,
  delayMs = 0,
  triggerOnView = true,
  sectionId,
}: CVAboutSectionProps) => {
  const { compactSidebarSectionSpacing, sectionHeadingCompactSx } = useComponentStyles();
  const bioAnimationStartDelayMs = delayMs + ANIMATED_CARD_DURATION_MS;

  return (
    <CVSectionCard
      delayMs={delayMs}
      triggerOnView={triggerOnView}
      id={sectionId}
      sx={cvSectionAnchorSx}
    >
      <Stack spacing={2}>
        <Stack spacing={compactSidebarSectionSpacing}>
          <SectionHeading overline="About" sx={sectionHeadingCompactSx} />
          <ProfileCard
            about={about}
            actions={actions}
            bioAnimationStartDelayMs={bioAnimationStartDelayMs}
          />
        </Stack>
        {footer && <Stack spacing={1.5}>{footer}</Stack>}
      </Stack>
    </CVSectionCard>
  );
};
