import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { GitHubContribution } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';

type GitHubContributionsProps = {
  contributions: GitHubContribution[];
  loading: boolean;
  variant?: 'cards' | 'list';
};

export const GitHubContributions = ({
  contributions,
  loading,
  variant = 'cards',
}: GitHubContributionsProps) => {
  const theme = useTheme();
  const { subtleBorder, subtleSurface } = useCvStyles();

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
      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          display: 'grid',
          gap: 0.75,
        }}
      >
        {sortedContributions.map((project) => (
          <Box key={project.name} component="li" sx={{ listStyle: 'none' }}>
            <Box
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
                p: 1,
                borderRadius: 1.5,
                border: subtleBorder,
                backgroundColor: subtleSurface,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[6],
                },
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: 'text.primary', fontWeight: 700, overflowWrap: 'anywhere' }}
                >
                  {project.name}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  ★ {project.stars ?? 0}
                </Typography>
              </Stack>
            </Box>
          </Box>
        ))}
      </Box>
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
              boxShadow: theme.shadows[6],
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
