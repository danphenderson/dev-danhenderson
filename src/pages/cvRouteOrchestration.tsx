import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { CVAboutSection } from '../components/cv/CVAboutSection';
import { CVCertificatesSection } from '../components/cv/CVCertificatesSection';
import { CVCodingSection } from '../components/cv/CVCodingSection';
import { CVEducationSection } from '../components/cv/CVEducationSection';
import { CVExperienceSection } from '../components/cv/CVExperienceSection';
import { CVGitHubSection } from '../components/cv/CVGitHubSection';
import { CVVolunteeringSection } from '../components/cv/CVVolunteeringSection';
import { cvSectionMetadata } from '../components/cv/cvSectionMetadata';
import { githubSectionLead } from '../data/cv';
import { CVLayoutMode, CVSectionRegion, cvPageSectionLayout } from './cvPageLayout';
import type {
  AboutMe,
  Certificate,
  CodingExample,
  CVSectionKey,
  EducationInfo,
  Experience,
  GitHubActivityItem,
  GitHubContribution,
  VolunteeringEntry,
} from '../types/cv';

const ABOUT_CONTENT_DELIMITER = '|bio|';
const OPPORTUNITY_DELIMITER = '|opportunity|';
const WORKFLOW_CONTENT_DELIMITER = '|workflow|';

type CVLayoutMotion = {
  delayMs: number;
  triggerOnView: boolean;
};

type CVSectionDefinition = {
  key: CVSectionKey;
  render: (layout: CVLayoutMotion) => ReactNode;
};

type UseCVRevealStateOptions = {
  bio: string;
  opportunities: string[];
  workflowTools: string[];
};

type CVMotionTokens = {
  sectionStaggerMs: number;
  itemOffsetMs: number;
};

export type CVResolvedSectionDescriptor = {
  id: string;
  key: CVSectionKey;
  node: ReactNode;
  placement: {
    order: number;
    region: CVSectionRegion;
  };
  delayMs: number;
  triggerOnView: boolean;
};

export type CVRevealState = {
  isAboutRevealed: boolean;
  isGithubRevealed: boolean;
  hasSettledGithubCalendar: boolean;
  isSectionRevealed: (sectionKey: CVSectionKey) => boolean;
  handleAboutRevealComplete: () => void;
  markSectionRevealed: (sectionKey: CVSectionKey) => void;
  markGithubCalendarSettled: () => void;
};

type BuildCVSectionDescriptorsOptions = {
  layoutMode: CVLayoutMode;
  about: AboutMe;
  aboutActions: ReactNode;
  aboutFooterControls: ReactNode;
  currentWorkflowTools: string[];
  experiences: Experience[];
  education: EducationInfo;
  volunteering: VolunteeringEntry[];
  certificates: Certificate[];
  codingExamples: CodingExample[];
  githubActivity: GitHubActivityItem[];
  githubContributions: GitHubContribution[];
  githubLoading: boolean;
  githubError: string | null;
  githubStatusTooltip: ReactNode;
  motionTokens: CVMotionTokens;
  revealState: CVRevealState;
};

const getAboutRevealKey = (bio: string, opportunities: string[], workflowTools: string[]) =>
  `${bio.trim()}${ABOUT_CONTENT_DELIMITER}${opportunities
    .filter((opportunity) => opportunity.trim().length > 0)
    .join(OPPORTUNITY_DELIMITER)}${WORKFLOW_CONTENT_DELIMITER}${workflowTools
    .filter((tool) => tool.trim().length > 0)
    .join(WORKFLOW_CONTENT_DELIMITER)}`;

export const useCVRevealState = ({
  bio,
  opportunities,
  workflowTools,
}: UseCVRevealStateOptions): CVRevealState => {
  const [revealedSections, setRevealedSections] = useState<Partial<Record<CVSectionKey, boolean>>>(
    {}
  );
  const [revealedAboutKey, setRevealedAboutKey] = useState<string | null>(null);
  const [hasSettledGithubCalendar, setHasSettledGithubCalendar] = useState(false);
  const aboutRevealKey = useMemo(
    () => getAboutRevealKey(bio, opportunities, workflowTools),
    [bio, opportunities, workflowTools]
  );

  useEffect(() => {
    setRevealedAboutKey((currentKey) => (currentKey === aboutRevealKey ? currentKey : null));
  }, [aboutRevealKey]);

  const markSectionRevealed = useCallback((sectionKey: CVSectionKey) => {
    setRevealedSections((currentSections) =>
      currentSections[sectionKey]
        ? currentSections
        : {
            ...currentSections,
            [sectionKey]: true,
          }
    );
  }, []);

  const markGithubCalendarSettled = useCallback(() => {
    setHasSettledGithubCalendar(true);
  }, []);

  const isSectionRevealed = useCallback(
    (sectionKey: CVSectionKey) => Boolean(revealedSections[sectionKey]),
    [revealedSections]
  );

  const handleAboutRevealComplete = useCallback(() => {
    setRevealedAboutKey(aboutRevealKey);
  }, [aboutRevealKey]);

  return {
    isAboutRevealed: revealedAboutKey === aboutRevealKey,
    isGithubRevealed: isSectionRevealed('github'),
    hasSettledGithubCalendar,
    isSectionRevealed,
    handleAboutRevealComplete,
    markSectionRevealed,
    markGithubCalendarSettled,
  };
};

