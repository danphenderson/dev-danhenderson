import {Grid, Paper, Box } from '@mui/material';
import { Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
export default function Home() {
  return (
  <BackgroundPaper image='assets/home.jpg'>
      <Typography variant="h1" align="center" sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: '1.5' }}>
        Hi, I'm a Developer, Photographer, and Climber.
      </Typography>
    </BackgroundPaper>
  );
}