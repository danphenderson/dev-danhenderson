import { Divider, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type {
  GitHubActivityItem,
  GitHubContribution,
  GitHubProject,
} from '../../data/cv';
import { githubUsername } from '../../data/cv';
import { ANIMATED_CARD_DURATION_MS } from '../AnimatedContentCard';
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

const ghostCardSx = {
  p: 0,
  border: 'none',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderRadius: 0,
};

const githubSectionTitleSx = {
  color: 'text.primary',
  fontWeight: 700,
};

const githubSectionDividerSx = {
  borderColor: 'divider',
};

const defaultOverlineSx = {
  mb: 0.5,
  ml: { xs: 1.5, md: 1.5 },
  mt: { xs: 0.75, md: 0.75 },
};

const nestedDelayBaseMs = 160;
const githubStaggerMs = 200;

export const CVGitHubSection = ({
  activity,
  contributions,
  projects,
  loading,
  error,
  sectionDelayMs = 0,
  nestedDelayOffsetMs = 0,
  projectTitle = 'Public Projects',
  overlineSx = defaultOverlineSx,
}: CVGitHubSectionProps) => {
  const githubNestedBaseDelayMs = ANIMATED_CARD_DURATION_MS + nestedDelayBaseMs + nestedDelayOffsetMs;
  const githubItemDelayOffsetMs = ANIMATED_CARD_DURATION_MS + nestedDelayBaseMs;
  const githubActivityDelayMs = githubNestedBaseDelayMs;
  const githubActivityItemsDelayMs = githubActivityDelayMs + githubItemDelayOffsetMs;
  const githubContributionsDelayMs = githubNestedBaseDelayMs + githubStaggerMs;
  const githubContributionsItemsDelayMs = githubContributionsDelayMs + githubItemDelayOffsetMs;

  return (
    <SectionCard delayMs={sectionDelayMs}>
      <Stack spacing={2}>
        <SectionHeading overline="GitHub" sx={overlineSx} />

        <SectionCard delayMs={githubActivityDelayMs} sx={ghostCardSx}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={githubSectionTitleSx}>
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

        <SectionCard delayMs={githubContributionsDelayMs} sx={ghostCardSx}>
          <Stack spacing={1}>
            <Divider sx={githubSectionDividerSx} />
            <Typography variant="subtitle2" sx={githubSectionTitleSx}>
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

        <SectionCard delayMs={githubNestedBaseDelayMs + githubStaggerMs * 2} sx={ghostCardSx}>
          <Stack spacing={1}>
            <Divider sx={githubSectionDividerSx} />
            <GitHubContributionCalendar username={githubUsername} contained={false} />
          </Stack>
        </SectionCard>

        <SectionCard delayMs={githubNestedBaseDelayMs + githubStaggerMs * 3} sx={ghostCardSx}>
          <Stack spacing={1}>
            <Divider sx={githubSectionDividerSx} />
            <Typography variant="subtitle2" sx={githubSectionTitleSx}>
              {projectTitle}
            </Typography>
            <SectionPanel>
              <GitHubProjects projects={projects} />
            </SectionPanel>
          </Stack>
        </SectionCard>
      </Stack>
    </SectionCard>
  );
};
