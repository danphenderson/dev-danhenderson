import { useMemo } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { GitHubCalendar } from 'react-github-calendar';
import { ContentCard } from '../ContentCard';
import { useCvStyles } from '../../styles/cvStyles';

type GitHubContributionCalendarProps = {
  username: string;
  contained?: boolean;
};

export const GitHubContributionCalendar = ({
  username,
  contained = true,
}: GitHubContributionCalendarProps) => {
  const theme = useTheme();
  const {
    accentColor,
    contentCardInsetSx,
    githubCalendarContainerSx,
    githubCalendarSizeSx,
    sectionTitleSx,
    secondaryTextSx,
  } = useCvStyles();

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

  const calendarContent = (
    <Stack spacing={1}>
      <Typography variant="subtitle2" sx={sectionTitleSx}>
        Contribution calendar
      </Typography>
      <Typography variant="body2" sx={secondaryTextSx}>
        Yearly GitHub activity at a glance.
      </Typography>
      <Box sx={githubCalendarContainerSx}>
        <Box sx={githubCalendarSizeSx}>
          <GitHubCalendar
            username={username}
            blockSize={9}
            blockMargin={2}
            fontSize={12}
            colorScheme={theme.palette.mode}
            theme={calendarTheme}
            showColorLegend
            showMonthLabels
            showTotalCount
          />
        </Box>
      </Box>
    </Stack>
  );

  return contained ? <ContentCard sx={contentCardInsetSx}>{calendarContent}</ContentCard> : calendarContent;
};
