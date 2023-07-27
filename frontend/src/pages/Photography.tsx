import React from "react";
import { Box, Typography, Grid, Container } from "@mui/material";
import {QuiltedImageList, TitledImageList } from '../components/ImageLists';


export default function Photography() {
  return (
    <Grid container direction="row" component="main" sx={{ height: '100vh' }} >
      <Grid item component={Container}>
        <TitledImageList/>
      </Grid>
      <Box>
      </Box>
    </Grid>
  );
}