import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { useComponentStyles } from '../../styles/componentStyles';
import { normalizeSxProp } from '../../utils/sx';
import { AnimatedZoomList } from '../AnimatedZoomList';

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
  const { chipWaveSx, getChipWaveDelaySx, getGitHubChipSx, getWrapListSx } = useComponentStyles();
  const customChipSx = normalizeSxProp(chipSx);
  const baseChipSx: SxProps<Theme> = getGitHubChipSx(layout);
  const animatedContainerSx: SxProps<Theme> = layout === 'wrap'
    ? getWrapListSx(wrapGap)
    : {
      display: 'flex',
      flexDirection: 'column',
      gap: stackSpacing,
    };

  const renderChip = (item: GitHubLinkChipItem, index: number) => {
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
        sx={[baseChipSx, chipWaveSx, getChipWaveDelaySx(index), ...customChipSx]}
      />
    );
  };

  if (layout === 'wrap') {
    return (
      animateItems ? (
        <AnimatedZoomList
          items={items}
          getItemKey={(item) => item.key}
          in
          startDelayMs={startDelayMs}
          containerSx={animatedContainerSx}
          itemStaggerMs={itemStaggerMs}
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
      <AnimatedZoomList
        items={items}
        getItemKey={(item) => item.key}
        in
        startDelayMs={startDelayMs}
        containerSx={animatedContainerSx}
        itemStaggerMs={itemStaggerMs}
        renderItem={renderChip}
      />
    ) : (
      <Stack spacing={stackSpacing}>
        {items.map(renderChip)}
      </Stack>
    )
  );
};
