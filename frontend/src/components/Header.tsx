import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import { ConnectWithoutContactOutlined, GitHub, LinkedIn, Mail } from '@mui/icons-material';
import { Box, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';

const pages = [
  { name: "CV", path: "/cv" },
  { name: "Photography", path: "/photography" },
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
        <Toolbar sx={{ justifyContent: "space-between", padding: "0 20px" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-describedby="Menu for profile links"
              onClick={handleMenu}
              sx={{justifyContent: "center"}}
            >
            <Avatar src={avatar} sx={{ p: 2, width: 80, height: 80 }} />
            </IconButton>
          </Box>
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
                <a href={href} target={newTab ? "_blank" : "_self"} rel={newTab ? "noopener noreferrer" : ""} style={{ color: '#333' }}>
                  {text}
                </a>
              </MenuItem>
            ))}
          </Menu>       
        </Toolbar>
      </AppBar>
    </Box>
  );
};