import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { AboutMe } from '../../types/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { MotionTiltCard } from '../../motion';
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
const OPPORTUNITIES_HEADING = 'Open to opportunities:';
const WORKFLOW_HEADING = 'Current workflow:';
const INLINE_SKILLS_HEADING_COLUMN_WIDTH = '16rem';
const CHIP_REVEAL_BUFFER_MS = 240;

type InlineAnimatedSkillsRowProps = {
  heading: string;
  headingColumnWidth: string;
  playing: boolean;
  revealed?: boolean;
  visible: boolean;
  onHeadingComplete: () => void;
  skills: string[];
  showSkills: boolean;
  titleSx: SxProps<Theme>;
};

const InlineAnimatedSkillsRow = ({
  heading,
  headingColumnWidth,
  playing,
  revealed = false,
  visible,
  onHeadingComplete,
  skills,
  showSkills,
  titleSx,
}: InlineAnimatedSkillsRowProps) => (
  <Stack
    spacing={1}
    aria-hidden={!visible}
    direction="row"
    flexWrap="wrap"
    alignItems="center"
    sx={{ visibility: visible ? 'visible' : 'hidden' }}
  >
    <Box sx={{ width: { sm: headingColumnWidth } }}>
      <SubsectionTitle sx={titleSx}>
        {revealed ? (
          heading
        ) : (
          <TypewriterText
            text={heading}
            playing={playing}
            timingPreset="body"
            onComplete={onHeadingComplete}
          />
        )}
      </SubsectionTitle>
    </Box>
    <SkillsChipList skills={skills} dense in={revealed || showSkills} />
  </Stack>
);

type CVAboutSectionProps = {
  about: AboutMe;
  actions?: ReactNode;
  footerControls?: ReactNode;
  currentWorkflowTools?: string[];
  delayMs?: number;
  triggerOnView?: boolean;
  revealed?: boolean;
  onRevealComplete?: () => void;
  sectionId?: string;
};

