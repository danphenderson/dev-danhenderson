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
import { useCvStyles } from '../ThemeProvider';

type ToolsAccordionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  tools?: string[]; // allow undefined safely
  dense?: boolean;
  defaultExpanded?: boolean;
  children?: ReactNode;
};

export const ToolsAccordion = ({
  id: idProp,
  title = 'Common tools',
  subtitle = 'Frequently used across roles and projects.',
  tools = [],
  dense = false,
  defaultExpanded = true,
  children,
}: ToolsAccordionProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();
  const fallbackId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [showTools, setShowTools] = useState(defaultExpanded);
  const accordionId = idProp ?? fallbackId;
  const summaryId = `${accordionId}-header`;
  const detailsId = `${accordionId}-content`;

  useEffect(() => {
    setExpanded(defaultExpanded);
    setShowTools(defaultExpanded);
  }, [defaultExpanded]);

  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={expanded}
      onChange={(_, nextExpanded) => setExpanded(nextExpanded)}
      TransitionProps={{
        onEntering: () => setShowTools(false),
        onEntered: () => setShowTools(true),
        onExit: () => setShowTools(false),
      }}
      sx={{
        border: subtleBorder,
        backgroundColor: subtleSurface,
        borderRadius: 2,
        '&::before': { display: 'none' },
        '& .MuiAccordionSummary-root': {
          minHeight: dense ? 44 : 56,
          px: { xs: 1.25, sm: 1.5 },
        },
        '& .MuiAccordionSummary-content': {
          my: dense ? 0.25 : 0.5,
        },
        '& .MuiAccordionDetails-root': {
          px: { xs: 1.25, sm: 1.5 },
          pb: dense ? 1.25 : 1.5,
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
        aria-controls={detailsId}
        id={summaryId}
      >
        <Stack spacing={0.25} sx={{ width: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
            {title}
          </Typography>

          {!!subtitle && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Stack>
      </AccordionSummary>

      <AccordionDetails id={detailsId} aria-labelledby={summaryId}>
        {children ? (
          <Box sx={{ width: '100%' }}>{children}</Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
            }}
          >
            {tools
              .filter((t): t is string => typeof t === 'string' && t.trim().length > 0)
              .map((tool, idx) => (
                <Zoom
                  key={`${tool}-${idx}`} // stable even if duplicates exist
                  in={showTools}
                  style={{ transitionDelay: showTools ? `${idx * 30}ms` : '0ms' }}
                >
                  <Chip
                    label={tool}
                    size={dense ? 'small' : 'medium'}
                    variant="outlined"
                    sx={{
                      border: subtleBorder,
                      backgroundColor: subtleSurface,
                      fontWeight: 500,
                      color: 'text.primary',
                    }}
                  />
                </Zoom>
              ))}
          </Box>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
