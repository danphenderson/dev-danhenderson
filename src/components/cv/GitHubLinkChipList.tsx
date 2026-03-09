import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';
import { useCvStyles } from '../../styles/cvStyles';
import { AnimatedContentCard } from '../AnimatedContentCard';

export type GitHubLinkChipItem = {
  key: string;
  label: ReactNode;
  href?: string;
};

type GitHubLinkChipListProps = {
  items: GitHubLinkChipItem[];
  layout?: 'stack' | 'wrap';
  animateItems?: boolean;
  startDelayMs?: number;
  itemStaggerMs?: number;
  chipSx?: SxProps<Theme>;
  stackSpacing?: number;
  wrapGap?: number;
};

export const GitHubLinkChipList = ({
  items,
  layout = 'stack',
  animateItems = false,
  startDelayMs = 0,
  itemStaggerMs = 80,
  chipSx,
  stackSpacing = 0.5,
  wrapGap = 0.75,
}: GitHubLinkChipListProps) => {
  const { chipWrapperSx, getGitHubChipSx } = useCvStyles();
  const customChipSx = Array.isArray(chipSx) ? chipSx : chipSx ? [chipSx] : [];
  const baseChipSx: SxProps<Theme> = getGitHubChipSx(layout);

  const renderChip = (item: GitHubLinkChipItem) => {
    const isLink = Boolean(item.href);

    return (
      <Chip
        key={item.key}
        icon={<GitHubIcon />}
        label={item.label}
        component={isLink ? 'a' : 'div'}
        href={item.href}
        target={isLink ? '_blank' : undefined}
        rel={isLink ? 'noopener noreferrer' : undefined}
        clickable={isLink}
        variant="outlined"
        size="small"
        sx={[baseChipSx, ...customChipSx]}
      />
    );
  };

  if (layout === 'wrap') {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: wrapGap }}>
        {items.map(renderChip)}
      </Box>
    );
  }

  return (
    <Stack spacing={stackSpacing}>
      {items.map((item, idx) => {
        if (!animateItems) {
          return renderChip(item);
        }

        return (
          <AnimatedContentCard
            key={item.key}
            delayMs={startDelayMs + idx * itemStaggerMs}
            sx={chipWrapperSx}
          >
            {renderChip(item)}
          </AnimatedContentCard>
        );
      })}
    </Stack>
  );
};
