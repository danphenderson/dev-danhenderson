import React from "react";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import { QuiltedImageList } from "../components/PhotoAlbum";
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


const albums = [
  {
    name: "landscapes",
    description: "Landscape photo collection",
    src: `${require("../images/photography/six-shooter-sunset.jpg")}`,
    images:  [
      {
        img: `${require("../images/photography/six-shooter-sunset.jpg")}`,
        title: "Six Shooter Sunset",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/alki-beach.jpg")}`,
        title: "Alki Beach",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/iccle-creek.jpg")}`,
        title:  "Iccle Creek",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/ancestrial-pueblo.jpg")}`,
        title: "Ancestral Pueblo View",
        rows: 1,
        cols: 1,
      },
    
      {
        img: `${require("../images/photography/crow.jpg")}`,
        title: "Migration",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/rim-rock.jpg")}`,
        title: "Rim Rock Lake",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/tieton-south-fork-1.jpg")}`,
        title:  "South Fork Tieton River",
        rows: 2,
        cols: 2,
      },
      {
        img: `${require("../images/photography/tieton-south-fork-2.jpg")}`,
        title: "Ancestral Pueblo View",
        rows: 1,
        cols: 1,
      },
    ]
  },
  {
    name: "action",
    description: "Action photo collection",
    src: `${require("../images/photography/city-photo-1.jpg")}`,
    images:  [
      {
        img: `${require("../images/photography/six-shooter-sunset.jpg")}`,
        title: "Six Shooter Sunset",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/alki-beach.jpg")}`,
        title: "Alki Beach",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/iccle-creek.jpg")}`,
        title:  "Iccle Creek",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/ancestrial-pueblo.jpg")}`,
        title: "Ancestral Pueblo View",
        rows: 1,
        cols: 1,
      },
    
      {
        img: `${require("../images/photography/crow.jpg")}`,
        title: "Migration",
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/rim-rock.jpg")}`,
        title: "Rim Rock Lake",                     
        rows: 1,
        cols: 1,
      },
      {
        img: `${require("../images/photography/tieton-south-fork-1.jpg")}`,
        title:  "South Fork Tieton River",
        rows: 2,
        cols: 2,
      },
      {
        img: `${require("../images/photography/tieton-south-fork-2.jpg")}`,
        title: "Ancestral Pueblo View",
        rows: 1,
        cols: 1,
      },
    ]  
  }
];


export default function Photography() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleAlbumView = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  return (
    <Grid container component="main">
        <Box sx={{ flexGrow: 1 }}>
          <Grid item component={Container} sx={{ py: 8 }} maxWidth="md">
            <Grid container spacing={4}>
              {albums.map((card) => (
                <Grid item key={card.name} xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia component="div"
                      sx={{pt: '80%'}}
                      image={card.src}
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
                      <Button href={"photography/" + card.name} variant="outlined" onClick={handleAlbumView}>View</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Box>
    </Grid>
  );
}


