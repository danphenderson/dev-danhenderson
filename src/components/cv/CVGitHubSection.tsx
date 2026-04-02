import type { ReactNode } from 'react';
import { Box, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { GitHubActivityItem, GitHubContribution } from '../../types/cv';
import type { AnimatedContentCardEntranceDirection } from '../../types/ui';
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
import { Text } from '../text';

type CVGitHubSectionProps = {
  activity: GitHubActivityItem[];
  contributions: GitHubContribution[];
  loading: boolean;
  error?: string | null;
  entranceDirection?: AnimatedContentCardEntranceDirection;
  revealed?: boolean;
  onReveal?: () => void;
  calendarSettled?: boolean;
  onCalendarSettled?: () => void;
  sectionDelayMs?: number;
  nestedDelayOffsetMs?: number;
  itemOffsetMs?: number;
  lead?: string;
  statusIndicator?: ReactNode;
  overlineSx?: SxProps<Theme>;
  sectionId?: string;
};

export const CVGitHubSection = ({
  activity,
  contributions,
  loading,
  error,
  entranceDirection,
  revealed = false,
  onReveal,
  calendarSettled = false,
  onCalendarSettled,
  sectionDelayMs = 0,
  nestedDelayOffsetMs = 0,
  itemOffsetMs,
  lead,
  statusIndicator,
  overlineSx,
  sectionId,
}: CVGitHubSectionProps) => {
  const {
    cardResetSx,
    compactSidebarSectionSpacing,
    getSectionDelayMs,
    motionTokens,
    sectionHeadingCompactSx,
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
    <CVSectionCard
      delayMs={sectionDelayMs}
      entranceDirection={entranceDirection}
      skipEntranceAnimation={revealed}
      onVisible={onReveal}
      id={sectionId}
      sx={cvSectionAnchorSx}
    >
      <Stack spacing={compactSidebarSectionSpacing}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            flexWrap: 'wrap',
          }}
        >
          <SectionHeading overline="GitHub" sx={resolvedOverlineSx} />
          {statusIndicator}
        </Box>
        {lead && <Text role="metaStrong">{lead}</Text>}
        <SectionCard
          delayMs={githubActivityDelayMs}
          skipEntranceAnimation={revealed}
          sx={githubSubsectionCardSx}
        >
          <Stack spacing={compactSidebarSectionSpacing}>
            <Text role="subsectionTitle" tone="support">
              Recent Activity
            </Text>
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

        <SectionCard
          delayMs={githubContributionsDelayMs}
          skipEntranceAnimation={revealed}
          sx={githubSubsectionCardSx}
        >
          <Stack spacing={compactSidebarSectionSpacing}>
            <Text role="subsectionTitle" tone="support">
              Contributions
            </Text>
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

        <SectionCard
          delayMs={githubCalendarDelayMs}
          skipEntranceAnimation={revealed}
          sx={githubSubsectionCardSx}
        >
          <Stack spacing={compactSidebarSectionSpacing}>
            <GitHubContributionCalendar
              username={githubUsername}
              contained={false}
              skipEntranceAnimation={calendarSettled}
              onEntranceComplete={onCalendarSettled}
            />
          </Stack>
        </SectionCard>
      </Stack>
    </CVSectionCard>
  );
};
