import { Box, Stack, Typography } from '@mui/material';
import type { GitHubContribution } from '../../data/cv';
import { LoadingBars } from '../LoadingBars';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../styles/cvStyles';
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
  itemStaggerMs,
}: GitHubContributionsProps) => {
  const {
    contributionCardBodySx,
    contributionCardMetaSx,
    contributionCardMetaRowSx,
    contributionCardNameSx,
    contributionCardSx,
    contributionInlineLabelSx,
    contributionInlineMetaSx,
    contributionInlineNameSx,
    secondaryTextSx,
  } = useCvStyles();

  if (loading) {
    return (
      <LoadingBars label="Loading GitHub contributions" compact />
    );
  }

  if (!contributions.length) {
    return (
      <Typography variant="body2" sx={secondaryTextSx}>
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
              sx={contributionInlineLabelSx}
            >
              <Box component="span" sx={contributionInlineNameSx}>
                {project.name}
              </Box>
              <Box component="span" sx={contributionInlineMetaSx}>
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
          sx={contributionCardSx}
        >
          <Box sx={contributionCardBodySx}>
            <Typography variant="subtitle2" sx={contributionCardNameSx}>
              {project.name}
            </Typography>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={contributionCardMetaRowSx}>
            <Typography variant="body2" sx={contributionCardMetaSx}>
              ★ {project.stars ?? 0}
            </Typography>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
};
