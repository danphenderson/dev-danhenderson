import * as React from 'react';
import {Grid, Paper, Box, Card, Container, CardActionArea, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import data from "../ticks.json";
import BackgroundPaper from '../components/BackgroundPaper';

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
      <Typography variant="h4" gutterBottom> 
        Recorded Ascents
      </Typography>
      <DataGrid rows={data} columns={columns} />
      <Typography variant="h4" gutterBottom> 
        Seattle Weather
      </Typography>
      <DataGrid rows={data} columns={columns} />
    </BackgroundPaper>
  );
  
}