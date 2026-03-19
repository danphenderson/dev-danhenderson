import { Box, Stack, TextField, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../components/CommonLink';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { ClimbingAnalytics } from '../components/climbing/ClimbingAnalytics';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useClimbingData } from '../hooks/useClimbingData';
import type { TickRow, TodoRow } from '../types/data';
import { useFuzzySearch } from '../hooks/useFuzzySearch';
import { useAppStyles } from '../styles/appStyles';
import { SectionLeadText } from '../components/text';
import { MotionSection, MotionFadeIn } from '../motion';

const renderRouteLink = (label: string, href: string) => (
  <CommonLink
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    underline="hover"
    data-tooltip-id={COMMON_LINK_TOOLTIP_ID}
    data-tooltip-content={`Open ${label} on Mountain Project.`}
    data-tooltip-place="top"
  >
    {label}
  </CommonLink>
);

const columns: GridColDef<TickRow>[] = [
  {
    field: 'route',
    headerName: 'Route',
    flex: 1.4,
    minWidth: 200,
    renderCell: (params) => renderRouteLink(String(params.value), params.row.url),
  },
  { field: 'grade', headerName: 'Grade', flex: 0.6, minWidth: 100 },
  { field: 'location', headerName: 'Location', flex: 1, minWidth: 150 },
];

const todoColumns: GridColDef<TodoRow>[] = [
  {
    field: 'route',
    headerName: 'Route',
    flex: 1.4,
    minWidth: 200,
    renderCell: (params) => renderRouteLink(String(params.value), params.row.url),
  },
  { field: 'grade', headerName: 'Grade', flex: 0.6, minWidth: 100 },
  { field: 'location', headerName: 'Location', flex: 1, minWidth: 150 },
];

const tickSearchKeys = ['route', 'location'];
const todoSearchKeys = ['route', 'location'];

export default function Climbing() {
  const appStyles = useAppStyles();
  useDocumentMetadata({ ...siteRouteMap.climbing, canonicalPath: siteRouteMap.climbing.path });
  const { ticks, todos, analytics, status } = useClimbingData();
  const tickSearch = useFuzzySearch<TickRow>(ticks, tickSearchKeys);
  const todoSearch = useFuzzySearch<TodoRow>(todos, todoSearchKeys);

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <MotionSection>
        <SectionCard sx={appStyles.climbingCardSx}>
          <Stack spacing={2}>
            <SectionHeading overline="Climbing" />
            <SectionLeadText>
              A collection of routes I've remembered to tick on Mountain Project, including some
              top-rope ascents — I don't climb 5.14.
            </SectionLeadText>
            <ClimbingAnalytics analytics={analytics} status={status} />
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
            <Box sx={appStyles.dataGridContainerSx}>
              <DataGrid
                rows={tickSearch.filtered}
                columns={columns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
              />
            </Box>
            <MotionFadeIn>
              <SectionHeading overline="TODO Routes" sx={appStyles.sectionHeadingOffsetSx} />
            </MotionFadeIn>
            <SectionLeadText>A collection of routes I'm interested in climbing.</SectionLeadText>
            <TextField
              size="small"
              placeholder="Search TODO routes..."
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
            <Box sx={appStyles.dataGridContainerSx}>
              <DataGrid
                rows={todoSearch.filtered}
                columns={todoColumns}
                autoHeight
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10, 25, 50]}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
              />
            </Box>
          </Stack>
        </SectionCard>
      </MotionSection>
    </PageFrame>
  );
}
