import * as React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';


const pages = [
  { name: "CV", path: "/cv" },
  { name: "Climbing", path: "/climbing" },
  { name: "Photography", path: "/photography" },
];

const avatar = "./assets/home.jpg";

export default function Header() {

  return (
      <AppBar position="static">
        <Toolbar sx={{ justifyContent: "space-between", padding: "0 20px" }}>
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Stack direction="row" spacing={4}>
              {
                pages.map(({ name, path }) => (
                  <Button
                    key={name}
                    size="large"
                    sx={{color: 'white', fontSize: "1.2rem" }}
                    component={Link}
                    to={path}
                    aria-label={'Go to ' + name}
                  >
                    {name}
                  </Button>
               ))
              }
            </Stack>
          </Box>
        </Toolbar>
      </AppBar>
  );
};
