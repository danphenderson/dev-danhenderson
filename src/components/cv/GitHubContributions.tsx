import { Box, Stack } from '@mui/material';
import type { GitHubContribution } from '../../types/cv';
import { LoadingBars } from '../LoadingBars';
import { ContentCard } from '../ContentCard';
import { useComponentStyles } from '../../styles/componentStyles';
import { GitHubLinkChipList } from './GitHubLinkChipList';
import { ChipMetaLabel, EntryTitle, MetaText, BodyText } from '../text';

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
    contributionInlineMetaSx,
    contributionInlineNameSx,
    secondaryTextSx,
  } = useComponentStyles();

  if (loading) {
    return (
      <LoadingBars label="Loading GitHub contributions" compact />
    );
  }

  if (!contributions.length) {
    return (
      <BodyText sx={secondaryTextSx}>
        No recent community contributions found. Showing personal projects below.
      </BodyText>
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
            <ChipMetaLabel>
              <Box component="span" sx={contributionInlineNameSx}>
                {project.name}
              </Box>
              <Box component="span" sx={contributionInlineMetaSx}>
                ★ {project.stars ?? 0}
              </Box>
            </ChipMetaLabel>
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
            <EntryTitle sx={contributionCardNameSx}>
              {project.name}
            </EntryTitle>
          </Box>
          <Stack direction="row" spacing={0.5} alignItems="center" sx={contributionCardMetaRowSx}>
            <MetaText sx={contributionCardMetaSx}>
              ★ {project.stars ?? 0}
            </MetaText>
          </Stack>
        </ContentCard>
      ))}
    </Stack>
  );
};
