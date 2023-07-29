import * as React from 'react';
import {Grid, Paper, Box, Card, Container } from '@mui/material';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import data from "../assets/climbing/data.json";

const columns = [
  { field: 'Date', headerName: 'Date', flex: 1 },
  { field: 'Route', headerName: 'Route', flex: 1 },
  { field: 'Rating', headerName: 'Rating', flex: 1 },
  { field: 'Notes', headerName: 'Notes', flex: 1 },
  { field: 'URL', headerName: 'URL', flex: 1 },
  { field: 'Pitches', headerName: 'Pitches', flex: 1 },
  { field: 'Location', headerName: 'Location', flex: 1 },
  { field: 'Avg Stars', headerName: 'Avg Stars', flex: 1 },
  { field: 'Your Stars', headerName: 'Your Stars', flex: 1 },
  { field: 'Style', headerName: 'Style', flex: 1 },
  { field: 'Lead Style', headerName: 'Lead Style', flex: 1 },
  { field: 'Route Type', headerName: 'Route Type', flex: 1 },
  { field: 'Your Rating', headerName: 'Your Rating', flex: 1 },
  { field: 'Length', headerName: 'Length', flex: 1 },
  { field: 'Rating Code', headerName: 'Rating Code', flex: 1 },
];


export default function Climbing() {
  return (
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
        <Grid
          item
          component={Paper}
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: `url(${require("../assets/photography/action/action-city-photo-2.jpg")})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <Box sx={{ my: 8, mx: 4 }}>
              <Typography variant="h1" marginTop={3}>Climbing</Typography>
            </Box>
            <Box>
              <DataGrid rows={data} columns={columns} />
            </Box>
          </Grid>
      </Grid>
  );
  
}