import { Box, IconButton, Typography } from '@mui/material';
import { motion } from 'motion/react';
import { useTheme, alpha } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import VolunteerActivismOutlinedIcon from '@mui/icons-material/VolunteerActivismOutlined';
import CodeIcon from '@mui/icons-material/Code';
import { MotionCard } from '../../motion';
import { duration } from '../../motion/tokens';
import type { CVStoryItem } from '../../data/cvStoryItems';

type CVStoryNavBarProps = {
  items: CVStoryItem[];
  currentIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onJumpTo: (index: number) => void;
};

const kindIcon: Record<CVStoryItem['kind'], React.ReactNode> = {
  about: <PersonOutlineIcon fontSize="small" />,
  experience: <WorkOutlineIcon fontSize="small" />,
  education: <SchoolOutlinedIcon fontSize="small" />,
  certificate: <EmojiEventsOutlinedIcon fontSize="small" />,
  volunteering: <VolunteerActivismOutlinedIcon fontSize="small" />,
  coding: <CodeIcon fontSize="small" />,
};

export const CVStoryNavBar = ({
  items,
  currentIndex,
  onPrev,
  onNext,
  onJumpTo,
}: CVStoryNavBarProps) => {
  const theme = useTheme();

  const uniqueKinds = Array.from(new Set(items.map((i) => i.kind)));
  const currentKind = items[currentIndex]?.kind;

  const jumpToKind = (kind: CVStoryItem['kind']) => {
    const firstIndex = items.findIndex((i) => i.kind === kind);
    if (firstIndex >= 0) onJumpTo(firstIndex);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: duration.normal, delay: 0.3 }}
    >
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: { xs: 2, sm: 3 },
          py: 1.5,
          gap: 1,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.15)}`,
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Left arrow */}
        <MotionCard
          hoverState={{ scale: 1.12, y: -2 }}
          tapState={{ scale: 0.92 }}
        >
          <IconButton
            onClick={onPrev}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
        </MotionCard>

        {/* Center: kind dots + counter */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {uniqueKinds.map((kind) => {
            const isActive = currentKind === kind;
            return (
              <motion.div
                key={kind}
                animate={{ scale: isActive ? 1.25 : 1 }}
                transition={{ duration: duration.fast }}
              >
                <IconButton
                  size="small"
                  onClick={() => jumpToKind(kind)}
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                  }}
                  aria-label={`Jump to ${kind}`}
                >
                  {kindIcon[kind]}
                </IconButton>
              </motion.div>
            );
          })}
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {currentIndex + 1} / {items.length}
          </Typography>
        </Box>

        {/* Right arrow */}
        <MotionCard
          hoverState={{ scale: 1.12, y: -2 }}
          tapState={{ scale: 0.92 }}
        >
          <IconButton
            onClick={onNext}
            disabled={currentIndex === items.length - 1}
            aria-label="Next slide"
            size="small"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </MotionCard>
      </Box>
    </motion.div>
  );
};
