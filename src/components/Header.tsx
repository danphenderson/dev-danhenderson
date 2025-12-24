import * as React from 'react'
import { keyframes } from '@emotion/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Avatar, Box, Button, IconButton, Popover, Stack, Tooltip, Typography } from '@mui/material';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { Link, useLocation } from 'react-router-dom';
import { useTheme as useAppTheme } from '../ThemeProvider';
import { avatar as avatarSrc } from '../data/cv';
import { useWelcomeAudio } from '../WelcomeAudioProvider';


const pages = [
  { name: "CV", path: "/cv" },
  { name: "Climbing", path: "/climbing" },
  { name: "Photography", path: "/photography" },
];

const pulseRing = keyframes`
  0% {
    transform: scale(0.85);
    opacity: 0.9;
  }
  70% {
    transform: scale(1.4);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

export default function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const { isPlaying, pause, play, ready, showPauseHint, setShowPauseHint, showDarkModeHint, setShowDarkModeHint } =
    useWelcomeAudio();
  const path = location.pathname.toLowerCase();
  const showAvatar = path.startsWith('/cv') || path.startsWith('/climbing') || path.startsWith('/photography');
  const headerIconSx = { fontSize: 30 };
  const pauseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeRingColor = alpha(muiTheme.palette.primary.light, 0.9);
  const themeGlowColor = alpha(muiTheme.palette.primary.main, 0.35);
  const pauseHighlightSx = showPauseHint
    ? {
        position: 'relative',
        overflow: 'visible',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: '2px solid rgba(255, 179, 128, 0.95)',
          animation: `${pulseRing} 1.6s ease-out infinite`,
          pointerEvents: 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          boxShadow: '0 0 0 3px rgba(255, 179, 128, 0.35)',
          pointerEvents: 'none',
        },
      }
    : {};
  const themeHighlightSx = showDarkModeHint
    ? {
        position: 'relative',
        overflow: 'visible',
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: -6,
          borderRadius: '50%',
          border: `2px solid ${themeRingColor}`,
          animation: `${pulseRing} 1.6s ease-out infinite`,
          pointerEvents: 'none',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          boxShadow: `0 0 0 3px ${themeGlowColor}`,
          pointerEvents: 'none',
        },
      }
    : {};

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
                  ref={pauseButtonRef}
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
                  aria-describedby={showPauseHint ? 'pause-audio-popover' : undefined}
                  disabled={!ready}
                  sx={{ mr: 0.625, ...pauseHighlightSx }}
                >
                  {isPlaying ? <PauseCircleOutlineIcon sx={headerIconSx} /> : <PlayCircleOutlineIcon sx={headerIconSx} />}
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}>
              <IconButton
                color="inherit"
                size="large"
                ref={themeButtonRef}
                onClick={() => {
                  if (showDarkModeHint) {
                    setShowDarkModeHint(false);
                  }
                  toggleTheme();
                }}
                aria-label="Toggle color theme"
                aria-describedby={showDarkModeHint ? 'dark-mode-popover' : undefined}
                sx={themeHighlightSx}
              >
                {mode === 'light' ? <DarkModeOutlinedIcon sx={headerIconSx} /> : <LightModeOutlinedIcon sx={headerIconSx} />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        <Popover
          id="pause-audio-popover"
          open={showPauseHint && Boolean(pauseButtonRef.current)}
          anchorEl={pauseButtonRef.current}
          onClose={() => setShowPauseHint(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableRestoreFocus
          PaperProps={{
            sx: {
              p: 2,
              maxWidth: 240,
              borderRadius: 2,
              boxShadow: 6,
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Pause anytime
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Use this pause button in the header to stop the welcome audio whenever you want.
          </Typography>
          <Button onClick={() => setShowPauseHint(false)} variant="contained" size="small">
            Okay
          </Button>
        </Popover>
        <Popover
          id="dark-mode-popover"
          open={showDarkModeHint && Boolean(themeButtonRef.current)}
          anchorEl={themeButtonRef.current}
          onClose={() => setShowDarkModeHint(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          disableRestoreFocus
          PaperProps={{
            sx: {
              p: 2,
              maxWidth: 240,
              borderRadius: 2,
              boxShadow: 6,
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Try dark mode
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            Tap this button to switch between light and dark themes.
          </Typography>
          <Button onClick={() => setShowDarkModeHint(false)} variant="contained" size="small">
            Okay
          </Button>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};
