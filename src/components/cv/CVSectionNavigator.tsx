import { useEffect, useState } from 'react';
import { Box, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { CVSectionKey, cvSectionMetadata, cvStickySectionNavMetrics } from './cvSectionMetadata';
import { useComponentStyles } from '../../styles/componentStyles';
import { SectionLabel, ChipLabel } from '../text';

type CVSectionNavigatorProps = {
  sections: CVSectionKey[];
  testId?: string;
};

export const CVSectionNavigator = ({
  sections,
  testId,
}: CVSectionNavigatorProps) => {
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const {
    sectionNavigatorRootSx,
    sectionNavigatorLeadSx,
    sectionNavigatorRailSx,
    sectionNavigatorChipSx,
  } = useComponentStyles();
  const [activeSection, setActiveSection] = useState<CVSectionKey | null>(sections[0] ?? null);
  const activeLinePx = isMobile
    ? cvStickySectionNavMetrics.mobile.activeLinePx
    : cvStickySectionNavMetrics.desktop.activeLinePx;

  useEffect(() => {
    if (sections.length === 0 || typeof window === 'undefined') {
      return;
    }

    const updateActiveSection = () => {
      const nextActiveSection = sections.reduce<{
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
          (priority === bestMatch.priority && distance === bestMatch.distance && order < bestMatch.order)
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

      setActiveSection((currentSection) => (currentSection === nextActiveSection ? currentSection : nextActiveSection));
    };

    updateActiveSection();
    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      window.removeEventListener('scroll', updateActiveSection);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, [activeLinePx, sections]);

  const handleJumpToSection = (sectionKey: CVSectionKey) => () => {
    setActiveSection(sectionKey);
    document.getElementById(cvSectionMetadata[sectionKey].id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <Box component="nav" aria-label="CV section navigation" sx={sectionNavigatorRootSx} data-testid={testId}>
      <SectionLabel sx={sectionNavigatorLeadSx}>
        Sections
      </SectionLabel>
      <Stack direction="row" spacing={1} sx={sectionNavigatorRailSx}>
        {sections.map((sectionKey) => {
          const isActive = sectionKey === activeSection;

          return (
            <Box
              key={sectionKey}
              component="button"
              type="button"
              onClick={handleJumpToSection(sectionKey)}
              aria-pressed={isActive}
              sx={sectionNavigatorChipSx}
            >
              <ChipLabel>{cvSectionMetadata[sectionKey].navLabel}</ChipLabel>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};
