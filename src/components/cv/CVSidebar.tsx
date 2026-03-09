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
  githubProjectTitle,
  spacing = 2.5,
}: CVSidebarProps) => {
  return (
    <Stack spacing={spacing}>
      {sections.includes('about') && (
        <SectionCard delayMs={aboutDelayMs}>
          <Stack spacing={2}>
            <SectionHeading overline="About" sx={{ mb: 0.5 }} />
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
          projectTitle={githubProjectTitle}
        />
      )}

      {sections.includes('certificates') && (
        <SectionCard delayMs={certificatesDelayMs}>
          <SectionHeading overline="Certificates" title="Credentials" />
          <CertificatesList certificates={certificates} />
        </SectionCard>
      )}

      {sections.includes('tools') && (
        <SectionCard delayMs={toolsDelayMs}>
          <Stack spacing={2}>
            <SectionHeading overline="Stack & Tools" sx={{ mb: 0.5 }} />
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
