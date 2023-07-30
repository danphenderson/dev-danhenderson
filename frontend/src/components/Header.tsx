import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import {GitHub, LinkedIn, Mail} from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';

const pages = ["Photography", "CV", "Climbing", "Contact"];
const avatar = "./assets/home.jpg";



export default function Header() {

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0
            }}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <Mail fontSize="small" />
              </ListItemIcon>
              <a href="mailto:me@danhenderson.dev">Gmail</a>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <LinkedIn fontSize="small" />
              </ListItemIcon>
              <a href="https://www.linkedin.com/in/daniel-henderson-6a9485bb/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <GitHub fontSize="small" />
              </ListItemIcon>
              <a href="https://github.com/danphenderson" target="_blank" rel="noopener noreferrer">GitHub</a>
            </MenuItem>
          </Menu>
          <IconButton edge="start"  aria-label="avatar" onClick={handleMenu}>
            <Avatar src={avatar} sx={{ width: 60, height: 60, margin: "0 auto 20px" }} />
          </IconButton>
          <Stack direction="row" spacing={4}>
            {
              pages.map((page) => (
                <Button
                  key={page}
                  size="large"
                  sx={{color: 'white', display: 'block' }}
                  href={page.toLowerCase()}
                  aria-label={'Go to ' + page}
                >
                  {page}
                </Button>
             ))
            }
          </Stack>       
        </Toolbar>
      </AppBar>
    </Box>
  );
}
