import * as React from 'react'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Avatar, Box, Button, IconButton, Stack, Tooltip } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../ThemeProvider';
import { avatar as avatarSrc } from '../data/cv';
import { useWelcomeAudio } from '../WelcomeAudioProvider';


const pages = [
  { name: "CV", path: "/cv" },
  { name: "Climbing", path: "/climbing" },
  { name: "Photography", path: "/photography" },
];

export default function Header() {
  const { mode, toggleTheme } = useTheme();
  const location = useLocation();
  const { isPlaying, pause, play, ready } = useWelcomeAudio();
  const path = location.pathname.toLowerCase();
  const showAvatar = path.startsWith('/cv') || path.startsWith('/climbing') || path.startsWith('/photography');
  const headerIconSx = { fontSize: 30 };

  return (
    <AppBar position="static">
      <Toolbar sx={{ padding: "0 25px", gap: 2.5, minHeight: 80 }}>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
          {showAvatar && (
            <Tooltip title="Back to home">
              <IconButton
                component={Link}
                to="/"
                color="inherit"
                aria-label="Go to home"
                sx={{ p: 0.625 }}
              >
                <Avatar
                  src={avatarSrc}
                  alt="Daniel Henderson"
                  sx={{ width: 50, height: 50, border: '2.5px solid rgba(255,255,255,0.8)' }}
                />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
          <Stack direction="row" spacing={5}>
            {pages.map(({ name, path }) => (
              <Button
                key={name}
                size="large"
                sx={{ color: 'white', fontSize: "1.5rem" }}
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
          <Stack direction="row" spacing={2} alignItems="center">
            <Tooltip title={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}>
              <span>
                <IconButton
                  color="inherit"
                  size="large"
                  onClick={async () => {
                    if (isPlaying) {
                      pause();
                      return;
                    }
                    try {
                      await play();
                    } catch (err) {
                      console.error('Unable to play welcome audio', err);
                    }
                  }}
                  aria-label={isPlaying ? 'Pause welcome audio' : 'Play welcome audio'}
                  disabled={!ready}
                  sx={{ mr: 0.625 }}
                >
                  {isPlaying ? <PauseCircleOutlineIcon sx={headerIconSx} /> : <PlayCircleOutlineIcon sx={headerIconSx} />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton color="inherit" size="large" onClick={toggleTheme} aria-label="Toggle color theme">
                {mode === 'light' ? <DarkModeOutlinedIcon sx={headerIconSx} /> : <LightModeOutlinedIcon sx={headerIconSx} />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
