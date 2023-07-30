import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const pages = ["Photography", "CV", "Climbing", "Contact"];

export default function Header() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
          <Toolbar>
            {pages.map((page) => (
              <Button
                key={page}
                size="large"
                sx={{color: 'white', display: 'block' }}
                href={page.toLowerCase()}
                aria-label={'Go to ' + page}
              >
                {page}
              </Button>
            ))}
          </Toolbar>
      </AppBar>
    </Box>
  );
}
