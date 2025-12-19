import * as React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { Link } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';


const pages = [
  { name: "CV", path: "/cv" },
  { name: "Climbing", path: "/climbing" },
  { name: "Photography", path: "/photography" },
];

export default function Header() {
  const { mode, toggleTheme } = useTheme();

  return (
    <AppBar position="static">
      <Toolbar sx={{ padding: "0 20px", gap: 2 }}>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <Stack direction="row" spacing={4}>
            {pages.map(({ name, path }) => (
              <Button
                key={name}
                size="large"
                sx={{ color: 'white', fontSize: "1.2rem" }}
                component={Link}
                to={path}
                aria-label={'Go to ' + name}
              >
                {name}
              </Button>
            ))}
          </Stack>
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton color="inherit" onClick={toggleTheme} aria-label="Toggle color theme">
              {mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
