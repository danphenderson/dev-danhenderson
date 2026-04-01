import { Stack, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { ClimbingAnalytics } from '../components/climbing/ClimbingAnalytics';
import { ClimbingRouteTable } from '../components/climbing/ClimbingRouteTable';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useClimbingData } from '../hooks/useClimbingData';
import type { TickRow, TodoRow } from '../types/data';
import { useFuzzySearch } from '../hooks/useFuzzySearch';
import { useAppStyles } from '../styles/appStyles';
import { Text } from '../components/text';
import { MotionSection, MotionFadeIn, MotionTiltCard } from '../motion';

const tickSearchKeys = ['route', 'location'];
const todoSearchKeys = ['route', 'location'];

export default function Climbing() {
  const appStyles = useAppStyles();
  useDocumentMetadata({ ...siteRouteMap.climbing, canonicalPath: siteRouteMap.climbing.path });
  const { ticks, todos, analytics } = useClimbingData();
  const tickSearch = useFuzzySearch<TickRow>(ticks, tickSearchKeys);
  const todoSearch = useFuzzySearch<TodoRow>(todos, todoSearchKeys);
  const hasRoutesToClimb = todos.length > 0;

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <MotionSection>
        <SectionCard sx={appStyles.climbingCardSx}>
          <Stack spacing={2}>
            <SectionHeading overline="Climbing" />
            <Text role="metaStrong">
              A collection of routes I've remembered to tick on Mountain Project, including some
              top-rope ascents — I don't climb 5.14.
            </Text>
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
      </MotionSection>
    </PageFrame>
  );
}
