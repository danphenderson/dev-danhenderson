import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import {QuiltedImageList, TitledImageList } from '../components/ImageLists';


export default function Photography() {
  return (
    <Grid container component="main">
      <Grid item component="div">
        <QuiltedImageList/>
      </Grid>
    </Grid>
  );
}