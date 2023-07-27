import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import QuiltedImageList from '../components/ImageLists';

export default function Photography() {
  return (
    <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
      <Grid item component={QuiltedImageList}/>
      <Box>
        <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
          Photography Page
        </Typography>
      </Box>
    </Grid>
  );
}