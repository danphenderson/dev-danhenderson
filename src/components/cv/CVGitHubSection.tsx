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
  projectTitle?: string;
  overlineSx?: SxProps<Theme>;
};

const nestedDelayBaseMs = 80;
const githubStaggerMs = 120;
const githubItemDelayOffsetMs = 80;

export const CVGitHubSection = ({
  activity,
  contributions,
  projects,
  loading,
  error,
  sectionDelayMs = 0,
  nestedDelayOffsetMs = 0,
  projectTitle = 'Public Projects',
  overlineSx,
}: CVGitHubSectionProps) => {
  const { cardResetSx, dividerSx, githubDefaultOverlineSx, sectionTitleSx } = useCvStyles();
  const githubNestedBaseDelayMs = nestedDelayBaseMs + nestedDelayOffsetMs;
  const githubActivityDelayMs = githubNestedBaseDelayMs;
  const githubActivityItemsDelayMs = githubActivityDelayMs + githubItemDelayOffsetMs;
  const githubContributionsDelayMs = githubNestedBaseDelayMs + githubStaggerMs;
  const githubContributionsItemsDelayMs = githubContributionsDelayMs + githubItemDelayOffsetMs;
  const githubCalendarDelayMs = githubNestedBaseDelayMs + githubStaggerMs * 2;
  const githubProjectsDelayMs = githubNestedBaseDelayMs + githubStaggerMs * 3;
  const githubProjectsItemsDelayMs = githubProjectsDelayMs + githubItemDelayOffsetMs;
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
                startDelayMs={githubActivityItemsDelayMs}
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
                startDelayMs={githubContributionsItemsDelayMs}
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
                startDelayMs={githubProjectsItemsDelayMs}
                itemStaggerMs={80}
              />
            </SectionPanel>
          </Stack>
        </SectionCard>
      </Stack>
    </SectionCard>
  );
};
