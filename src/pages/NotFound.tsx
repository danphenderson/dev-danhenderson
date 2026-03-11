import { Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
import { fallbackBackgroundImage } from '../data/photography';

export default function NotFound() {
  return (
    <BackgroundPaper image={fallbackBackgroundImage}>
      <Typography variant="h2" marginTop={3}>404 Not Found</Typography>
    </BackgroundPaper>
     
  );
}