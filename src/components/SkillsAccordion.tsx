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
} from '@mui/material';
import { AnimatedZoomList } from './AnimatedZoomList';
import { useCvStyles } from '../styles/cvStyles';

type SkillsAccordionProps = {
  id?: string;
  title?: string;
  subtitle?: string;
  skills?: string[]; // allow undefined safely
  dense?: boolean;
  defaultExpanded?: boolean;
  children?: ReactNode;
};

export const SkillsAccordion = ({
  id: idProp,
  title = 'Common skills',
  subtitle = 'Frequently used across roles and projects.',
  skills = [],
  dense = false,
  defaultExpanded = true,
  children,
}: SkillsAccordionProps) => {
  const { fullWidthSx, getSkillsAccordionSx, sectionTitleSx, secondaryTextSx, skillsChipSx, skillsWrapSx } =
    useCvStyles();
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
      sx={getSkillsAccordionSx(dense)}
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
          <AnimatedZoomList
            items={skills.filter((s): s is string => typeof s === 'string' && s.trim().length > 0)}
            getItemKey={(skill, idx) => `${skill}-${idx}`}
            in={expanded}
            containerSx={skillsWrapSx}
            renderItem={(skill, idx) => (
              <Chip
                key={`${skill}-${idx}`}
                label={skill}
                size={dense ? 'small' : 'medium'}
                variant="outlined"
                sx={skillsChipSx}
              />
            )}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};
