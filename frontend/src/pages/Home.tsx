import * as React from 'react';
import {Grid, Paper, Box, Card, Container } from '@mui/material';
import { Typography } from '@mui/material';

export default function Home() {
  return (
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
        <Grid item component="div" xs={12} sm={12} md={12}
          sx={{
            backgroundImage: `url(${require("../images/home.jpg")})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}>
            <Box sx={{ my: 8, mx: 4 }}>
             <Paper>
                <Typography variant="h2" marginTop={3}>I'm a Developer, a Photographer, and a Climber.</Typography>
              </Paper>
            </Box>

          </Grid>
      </Grid>
  );
  
}