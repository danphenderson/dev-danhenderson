import GitHubIcon from '@mui/icons-material/GitHub';
import { Box, Chip, Stack } from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { ReactNode } from 'react';
import { useCvStyles } from '../../styles/cvTheme';
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

const chipWrapperSx = {
  width: '100%',
  p: { xs: 0, md: 0 },
  border: 'none',
  backgroundColor: 'transparent',
  boxShadow: 'none',
  borderRadius: 0,
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
  const { subtleBorder, subtleSurface } = useCvStyles();
  const customChipSx = Array.isArray(chipSx) ? chipSx : chipSx ? [chipSx] : [];

  const baseChipSx: SxProps<Theme> = {
    border: subtleBorder,
    backgroundColor: subtleSurface,
    fontWeight: 600,
    color: 'text.primary',
    width: layout === 'stack' ? '100%' : 'auto',
    height: 'auto',
    justifyContent: 'flex-start',
    alignItems: 'center',
    '& .MuiChip-icon': {
      alignSelf: 'center',
      marginLeft: 0.5,
      marginRight: 0.5,
      fontSize: 18,
      color: 'text.secondary',
    },
    '& .MuiChip-label': {
      whiteSpace: 'normal',
      textOverflow: 'clip',
      lineHeight: 1.4,
      px: 1,
      py: 0.25,
      overflowWrap: 'anywhere',
    },
  };

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
