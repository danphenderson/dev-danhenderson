import { Divider, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type {
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
} from '../../data/cv';
import { githubUsername } from '../../data/cv';
import { useCvStyles } from '../../styles/cvStyles';
import { SectionCard } from '../layout/SectionCard';
import { SectionPanel } from '../layout/SectionPanel';
import { GitHubActivityList } from './GitHubActivityList';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';
import { GitHubContributions } from './GitHubContributions';
import { GitHubProjects } from './GitHubProjects';
import { SectionHeading } from './SectionHeading';

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
  overlineSx?: SxProps<Theme>;
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
  overlineSx,
}: CVGitHubSectionProps) => {
  const {
    cardResetSx,
    dividerSx,
    getSectionDelayMs,
    githubDefaultOverlineSx,
    motionTokens,
    sectionTitleSx,
  } = useCvStyles();
  const resolvedItemOffsetMs = itemOffsetMs ?? motionTokens.itemOffsetMs;
  const githubActivityDelayMs = getSectionDelayMs(0, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubContributionsDelayMs = getSectionDelayMs(1, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubCalendarDelayMs = getSectionDelayMs(2, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const githubProjectsDelayMs = getSectionDelayMs(3, nestedDelayOffsetMs, motionTokens.githubSubsectionStaggerMs);
  const resolvedOverlineSx = overlineSx ?? githubDefaultOverlineSx;

  return (
    <SectionCard delayMs={sectionDelayMs}>
      <Stack spacing={2}>
        <SectionHeading overline="GitHub" sx={resolvedOverlineSx} />

        <SectionCard delayMs={githubActivityDelayMs} sx={cardResetSx}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              Recent Activity
            </Typography>
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

        <SectionCard delayMs={githubContributionsDelayMs} sx={cardResetSx}>
          <Stack spacing={1}>
            <Divider sx={dividerSx} />
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              Contributions
            </Typography>
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

        <SectionCard delayMs={githubCalendarDelayMs} sx={cardResetSx}>
          <Stack spacing={1}>
            <Divider sx={dividerSx} />
            <GitHubContributionCalendar username={githubUsername} contained={false} />
          </Stack>
        </SectionCard>

        <SectionCard delayMs={githubProjectsDelayMs} sx={cardResetSx}>
          <Stack spacing={1}>
            <Divider sx={dividerSx} />
            <Typography variant="subtitle2" sx={sectionTitleSx}>
              {projectTitle}
            </Typography>
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
    </SectionCard>
  );
};
