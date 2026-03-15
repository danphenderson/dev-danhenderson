import { Box, Chip, Stack, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { SectionPanel } from '../layout/SectionPanel';
import { SubsectionTitle, MetaText, CaptionText } from '../text';
import type { ClimbingAnalytics as ClimbingAnalyticsType, ClimbingStatus } from '../../hooks/useClimbingData';

type ClimbingAnalyticsProps = {
  analytics: ClimbingAnalyticsType;
  status: ClimbingStatus;
};

const metricSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: 80,
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
  pl: 0,
  listStyle: 'none',
  m: 0,
};

const locationItemSx: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 1,
  py: 0.25,
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
      {/* ── Overview metrics ────────────────────────────── */}
      <SubsectionTitle>Overview</SubsectionTitle>
      <SectionPanel>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', py: 1 }}>
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
            <Typography sx={metricValueSx}>{overview.mostRecentDate}</Typography>
            <MetaText>Most Recent Tick</MetaText>
          </Box>
        </Box>
      </SectionPanel>

      {/* ── Grade profile ───────────────────────────────── */}
      <SubsectionTitle>Grade Profile</SubsectionTitle>
      <SectionPanel>
        <Stack spacing={1}>
          <CaptionText>Climbed</CaptionText>
          <Box sx={gradeSectionSx}>
            {gradeProfile
              .filter((g) => g.tickCount > 0)
              .map((g) => (
                <Chip
                  key={`tick-${g.bucket}`}
                  label={`${g.bucket} (${g.tickCount})`}
                  size="small"
                  variant="outlined"
                />
              ))}
          </Box>
          <CaptionText>To Do</CaptionText>
          <Box sx={gradeSectionSx}>
            {gradeProfile
              .filter((g) => g.todoCount > 0)
              .map((g) => (
                <Chip
                  key={`todo-${g.bucket}`}
                  label={`${g.bucket} (${g.todoCount})`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
              ))}
          </Box>
        </Stack>
      </SectionPanel>

      {/* ── Destination profile ─────────────────────────── */}
      <SubsectionTitle>Top Destinations</SubsectionTitle>
      <SectionPanel>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ width: '100%' }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CaptionText>Most Climbed</CaptionText>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTickLocations.map((loc) => (
                <Box component="li" key={loc.location} sx={locationItemSx}>
                  <MetaText sx={locationTextSx}>{loc.location}</MetaText>
                  <MetaText sx={{ flexShrink: 0 }}>{loc.count}</MetaText>
                </Box>
              ))}
            </Box>
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CaptionText>Most Wanted</CaptionText>
            <Box component="ul" sx={locationListSx}>
              {destinationProfile.topTodoLocations.map((loc) => (
                <Box component="li" key={loc.location} sx={locationItemSx}>
                  <MetaText sx={locationTextSx}>{loc.location}</MetaText>
                  <MetaText sx={{ flexShrink: 0 }}>{loc.count}</MetaText>
                </Box>
              ))}
            </Box>
          </Box>
        </Stack>
      </SectionPanel>

      {/* ── Data freshness ──────────────────────────────── */}
      <CaptionText sx={{ textAlign: 'center', pt: 0.5 }}>
        {status.dataFreshness}
      </CaptionText>
    </Stack>
  );
};
