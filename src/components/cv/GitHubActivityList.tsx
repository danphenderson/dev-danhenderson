import { Box } from '@mui/material';
import type { GitHubActivityItem } from '../../types/cv';
import { LoadingBars } from '../LoadingBars';
import { GitHubLinkChipList } from './GitHubLinkChipList';
import { Text } from '../text';

type GitHubActivityListProps = {
  activity: GitHubActivityItem[];
  loading: boolean;
  error?: string | null;
  startDelayMs?: number;
  itemStaggerMs?: number;
};

export const GitHubActivityList = ({
  activity,
  loading,
  error,
  startDelayMs = 0,
  itemStaggerMs,
}: GitHubActivityListProps) => {
  return (
    <Box>
      {loading ? (
        <LoadingBars label="Loading GitHub activity" compact />
      ) : (
        <GitHubLinkChipList
          items={activity.map((item, idx) => ({
            key: `${item.label}-${idx}`,
            label: item.label,
            href: item.href,
            tooltip: item.href ? `Open ${item.label} on GitHub.` : undefined,
          }))}
          layout="stack"
          animateItems
          startDelayMs={startDelayMs}
          itemStaggerMs={itemStaggerMs}
        />
      )}
      {error && (
        <Text role="caption" tone="muted">
          {error}
        </Text>
      )}
    </Box>
  );
};
