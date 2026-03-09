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
import { SectionCard } from '../layout/SectionCard';
import { CertificatesList } from './CertificatesList';
import { CVGitHubSection } from './CVGitHubSection';
import { ProfileCard } from './ProfileCard';
import { SectionHeading } from './SectionHeading';
import { ToolsAccordion } from '../ToolsAccordion';
import { useCvStyles } from '../../styles/cvStyles';

export type CVSidebarSection = 'about' | 'github' | 'certificates' | 'tools';

type CVSidebarProps = {
  sections: CVSidebarSection[];
  about: AboutMe;
  linkedinUrl?: string;
  resumeDownloadAction: ReactNode;
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
};

export const CVSidebar = ({
  sections,
  about,
  linkedinUrl,
  resumeDownloadAction,
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
}: CVSidebarProps) => {
  const { motionTokens, sectionHeadingCompactSx } = useCvStyles();
  const resolvedItemOffsetMs = itemOffsetMs ?? motionTokens.itemOffsetMs;

  return (
    <Stack spacing={spacing}>
      {sections.includes('about') && (
        <SectionCard delayMs={aboutDelayMs}>
          <Stack spacing={2}>
            <SectionHeading overline="About" sx={sectionHeadingCompactSx} />
            <ProfileCard about={about} linkedinUrl={linkedinUrl} />
            {resumeDownloadAction}
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
          sectionDelayMs={githubDelayMs}
          nestedDelayOffsetMs={githubNestedDelayOffsetMs}
          itemOffsetMs={resolvedItemOffsetMs}
          projectTitle={githubProjectTitle}
        />
      )}

      {sections.includes('certificates') && (
        <SectionCard delayMs={certificatesDelayMs}>
          <SectionHeading overline="Certificates" title="Credentials" />
          <CertificatesList certificates={certificates} startDelayMs={resolvedItemOffsetMs} />
        </SectionCard>
      )}

      {sections.includes('tools') && (
        <SectionCard delayMs={toolsDelayMs}>
          <Stack spacing={2}>
            <SectionHeading overline="Stack & Tools" sx={sectionHeadingCompactSx} />
            {stackAndTools.map((section) => (
              <ToolsAccordion
                key={section.title}
                title={section.title}
                subtitle=""
                tools={section.items}
                dense
                defaultExpanded={false}
              />
            ))}
          </Stack>
        </SectionCard>
      )}
    </Stack>
  );
};
