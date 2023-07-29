import {Grid, Paper, Box } from '@mui/material';
import { Typography } from '@mui/material';


export default function NotFound() {
  return (
      <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
          <Box sx={{ my: 8, mx: 4 }}>
           <Paper elevation={10}>
              <Typography variant="h2" marginTop={3}>404 Not Found</Typography>
            </Paper>
          </Box>
    </Grid>
  );
}