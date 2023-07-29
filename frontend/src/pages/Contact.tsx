import * as React from 'react';
import {Grid, Paper, Box, Card, Container } from '@mui/material';
import { Typography } from '@mui/material';

export default function Contact() {
  return (
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
        <Grid
          item
          component={Paper}
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: `${"./assets/home.jpg"}`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            loading: 'lazy',
          }}>
            <Box sx={{ my: 8, mx: 4 }}>
              <Typography variant="h2" marginTop={3}>Let's do business, please connect via email at me@danhenderson.dev.</Typography>
            </Box>
          </Grid>
      </Grid>
  );
  
}