export const CVAboutSection = ({
  about,
  actions,
  footerControls,
  currentWorkflowTools = [],
  delayMs = 0,
  triggerOnView = true,
  revealed = false,
  onRevealComplete,
  sectionId,
}: CVAboutSectionProps) => {
  const {
    compactSidebarSectionSpacing,
    motionTokens,
    sectionHeadingCompactSx,
    supportAccentTitleSx,
    cvSectionItemSpacing,
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
  const previousRevealedRef = useRef<boolean | null>(null);
  const completedRevealContentKeyRef = useRef<string | null>(null);
  const workflowStartTimerRef = useRef<number | null>(null);
  const [hasBioCompleted, setHasBioCompleted] = useState(revealed || trimmedBio.length === 0);
  const [playOpportunitiesHeading, setPlayOpportunitiesHeading] = useState(
    !revealed && trimmedBio.length === 0 && opportunities.length > 0
  );
  const [showOpportunities, setShowOpportunities] = useState(revealed && opportunities.length > 0);
  const [playWorkflowHeading, setPlayWorkflowHeading] = useState(
    !revealed && trimmedBio.length === 0 && opportunities.length === 0
  );
  const [showWorkflowTools, setShowWorkflowTools] = useState(revealed && workflowTools.length > 0);
  const hasCompletedBio = revealed || hasBioCompleted;
  const shouldShowOpportunities = revealed || showOpportunities;
  const shouldShowWorkflowTools = revealed || showWorkflowTools;
  const isOpportunitiesSectionVisible =
    (revealed && opportunities.length > 0) || playOpportunitiesHeading || showOpportunities;
  const isWorkflowSectionVisible =
    (revealed && workflowTools.length > 0) || playWorkflowHeading || showWorkflowTools;
  const handleBioAnimationComplete = useCallback(() => {
    setHasBioCompleted(true);

    if (opportunities.length > 0) {
      setPlayOpportunitiesHeading(true);
      return;
    }

    setPlayWorkflowHeading(true);
  }, [opportunities.length]);

  const handleOpportunitiesHeadingComplete = useCallback(() => {
    setShowOpportunities(true);
  }, []);

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
    if (
      previousAboutContentKeyRef.current === aboutContentKey &&
      previousRevealedRef.current === revealed
    ) {
      return;
    }

    previousAboutContentKeyRef.current = aboutContentKey;
    previousRevealedRef.current = revealed;
    completedRevealContentKeyRef.current = null;

    if (workflowStartTimerRef.current !== null) {
      window.clearTimeout(workflowStartTimerRef.current);
      workflowStartTimerRef.current = null;
    }

    if (revealed) {
      setHasBioCompleted(true);
      setPlayOpportunitiesHeading(false);
      setShowOpportunities(opportunities.length > 0);
      setPlayWorkflowHeading(false);
      setShowWorkflowTools(workflowTools.length > 0);
      return;
    }

    setHasBioCompleted(trimmedBio.length === 0);
    setPlayOpportunitiesHeading(trimmedBio.length === 0 && opportunities.length > 0);
    setShowOpportunities(false);
    setPlayWorkflowHeading(trimmedBio.length === 0 && opportunities.length === 0);
    setShowWorkflowTools(false);
  }, [aboutContentKey, opportunities.length, revealed, trimmedBio.length, workflowTools.length]);

  useEffect(() => {
    if (revealed || !showOpportunities || playWorkflowHeading) {
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
    revealed,
    showOpportunities,
  ]);

  const hasCompletedAboutReveal =
    hasCompletedBio &&
    (opportunities.length === 0 || shouldShowOpportunities) &&
    (workflowTools.length === 0 || shouldShowWorkflowTools);

  useEffect(() => {
    if (!onRevealComplete || !hasCompletedAboutReveal) {
      return;
    }

    if (completedRevealContentKeyRef.current === aboutContentKey) {
      return;
    }

    completedRevealContentKeyRef.current = aboutContentKey;
    onRevealComplete();
  }, [aboutContentKey, hasCompletedAboutReveal, onRevealComplete]);

  return (
    <MotionTiltCard intensity={0.5}>
      <CVSectionCard
        delayMs={delayMs}
        triggerOnView={triggerOnView}
        id={sectionId}
        sx={cvSectionAnchorSx}
      >
        <Stack spacing={cvSectionItemSpacing}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <SectionHeading overline="About" sx={sectionHeadingCompactSx} />
            <ProfileCard
              about={about}
              actions={actions}
              bioRevealed={revealed}
              bioAnimationStartDelayMs={bioAnimationStartDelayMs}
              onBioAnimationComplete={handleBioAnimationComplete}
            />
          </Stack>
          {(opportunities.length > 0 || workflowTools.length > 0) && (
            <Stack spacing={cvSectionItemSpacing}>
              {opportunities.length > 0 && (
                <InlineAnimatedSkillsRow
                  heading={OPPORTUNITIES_HEADING}
                  headingColumnWidth={INLINE_SKILLS_HEADING_COLUMN_WIDTH}
                  playing={playOpportunitiesHeading}
                  revealed={revealed}
                  visible={isOpportunitiesSectionVisible}
                  onHeadingComplete={handleOpportunitiesHeadingComplete}
                  skills={opportunities}
                  showSkills={shouldShowOpportunities}
                  titleSx={supportAccentTitleSx}
                />
              )}
              {workflowTools.length > 0 && (
                <InlineAnimatedSkillsRow
                  heading={WORKFLOW_HEADING}
                  headingColumnWidth={INLINE_SKILLS_HEADING_COLUMN_WIDTH}
                  playing={playWorkflowHeading}
                  revealed={revealed}
                  visible={isWorkflowSectionVisible}
                  onHeadingComplete={handleWorkflowHeadingComplete}
                  skills={workflowTools}
                  showSkills={shouldShowWorkflowTools}
                  titleSx={supportAccentTitleSx}
                />
              )}
            </Stack>
          )}
          {footerControls && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                pt: 0.5,
              }}
            >
              {footerControls}
            </Box>
          )}
        </Stack>
      </CVSectionCard>
    </MotionTiltCard>
  );
};
