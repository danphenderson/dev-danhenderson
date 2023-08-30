import { Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';

export default function NotFound() {
  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-lime-kiln.jpg'>
      <Typography variant="h2" marginTop={3}>404 Not Found</Typography>
    </BackgroundPaper>
     
  );
}