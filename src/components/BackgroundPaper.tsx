import { Box, Grid, Paper } from '@mui/material';

interface BackgroundPaperProps {
  image: string;
  children: React.ReactNode;
}

const resolveBackgroundImage = (src: string) => {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) {
    return src;
  }

  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
  const sanitized = src.replace(/^\.\//, '');
  const normalized = sanitized.startsWith('/') ? sanitized : `/${sanitized.replace(/^\/+/, '')}`;

  return `${base}${normalized}`;
};

const BackgroundPaper: React.FC<BackgroundPaperProps> = ({ image, children }) => {
  const resolvedImage = resolveBackgroundImage(image);

  return (
    <Grid container component="main" sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        sx={{
          backgroundImage: `url('${resolvedImage}')`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          minHeight: '100vh',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            minHeight: '100vh',
            width: '100%',
            padding: '50px 0',
          }}
        >
          <Paper elevation={10} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.6)', padding: 2, borderRadius: 2 }}>
            {children}
          </Paper>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BackgroundPaper;
