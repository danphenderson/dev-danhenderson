import * as React from 'react';
import {Grid, Paper, Box, Card, Container, CardActionArea, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import data from "../ticks.json";
import BackgroundPaper from '../components/BackgroundPaper';

import WeatherWidget from '../components/WeatherWidget';

const columns = [
  { field: 'Date', headerName: 'Date', flex: 1 },
  { field: 'Route', headerName: 'Route', flex: 1 },
  { field: 'Rating', headerName: 'Rating', flex: 1 },
  { field: 'URL', headerName: 'URL', flex: 1 },
  { field: 'Pitches', headerName: 'Pitches', flex: 1 },
  { field: 'Location', headerName: 'Location', flex: 1 },
];
export default function Climbing() {
  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-lime-kiln.jpg'>
      
      {/* Left Section (Profile Section) */}
      <Paper elevation={3} sx={{ padding: 2, marginY: 4, width: '70%', minWidth: '600px' }}> {/* Adjusted the width here */}
        <Box>
          <Box sx={{ my: 2 }}>
            <WeatherWidget city="Index" />
          </Box>
          <Box sx={{ my: 2 }}>
            <WeatherWidget city="Seattle" />
          </Box>
        </Box>
      </Paper>

      {/* Left Section (Profile Section) TODO: Update ME */}
      <Paper elevation={3} sx={{ padding: 2, marginY: 4 }}>
        {/* Name and Title */}
        <Typography variant="h2">
          Recorded Ascents
        </Typography>
        <DataGrid rows={data} columns={columns} />
      </Paper>
    
    </BackgroundPaper>
  );
}