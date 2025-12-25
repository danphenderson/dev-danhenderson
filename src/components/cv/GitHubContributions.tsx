import { Box, Chip, Stack, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import type { GitHubContribution } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';

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
    const chipSx = {
      border: subtleBorder,
      backgroundColor: subtleSurface,
      fontWeight: 600,
      color: 'text.primary',
      width: '100%',
      height: 'auto',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      '& .MuiChip-label': {
        whiteSpace: 'normal',
        textOverflow: 'clip',
        lineHeight: 1.4,
        px: 1,
        py: 0.25,
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
      <Stack spacing={0.5}>
        {sortedContributions.map((project, index) => (
          <AnimatedContentCard
            key={project.name}
            delayMs={startDelayMs + index * itemStaggerMs}
            sx={chipWrapperSx}
          >
            <Chip
              icon={<GitHubIcon sx={{ fontSize: 18, color: 'text.secondary' }} />}
              label={
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
                  <Box component="span" sx={{ fontWeight: 600, color: 'text.primary', overflowWrap: 'anywhere' }}>
                    {project.name}
                  </Box>
                  <Box component="span" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    ★ {project.stars ?? 0}
                  </Box>
                </Box>
              }
              component="a"
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              clickable
              variant="outlined"
              size="small"
              sx={chipSx}
            />
          </AnimatedContentCard>
        ))}
      </Stack>
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
