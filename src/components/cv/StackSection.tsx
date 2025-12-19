import { Box, Chip, Stack, Typography } from '@mui/material';
import { useCvStyles } from '../../ThemeProvider';
import type { StackSection as StackSectionType } from '../../data/cv';

type StackSectionProps = {
  sections: StackSectionType[];
};

export const StackSection = ({ sections }: StackSectionProps) => {
  const { subtleBorder, subtleSurface } = useCvStyles();

  return (
    <Stack spacing={1.5} sx={{ mt: 1 }}>
      {sections.map((section) => (
        <Box key={section.title}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
            {section.title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.75,
            }}
          >
            {section.items.map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
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
        </Box>
      ))}
    </Stack>
  );
};
