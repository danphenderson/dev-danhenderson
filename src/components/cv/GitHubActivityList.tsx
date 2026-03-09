import { Box, Typography } from '@mui/material';
import type { GitHubActivityItem } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { GitHubLinkChipList } from './GitHubLinkChipList';

type GitHubActivityListProps = {
  activity: GitHubActivityItem[];
  loading: boolean;
  error?: string | null;
  startDelayMs?: number;
  itemStaggerMs?: number;
};

const defaultStaggerMs = 80;

export const GitHubActivityList = ({
  activity,
  loading,
  error,
  startDelayMs = 0,
  itemStaggerMs = defaultStaggerMs,
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
          }))}
          layout="stack"
          animateItems
          startDelayMs={startDelayMs}
          itemStaggerMs={itemStaggerMs}
        />
      )}
      {error && (
        <Typography variant="caption" color="text.secondary">
          {error}
        </Typography>
      )}
    </Box>
  );
};
