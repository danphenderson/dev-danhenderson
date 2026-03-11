import type { ReactNode } from 'react';
import { Stack } from '@mui/material';
import type { AboutMe } from '../../data/cv';
import { useCvStyles } from '../../styles/cvStyles';
import { SectionCard } from '../layout/SectionCard';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ProfileCard } from './ProfileCard';
import { SectionHeading } from './SectionHeading';

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
  const { compactSidebarSectionSpacing, sectionHeadingCompactSx } = useCvStyles();

  return (
    <SectionCard
      delayMs={delayMs}
      triggerOnView={triggerOnView}
      id={sectionId}
      sx={cvSectionAnchorSx}
    >
      <Stack spacing={2}>
        <Stack spacing={compactSidebarSectionSpacing}>
          <SectionHeading overline="About" sx={sectionHeadingCompactSx} />
          <ProfileCard about={about} />
        </Stack>
        {(actions || footer) && (
          <Stack spacing={1.5}>
            {actions}
            {footer}
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
};
