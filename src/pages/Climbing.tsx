import React from 'react';
import { Box, Link as MuiLink, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { SectionHeading } from '../components/layout/SectionHeading';
import { PageFrame } from '../components/layout/PageFrame';
import { SectionCard } from '../components/layout/SectionCard';
import { ClimbingAnalytics } from '../components/climbing/ClimbingAnalytics';
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
  const { ticks, todos, analytics, status } = useClimbingData();

  return (
    <PageFrame image="assets/climbing/climbing-locations.png" maxWidth={1200}>
      <SectionCard sx={appStyles.climbingCardSx}>
        <Stack spacing={2}>
          <SectionHeading overline="Climbing"/>
          <SectionLeadText sx={appStyles.sectionLeadSx}>
            A collection of routes I've remembered to tick on Mountain Project.
          </SectionLeadText>
          <ClimbingAnalytics analytics={analytics} status={status} />
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
