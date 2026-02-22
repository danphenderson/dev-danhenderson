import { Box, Chip, Stack, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { GitHubActivityItem } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { LoadingBars } from '../LoadingBars';
import { useCvStyles } from '../../ThemeProvider';

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
  const { subtleBorder, subtleSurface } = useCvStyles();
  const chipSx = {
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 600,
    color: 'text.primary',
    width: '100%',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& .MuiChip-icon': {
      alignSelf: 'center',
      marginLeft: 0.5,
      marginRight: 0.5,
      fontSize: 18,
      color: 'text.secondary',
    },
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      textOverflow: 'clip',
      lineHeight: 1.4,
      px: 1,
      py: 0.25,
      overflowWrap: 'anywhere',
    },
  };
  const chipWrapperSx = {
    width: '100%',
    p: { xs: 0, md: 0 },
    border: 'none',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    borderRadius: 0,
  };

  return (
    <Box>
      {loading ? (
        <LoadingBars label="Loading GitHub activity" compact />
      ) : (
        <Stack spacing={0.5}>
          {activity.map((item, idx) => {
            const isLink = Boolean(item.href);

            return (
              <AnimatedContentCard
                key={`${item.label}-${idx}`}
                delayMs={startDelayMs + idx * itemStaggerMs}
                sx={chipWrapperSx}
              >
                <Chip
                  icon={<GitHubIcon />}
                  label={item.label}
                  component={isLink ? 'a' : 'div'}
                  href={item.href}
                  target={isLink ? '_blank' : undefined}
                  rel={isLink ? 'noopener noreferrer' : undefined}
                  clickable={isLink}
                  variant="outlined"
                  size="small"
                  sx={chipSx}
                />
              </AnimatedContentCard>
            );
          })}
        </Stack>
      )}
      {error && (
        <Typography variant="caption" color="text.secondary">
          {error}
        </Typography>
      )}
    </Box>
  );
};
