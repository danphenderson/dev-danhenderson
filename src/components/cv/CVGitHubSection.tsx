import { Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type {
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
} from '../../types/cv';
import { githubUsername } from '../../data/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { CVSectionCard } from './CVSectionCard';
import { SectionCard } from '../layout/SectionCard';
import { SectionPanel } from '../layout/SectionPanel';
import { GitHubActivityList } from './GitHubActivityList';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';
import { GitHubContributions } from './GitHubContributions';
import { GitHubProjects } from './GitHubProjects';
import { SectionHeading } from '../layout/SectionHeading';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { SectionLeadText, SubsectionTitle } from '../text';

type CVGitHubSectionProps = {
  activity: GitHubActivityItem[];
  contributions: GitHubContribution[];
  projects: GitHubProject[];
  loading: boolean;
  error?: string | null;
  sectionDelayMs?: number;
  nestedDelayOffsetMs?: number;
  itemOffsetMs?: number;
  projectTitle?: string;
  lead?: string;
  overlineSx?: SxProps<Theme>;
  sectionId?: string;
};

export const CVGitHubSection = ({
  activity,
  contributions,
  projects,
  loading,
  error,
  sectionDelayMs = 0,
  nestedDelayOffsetMs = 0,
  itemOffsetMs,
  projectTitle = 'Public Projects',
  lead,
  overlineSx,
  sectionId,
}: CVGitHubSectionProps) => {
  const {
    cardResetSx,
    compactSidebarSectionSpacing,
    getSectionDelayMs,
    motionTokens,
    sectionHeadingCompactSx,
    supportAccentTitleSx,
  } = useComponentStyles();
  const resolvedItemOffsetMs = itemOffsetMs ?? motionTokens.itemOffsetMs;
  const githubActivityDelayMs = getSectionDelayMs(0, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubContributionsDelayMs = getSectionDelayMs(1, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubCalendarDelayMs = getSectionDelayMs(2, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubProjectsDelayMs = getSectionDelayMs(3, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const resolvedOverlineSx = overlineSx ?? sectionHeadingCompactSx;
  const githubSubsectionCardSx: SxProps<Theme> = [
    cardResetSx,
    {
      '&::after': {
        animation: 'none',
        boxShadow: 'none',
        content: 'none',
      },
    },
  ];

  return (
    <CVSectionCard delayMs={sectionDelayMs} id={sectionId} sx={cvSectionAnchorSx}>
      <Stack spacing={compactSidebarSectionSpacing}>
        <SectionHeading overline="GitHub" sx={resolvedOverlineSx} />
        {lead && <SectionLeadText>{lead}</SectionLeadText>}

        <SectionCard delayMs={githubActivityDelayMs} sx={githubSubsectionCardSx}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <SubsectionTitle sx={supportAccentTitleSx}>
              Recent Activity
            </SubsectionTitle>
            <SectionPanel>
              <GitHubActivityList
                activity={activity}
                loading={loading}
                error={error}
                startDelayMs={resolvedItemOffsetMs}
              />
            </SectionPanel>
          </Stack>
        </SectionCard>

        <SectionCard delayMs={githubContributionsDelayMs} sx={githubSubsectionCardSx}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <SubsectionTitle sx={supportAccentTitleSx}>
              Contributions
            </SubsectionTitle>
            <SectionPanel>
              <GitHubContributions
                contributions={contributions}
                loading={loading}
                variant="list"
                startDelayMs={resolvedItemOffsetMs}
              />
            </SectionPanel>
          </Stack>
        </SectionCard>

        <SectionCard delayMs={githubCalendarDelayMs} sx={githubSubsectionCardSx}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <GitHubContributionCalendar username={githubUsername} contained={false} />
          </Stack>
        </SectionCard>

        <SectionCard delayMs={githubProjectsDelayMs} sx={githubSubsectionCardSx}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <SubsectionTitle sx={supportAccentTitleSx}>
              {projectTitle}
            </SubsectionTitle>
            <SectionPanel>
              <GitHubProjects
                projects={projects}
                animateItems
                startDelayMs={resolvedItemOffsetMs}
              />
            </SectionPanel>
          </Stack>
        </SectionCard>
      </Stack>
    </CVSectionCard>
  );
};
