import { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { Experience } from '../../types/cv';
import type { AnimatedContentCardEntranceDirection } from '../../types/ui';
import { cvSectionAnchorSx } from './cvSectionMetadata';
import { ExperienceList } from './ExperienceList';
import { SectionHeading } from '../layout/SectionHeading';
import { CVSectionCard } from './CVSectionCard';
import { cssDuration } from '../../motion/tokens';
import { SPRING_EASING_CSS } from '../../styles/springEasing';

type CVExperienceSectionProps = {
  experiences: Experience[];
  delayMs?: number;
  entranceDirection?: AnimatedContentCardEntranceDirection;
  triggerOnView?: boolean;
  revealed?: boolean;
  onReveal?: () => void;
  itemOffsetMs?: number;
  sectionId?: string;
};

export const CVExperienceSection = ({
  experiences,
  delayMs = 0,
  entranceDirection,
  triggerOnView = true,
  revealed = false,
  onReveal,
  itemOffsetMs,
  sectionId,
}: CVExperienceSectionProps) => {
  const [activeDetail, setActiveDetail] = useState<{ index: number; value: string } | null>(null);
  const sectionContentRef = useRef<HTMLDivElement | null>(null);
  const hasBackdrop = activeDetail !== null;

  const clearActiveDetail = useCallback(() => {
    setActiveDetail(null);
  }, []);

  useEffect(() => {
    if (!hasBackdrop || typeof document === 'undefined') {
      return undefined;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (sectionContentRef.current?.contains(target)) {
        return;
      }

      clearActiveDetail();
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (sectionContentRef.current?.contains(target)) {
        return;
      }

      clearActiveDetail();
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('focusin', handleFocusIn, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('focusin', handleFocusIn, true);
    };
  }, [clearActiveDetail, hasBackdrop]);

  return (
    <CVSectionCard
      delayMs={delayMs}
      entranceDirection={entranceDirection}
      triggerOnView={triggerOnView}
      skipEntranceAnimation={revealed}
      onVisible={onReveal}
      id={sectionId}
      sx={cvSectionAnchorSx}
    >
      <Box ref={sectionContentRef} sx={{ position: 'relative', zIndex: 'auto' }}>
        <SectionHeading overline="Experience" />
        <ExperienceList
          experiences={experiences}
          startDelayMs={itemOffsetMs}
          activeDetail={activeDetail}
          onActiveDetailChange={setActiveDetail}
        />
      </Box>
      <Box
        aria-hidden={!hasBackdrop}
        data-testid="experience-section-backdrop"
        data-active={hasBackdrop ? 'true' : 'false'}
        onPointerDown={clearActiveDetail}
        sx={(theme) => ({
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          borderRadius: 'inherit',
          backgroundColor:
            theme.palette.mode === 'light'
              ? alpha(theme.palette.background.default, 0.54)
              : alpha(theme.palette.common.black, 0.56),
          backdropFilter: hasBackdrop ? 'blur(2px)' : 'none',
          opacity: hasBackdrop ? 1 : 0,
          pointerEvents: hasBackdrop ? 'auto' : 'none',
          cursor: hasBackdrop ? 'pointer' : 'default',
          transition: `opacity ${cssDuration.normal} ${SPRING_EASING_CSS}, backdrop-filter ${cssDuration.normal} ${SPRING_EASING_CSS}`,
        })}
      />
    </CVSectionCard>
  );
};
