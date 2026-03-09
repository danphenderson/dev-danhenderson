import { Box, Stack, Typography } from '@mui/material';
import type { GitHubContribution } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { ContentCard } from '../ContentCard';
import { GitHubLinkChipList } from './GitHubLinkChipList';

type GitHubContributionsProps = {
  contributions: GitHubContribution[];
  loading: boolean;
  variant?: 'cards' | 'list';
  startDelayMs?: number;
  itemStaggerMs?: number;
};

export const GitHubContributions = ({
  contributions,
  loading,
  variant = 'cards',
  startDelayMs = 0,
  itemStaggerMs = 80,
}: GitHubContributionsProps) => {
  if (loading) {
    return (
      <LoadingBars label="Loading GitHub contributions" compact />
    );
  }

  if (!contributions.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        No recent community contributions found. Showing personal projects below.
      </Typography>
    );
  }

  const sortedContributions = [...contributions].sort(
    (a, b) => (b.stars ?? 0) - (a.stars ?? 0)
  );

  if (variant === 'list') {
    return (
      <GitHubLinkChipList
        items={sortedContributions.map((project) => ({
          key: project.name,
          href: project.url,
          label: (
            <Box
              component="span"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}
            >
              <Box
                component="span"
                sx={{ fontWeight: 600, color: 'text.primary', overflowWrap: 'anywhere' }}
              >
                {project.name}
              </Box>
              <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                ★ {project.stars ?? 0}
              </Box>
            </Box>
          ),
        }))}
        layout="stack"
        animateItems
        startDelayMs={startDelayMs}
        itemStaggerMs={itemStaggerMs}
      />
    );
  }

  return (
    <Stack spacing={1.25}>
      {sortedContributions.map((project) => (
        <ContentCard
          key={project.name}
          component="a"
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            p: 1.5,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: 6,
            },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{ color: 'text.primary', fontWeight: 700, overflowWrap: 'anywhere' }}
            >
              {project.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
              ★ {project.stars ?? 0}
            </Typography>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
};
