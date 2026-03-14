import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Zoom } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import ListIcon from '@mui/icons-material/List';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GitHubIcon from '@mui/icons-material/GitHub';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import BuildIcon from '@mui/icons-material/Build';
import CodeIcon from '@mui/icons-material/Code';
import { AppSpeedDial, AppSpeedDialAction } from '../AppSpeedDial';
import { CVSectionKey, cvSectionMetadata, cvSectionViewportMetrics } from './cvSectionMetadata';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useAppStyles } from '../../styles/appStyles';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from '../header/headerScroll';

const cvSectionIcons: Record<CVSectionKey, ReactNode> = {
  about: null,
  experience: <WorkIcon fontSize="small" />,
  education: <SchoolIcon fontSize="small" />,
  volunteering: <VolunteerActivismIcon fontSize="small" />,
  github: <GitHubIcon fontSize="small" />,
  certificates: <CardMembershipIcon fontSize="small" />,
  tools: <BuildIcon fontSize="small" />,
  coding: <CodeIcon fontSize="small" />,
};

type CVSectionNavigatorProps = {
  sections: CVSectionKey[];
  testId?: string;
};

const IDLE_TIMEOUT_MS = 2500;
const IDLE_OPACITY = 0.32;

export const CVSectionNavigator = ({ sections, testId }: CVSectionNavigatorProps) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const appStyles = useAppStyles();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeSection, setActiveSection] = useState<CVSectionKey | null>(sections[0] ?? null);
  const [idle, setIdle] = useState(false);
  const [hovered, setHovered] = useState(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolledPastThreshold = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);
  const activeLinePx = isMobile
    ? cvSectionViewportMetrics.mobile.activeLinePx
    : cvSectionViewportMetrics.desktop.activeLinePx;

  const resetIdleTimer = useCallback(() => {
    setIdle(false);

    if (idleTimerRef.current !== null) {
      clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = setTimeout(() => {
      setIdle(true);
    }, IDLE_TIMEOUT_MS);
  }, []);

  useEffect(() => {
    if (sections.length === 0 || typeof window === 'undefined') {
      return;
    }

    const updateActiveSection = () => {
      const nextActiveSection =
        sections.reduce<{
          key: CVSectionKey;
          priority: number;
          distance: number;
          order: number;
        } | null>((bestMatch, sectionKey, order) => {
          const sectionElement = document.getElementById(cvSectionMetadata[sectionKey].id);

          if (!(sectionElement instanceof HTMLElement)) {
            return bestMatch;
          }

          const rect = sectionElement.getBoundingClientRect();
          const coversActiveLine = rect.top <= activeLinePx && rect.bottom > activeLinePx;
          const isVisible = rect.bottom > 0 && rect.top < window.innerHeight;
          const priority = coversActiveLine ? 2 : isVisible ? 1 : 0;
          const distance = coversActiveLine
            ? activeLinePx - rect.top
            : Math.abs(rect.top - activeLinePx);

          if (
            !bestMatch ||
            priority > bestMatch.priority ||
            (priority === bestMatch.priority && distance < bestMatch.distance) ||
            (priority === bestMatch.priority &&
              distance === bestMatch.distance &&
              order < bestMatch.order)
          ) {
            return {
              key: sectionKey,
              priority,
              distance,
              order,
            };
          }

          return bestMatch;
        }, null)?.key ?? sections[0];

      setActiveSection((currentSection) =>
        currentSection === nextActiveSection ? currentSection : nextActiveSection
      );
    };

    const handleScroll = () => {
      updateActiveSection();
      resetIdleTimer();
    };

    updateActiveSection();
    resetIdleTimer();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveSection);

      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [activeLinePx, sections, resetIdleTimer]);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleJumpToSection = (sectionKey: CVSectionKey) => {
    setActiveSection(sectionKey);
    document.getElementById(cvSectionMetadata[sectionKey].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const actions: AppSpeedDialAction[] = [
    {
      id: 'back-to-top',
      label: 'Back to top',
      icon: <KeyboardArrowUpRoundedIcon />,
      onClick: handleBackToTop,
    },
    ...sections.map((sectionKey) => ({
      id: `section-${sectionKey}`,
      label: cvSectionMetadata[sectionKey].navLabel,
      icon: cvSectionIcons[sectionKey] ?? <ListIcon fontSize="small" />,
      onClick: () => handleJumpToSection(sectionKey),
    })),
  ];

  const dimmed = idle && !hovered;
  const activeSectionSx = activeSection ? appStyles.cvFloatingDialActiveFabSx : undefined;

  return (
    <Zoom
      in={scrolledPastThreshold}
      timeout={prefersReducedMotion ? 0 : { enter: 180, exit: 140 }}
      unmountOnExit
    >
      <Box
        component="nav"
        aria-label="CV section navigation"
        data-testid={testId}
        onMouseEnter={() => {
          setHovered(true);
          setIdle(false);
        }}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => {
          setHovered(true);
          setIdle(false);
        }}
        onBlur={() => setHovered(false)}
        sx={{
          opacity: dimmed ? IDLE_OPACITY : 1,
          transition: prefersReducedMotion ? 'none' : 'opacity 300ms ease',
          '&:hover': { opacity: 1 },
        }}
      >
        <AppSpeedDial
          ariaLabel="CV section navigation"
          icon={<ListIcon />}
          actions={actions}
          layer="content"
          direction="up"
          actionTooltipPlacement="left"
          sx={[appStyles.cvFloatingDialSx, ...(activeSectionSx ? [activeSectionSx] : [])]}
        />
      </Box>
    </Zoom>
  );
};
