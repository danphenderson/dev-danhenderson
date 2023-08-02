import { Box, Grid, Paper } from '@mui/material';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
}

const BackgroundPaper: React.FC<BackgroundPaperProps> = ({ image, children }) => (
  <Grid container component="main" sx={{ height: '100vh' }}>
    <Grid item xs={12} sm={12} md={12}
      sx={{
        backgroundImage: `url('${image}')`,
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
          {children}
        </Paper>
      </Box>
    </Grid>
  </Grid>
);

export default BackgroundPaper;