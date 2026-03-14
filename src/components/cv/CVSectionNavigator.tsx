import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Zoom } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import KeyboardArrowUpRoundedIcon from '@mui/icons-material/KeyboardArrowUpRounded';
import ListIcon from '@mui/icons-material/List';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import GitHubIcon from '@mui/icons-material/GitHub';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
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
  coding: <CodeIcon fontSize="small" />,
};

type CVSectionNavigatorProps = {
  sections: CVSectionKey[];
  testId?: string;
};

const IDLE_TIMEOUT_MS = 2500;
const IDLE_OPACITY = 0.32;
const GENIE_TRANSITION = 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease, filter 260ms ease, box-shadow 260ms ease';

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
  const genieDialSx = useMemo(() => {
    const isLight = muiTheme.palette.mode === 'light';
    const surface = muiTheme.appearanceTreatment.surface;
    const genieRailColor = alpha(muiTheme.palette.primary.light, isLight ? 0.2 : 0.3);
    const genieTrailColor = alpha(muiTheme.palette.primary.main, isLight ? 0.06 : 0.12);
    const genieTrailBorderColor = alpha(
      muiTheme.palette.primary.main,
      Math.min(surface.panelBorderAlpha + 0.1, 0.5)
    );
    const genieGlowColor = alpha(muiTheme.palette.primary.light, isLight ? 0.28 : 0.42);
    const genieGlowSpread = alpha(muiTheme.palette.primary.main, isLight ? 0.16 : 0.28);
    const genieTransition = prefersReducedMotion ? 'none' : GENIE_TRANSITION;

    return {
      '& .MuiSpeedDial-actions': {
        position: 'relative',
        overflow: 'visible',
        alignItems: 'center',
        gap: { xs: 1.5, md: 2 },
        py: 1.5,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 8,
          bottom: 8,
          right: 'calc(50% - 0.5px)',
          width: 1,
          borderRadius: 999,
          backgroundColor: genieRailColor,
          pointerEvents: 'none',
        },
      },
      '& .MuiSpeedDialAction-root': {
        position: 'relative',
        overflow: 'visible',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          right: { xs: 18, md: 20 },
          width: { xs: 72, md: 104 },
          height: { xs: 38, md: 42 },
          borderRadius: 999,
          border: `1px solid ${genieTrailBorderColor}`,
          background: `linear-gradient(90deg, ${alpha(genieTrailColor, 0)} 0%, ${genieTrailColor} 50%, ${alpha(
            muiTheme.palette.background.paper,
            Math.min(surface.panelSurfaceAlpha + (isLight ? 0.12 : 0.16), 0.92)
          )} 100%)`,
          backdropFilter: `blur(${Math.max(surface.cardBlurPx - 2, 4)}px)`,
          opacity: 0,
          transform: 'translateY(-50%) scaleX(0.3)',
          transformOrigin: 'right center',
          transition: genieTransition,
          pointerEvents: 'none',
        },
        '&:hover::before, &:focus-within::before': {
          opacity: 1,
          transform: 'translateY(-50%) scaleX(1)',
        },
      },
      '& .MuiSpeedDialAction-fab': {
        position: 'relative',
        zIndex: 1,
        transition: genieTransition,
      },
      '& .MuiSpeedDialAction-root:hover .MuiSpeedDialAction-fab, & .MuiSpeedDialAction-root:focus-within .MuiSpeedDialAction-fab': {
        transform: 'translateX(-3px) scale(1.1)',
        boxShadow: `0 0 0 2.5px ${genieGlowColor}, 0 0 14px ${genieGlowSpread}`,
      },
    } as const;
  }, [muiTheme, prefersReducedMotion]);

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
        data-hovered={hovered}
        onMouseEnter={() => {
          setHovered(true);
          setIdle(false);
        }}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => {
          setHovered(true);
          setIdle(false);
        }}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setHovered(false);
          }
        }}
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
          sx={[appStyles.cvFloatingDialSx, genieDialSx, ...(activeSectionSx ? [activeSectionSx] : [])]}
        />
      </Box>
    </Zoom>
  );
};
