import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';
import { useCvStyles } from '../../styles/cvStyles';
import { AnimatedContentList } from '../AnimatedContentList';

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
  itemStaggerMs,
  chipSx,
  stackSpacing = 0.5,
  wrapGap = 0.75,
}: GitHubLinkChipListProps) => {
  const { cardResetSx, chipWrapperSx, getGitHubChipSx, getWrapListSx } = useCvStyles();
  const customChipSx = Array.isArray(chipSx) ? chipSx : chipSx ? [chipSx] : [];
  const baseChipSx: SxProps<Theme> = getGitHubChipSx(layout);
  const wrapperSx = layout === 'wrap' ? cardResetSx : chipWrapperSx;

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
      animateItems ? (
        <AnimatedContentList
          items={items}
          getItemKey={(item) => item.key}
          layout="wrap"
          startDelayMs={startDelayMs}
          itemStaggerMs={itemStaggerMs}
          wrapGap={wrapGap}
          itemSx={wrapperSx}
          renderItem={renderChip}
        />
      ) : (
        <Box sx={getWrapListSx(wrapGap)}>
          {items.map(renderChip)}
        </Box>
      )
    );
  }

  return (
    animateItems ? (
      <AnimatedContentList
        items={items}
        getItemKey={(item) => item.key}
        startDelayMs={startDelayMs}
        itemStaggerMs={itemStaggerMs}
        stackSpacing={stackSpacing}
        itemSx={wrapperSx}
        renderItem={renderChip}
      />
    ) : (
      <Stack spacing={stackSpacing}>
        {items.map(renderChip)}
      </Stack>
    )
  );
};
