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
const GENIE_TRANSITION = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease';
const GENIE_TRAIL_SCALE_REST = 0.22;
const GENIE_RAIL_SCALE_REST = 0.72;
const GENIE_TRAIL_TRANSLATE_X_PX = -4;
const GENIE_TRAIL_GRADIENT_MIDPOINT = '62%';
const GENIE_TRAIL_GRADIENT_START = '0%';
const GENIE_TRAIL_GRADIENT_END = '100%';

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
    const surface = muiTheme.appearanceTreatment.surface;
    const genieRailColor = alpha(muiTheme.palette.primary.light, muiTheme.palette.mode === 'light' ? 0.34 : 0.46);
    const genieTrailColor = alpha(muiTheme.palette.primary.main, muiTheme.palette.mode === 'light' ? 0.1 : 0.18);
    const genieTrailBorderColor = alpha(
      muiTheme.palette.primary.main,
      Math.min(surface.panelBorderAlpha + 0.12, 0.6)
    );
    const genieTrailShadow = `0 14px 28px ${alpha(
      muiTheme.palette.common.black,
      muiTheme.palette.mode === 'light' ? 0.14 : 0.26
    )}`;
    const genieSurfaceAlpha = Math.min(
      surface.panelSurfaceAlpha + (muiTheme.palette.mode === 'light' ? 0.14 : 0.2),
      0.94
    );
    const genieTransition = prefersReducedMotion ? 'none' : GENIE_TRANSITION;

    return {
      '& .MuiSpeedDial-actions': {
        position: 'relative',
        overflow: 'visible',
        alignItems: 'center',
        gap: {
          xs: 2,
          md: 2.5,
        },
        py: 1.5,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 12,
          bottom: 12,
          right: 'calc(50% - 1px)',
          width: 2,
          borderRadius: 999,
          backgroundColor: genieRailColor,
          opacity: hovered ? 0.88 : 0.3,
          transform: hovered ? 'scaleY(1)' : `scaleY(${GENIE_RAIL_SCALE_REST})`,
          transformOrigin: 'bottom center',
          transition: genieTransition,
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
          right: {
            xs: 20,
            md: 22,
          },
          width: {
            xs: 88,
            md: 132,
          },
          height: {
            xs: 42,
            md: 48,
          },
          borderRadius: 999,
          border: `1px solid ${genieTrailBorderColor}`,
          background: `linear-gradient(90deg, ${alpha(genieTrailColor, 0)} ${GENIE_TRAIL_GRADIENT_START}, ${genieTrailColor} ${GENIE_TRAIL_GRADIENT_MIDPOINT}, ${alpha(
            muiTheme.palette.background.paper,
            genieSurfaceAlpha
          )} ${GENIE_TRAIL_GRADIENT_END})`,
          boxShadow: genieTrailShadow,
          opacity: hovered ? 1 : 0,
          transform: `translateY(-50%) scaleX(${hovered ? 1 : GENIE_TRAIL_SCALE_REST})`,
          transformOrigin: 'right center',
          transition: genieTransition,
          pointerEvents: 'none',
        },
      },
      '& .MuiSpeedDialAction-fab': {
        position: 'relative',
        zIndex: 1,
        transform: hovered ? `translateX(${GENIE_TRAIL_TRANSLATE_X_PX}px)` : 'translateX(0)',
        transition: genieTransition,
      },
    } as const;
  }, [hovered, muiTheme, prefersReducedMotion]);

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
