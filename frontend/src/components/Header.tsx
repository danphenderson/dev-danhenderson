import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { GitHub, LinkedIn, Mail } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const pages = [
  { name: "Photography", path: "/photography" },
  { name: "CV", path: "/cv" },
  { name: "Climbing", path: "/climbing" },
  { name: "Contact", path: "/contact" },
];
const avatar = "./assets/home.jpg";

const menuItems = [
  {
    icon: <Mail fontSize="small" />,
    text: "Gmail",
    href: "mailto:me@danhenderson.dev",
  },
  {
    icon: <LinkedIn fontSize="small" />,
    text: "LinkedIn",
    href: "https://www.linkedin.com/in/daniel-henderson-6a9485bb/",
    newTab: true,
  },
  {
    icon: <GitHub fontSize="small" />,
    text: "GitHub",
    href: "https://github.com/danphenderson",
    newTab: true,
  },
];

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
            {menuItems.map(({ icon, text, href, newTab }, index) => (
              <MenuItem key={index} onClick={handleClose}>
                <ListItemIcon>{icon}</ListItemIcon>
                <a href={href} target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : ""}>
                  {text}
                </a>
              </MenuItem>
            ))}
          </Menu>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            aria-describedby="Menu for profile links"
            onClick={handleMenu}
          >
            <Avatar src={avatar} sx={{ width: 60, height: 60, margin: "0 auto 20px" }} />
          </IconButton>
          <Stack direction="row" spacing={4}>
            {
              pages.map(({ name, path }) => (
                <Button
                  key={name}
                  size="large"
                  sx={{color: 'white', display: 'block' }}
                  component={Link}
                  to={path}
                  aria-label={'Go to ' + name}
                >
                  {name}
                </Button>
             ))
            }
          </Stack>       
        </Toolbar>
      </AppBar>
    </Box>
  );
}