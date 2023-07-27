import * as React from 'react';
import Grid from '@mui/material/Grid';


export default function Home() {
  return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            backgroundImage: `url(${require("../images/home.jpg")})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </Grid>
  );
}