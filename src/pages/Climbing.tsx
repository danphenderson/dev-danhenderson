import React from 'react';
import { Alert, Box, Link as MuiLink, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BackgroundPaper from '../components/BackgroundPaper';
import { SectionHeading } from '../components/cv/SectionHeading';
import { ContentCard } from '../components/ContentCard';
import { useClimbingData, TickRow, TodoRow } from '../hooks/useClimbingData';

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
  const { ticks, todos, loading, todosLoading, error, todosError } = useClimbingData();

  return (
    <BackgroundPaper image="assets/climbing/climbing-locations.png" showShell={false}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <ContentCard sx={{ p: { xs: 2.5, md: 3.5 } }}>
          <Stack spacing={2}>
            <SectionHeading overline="Climbing" title="Recorded Ascents" />
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}
            <Box sx={{ width: '100%' }}>
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
                loading={loading}
              />
            </Box>
            <SectionHeading overline="Climbing" title="To-Do Routes" sx={{ mt: 2 }} />
            {todosError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {todosError}
              </Alert>
            )}
            <Box sx={{ width: '100%' }}>
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
                loading={todosLoading}
              />
            </Box>
          </Stack>
        </ContentCard>
      </Box>
    </BackgroundPaper>
  );
}
