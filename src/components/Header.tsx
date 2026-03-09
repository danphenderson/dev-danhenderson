import * as React from 'react';
import { keyframes } from '@emotion/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Slide } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { alpha, useTheme as useMuiTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useTheme as useAppTheme } from '../ThemeProvider';
import { avatar as avatarSrc } from '../data/cv';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { HeaderActions } from './header/HeaderActions';
import { HeaderNav } from './header/HeaderNav';
import { HintPopover } from './header/HintPopover';

const pages = [
  { name: 'CV', path: '/cv' },
  { name: 'Climbing', path: '/climbing' },
  { name: 'Photography', path: '/photography' },
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

const HideOnScroll = ({ children }: { children: React.ReactElement }) => {
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 80 });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

export default function Header() {
  const { mode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const {
    isPlaying,
    pause,
    play,
    showPauseHint,
    setShowPauseHint,
    showDarkModeHint,
    setShowDarkModeHint,
  } = useWelcomeAudio();
  const path = location.pathname.toLowerCase();
  const showAvatar =
    path.startsWith('/cv') || path.startsWith('/climbing') || path.startsWith('/photography');
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const headerIconSx = { fontSize: { xs: 26, md: 30 } };
  const iconButtonSize = isMobile ? 'medium' : ('large' as const);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const pauseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeRingColor = alpha(muiTheme.palette.primary.light, 0.9);
  const themeGlowColor = alpha(muiTheme.palette.primary.main, 0.35);
  const themeHintTitle = mode === 'dark' ? 'Try light mode' : 'Try dark mode';
  const themeHintBody =
    mode === 'dark'
      ? 'Tap this button to switch back to light mode.'
      : 'Tap this button to switch to dark mode.';
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

  React.useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuAnchor(null);
    }
  }, [isMobile, mobileMenuOpen]);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleAudioToggle = async () => {
    if (isPlaying) {
      pause();
      return;
    }
    try {
      await play();
    } catch (err) {
      console.error('Unable to play welcome audio', err);
    }
  };

  const handleThemeToggle = () => {
    if (showDarkModeHint) {
      setShowDarkModeHint(false);
    }
    toggleTheme();
  };

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" elevation={6}>
          <Toolbar
            sx={{ px: { xs: 1.5, md: 2.5 }, gap: { xs: 1.5, md: 2.5 }, minHeight: { xs: 64, md: 80 } }}
          >
            <HeaderNav
              pages={pages}
              isMobile={isMobile}
              iconButtonSize={iconButtonSize}
              headerIconSx={headerIconSx}
              mobileMenuOpen={mobileMenuOpen}
              mobileMenuAnchor={mobileMenuAnchor}
              onMobileMenuOpen={handleMobileMenuOpen}
              onMobileMenuClose={handleMobileMenuClose}
              leftContent={
                showAvatar ? (
                  <HeaderActions
                    iconButtonSize={iconButtonSize}
                    headerIconSx={headerIconSx}
                    showAvatar
                    avatarSrc={avatarSrc}
                  />
                ) : null
              }
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                flexShrink: 0,
                ml: { xs: 'auto', md: 0 },
              }}
            >
              <HeaderActions
                iconButtonSize={iconButtonSize}
                headerIconSx={headerIconSx}
                showAudioControl
                isPlaying={isPlaying}
                onToggleAudio={handleAudioToggle}
                pauseButtonRef={pauseButtonRef}
                showPauseHint={showPauseHint}
                pauseHighlightSx={pauseHighlightSx}
                showThemeControl
                mode={mode}
                onToggleTheme={handleThemeToggle}
                themeButtonRef={themeButtonRef}
                showDarkModeHint={showDarkModeHint}
                themeHighlightSx={themeHighlightSx}
              />
            </Box>
            <HintPopover
              id="pause-audio-popover"
              open={showPauseHint && Boolean(pauseButtonRef.current)}
              anchorEl={pauseButtonRef.current}
              onClose={() => setShowPauseHint(false)}
              title="Pause anytime"
              body="Use this pause button in the header to stop the welcome audio whenever you want."
            />
            <HintPopover
              id="dark-mode-popover"
              open={showDarkModeHint && Boolean(themeButtonRef.current)}
              anchorEl={themeButtonRef.current}
              onClose={() => setShowDarkModeHint(false)}
              title={themeHintTitle}
              body={themeHintBody}
            />
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar sx={{ minHeight: { xs: 64, md: 80 } }} />
    </>
  );
}
