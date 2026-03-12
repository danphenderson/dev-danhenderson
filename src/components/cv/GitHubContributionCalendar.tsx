import { Box, Stack } from '@mui/material';
import { GitHubCalendar } from 'react-github-calendar';
import { ContentCard } from '../ContentCard';
import { useComponentStyles } from '../../styles/componentStyles';
import { BodyText, SubsectionTitle } from '../text';

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
      <SubsectionTitle sx={sectionTitleSx}>
        Contribution calendar
      </SubsectionTitle>
      <BodyText sx={secondaryTextSx}>
        Yearly GitHub activity at a glance.
      </BodyText>
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
