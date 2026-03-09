import { Box, Link, Stack, Typography } from '@mui/material';
import type { VolunteeringEntry } from '../../data/cv';
import { AnimatedContentCard } from '../AnimatedContentCard';
import { useCvStyles } from '../../styles/cvStyles';

type VolunteeringListProps = {
  volunteering: VolunteeringEntry[];
  startDelayMs?: number;
};

const volunteeringStaggerMs = 80;

export const VolunteeringList = ({ volunteering, startDelayMs = 0 }: VolunteeringListProps) => {
  const { getDetailListSx, secondaryItalicSx, secondaryStrongSx, sectionTitleSx } = useCvStyles();

  if (volunteering.length === 0) {
    return null;
  }

  return (
    <Stack spacing={2.25}>
      {volunteering.map((entry, index) => (
        <AnimatedContentCard
          key={`${entry.organization}-${entry.role}-${index}`}
          delayMs={startDelayMs + index * volunteeringStaggerMs}
        >
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
              spacing={1.5}
              flexWrap="wrap"
            >
              <Box>
                {entry.organizationUrl ? (
                  <Link
                    href={entry.organizationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    color="inherit"
                    underline="hover"
                    variant="h6"
                    sx={sectionTitleSx}
                  >
                    {entry.organization}
                  </Link>
                ) : (
                  <Typography variant="h6" fontWeight={700} sx={sectionTitleSx}>
                    {entry.organization}
                  </Typography>
                )}
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                  {entry.role}
                </Typography>
              </Box>

              <Box sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Typography variant="subtitle2" sx={secondaryStrongSx}>
                  {entry.dateRange}
                </Typography>
                {entry.location && (
                  <Typography variant="body2" sx={secondaryItalicSx}>
                    {entry.location}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Box component="ul" sx={getDetailListSx(0, 0)}>
              {entry.highlights.map((highlight, highlightIndex) => (
                <Typography component="li" variant="body2" key={`${highlight}-${highlightIndex}`}>
                  {highlight}
                </Typography>
              ))}
            </Box>
          </Stack>
        </AnimatedContentCard>
      ))}
    </Stack>
  );
};
