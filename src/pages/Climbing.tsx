import { useCallback, useEffect, useState } from 'react';
import { Box, Stack, TextField, InputAdornment } from '@mui/material';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import SearchIcon from '@mui/icons-material/Search';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { ClimbingAnalytics } from '../components/climbing/ClimbingAnalytics';
import { ClimbingRouteTable } from '../components/climbing/ClimbingRouteTable';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from '../components/header/headerScroll';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useClimbingData } from '../hooks/useClimbingData';
import type { TickRow, TodoRow } from '../types/data';
import { useFuzzySearch } from '../hooks/useFuzzySearch';
import { useAppStyles } from '../styles/appStyles';
import { Text, TypewriterText } from '../components/text';
import { MotionSection, MotionFadeIn, MotionTiltCard } from '../motion';

const tickSearchKeys = ['route', 'location'];
const todoSearchKeys = ['route', 'location'];
const CLIMBING_CONTENT_ENTRANCE_DELAY_MS = 120;
const CLIMBING_DEFERRED_CONTENT_SCROLL_RUNWAY_PX =
  HEADER_HIDE_SCROLL_TRIGGER_OPTIONS.threshold + 96;
const climbingIntroText =
  'A collection of ascents that were recorded on Mountain Project, including everything from the rare onsights to noteworthy top-ropes.';

export default function Climbing() {
  const appStyles = useAppStyles();
  useDocumentMetadata({ ...siteRouteMap.climbing, canonicalPath: siteRouteMap.climbing.path });
  const { ticks, todos, analytics } = useClimbingData();
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [isIntroSubtitlePlaying, setIsIntroSubtitlePlaying] = useState(false);
  const scrolledPastHeaderCollapse = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);
  const [hasUnlockedDeferredContent, setHasUnlockedDeferredContent] = useState(
    scrolledPastHeaderCollapse
  );
  const tickSearch = useFuzzySearch<TickRow>(ticks, tickSearchKeys);
  const todoSearch = useFuzzySearch<TodoRow>(todos, todoSearchKeys);
  const hasRoutesToClimb = todos.length > 0;

  const handleIntroVisible = useCallback(() => {
    setIsIntroPlaying(true);
  }, []);

  const handleIntroHeadingComplete = useCallback(() => {
    setIsIntroSubtitlePlaying(true);
  }, []);

  useEffect(() => {
    if (hasUnlockedDeferredContent || !scrolledPastHeaderCollapse) {
      return;
    }

    setHasUnlockedDeferredContent(true);
  }, [hasUnlockedDeferredContent, scrolledPastHeaderCollapse]);

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <Stack spacing={3}>
        <MotionSection>
          <MotionTiltCard intensity={0.5}>
            <SectionCard delayMs={0} triggerOnView={false} onVisible={handleIntroVisible}>
              <Stack spacing={1}>
                <Box sx={appStyles.compactSectionHeadingSx} data-testid="climbing-intro-label">
                  <Text role="sectionEyebrow" tone="support">
                    <TypewriterText
                      text="Climbing"
                      playing={isIntroPlaying}
                      timingPreset="body"
                      onComplete={handleIntroHeadingComplete}
                    />
                  </Text>
                </Box>
                <Text role="sectionSubtitle">
                  <TypewriterText
                    text={climbingIntroText}
                    playing={isIntroSubtitlePlaying}
                    timingPreset="body"
                  />
                </Text>
              </Stack>
            </SectionCard>
          </MotionTiltCard>
        </MotionSection>

        {hasUnlockedDeferredContent ? (
          <SectionCard
            delayMs={CLIMBING_CONTENT_ENTRANCE_DELAY_MS}
            entranceDirection="right"
            sx={appStyles.climbingCardSx}
          >
            <Stack spacing={2}>
              <ClimbingAnalytics analytics={analytics} />
              <TextField
                size="small"
                placeholder="Search climbed routes..."
                value={tickSearch.search}
                onChange={(e) => tickSearch.setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <MotionTiltCard intensity={0.4}>
                <ClimbingRouteTable
                  rows={tickSearch.filtered}
                  ariaLabel="Climbed routes"
                  emptyMessage="No climbed routes match this search."
                />
              </MotionTiltCard>
              {hasRoutesToClimb && (
                <>
                  <MotionFadeIn>
                    <SectionHeading
                      overline="Routes to Climb"
                      sx={appStyles.sectionHeadingOffsetSx}
                    />
                  </MotionFadeIn>
                  <Text role="metaStrong">A collection of routes I'd still like to climb.</Text>
                  <TextField
                    size="small"
                    placeholder="Search routes to climb..."
                    value={todoSearch.search}
                    onChange={(e) => todoSearch.setSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <MotionTiltCard intensity={0.4}>
                    <ClimbingRouteTable
                      rows={todoSearch.filtered}
                      ariaLabel="Routes to climb"
                      emptyMessage="No routes to climb match this search."
                    />
                  </MotionTiltCard>
                </>
              )}
            </Stack>
          </SectionCard>
        ) : (
          <Box
            aria-hidden
            data-testid="climbing-scroll-unlock-runway"
            sx={{ height: CLIMBING_DEFERRED_CONTENT_SCROLL_RUNWAY_PX }}
          />
        )}
      </Stack>
    </PageFrame>
  );
}
