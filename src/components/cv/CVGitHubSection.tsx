import { Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { SharedDataStatus } from '../../types/data';
import type { GitHubActivityItem, GitHubContribution } from '../../types/cv';
import { githubUsername } from '../../data/cv';
import { useComponentStyles } from '../../styles/componentStyles';
import { CVSectionCard } from './CVSectionCard';
import { SectionCard } from '../layout/SectionCard';
import { SectionPanel } from '../layout/SectionPanel';
import { GitHubActivityList } from './GitHubActivityList';
import { GitHubContributionCalendar } from './GitHubContributionCalendar';
import { GitHubContributions } from './GitHubContributions';
import { SectionHeading } from '../layout/SectionHeading';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { BodyText, SectionLeadText, SubsectionTitle } from '../text';

const formatStatusTimestamp = (value?: string) => {
  if (!value) {
    return null;
  }

  const resolvedDate = new Date(value);
  if (Number.isNaN(resolvedDate.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(resolvedDate);
};

const getGitHubStatusSummary = (status: SharedDataStatus) => {
  if (status.loading) {
    return 'Loading live GitHub activity while keeping bundled fallback highlights available.';
  }

  if (status.isFallback) {
    return 'Showing bundled fallback highlights because the live GitHub response was incomplete or unavailable.';
  }

  if (status.source === 'cache') {
    return 'Showing recent cached GitHub data from an earlier successful fetch.';
  }

  return 'Showing live GitHub activity from the latest successful fetch.';
};

type CVGitHubSectionProps = {
  activity: GitHubActivityItem[];
  contributions: GitHubContribution[];
  loading: boolean;
  error?: string | null;
  status?: SharedDataStatus;
  sectionDelayMs?: number;
  nestedDelayOffsetMs?: number;
  itemOffsetMs?: number;
  lead?: string;
  overlineSx?: SxProps<Theme>;
  sectionId?: string;
};

export const CVGitHubSection = ({
  activity,
  contributions,
  loading,
  error,
  status,
  sectionDelayMs = 0,
  nestedDelayOffsetMs = 0,
  itemOffsetMs,
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
  const githubActivityDelayMs = getSectionDelayMs(
    0,
    nestedDelayOffsetMs,
    motionTokens.githubSubsectionStaggerMs
  );
  const githubContributionsDelayMs = getSectionDelayMs(
    1,
    nestedDelayOffsetMs,
    motionTokens.githubSubsectionStaggerMs
  );
  const githubCalendarDelayMs = getSectionDelayMs(
    2,
    nestedDelayOffsetMs,
    motionTokens.githubSubsectionStaggerMs
  );
  const resolvedOverlineSx = overlineSx ?? sectionHeadingCompactSx;
  const resolvedStatus = status ?? {
    source: 'static',
    loading,
    error: error ?? null,
    isFallback: Boolean(error),
    reason: error ? 'fallback-content' : 'bundled-content',
    freshness: {
      label: 'GitHub status metadata is unavailable for this render.',
      isStale: false,
    },
  };
  const formattedStatusTimestamp = formatStatusTimestamp(resolvedStatus.freshness.lastUpdated);
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
        <SectionPanel>
          <Stack spacing={0.75}>
            <SubsectionTitle sx={supportAccentTitleSx}>Data status</SubsectionTitle>
            <BodyText>{getGitHubStatusSummary(resolvedStatus)}</BodyText>
            <BodyText>{resolvedStatus.freshness.label}</BodyText>
            {formattedStatusTimestamp && (
              <BodyText>Last refreshed {formattedStatusTimestamp}.</BodyText>
            )}
            {resolvedStatus.error && <BodyText>{resolvedStatus.error}</BodyText>}
          </Stack>
        </SectionPanel>

        <SectionCard delayMs={githubActivityDelayMs} sx={githubSubsectionCardSx}>
          <Stack spacing={compactSidebarSectionSpacing}>
            <SubsectionTitle sx={supportAccentTitleSx}>Recent Activity</SubsectionTitle>
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
            <SubsectionTitle sx={supportAccentTitleSx}>Contributions</SubsectionTitle>
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
      </Stack>
    </CVSectionCard>
  );
};
