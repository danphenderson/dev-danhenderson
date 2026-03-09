import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode, useEffect, useId, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
  Zoom,
} from '@mui/material';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useCvStyles } from '../styles/cvStyles';

type ToolsAccordionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  tools?: string[]; // allow undefined safely
  dense?: boolean;
  defaultExpanded?: boolean;
  children?: ReactNode;
};

const getToolsChipZoomStyle = (expanded: boolean, idx: number) => ({
  transitionDelay: expanded ? `${idx * 20}ms` : '0ms',
});

export const ToolsAccordion = ({
  id: idProp,
  title = 'Common tools',
  subtitle = 'Frequently used across roles and projects.',
  tools = [],
  dense = false,
  defaultExpanded = true,
  children,
}: ToolsAccordionProps) => {
  const { fullWidthSx, getToolsAccordionSx, sectionTitleSx, secondaryTextSx, toolsChipSx, toolsWrapSx } =
    useCvStyles();
  const prefersReducedMotion = usePrefersReducedMotion();
  const fallbackId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const accordionId = idProp ?? fallbackId;
  const summaryId = `${accordionId}-header`;
  const detailsId = `${accordionId}-content`;

  useEffect(() => {
    setExpanded(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
      sx={getToolsAccordionSx(dense)}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={secondaryTextSx} />}
        aria-controls={detailsId}
        id={summaryId}
      >
        <Stack spacing={0.25} sx={fullWidthSx}>
          <Typography variant="subtitle2" sx={sectionTitleSx}>
            {title}
          </Typography>

          {!!subtitle && (
            <Typography variant="body2" sx={secondaryTextSx}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails id={detailsId} aria-labelledby={summaryId}>
        {children ? (
          <Box sx={fullWidthSx}>{children}</Box>
        ) : (
          <Box sx={toolsWrapSx}>
            {tools
              .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
              .map((tool, idx) => {
                const chip = (
                  <Chip
                    key={`${tool}-${idx}`}
                    label={tool}
                    size={dense ? 'small' : 'medium'}
                    variant="outlined"
                    sx={toolsChipSx}
                  />
                );

                if (prefersReducedMotion) {
                  return chip;
                }

                return (
                  <Zoom
                    key={`${tool}-${idx}`}
                    in={expanded}
                    appear={false}
                    style={getToolsChipZoomStyle(expanded, idx)}
                  >
                    {chip}
                  </Zoom>
                );
              })}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
