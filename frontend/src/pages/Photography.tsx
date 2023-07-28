import { Box, Typography, Grid, Container, Paper } from "@mui/material";
import {QuiltedImageList, TitledImageList } from '../components/ImageLists';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


const albums = [
  {
    name: "landscapes",
    description: "Landscape photo collection",
    images: [
    ]
  },
  {
    name: "action",
    description: "Action photo collection",
    images: [
    ]
  }
];
export default function Photography() {
  return (
    <Grid container component="main">
        <Box sx={{ flexGrow: 1 }}>
          <Grid item component={Container} sx={{ py: 8 }} maxWidth="md">
            {/* End hero unit */}
            <Grid container spacing={4}>
              {albums.map((card) => (
                <Grid item key={card.name} xs={12} sm={6} md={4}>
                  <Card
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardMedia component="div"
                      sx={{pt: '56.25%'}}
                      image="https://source.unsplash.com/random?wallpapers"
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
                      <Button size="small">View</Button>
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