export const buildCVSectionDescriptors = ({
  layoutMode,
  about,
  aboutActions,
  aboutFooterControls,
  currentWorkflowTools,
  experiences,
  education,
  volunteering,
  certificates,
  codingExamples,
  githubActivity,
  githubContributions,
  githubLoading,
  githubError,
  githubStatusTooltip,
  motionTokens,
  revealState,
}: BuildCVSectionDescriptorsOptions): CVResolvedSectionDescriptor[] => {
  const githubNestedDelayOffsetMs = motionTokens.sectionStaggerMs / 2;
  const itemOffsetMs = motionTokens.itemOffsetMs;

  const sectionDefinitions: CVSectionDefinition[] = [
    {
      key: 'about',
      render: (layout) => (
        <CVAboutSection
          about={about}
          actions={aboutActions}
          footerControls={aboutFooterControls}
          currentWorkflowTools={currentWorkflowTools}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isAboutRevealed}
          onRevealComplete={revealState.handleAboutRevealComplete}
          sectionId={cvSectionMetadata.about.id}
        />
      ),
    },
    {
      key: 'experience',
      render: (layout) => (
        <CVExperienceSection
          experiences={experiences}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isSectionRevealed('experience')}
          onReveal={() => revealState.markSectionRevealed('experience')}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.experience.id}
        />
      ),
    },
    {
      key: 'education',
      render: (layout) => (
        <CVEducationSection
          education={education}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isSectionRevealed('education')}
          onReveal={() => revealState.markSectionRevealed('education')}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.education.id}
        />
      ),
    },
    {
      key: 'volunteering',
      render: (layout) => (
        <CVVolunteeringSection
          volunteering={volunteering}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isSectionRevealed('volunteering')}
          onReveal={() => revealState.markSectionRevealed('volunteering')}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.volunteering.id}
        />
      ),
    },
    {
      key: 'github',
      render: (layout) => (
        <CVGitHubSection
          activity={githubActivity}
          contributions={githubContributions}
          loading={githubLoading}
          error={githubError}
          statusIndicator={githubStatusTooltip}
          revealed={revealState.isGithubRevealed}
          onReveal={() => revealState.markSectionRevealed('github')}
          calendarSettled={revealState.hasSettledGithubCalendar}
          onCalendarSettled={revealState.markGithubCalendarSettled}
          sectionDelayMs={layout.delayMs}
          nestedDelayOffsetMs={githubNestedDelayOffsetMs}
          itemOffsetMs={itemOffsetMs}
          lead={githubSectionLead}
          sectionId={cvSectionMetadata.github.id}
        />
      ),
    },
    {
      key: 'certificates',
      render: (layout) => (
        <CVCertificatesSection
          certificates={certificates}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isSectionRevealed('certificates')}
          onReveal={() => revealState.markSectionRevealed('certificates')}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.certificates.id}
        />
      ),
    },
    {
      key: 'coding',
      render: (layout) => (
        <CVCodingSection
          examples={codingExamples}
          delayMs={layout.delayMs}
          triggerOnView={layout.triggerOnView}
          revealed={revealState.isSectionRevealed('coding')}
          onReveal={() => revealState.markSectionRevealed('coding')}
          itemOffsetMs={itemOffsetMs}
          sectionId={cvSectionMetadata.coding.id}
        />
      ),
    },
  ];

  return sectionDefinitions.map(({ key, render }) => {
    const layout = cvPageSectionLayout[key][layoutMode];

    return {
      id: cvSectionMetadata[key].id,
      key,
      node: render(layout),
      placement: {
        order: layout.order,
        region: layout.region,
      },
      delayMs: layout.delayMs,
      triggerOnView: layout.triggerOnView,
    };
  });
};

export const getSectionDescriptorsForRegion = (
  sectionDescriptors: CVResolvedSectionDescriptor[],
  region: CVSectionRegion
) =>
  sectionDescriptors
    .filter((descriptor) => descriptor.placement.region === region)
    .sort((left, right) => left.placement.order - right.placement.order);
