import { Box, Chip, Stack, Typography } from '@mui/material';
import type { StackSection as StackSectionType } from '../../data/cv';

type StackSectionProps = {
  sections: StackSectionType[];
};

export const StackSection = ({ sections }: StackSectionProps) => (
  <Stack spacing={1.5} sx={{ mt: 1 }}>
    {sections.map((section) => (
      <Box key={section.title}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#0f172a', mb: 0.5 }}>
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
                borderColor: 'rgba(15,23,42,0.12)',
                backgroundColor: 'rgba(255,255,255,0.9)',
                fontWeight: 500,
              }}
            />
          ))}
        </Box>
      </Box>
    ))}
  </Stack>
);
