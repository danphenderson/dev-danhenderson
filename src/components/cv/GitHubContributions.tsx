import { Box, Stack, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import type { GitHubContribution } from '../../data/cv';
import { ContentCard } from './ContentCard';

type GitHubContributionsProps = {
  contributions: GitHubContribution[];
  loading: boolean;
};

export const GitHubContributions = ({ contributions, loading }: GitHubContributionsProps) => {
  if (loading) {
    return (
      <Typography variant="body2" color="text.secondary">
        Loading contributions...
      </Typography>
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
              boxShadow: '0 12px 30px rgba(15,23,42,0.15)',
            },
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack spacing={0.25}>
              <Typography
                variant="subtitle2"
                sx={{ color: '#0f172a', fontWeight: 700, overflowWrap: 'anywhere' }}
              >
                {project.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                View on GitHub
              </Typography>
            </Stack>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
            <StarRoundedIcon sx={{ fontSize: 18, color: '#fbbf24' }} />
            <Typography variant="body2" sx={{ fontWeight: 600, color: '#0f172a' }}>
              {project.stars ?? 0}
            </Typography>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
};
