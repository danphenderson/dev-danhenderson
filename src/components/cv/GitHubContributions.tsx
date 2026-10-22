import { Box, Stack } from '@mui/material';
import type { GitHubContribution } from '../../types/cv';
import { LoadingBars } from '../LoadingBars';
import { ContentCard } from '../ContentCard';
import { useComponentStyles } from '../../styles/componentStyles';
import { GitHubLinkChipList } from './GitHubLinkChipList';
import { Text } from '../text';

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
    contributionInlineLabelSx,
    contributionCardNameSx,
    contributionCardSx,
    contributionInlineMetaSx,
    contributionInlineNameSx,
  } = useComponentStyles();

  if (loading) {
    return <LoadingBars label="Loading GitHub contributions" compact />;
  }

  if (!contributions.length) {
    return <Text role="bodyMuted">No recent community contributions found right now.</Text>;
  }

  const sortedContributions = [...contributions].sort((a, b) => (b.stars ?? -1) - (a.stars ?? -1));
  const starCount = (project: GitHubContribution) => project.stars?.toLocaleString('en-US') ?? '—';
  const starLabel = (project: GitHubContribution) =>
    project.stars === undefined ? 'Star count unavailable' : `${starCount(project)} GitHub stars`;

  if (variant === 'list') {
    return (
      <GitHubLinkChipList
        items={sortedContributions.map((project) => ({
          key: project.name,
          href: project.url,
          tooltip: `Open ${project.name} on GitHub.`,
          label: (
            <Text role="inlineLabel" component="span" sx={contributionInlineLabelSx}>
              <Box component="span" sx={contributionInlineNameSx}>
                {project.name}
              </Box>
              <Box
                component="span"
                sx={contributionInlineMetaSx}
                aria-label={starLabel(project)}
                title={starLabel(project)}
              >
                ★ {starCount(project)}
              </Box>
            </Text>
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
            <Text role="cardTitle" sx={contributionCardNameSx}>
              {project.name}
            </Text>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={contributionCardMetaRowSx}>
            <Text
              role="meta"
              sx={contributionCardMetaSx}
              aria-label={starLabel(project)}
              title={starLabel(project)}
            >
              ★ {starCount(project)}
            </Text>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
};
