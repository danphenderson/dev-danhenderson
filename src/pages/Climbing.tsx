import { Box, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { CommonLink, COMMON_LINK_TOOLTIP_ID } from '../components/CommonLink';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { useClimbingData, TickRow, TodoRow } from '../hooks/useClimbingData';
import { useAppStyles } from '../styles/appStyles';
import { SectionLeadText } from '../components/text';

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
  { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 120 },
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

export default function Climbing() {
  const appStyles = useAppStyles();
  const { ticks, todos } = useClimbingData();

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <SectionCard sx={appStyles.climbingCardSx}>
        <Stack spacing={2}>
          <SectionHeading overline="Climbing" />
          <SectionLeadText sx={appStyles.sectionLeadSx}>
            A collection of routes I've remembered to tick on Mountain Project.
          </SectionLeadText>
          <Box sx={appStyles.dataGridContainerSx}>
            <DataGrid
              rows={ticks}
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
          <SectionHeading overline="TODO Routes" sx={appStyles.sectionHeadingOffsetSx} />
          <SectionLeadText sx={appStyles.sectionLeadSx}>
            A collection of routes I'm interested in climbing.
          </SectionLeadText>
          <Box sx={appStyles.dataGridContainerSx}>
            <DataGrid
              rows={todos}
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
    </PageFrame>
  );
}
