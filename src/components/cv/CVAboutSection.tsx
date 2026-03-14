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
import { SubsectionTitle, TypewriterText } from '../text';

const ABOUT_CONTENT_DELIMITER = '|bio|';
const OPPORTUNITY_DELIMITER = '|opportunity|';
const WORKFLOW_CONTENT_DELIMITER = '|workflow|';
const WORKFLOW_HEADING = 'Current workflow:';
const CHIP_REVEAL_BUFFER_MS = 240;

type CVAboutSectionProps = {
  about: AboutMe;
  actions?: ReactNode;
  currentWorkflowTools?: string[];
  delayMs?: number;
  triggerOnView?: boolean;
  sectionId?: string;
};

export const CVAboutSection = ({
  about,
  actions,
  currentWorkflowTools = [],
  delayMs = 0,
  triggerOnView = true,
  sectionId,
}: CVAboutSectionProps) => {
  const {
    compactSidebarSectionSpacing,
    motionTokens,
    sectionHeadingCompactSx,
    supportAccentTitleSx,
  } = useComponentStyles();
  const bioAnimationStartDelayMs = delayMs + ANIMATED_CARD_DURATION_MS;
  const trimmedBio = about.bio.trim();
  const opportunities = useMemo(
    () => about.opportunities?.filter((opportunity) => opportunity.trim().length > 0) ?? [],
    [about.opportunities]
  );
  const workflowTools = useMemo(
    () => currentWorkflowTools.filter((tool) => tool.trim().length > 0),
    [currentWorkflowTools]
  );
  const aboutContentKey = useMemo(
    () =>
      `${trimmedBio}${ABOUT_CONTENT_DELIMITER}${opportunities.join(
        OPPORTUNITY_DELIMITER
      )}${WORKFLOW_CONTENT_DELIMITER}${workflowTools.join(WORKFLOW_CONTENT_DELIMITER)}`,
    [opportunities, trimmedBio, workflowTools]
  );
  const previousAboutContentKeyRef = useRef<string | null>(null);
  const workflowStartTimerRef = useRef<number | null>(null);
  const [showOpportunities, setShowOpportunities] = useState(
    opportunities.length > 0 && trimmedBio.length === 0
  );
  const [playWorkflowHeading, setPlayWorkflowHeading] = useState(
    trimmedBio.length === 0 && opportunities.length === 0
  );
  const [showWorkflowTools, setShowWorkflowTools] = useState(false);
  const isWorkflowSectionVisible = playWorkflowHeading;
  const handleBioAnimationComplete = useCallback(() => {
    if (opportunities.length > 0) {
      setShowOpportunities(true);
      return;
    }

    setPlayWorkflowHeading(true);
  }, [opportunities.length]);

  const handleWorkflowHeadingComplete = useCallback(() => {
    setShowWorkflowTools(true);
  }, []);

  useEffect(() => {
    return () => {
      if (workflowStartTimerRef.current !== null) {
        window.clearTimeout(workflowStartTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previousAboutContentKeyRef.current === aboutContentKey) {
      return;
    }

    previousAboutContentKeyRef.current = aboutContentKey;

    if (workflowStartTimerRef.current !== null) {
      window.clearTimeout(workflowStartTimerRef.current);
      workflowStartTimerRef.current = null;
    }

    setShowOpportunities(opportunities.length > 0 && trimmedBio.length === 0);
    setPlayWorkflowHeading(trimmedBio.length === 0 && opportunities.length === 0);
    setShowWorkflowTools(false);
  }, [aboutContentKey, opportunities.length, trimmedBio.length]);

  useEffect(() => {
    if (!showOpportunities || playWorkflowHeading) {
      return;
    }

    const workflowStartDelayMs =
      Math.max(opportunities.length - 1, 0) * motionTokens.accordionChipStaggerMs +
      CHIP_REVEAL_BUFFER_MS;

    workflowStartTimerRef.current = window.setTimeout(() => {
      setPlayWorkflowHeading(true);
      workflowStartTimerRef.current = null;
    }, workflowStartDelayMs);

    return () => {
      if (workflowStartTimerRef.current !== null) {
        window.clearTimeout(workflowStartTimerRef.current);
        workflowStartTimerRef.current = null;
      }
    };
  }, [
    motionTokens.accordionChipStaggerMs,
    opportunities.length,
    playWorkflowHeading,
    showOpportunities,
  ]);

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
          {opportunities.length > 0 && (
            <SkillsChipList skills={opportunities} dense in={showOpportunities} />
          )}
        </Stack>
        {workflowTools.length > 0 && (
          <Stack
            spacing={1}
            aria-hidden={!isWorkflowSectionVisible}
            sx={{ visibility: isWorkflowSectionVisible ? 'visible' : 'hidden' }}
          >
            <SubsectionTitle sx={supportAccentTitleSx}>
              <TypewriterText
                text={WORKFLOW_HEADING}
                playing={playWorkflowHeading}
                timingPreset="body"
                onComplete={handleWorkflowHeadingComplete}
              />
            </SubsectionTitle>
            <SkillsChipList skills={workflowTools} dense in={showWorkflowTools} />
          </Stack>
        )}
      </Stack>
    </CVSectionCard>
  );
};
