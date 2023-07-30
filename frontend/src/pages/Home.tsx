import {Grid, Paper, Box } from '@mui/material';
import { Typography } from '@mui/material';

export default function Home() {
  return (
    <Grid container component="main" sx={{ height: '100vh' }} >
      <Grid item xs={12} sm={12} md={12}
        sx={{
          backgroundImage: `url('assets/photography/landscape/landscape-lime-kiln.jpg')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}> 
        <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', height: '100%', padding: '50px 0' }}>
          <Paper elevation={10} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: 2, borderRadius: 2 }}>
            <Typography variant="h1" align="center" sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: '1.5' }}>
              Hi, I'm a Developer, Photographer, and Climber.
            </Typography>
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
}