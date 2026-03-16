import { AnimatePresence, motion } from 'motion/react';
import { Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import { useCallback, useEffect, useState } from 'react';
import { duration } from '../../motion/tokens';
import { storySlideVariants } from '../../motion/variants';
import { CVStoryProgress } from './CVStoryProgress';
import { CVStoryNavBar } from './CVStoryNavBar';
import { CVStorySlideRenderer } from './CVStorySlideRenderer';
import type { CVStoryItem } from '../../data/cvStoryItems';

type CVStoryViewerProps = {
  items: CVStoryItem[];
  onExit: () => void;
};

const kindLabel: Record<CVStoryItem['kind'], string> = {
  about: 'About',
  experience: 'Experience',
  education: 'Education',
  certificate: 'Certificate',
  volunteering: 'Volunteering',
  coding: 'Project',
  end: '',
};

export const CVStoryViewer = ({ items, onExit }: CVStoryViewerProps) => {
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const goTo = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) goTo(currentIndex + 1);
  }, [currentIndex, items.length, goTo]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
      else if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goNext, goPrev, onExit]);

  const progress = items.length > 0 ? (currentIndex + 1) / items.length : 0;
  const currentItem = items[currentIndex];

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: theme.zIndex.modal,
        display: 'flex',
        flexDirection: 'column',
        background: theme.palette.background.default,
        overflow: 'hidden',
      }}
    >
      <motion.div
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: duration.fast }}
      >
        <CVStoryProgress progress={progress} />

        {/* Slide area */}
        <Box sx={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          {/* Exit button — top right */}
          <motion.div
            style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.fast, delay: 0.2 }}
          >
            <IconButton onClick={onExit} aria-label="Exit story mode" size="small">
              <CloseIcon />
            </IconButton>
          </motion.div>

          {/* Kind label — top center */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem?.kind}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: duration.fast }}
              style={{
                position: 'absolute',
                top: 16,
                left: 0,
                right: 0,
                textAlign: 'center',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            >
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 3 }}>
                {currentItem ? kindLabel[currentItem.kind] : ''}
              </Typography>
            </motion.div>
          </AnimatePresence>

          {/* Slide content with drag */}
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            dragDirectionLock
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -300) goNext();
              else if (info.offset.x > 80 || info.velocity.x > 300) goPrev();
            }}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              cursor: 'grab',
              overflow: 'hidden',
            }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={storySlideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  position: 'absolute',
                  inset: 0,
                  overflowY: 'auto',
                  paddingTop: 48,
                }}
              >
                <CVStorySlideRenderer item={currentItem} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </Box>

        <CVStoryNavBar
          items={items}
          currentIndex={currentIndex}
          onPrev={goPrev}
          onNext={goNext}
          onJumpTo={goTo}
        />
      </motion.div>
    </Box>
  );
};
