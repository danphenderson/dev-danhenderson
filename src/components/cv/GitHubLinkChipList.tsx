import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { MotionTiltCard } from '../../motion';
import { useComponentStyles } from '../../styles/componentStyles';
import { normalizeSxProp } from '../../utils/sx';
import { AnimatedSlideList } from '../AnimatedSlideList';
import { COMMON_LINK_TOOLTIP_ID } from '../CommonLink';

export type GitHubLinkChipItem = {
  key: string;
  label: ReactNode;
  href?: string;
  tooltip?: string;
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
  const chipTiltStyle = layout === 'stack' ? { width: '100%' } : undefined;

  const renderChip = (item: GitHubLinkChipItem, index: number) => {
    const isLink = Boolean(item.href);
    const tooltipProps =
      isLink && item.tooltip
        ? {
            'data-tooltip-id': COMMON_LINK_TOOLTIP_ID,
            'data-tooltip-content': item.tooltip,
            'data-tooltip-place': 'top' as const,
          }
        : undefined;

    return (
      <Chip
        icon={
          <Box component="span" {...tooltipProps}>
            <GitHubIcon />
          </Box>
        }
        label={
          <Box component="span" {...tooltipProps}>
            {item.label}
          </Box>
        }
        component={isLink ? 'a' : 'div'}
        href={item.href}
        target={isLink ? '_blank' : undefined}
        rel={isLink ? 'noopener noreferrer' : undefined}
        {...tooltipProps}
        clickable={isLink}
        variant="outlined"
        size="small"
        sx={[baseChipSx, chipWaveSx, getChipWaveDelaySx(index), ...customChipSx]}
      />
    );
  };

  const renderTiltChip = (item: GitHubLinkChipItem, index: number) => (
    <MotionTiltCard key={item.key} intensity={0.5} style={chipTiltStyle}>
      {renderChip(item, index)}
    </MotionTiltCard>
  );

  const getAlternatingDirection = (_item: GitHubLinkChipItem, index: number) =>
    index % 2 === 0 ? 'right' : 'left';

  if (layout === 'wrap') {
    return animateItems ? (
      <AnimatedSlideList
        items={items}
        getItemKey={(item) => item.key}
        in
        layout="wrap"
        startDelayMs={startDelayMs}
        itemStaggerMs={itemStaggerMs}
        wrapGap={wrapGap}
        getItemDirection={getAlternatingDirection}
        renderItem={renderTiltChip}
      />
    ) : (
      <Box sx={getWrapListSx(wrapGap)}>{items.map(renderTiltChip)}</Box>
    );
  }

  return animateItems ? (
    <AnimatedSlideList
      items={items}
      getItemKey={(item) => item.key}
      in
      layout="stack"
      startDelayMs={startDelayMs}
      itemStaggerMs={itemStaggerMs}
      stackSpacing={stackSpacing}
      getItemDirection={getAlternatingDirection}
      renderItem={renderTiltChip}
    />
  ) : (
    <Stack spacing={stackSpacing}>{items.map(renderTiltChip)}</Stack>
  );
};
