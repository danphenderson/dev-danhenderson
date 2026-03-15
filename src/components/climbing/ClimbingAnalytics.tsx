import { Box, Chip, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { SectionPanel } from '../layout/SectionPanel';
import { SubsectionTitle, MetaText, CaptionText } from '../text';
import type { ClimbingAnalytics as ClimbingAnalyticsType } from '../../hooks/useClimbingData';
import type { SharedDataStatus } from '../../types/data';

type ClimbingAnalyticsProps = {
  analytics: ClimbingAnalyticsType;
  status: SharedDataStatus;
};

const metricSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 96,
};

const metricValueSx: SxProps<Theme> = {
  fontWeight: 700,
  fontSize: '1.5rem',
  color: 'primary.main',
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

export const ClimbingAnalytics = ({ analytics, status }: ClimbingAnalyticsProps) => {
  const { overview, gradeProfile, destinationProfile } = analytics;

  return (
    <Stack spacing={2}>
      <SubsectionTitle>Overview</SubsectionTitle>
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
            <Typography sx={metricValueSx}>{overview.tickCount}</Typography>
            <MetaText>Routes Climbed</MetaText>
          </Box>
          <Box sx={metricSx}>
            <Typography sx={metricValueSx}>{overview.todoCount}</Typography>
            <MetaText>Routes To Do</MetaText>
          </Box>
          <Box sx={metricSx}>
            <Typography sx={metricValueSx}>{overview.uniqueLocations}</Typography>
            <MetaText>Unique Locations</MetaText>
          </Box>
          <Box sx={metricSx}>
            <Typography sx={metricValueSx}>{overview.mostRecentDate || 'N/A'}</Typography>
            <MetaText>Most Recent Tick</MetaText>
          </Box>
        </Box>
      </SectionPanel>

      <SubsectionTitle>Grade Profile</SubsectionTitle>
      <SectionPanel>
        <Stack spacing={1}>
          <CaptionText>Climbed</CaptionText>
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

          <CaptionText>To Do</CaptionText>
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

      <SubsectionTitle>Top Destinations</SubsectionTitle>
      <SectionPanel>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CaptionText>Most Climbed</CaptionText>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTickLocations.map((location) => (
                <Box component="li" key={location.location} sx={locationItemSx}>
                  <MetaText sx={locationTextSx}>{location.location}</MetaText>
                  <MetaText sx={{ flexShrink: 0 }}>{location.count}</MetaText>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CaptionText>Most Wanted</CaptionText>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTodoLocations.map((location) => (
                <Box component="li" key={location.location} sx={locationItemSx}>
                  <MetaText sx={locationTextSx}>{location.location}</MetaText>
                  <MetaText sx={{ flexShrink: 0 }}>{location.count}</MetaText>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </SectionPanel>

      <CaptionText sx={{ textAlign: 'center', paddingTop: 0.5 }}>
        {status.freshness.label}
      </CaptionText>
    </Stack>
  );
};
