import { Box, Chip, Stack } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { SectionPanel } from '../layout/SectionPanel';
import { Text } from '../text';
import type { ClimbingAnalytics as ClimbingAnalyticsType } from '../../types/data';

type ClimbingAnalyticsProps = {
  analytics: ClimbingAnalyticsType;
};

const metricSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 96,
};

const gradeSectionSx: SxProps<Theme> = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 0.75,
};

const locationListSx: SxProps<Theme> = {
  paddingLeft: 0,
  listStyle: 'none',
  margin: 0,
};

const locationItemSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
  paddingTop: 0.25,
  paddingBottom: 0.25,
};

const locationTextSx: SxProps<Theme> = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
};

export const ClimbingAnalytics = ({ analytics }: ClimbingAnalyticsProps) => {
  const { overview, gradeProfile, destinationProfile } = analytics;
  const freshnessLabel = overview.mostRecentDate
    ? `Bundled climbing log updated through ${overview.mostRecentDate}.`
    : 'Bundled climbing log data is available in the client build.';

  return (
    <Stack spacing={2}>
      <Text role="subsectionTitle">Overview</Text>
      <SectionPanel>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            justifyContent: 'center',
            paddingTop: 1,
            paddingBottom: 1,
          }}
        >
          <Box sx={metricSx}>
            <Text role="metricValue" tone="accent">
              {overview.tickCount}
            </Text>
            <Text role="metricLabel">Routes Climbed</Text>
          </Box>
          <Box sx={metricSx}>
            <Text role="metricValue" tone="accent">
              {overview.todoCount}
            </Text>
            <Text role="metricLabel">Routes to Climb</Text>
          </Box>
          <Box sx={metricSx}>
            <Text role="metricValue" tone="accent">
              {overview.uniqueLocations}
            </Text>
            <Text role="metricLabel">Unique Locations</Text>
          </Box>
          <Box sx={metricSx}>
            <Text role="metricValue" tone="accent">
              {overview.mostRecentDate || 'N/A'}
            </Text>
            <Text role="metricLabel">Most Recent Tick</Text>
          </Box>
        </Box>
      </SectionPanel>

      <Text role="subsectionTitle">Grade Profile</Text>
      <SectionPanel>
        <Stack spacing={1}>
          <Text role="caption" tone="muted">
            Climbed
          </Text>
          <Box sx={gradeSectionSx}>
            {gradeProfile
              .filter((grade) => grade.tickCount > 0)
              .map((grade) => (
                <Chip
                  key={`tick-${grade.bucket}`}
                  label={`${grade.bucket} (${grade.tickCount})`}
                  size="small"
                  variant="outlined"
                />
              ))}
          </Box>

          <Text role="caption" tone="muted">
            To Climb
          </Text>
          <Box sx={gradeSectionSx}>
            {gradeProfile
              .filter((grade) => grade.todoCount > 0)
              .map((grade) => (
                <Chip
                  key={`todo-${grade.bucket}`}
                  label={`${grade.bucket} (${grade.todoCount})`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
          </Box>
        </Stack>
      </SectionPanel>

      <Text role="subsectionTitle">Top Destinations</Text>
      <SectionPanel>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text role="caption" tone="muted">
              Most Climbed
            </Text>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTickLocations.map((location) => (
                <Box component="li" key={location.location} sx={locationItemSx}>
                  <Text role="meta" sx={locationTextSx}>
                    {location.location}
                  </Text>
                  <Text role="meta" sx={{ flexShrink: 0 }}>
                    {location.count}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Text role="caption" tone="muted">
              Most Wanted
            </Text>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTodoLocations.map((location) => (
                <Box component="li" key={location.location} sx={locationItemSx}>
                  <Text role="meta" sx={locationTextSx}>
                    {location.location}
                  </Text>
                  <Text role="meta" sx={{ flexShrink: 0 }}>
                    {location.count}
                  </Text>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </SectionPanel>

      <Text role="caption" tone="muted" sx={{ textAlign: 'center', paddingTop: 0.5 }}>
        {freshnessLabel}
      </Text>
    </Stack>
  );
};
