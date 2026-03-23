import { motion } from 'motion/react';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme, alpha } from '@mui/material/styles';
import { useCallback, useEffect, useRef, useState } from 'react';
import { duration, easing } from '../../motion/tokens';
import { useMotionScale } from '../../motion';
import { CVStoryProgress } from './CVStoryProgress';
import { CVStorySectionRenderer } from './CVStorySectionRenderer';
import type { CVStoryItem } from '../../types/cv';
import { UnsafeTypography } from '../text';

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
  end: 'Connect',
};

const getInitialActiveKind = (items: CVStoryItem[]): CVStoryItem['kind'] =>
  items[0]?.kind ?? 'about';

const getActiveStoryIndex = (items: CVStoryItem[], visibleIndices: Set<number>): number | null => {
  let nextActiveIndex: number | null = null;

  visibleIndices.forEach((index) => {
    if (!items[index]) {
      return;
    }

    if (nextActiveIndex === null || index < nextActiveIndex) {
      nextActiveIndex = index;
    }
  });

  return nextActiveIndex;
};

const getStoryItemKey = (item: CVStoryItem): string => {
  switch (item.kind) {
    case 'about':
      return `about:${item.data.name}:${item.data.title}`;
    case 'experience':
      return `experience:${item.data.company}:${item.data.title}:${item.data.startDate}:${item.data.endDate}`;
    case 'education':
      return `education:${item.data.university}:${item.data.program}:${
        item.data.dateRange ?? item.data.expectedCompletion ?? ''
      }`;
    case 'certificate':
      return `certificate:${item.data.issuer}:${item.data.title}:${item.data.date}`;
    case 'volunteering':
      return `volunteering:${item.data.organization}:${item.data.role}:${item.data.dateRange}`;
    case 'coding':
      return `coding:${item.data.title}:${item.data.links[0] ?? ''}`;
    case 'end':
      return `end:${item.data.headline}:${item.data.channels[0]?.url ?? ''}`;
  }
};

export const CVStoryViewer = ({ items, onExit }: CVStoryViewerProps) => {
  const theme = useTheme();
  const { duration: dFactor } = useMotionScale();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeKind, setActiveKind] = useState<CVStoryItem['kind']>(() =>
    getInitialActiveKind(items)
  );
  const sectionRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const visibleSectionIndicesRef = useRef<Set<number>>(new Set());

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    setScrollProgress(maxScroll > 0 ? scrollTop / maxScroll : 0);
  }, []);

  const updateActiveKindFromVisibleSections = useCallback(() => {
    const nextActiveIndex = getActiveStoryIndex(items, visibleSectionIndicesRef.current);

    if (nextActiveIndex === null) {
      return;
    }

    const nextKind = items[nextActiveIndex].kind;
    setActiveKind((currentKind) => (currentKind === nextKind ? currentKind : nextKind));
  }, [items]);

  useEffect(() => {
    visibleSectionIndicesRef.current.clear();
    setActiveKind(getInitialActiveKind(items));
  }, [items]);

  // Track which section is active based on scroll position
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const visibleSectionIndices = visibleSectionIndicesRef.current;
    visibleSectionIndices.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        let shouldResolveActiveKind = false;

        for (const entry of entries) {
          const index = Number(entry.target.getAttribute('data-story-index'));

          if (isNaN(index) || !items[index]) {
            continue;
          }

          shouldResolveActiveKind = true;

          if (entry.isIntersecting) {
            visibleSectionIndices.add(index);
          } else {
            visibleSectionIndices.delete(index);
          }
        }

        if (shouldResolveActiveKind) {
          updateActiveKindFromVisibleSections();
        }
      },
      { root: el, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    sectionRefs.current.forEach((ref) => {
      observer.observe(ref);
    });

    return () => {
      observer.disconnect();
      visibleSectionIndices.clear();
    };
  }, [items, updateActiveKindFromVisibleSections]);

  // Escape key exits
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onExit]);

  const registerRef = useCallback((index: number, el: HTMLDivElement | null) => {
    if (el) {
      sectionRefs.current.set(index, el);
    } else {
      sectionRefs.current.delete(index);
    }
  }, []);

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
        transition={{ duration: duration.fast * dFactor }}
      >
        <CVStoryProgress progress={scrollProgress} />

        {/* Header bar */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            columnGap: 1,
            px: { xs: 1.5, sm: 2 },
            py: 1,
            minHeight: 56,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
          }}
        >
          <Box aria-hidden="true" />

          <motion.div
            key={activeKind}
            style={{ justifySelf: 'center' }}
            initial={{ opacity: 0, y: dFactor === 0 ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: duration.fast * dFactor, ease: easing.decel }}
          >
            <UnsafeTypography
              variant="overline"
              color="text.secondary"
              sx={{ letterSpacing: 3, userSelect: 'none' }}
              _unsafe={{
                reason: 'CV story mode is an intentional design-system exception boundary',
                owner: 'cv-story',
                expiresBy: '2026-12-01',
              }}
            >
              {kindLabel[activeKind]}
            </UnsafeTypography>
          </motion.div>

          <motion.div
            style={{ justifySelf: 'end' }}
            initial={{ opacity: 0, scale: dFactor === 0 ? 1 : 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: duration.fast * dFactor, delay: 0.2 * dFactor }}
          >
            <IconButton
              onClick={onExit}
              aria-label="Exit story mode"
              sx={{ color: 'text.primary', p: 0.75 }}
            >
              <CloseIcon sx={{ fontSize: { xs: '1.875rem', sm: '2rem' } }} />
            </IconButton>
          </motion.div>
        </Box>

        {/* Scrollable narrative */}
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollBehavior: dFactor === 0 ? 'auto' : 'smooth',
          }}
        >
          {/* Top spacing */}
          <Box sx={{ height: { xs: 32, sm: 48 } }} />

          {items.map((item, index) => (
            <Box
              key={getStoryItemKey(item)}
              ref={(el: HTMLDivElement | null) => registerRef(index, el)}
              data-story-index={index}
              sx={{ mb: { xs: 6, sm: 8 } }}
            >
              <CVStorySectionRenderer item={item} index={index} scrollContainerRef={scrollRef} />
            </Box>
          ))}

          {/* Bottom spacing */}
          <Box sx={{ height: { xs: 48, sm: 80 } }} />
        </Box>
      </motion.div>
    </Box>
  );
};
