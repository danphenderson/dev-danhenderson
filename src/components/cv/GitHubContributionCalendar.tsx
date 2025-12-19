import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { GitHubCalendar } from 'react-github-calendar';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../ThemeProvider';

type GitHubContributionCalendarProps = {
  username: string;
};

export const GitHubContributionCalendar = ({ username }: GitHubContributionCalendarProps) => {
  const theme = useTheme();
  const { accentColor, subtleBorder, subtleSurface } = useCvStyles();

  const calendarTheme = useMemo(
    () => {
      const baseTone = alpha(theme.palette.text.primary, theme.palette.mode === 'light' ? 0.12 : 0.2);

      return {
        light: [
          baseTone,
          alpha(accentColor, 0.25),
          alpha(accentColor, 0.45),
          alpha(accentColor, 0.65),
          alpha(accentColor, 0.85),
        ],
        dark: [
          baseTone,
          alpha(accentColor, 0.35),
          alpha(accentColor, 0.55),
          alpha(accentColor, 0.75),
          accentColor,
        ],
      };
    },
    [accentColor, theme]
  );

  return (
    <ContentCard sx={{ p: { xs: 1.5, md: 2 } }}>
      <Stack spacing={1}>
        <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 700 }}>
          Contribution calendar
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Yearly GitHub activity at a glance.
        </Typography>

        <Box
          sx={{
            mt: 0.5,
            borderRadius: 1.5,
            border: subtleBorder,
            backgroundColor: subtleSurface,
            p: { xs: 1, sm: 1.5 },
            overflowX: 'auto',
            '& .react-activity-calendar': {
              width: '100%',
              color: theme.palette.text.primary,
            },
            '& .react-activity-calendar__legend-colors > span': {
              borderRadius: 0.5,
              border: subtleBorder,
            },
            '& .react-activity-calendar__count': {
              color: theme.palette.text.primary,
              fontWeight: 700,
            },
          }}
        >
          <GitHubCalendar
            username={username}
            blockSize={11}
            blockMargin={4}
            fontSize={12}
            colorScheme={theme.palette.mode}
            theme={calendarTheme}
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
