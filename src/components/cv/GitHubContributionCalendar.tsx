import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { GitHubCalendar } from 'react-github-calendar';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';

type GitHubContributionCalendarProps = {
  username: string;
};

export const GitHubContributionCalendar = ({ username }: GitHubContributionCalendarProps) => {
  const { accentColor } = useCvStyles();

  const theme = useMemo(
    () => ({
      light: [
        'rgba(15,23,42,0.08)',
        alpha(accentColor, 0.25),
        alpha(accentColor, 0.45),
        alpha(accentColor, 0.65),
        alpha(accentColor, 0.85),
      ],
      dark: [
        'rgba(255,255,255,0.1)',
        alpha(accentColor, 0.35),
        alpha(accentColor, 0.55),
        alpha(accentColor, 0.75),
        accentColor,
      ],
    }),
    [accentColor]
  );

  return (
    <ContentCard sx={{ p: { xs: 1.5, md: 2 } }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ color: '#0f172a', fontWeight: 700 }}>
          Contribution calendar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yearly GitHub activity at a glance.
        </Typography>

        <Box
          sx={{
            mt: 0.5,
            borderRadius: 1.5,
            border: '1px solid rgba(15,23,42,0.08)',
            backgroundColor: 'rgba(255,255,255,0.92)',
            p: { xs: 1, sm: 1.5 },
            overflowX: 'auto',
            '& .react-activity-calendar': {
              width: '100%',
              color: '#334155',
            },
            '& .react-activity-calendar__legend-colors > span': {
              borderRadius: 0.5,
              border: '1px solid rgba(15,23,42,0.08)',
            },
            '& .react-activity-calendar__count': {
              color: '#0f172a',
              fontWeight: 700,
            },
          }}
        >
          <GitHubCalendar
            username={username}
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            colorScheme="light"
            theme={theme}
            showColorLegend
            showMonthLabels
            showTotalCount
            style={{ width: '100%', minHeight: 140 }}
          />
        </Box>
      </Stack>
    </ContentCard>
  );
};
