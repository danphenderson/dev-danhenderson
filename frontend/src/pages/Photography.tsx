import React from "react";
import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import {ImageList, ImageListItem, ImageListItemBar, Link} from "@mui/material";
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
      },
      {
        img: `${require("../images/photography/alki-beach.jpg")}`,
        title: "Alki Beach",
      },
      {
        img: `${require("../images/photography/iccle-creek.jpg")}`,
        title:  "Iccle Creek",
      },
      {
        img: `${require("../images/photography/ancestrial-pueblo.jpg")}`,
        title: "Ancestral Pueblo View",
      },
      {
        img: `${require("../images/photography/crow.jpg")}`,
        title: "Migration",
      },
      {
        img: `${require("../images/photography/rim-rock.jpg")}`,
        title: "Rim Rock Lake",
      },
      {
        img: `${require("../images/photography/tieton-south-fork-1.jpg")}`,
        title:  "South Fork Tieton River",
      },
      {
        img: `${require("../images/photography/tieton-south-fork-2.jpg")}`,
        title: "Ancestral Pueblo View",
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
      },
      {
        img: `${require("../images/photography/alki-beach.jpg")}`,
        title: "Alki Beach",
      },
      {
        img: `${require("../images/photography/iccle-creek.jpg")}`,
        title:  "Iccle Creek",
      },
      {
        img: `${require("../images/photography/ancestrial-pueblo.jpg")}`,
        title: "Ancestral Pueblo View",
      },
      {
        img: `${require("../images/photography/crow.jpg")}`,
        title: "Migration",
      },
      {
        img: `${require("../images/photography/rim-rock.jpg")}`,
        title: "Rim Rock Lake",
      },
      {
        img: `${require("../images/photography/tieton-south-fork-1.jpg")}`,
        title:  "South Fork Tieton River",
      },
      {
        img: `${require("../images/photography/tieton-south-fork-2.jpg")}`,
        title: "Ancestral Pueblo View",
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
            {/* End hero unit */}
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
                      <Button variant="outlined" onClick={handleAlbumView}>View</Button>
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