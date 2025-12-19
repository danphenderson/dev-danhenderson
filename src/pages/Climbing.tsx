import React, { useState, useEffect } from 'react';
import { Alert, Box, Link as MuiLink, Paper, Stack } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import BackgroundPaper from '../components/BackgroundPaper';
import { SectionHeading } from '../components/cv/SectionHeading';
import { useCvStyles } from '../ThemeProvider';
import ticksCsvUrl from '../data/ticks.csv';
import todosCsvUrl from '../data/to-dos.csv';
import { ContentCard } from '../components/ContentCard';

type Tick = {
  id: string;
  date: string;
  route: string;
  grade: string;
  location: string;
  url: string;
};

type Todo = {
  id: string;
  route: string;
  grade: string;
  location: string;
  url: string;
};

const columns: GridColDef<Tick>[] = [
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

const todoColumns: GridColDef<Todo>[] = [
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

const parseCsvLine = (line: string) => {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current);
  return values.map((v) => v.trim());
};

export default function Climbing() {
  const [ticks, setTicks] = useState<Tick[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [todosLoading, setTodosLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [todosError, setTodosError] = useState<string | null>(null);
  const { glassPanelSx } = useCvStyles();

  useEffect(() => {
    const parseTicks = (csv: string) => {
      const lines = csv.trim().split(/\r?\n/);
      const [header, ...rows] = lines;
      if (!header) return [];

      return rows
        .map((line, idx) => {
          const cols = parseCsvLine(line);
          const [date, route, rating, , url, , location] = cols;
          return {
            id: `${date}-${route}-${idx}`,
            date: date ? new Date(date).toLocaleDateString() : '',
            route,
            grade: rating,
            location,
            url,
          };
        })
        .filter((row) => row.route);
    };

    const parseTodos = (csv: string) => {
      const lines = csv.trim().split(/\r?\n/);
      const [header, ...rows] = lines;
      if (!header) return [];

      return rows
        .map((line, idx) => {
          const cols = parseCsvLine(line);
          const [route, rating, url, , location] = cols;
          return {
            id: `${route}-${idx}`,
            route,
            grade: rating,
            location,
            url,
          };
        })
        .filter((row) => row.route);
    };

    const loadTicks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(ticksCsvUrl);
        if (!res.ok) throw new Error('Failed to load ticks');
        const text = await res.text();
        const parsed = parseTicks(text);
        const sorted = parsed.sort((a, b) => {
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;
          return bDate - aDate;
        });
        setTicks(sorted);
      } catch (err) {
        setError('Unable to load climbs from ticks.csv right now.');
        setTicks([]);
      } finally {
        setLoading(false);
      }
    };

    const loadTodos = async () => {
      setTodosLoading(true);
      setTodosError(null);
      try {
        const res = await fetch(todosCsvUrl);
        if (!res.ok) throw new Error('Failed to load todos');
        const text = await res.text();
        const parsed = parseTodos(text);
        const sorted = parsed.sort((a, b) => a.route.localeCompare(b.route));
        setTodos(sorted);
      } catch {
        setTodosError('Unable to load TODOs from to-dos.csv right now.');
        setTodos([]);
      } finally {
        setTodosLoading(false);
      }
    };

    loadTicks();
    loadTodos();
  }, []);

  return (
    <BackgroundPaper image="assets/climbing/climbing-locations.png">
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 1.5, md: 3 }, py: { xs: 2, md: 3 } }}>
        <Paper
          elevation={0}
          sx={{
            ...glassPanelSx,
            p: { xs: 2.5, md: 3.5 },
            borderRadius: 3,
          }}
        >
          <Stack spacing={2}>
            <SectionHeading overline="Climbing" title="Recorded Ascents" />
            {error && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
            )}
            <ContentCard>
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
            </ContentCard>
            <SectionHeading overline="Climbing" title="To-Do Routes" sx={{ mt: 2 }} />
            {todosError && (
              <Alert severity="error" sx={{ mb: 1 }}>
                {todosError}
              </Alert>
            )}
            <ContentCard>
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
            </ContentCard>
          </Stack>
        </Paper>
      </Box>
    </BackgroundPaper>
  );
}
