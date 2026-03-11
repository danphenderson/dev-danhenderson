import * as React from 'react';
import { keyframes } from '@emotion/react';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined';
import TerrainIcon from '@mui/icons-material/Terrain';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Slide } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { useAppTheme } from '../ThemeProvider';
import { avatar as avatarSrc } from '../data/cv';
import { useAppStyles } from '../styles/appStyles';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import type { AppSpeedDialAction } from './AppSpeedDial';
import { HeaderActions } from './header/HeaderActions';
import { HeaderNav } from './header/HeaderNav';
import { HeaderPageDial } from './header/HeaderPageDial';
import { HintPopover } from './header/HintPopover';

const pages = [
  { name: 'CV', path: '/cv' },
  { name: 'Climbing', path: '/climbing' },
  { name: 'Photography', path: '/photography' },
];

type HeaderPageDialMode = 'cv' | 'climbing' | 'photography';

const pageDialActionsByMode: Record<HeaderPageDialMode, AppSpeedDialAction[]> = {
  cv: [
    {
      id: 'climbing',
      label: 'Climbing',
      icon: <TerrainIcon fontSize="small" />,
      to: '/climbing',
    },
    {
      id: 'photography',
      label: 'Photography',
      icon: <PhotoCameraOutlinedIcon fontSize="small" />,
      to: '/photography',
    },
    {
      id: 'home',
      label: 'Home',
      icon: <HomeOutlinedIcon fontSize="small" />,
      to: '/',
    },
  ],
  climbing: [
    {
      id: 'cv',
      label: 'CV',
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      to: '/cv',
    },
    {
      id: 'photography',
      label: 'Photography',
      icon: <PhotoCameraOutlinedIcon fontSize="small" />,
      to: '/photography',
    },
    {
      id: 'home',
      label: 'Home',
      icon: <HomeOutlinedIcon fontSize="small" />,
      to: '/',
    },
  ],
  photography: [
    {
      id: 'cv',
      label: 'CV',
      icon: <DescriptionOutlinedIcon fontSize="small" />,
      to: '/cv',
    },
    {
      id: 'climbing',
      label: 'Climbing',
      icon: <TerrainIcon fontSize="small" />,
      to: '/climbing',
    },
    {
      id: 'home',
      label: 'Home',
      icon: <HomeOutlinedIcon fontSize="small" />,
      to: '/',
    },
  ],
};

const getHeaderPageDialMode = (path: string): HeaderPageDialMode | null => {
  if (path.startsWith('/cv')) {
    return 'cv';
  }
  if (path.startsWith('/climbing')) {
    return 'climbing';
  }
  if (path.startsWith('/photography')) {
    return 'photography';
  }

  return null;
};

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
  const appStyles = useAppStyles();
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
  const pageDialMode = getHeaderPageDialMode(path);
  const showPageDial = Boolean(pageDialMode);
  const pageDialActions = pageDialMode ? pageDialActionsByMode[pageDialMode] : [];
  const showNavigationLinks = !showPageDial;
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const iconButtonSize = isMobile ? 'medium' : ('large' as const);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const pauseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const themeHintTitle = mode === 'dark' ? 'Try light mode' : 'Try dark mode';
  const themeHintBody =
    mode === 'dark'
      ? 'Tap this button to switch back to light mode.'
      : 'Tap this button to switch to dark mode.';
  const pauseHighlightSx = showPauseHint
    ? appStyles.getHeaderHighlightSx('secondary', `${pulseRing} 1.6s ease-out infinite`)
    : {};
  const themeHighlightSx = showDarkModeHint
    ? appStyles.getHeaderHighlightSx('primary', `${pulseRing} 1.6s ease-out infinite`)
    : {};

  React.useEffect(() => {
    if ((!isMobile || !showNavigationLinks) && mobileMenuOpen) {
      setMobileMenuAnchor(null);
    }
  }, [isMobile, mobileMenuOpen, showNavigationLinks]);

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
          <Toolbar sx={appStyles.headerToolbarSx}>
            <HeaderNav
              pages={pages}
              showNavigationLinks={showNavigationLinks}
              isMobile={isMobile}
              iconButtonSize={iconButtonSize}
              headerIconSx={appStyles.headerIconSx}
              mobileMenuOpen={mobileMenuOpen}
              mobileMenuAnchor={mobileMenuAnchor}
              onMobileMenuOpen={handleMobileMenuOpen}
              onMobileMenuClose={handleMobileMenuClose}
              leftContent={
                showPageDial ? (
                  <HeaderPageDial
                    iconButtonSize={iconButtonSize}
                    avatarSrc={avatarSrc}
                    actions={pageDialActions}
                  />
                ) : null
              }
            />
            <Box sx={appStyles.headerActionsContainerSx}>
              <HeaderActions
                iconButtonSize={iconButtonSize}
                headerIconSx={appStyles.headerIconSx}
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
      <Toolbar sx={appStyles.headerOffsetToolbarSx} />
    </>
  );
}
