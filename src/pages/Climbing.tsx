import React from 'react';
import { Alert, Box, Link as MuiLink, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { LoadingBars } from '../components/LoadingBars';
import { useClimbingData, TickRow, TodoRow } from '../hooks/useClimbingData';
import { useAppStyles } from '../styles/appStyles';
import { SectionLeadText } from '../components/text';

const columns: GridColDef<TickRow>[] = [
  { field: 'date', headerName: 'Date', flex: 0.7, minWidth: 120 },
  {
    field: 'route',
    headerName: 'Route',
    flex: 1.4,
    minWidth: 200,
    renderCell: (params) => (
      <MuiLink
        href={params.row.url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
      >
        {params.value}
      </MuiLink>
    ),
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
    renderCell: (params) => (
      <MuiLink
        href={params.row.url}
        target="_blank"
        rel="noopener noreferrer"
        underline="hover"
      >
        {params.value}
      </MuiLink>
    ),
  },
  { field: 'grade', headerName: 'Grade', flex: 0.6, minWidth: 100 },
  { field: 'location', headerName: 'Location', flex: 1, minWidth: 150 },
];

export default function Climbing() {
  const appStyles = useAppStyles();
  const { ticks, todos, loading, todosLoading, error, todosError } = useClimbingData();
  const LoadingOverlay = () => (
    <Box sx={appStyles.loadingOverlaySx}>
      <LoadingBars label="Loading climbing data" compact />
    </Box>
  );

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <SectionCard sx={appStyles.climbingCardSx}>
        <Stack spacing={2}>
          <SectionHeading overline="Climbing"/>
          <SectionLeadText sx={appStyles.sectionLeadSx}>
            A collection of routes I've remembered to tick on Mountain Project.
          </SectionLeadText>
          {error && (
            <Alert severity="error" sx={appStyles.errorAlertSx}>
              {error}
            </Alert>
          )}
          <Box sx={appStyles.dataGridContainerSx}>
            <DataGrid
              rows={ticks}
              columns={columns}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              slots={{ loadingOverlay: LoadingOverlay }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              loading={loading}
            />
          </Box>
          <SectionHeading overline="TODO Routes" sx={appStyles.sectionHeadingOffsetSx} />
          <SectionLeadText sx={appStyles.sectionLeadSx}>
            A collection of routes I'm interested in climbing.
          </SectionLeadText>
          {todosError && (
            <Alert severity="error" sx={appStyles.errorAlertSx}>
              {todosError}
            </Alert>
          )}
          <Box sx={appStyles.dataGridContainerSx}>
            <DataGrid
              rows={todos}
              columns={todoColumns}
              autoHeight
              disableRowSelectionOnClick
              pageSizeOptions={[5, 10, 25, 50]}
              slots={{ loadingOverlay: LoadingOverlay }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              loading={todosLoading}
            />
          </Box>
        </Stack>
      </SectionCard>
    </PageFrame>
  );
}
