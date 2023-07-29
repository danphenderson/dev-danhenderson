import * as React from 'react';
import {Grid, Paper, Box, Card, Container, CardActionArea, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import data from "../ticks.json";

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
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
        <Grid
          item
          component={Paper}
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: `${"./assets/photography/action/action-city-photo-2.jpg"}`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>

          <Grid container spacing={4}  sx={{ padding: 2}}>

            {/* Left Section (Profile Section)*/}
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ padding: 2, textAlign: "center" }}>

                {/* Places I've Climbed */}
                <Box sx={{padding: 2}}> 
                <Card sx={{ maxWidth: 345 }}>
                  <CardMedia
                    component="img"
                    alt="green iguana"
                    height="140"
                    image={`${"./assets/photography/action/action-city-photo-2.jpg"}`}
                    loading='lazy'
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      Lizard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with over 6,000
                      species, ranging across all continents except Antarctica
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">Share</Button>
                    <Button size="small">Learn More</Button>
                  </CardActions>
                </Card>
                </Box>

                <Box sx={{padding: 2}}> 
                  <Typography variant="h4" gutterBottom> 
                    Recent Ticks
                  </Typography>
                  <DataGrid rows={data} columns={columns} />
                </Box>

              </Paper>
            </Grid>

            

            {/* Right Section */}
            <Grid item xs={12} md={8}>
              <Paper elevation={3} sx={{ padding: 2 }}>
                
                {/* Current Weather */}
                <Box sx={{padding: 2}}>
                <Grid item xs={12} md={6}>
                <Box sx={{padding: 2}}> 
                  <Typography variant="h4" gutterBottom> 
                    Weather
                  </Typography>
                  <Card sx={{padding: 2}}>
                    <Typography variant="h6" gutterBottom> 
                      Current Weather
                    </Typography>
                    <Typography variant="body1" gutterBottom> 
                      70 degrees
                    </Typography>
                    <Typography variant="body1" gutterBottom> 
                      Sunny
                    </Typography>
                  </Card>
                </Box>
                <Typography variant="h4" gutterBottom>
                        Trip Reports
                </Typography>
                  <CardActionArea component="a" href="#">
                    <Card sx={{ display: 'flex' }}>
                      <CardContent sx={{ flex: 1 }}>
                        <Typography component="h2" variant="h5">
                          "Title of trip report"
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          "Date of trip report"
                        </Typography>
                        <Typography variant="subtitle1" paragraph>
                          "Description"
                        </Typography>
                        <Typography variant="subtitle1" color="primary">
                          Continue reading...
                        </Typography>
                      </CardContent>
                      <CardMedia
                        component="img"
                        sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
                        image={`${"./assets/photography/action/action-city-photo-2.jpg"}`}
                        alt={'Image of trip report'}
                      />
                    </Card>
                  </CardActionArea>
                </Grid>

                </Box>
              </Paper>
            </Grid>
          </Grid>
          </Grid>
      </Grid>
  );
  
}