import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack, Zoom } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';
import { MotionTiltCard } from '../../motion';
import { useComponentStyles } from '../../styles/componentStyles';
import { SPRING_EASING_CSS } from '../../styles/springEasing';
import { normalizeSxProp } from '../../utils/sx';
import { useControlledAnimatedList } from '../animatedListShared';
import { COMMON_LINK_TOOLTIP_ID } from '../CommonLink';

const ZOOM_BASE_TIMEOUT_MS = 220;

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

const ZoomGitHubLinkChipList = ({
  items,
  in: inProp,
  startDelayMs,
  itemStaggerMs,
  containerSx,
  renderItem,
}: {
  items: GitHubLinkChipItem[];
  in: boolean;
  startDelayMs: number;
  itemStaggerMs?: number;
  containerSx: SxProps<Theme>;
  renderItem: (item: GitHubLinkChipItem, index: number) => ReactNode;
}) => {
  const { durationFactor, isMotionDisabled, itemEntries, resolvedContainerSx } =
    useControlledAnimatedList({
      items,
      getItemKey: (item) => item.key,
      in: inProp,
      startDelayMs,
      itemStaggerMs,
      containerSx,
    });
  const zoomTimeout = isMotionDisabled ? 0 : Math.round(ZOOM_BASE_TIMEOUT_MS * durationFactor);

  if (isMotionDisabled) {
    return (
      <Box
        sx={resolvedContainerSx}
        aria-hidden={!inProp ? true : undefined}
        style={!inProp ? { visibility: 'hidden' } : undefined}
      >
        {itemEntries.map(({ item, index, key, nodeRef }) => (
          <Box key={key} ref={nodeRef}>
            {renderItem(item, index)}
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Box sx={resolvedContainerSx}>
      {itemEntries.map(({ item, index, key, isEntered }) => (
        <Zoom
          key={key}
          in={isEntered}
          appear={false}
          timeout={zoomTimeout}
          easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
        >
          <Box>{renderItem(item, index)}</Box>
        </Zoom>
      ))}
    </Box>
  );
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
  const animatedContainerSx: SxProps<Theme> =
    layout === 'wrap'
      ? getWrapListSx(wrapGap)
      : {
          display: 'flex',
          flexDirection: 'column',
          gap: stackSpacing,
        };

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

  if (layout === 'wrap') {
    return animateItems ? (
      <ZoomGitHubLinkChipList
        items={items}
        in
        startDelayMs={startDelayMs}
        itemStaggerMs={itemStaggerMs}
        containerSx={animatedContainerSx}
        renderItem={renderTiltChip}
      />
    ) : (
      <Box sx={getWrapListSx(wrapGap)}>{items.map(renderTiltChip)}</Box>
    );
  }

  return animateItems ? (
    <ZoomGitHubLinkChipList
      items={items}
      in
      startDelayMs={startDelayMs}
      itemStaggerMs={itemStaggerMs}
      containerSx={animatedContainerSx}
      renderItem={renderTiltChip}
    />
  ) : (
    <Stack spacing={stackSpacing}>{items.map(renderTiltChip)}</Stack>
  );
};
