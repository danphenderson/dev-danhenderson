import { ReactNode } from 'react';
import { Stack } from '@mui/material';
import type {
  AboutMe,
  Certificate,
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
  StackSection,
} from '../../data/cv';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { SectionCard } from '../layout/SectionCard';
import { CertificatesList } from './CertificatesList';
import { CVGitHubSection } from './CVGitHubSection';
import { ProfileCard } from './ProfileCard';
import { SectionHeading } from './SectionHeading';
import { StackAndToolsSection } from './StackAndToolsSection';
import { useCvStyles } from '../../styles/cvStyles';

export type CVSidebarSection = 'about' | 'github' | 'certificates' | 'tools';

type CVSidebarProps = {
  sections: CVSidebarSection[];
  about: AboutMe;
  aboutActions?: ReactNode;
  activity: GitHubActivityItem[];
  contributions: GitHubContribution[];
  projects: GitHubProject[];
  loading: boolean;
  error?: string | null;
  certificates: Certificate[];
  stackAndTools: StackSection[];
  aboutDelayMs?: number;
  githubDelayMs?: number;
  certificatesDelayMs?: number;
  toolsDelayMs?: number;
  githubNestedDelayOffsetMs?: number;
  itemOffsetMs?: number;
  githubProjectTitle?: string;
  spacing?: number;
  sectionIds?: Partial<Record<CVSidebarSection, string>>;
};

export const CVSidebar = ({
  sections,
  about,
  aboutActions,
  activity,
  contributions,
  projects,
  loading,
  error,
  certificates,
  stackAndTools,
  aboutDelayMs = 0,
  githubDelayMs = 0,
  certificatesDelayMs = 0,
  toolsDelayMs = 0,
  githubNestedDelayOffsetMs = 0,
  itemOffsetMs,
  githubProjectTitle,
  spacing = 2.5,
  sectionIds,
}: CVSidebarProps) => {
  const {
    compactSidebarSectionSpacing,
    motionTokens,
    sectionHeadingCompactSx,
  } = useCvStyles();
  const resolvedItemOffsetMs = itemOffsetMs ?? motionTokens.itemOffsetMs;

  return (
    <Stack spacing={spacing}>
      {sections.includes('about') && (
        <SectionCard delayMs={aboutDelayMs} id={sectionIds?.about} sx={cvSectionAnchorSx}>
          <Stack spacing={2}>
            <Stack spacing={compactSidebarSectionSpacing}>
              <SectionHeading overline="About" sx={sectionHeadingCompactSx} />
              <ProfileCard about={about} />
            </Stack>
            {aboutActions}
          </Stack>
        </SectionCard>
      )}

      {sections.includes('github') && (
        <CVGitHubSection
          activity={activity}
          contributions={contributions}
          projects={projects}
          loading={loading}
          error={error}
          sectionId={sectionIds?.github}
          sectionDelayMs={githubDelayMs}
          nestedDelayOffsetMs={githubNestedDelayOffsetMs}
          itemOffsetMs={resolvedItemOffsetMs}
          projectTitle={githubProjectTitle}
        />
      )}

      {sections.includes('certificates') && (
        <SectionCard delayMs={certificatesDelayMs} id={sectionIds?.certificates} sx={cvSectionAnchorSx}>
          <SectionHeading overline="Certificates" title="Credentials" />
          <CertificatesList certificates={certificates} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}

      {sections.includes('tools') && (
        <SectionCard delayMs={toolsDelayMs} id={sectionIds?.tools} sx={cvSectionAnchorSx}>
          <StackAndToolsSection sections={stackAndTools} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}
    </Stack>
  );
};
