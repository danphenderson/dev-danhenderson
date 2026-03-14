import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Stack } from '@mui/material';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ProfileCard } from './ProfileCard';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';
import { ANIMATED_CARD_DURATION_MS } from '../AnimatedContentCard';
import { SkillsChipList } from '../SkillsChipList';

const ABOUT_CONTENT_DELIMITER = '|bio|';
const OPPORTUNITY_DELIMITER = '|opportunity|';

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
  const trimmedBio = about.bio.trim();
  const opportunities = useMemo(
    () => about.opportunities?.filter((opportunity) => opportunity.trim().length > 0) ?? [],
    [about.opportunities]
  );
  const aboutContentKey = useMemo(
    () => `${trimmedBio}${ABOUT_CONTENT_DELIMITER}${opportunities.join(OPPORTUNITY_DELIMITER)}`,
    [opportunities, trimmedBio]
  );
  const previousAboutContentKeyRef = useRef<string | null>(null);
  const [showOpportunities, setShowOpportunities] = useState(
    opportunities.length > 0 && trimmedBio.length === 0
  );
  const handleBioAnimationComplete = useCallback(() => {
    setShowOpportunities(true);
  }, []);

  useEffect(() => {
    if (previousAboutContentKeyRef.current === aboutContentKey) {
      return;
    }

    previousAboutContentKeyRef.current = aboutContentKey;
    setShowOpportunities(opportunities.length > 0 && trimmedBio.length === 0);
  }, [aboutContentKey, opportunities.length, trimmedBio.length]);

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
            onBioAnimationComplete={handleBioAnimationComplete}
          />
          {opportunities.length > 0 && <SkillsChipList skills={opportunities} dense in={showOpportunities} />}
        </Stack>
        {footer && <Stack spacing={1.5}>{footer}</Stack>}
      </Stack>
    </CVSectionCard>
  );
};
