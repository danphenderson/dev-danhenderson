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
import ThemeToggleButton from './Admin';


const pages = [
  { name: "Home", path: "/" },
  { name: "CV", path: "/cv" },
  { name: "Photography", path: "/photography" },
  { name: "Climbing", path: "/climbing" },
];
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