import React from "react";
import { Typography, Grid } from "@mui/material";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import BackgroundPaper from "../components/BackgroundPaper";
import { Link } from "react-router-dom"
import { usePhotographyData } from '../hooks/usePhotographyData';

export default function Photography() {
  const { categories } = usePhotographyData();

  return (
    <BackgroundPaper image='assets/photography/landscape/landscape-lime-kiln.jpg'>
      <Grid container spacing={4}>
        {categories.map((card) => (
          <Grid item key={card.name} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="div"
                sx={{pt: '80%'}}
                image={`${card.src}`}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {card.name}
                </Typography>
                <Typography>
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  component={Link}
                  to={`/photography/${card.slug}`}
                  variant="outlined"
                >
                  View
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </BackgroundPaper>
  );
}
