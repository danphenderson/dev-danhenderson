import { Box, Stack, Typography } from '@mui/material';
import { GitHubCalendar } from 'react-github-calendar';
import { ContentCard } from '../ContentCard';
import { useComponentStyles } from '../../styles/componentStyles';

type GitHubContributionCalendarProps = {
  username: string;
  contained?: boolean;
};

export const GitHubContributionCalendar = ({
  username,
  contained = true,
}: GitHubContributionCalendarProps) => {
  const {
    contentCardInsetSx,
    githubCalendarColorScheme,
    githubCalendarContainerSx,
    githubCalendarSizeSx,
    githubCalendarTheme,
    sectionTitleSx,
    secondaryTextSx,
  } = useComponentStyles();

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
            colorScheme={githubCalendarColorScheme}
            theme={githubCalendarTheme}
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
