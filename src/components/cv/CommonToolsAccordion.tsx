import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Stack,
  Typography,
} from '@mui/material';
import { useCvStyles } from '../../ThemeProvider';

type CommonToolsAccordionProps = {
  title?: string;
  subtitle?: string;
  tools: string[];
  dense?: boolean;
  defaultExpanded?: boolean;
};

export const CommonToolsAccordion = ({
  title = 'Common tools',
  subtitle = 'Frequently used across roles and projects.',
  tools,
  dense = false,
  defaultExpanded = true,
}: CommonToolsAccordionProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();

  return (
    <Accordion
      disableGutters
      elevation={0}
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
      defaultExpanded={defaultExpanded}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: 'text.secondary' }} />}
        aria-controls="common-tools-content"
        id="common-tools-header"
      >
        <Stack spacing={0.25} sx={{ width: '100%' }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary' }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          ) : null}
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 0.75,
          }}
        >
          {tools.map((tool) => (
            <Chip
              key={tool}
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
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
