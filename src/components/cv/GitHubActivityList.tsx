import { Box, Typography } from '@mui/material';
import type { GitHubActivityItem } from '../../types/cv';
import { LoadingBars } from '../LoadingBars';
import { useComponentStyles } from '../../styles/componentStyles';
import { GitHubLinkChipList } from './GitHubLinkChipList';

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
  const { secondaryTextSx } = useComponentStyles();

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
        <Typography variant="caption" sx={secondaryTextSx}>
          {error}
        </Typography>
      )}
    </Box>
  );
};
