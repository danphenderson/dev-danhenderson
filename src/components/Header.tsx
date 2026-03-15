import * as React from 'react';
import { keyframes } from '@emotion/react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Slide } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { primaryNavigationRoutes } from '../constants/siteRoutes';
import { useAppTheme } from '../ThemeProvider';
import { avatar as avatarSrc } from '../data/cv';
import { useAppStyles } from '../styles/appStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';
import { HeaderActions } from './header/HeaderActions';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from './header/headerScroll';
import { HeaderNav } from './header/HeaderNav';
import { HintPopover } from './header/HintPopover';

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
  const trigger = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);

  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
      easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
    >
      {children}
    </Slide>
  );
};

export default function Header() {
  const { mode, appearance, setAppearance, toggleTheme } = useAppTheme();
  const appStyles = useAppStyles();
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const { isPlaying, pause, play, audioConsent } = useWelcomeAudio();
  const { showPauseHint, dismissPauseHint, showDarkModeHint, dismissDarkModeHint } =
    useWelcomeOnboarding();
  const path = location.pathname.toLowerCase();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const iconButtonSize = isMobile ? 'medium' : ('large' as const);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);
  const pauseButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const appearanceDialRef = React.useRef<HTMLElement | null>(null);
  const themeHintTitle = 'Try an alternative theme';
  const themeHintBody =
    'Open this palette menu to switch theme and toggle between light and dark mode.';
  const pauseHighlightSx = showPauseHint
    ? appStyles.getHeaderHighlightSx('secondary', `${pulseRing} 1.6s ease-out infinite`)
    : {};
  const themeHighlightSx = showDarkModeHint
    ? appStyles.getHeaderHighlightSx('primary', `${pulseRing} 1.6s ease-out infinite`)
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
      dismissDarkModeHint();
    }
    toggleTheme();
  };

  const appearanceDial = {
    appearance,
    mode,
    onChangeAppearance: setAppearance,
    onToggleTheme: handleThemeToggle,
    controlRef: appearanceDialRef,
    triggerDescriptionId: showDarkModeHint ? 'dark-mode-popover' : undefined,
    triggerHighlightSx: themeHighlightSx,
  };

  return (
    <>
      <HideOnScroll>
        <AppBar id="site-navigation" position="fixed" elevation={0}>
          <Toolbar sx={appStyles.headerToolbarSx}>
            <HeaderNav
              pages={primaryNavigationRoutes}
              currentPath={path}
              isMobile={isMobile}
              iconButtonSize={iconButtonSize}
              headerIconSx={appStyles.headerIconSx}
              avatarSrc={avatarSrc}
              mobileMenuOpen={mobileMenuOpen}
              mobileMenuAnchor={mobileMenuAnchor}
              onMobileMenuOpen={handleMobileMenuOpen}
              onMobileMenuClose={handleMobileMenuClose}
            />
            <Box sx={appStyles.headerActionsContainerSx}>
              <HeaderActions
                iconButtonSize={iconButtonSize}
                headerIconSx={appStyles.headerIconSx}
                showAudioControl={audioConsent !== 'declined'}
                isPlaying={isPlaying}
                onToggleAudio={handleAudioToggle}
                pauseButtonRef={pauseButtonRef}
                showPauseHint={showPauseHint}
                pauseHighlightSx={pauseHighlightSx}
                appearanceDial={appearanceDial}
              />
            </Box>
            <HintPopover
              id="pause-audio-popover"
              open={showPauseHint && Boolean(pauseButtonRef.current)}
              anchorEl={pauseButtonRef.current}
              onClose={dismissPauseHint}
              title="Pause anytime"
              body="Use this pause button in the header to stop the welcome audio whenever you want."
            />
            <HintPopover
              id="dark-mode-popover"
              open={showDarkModeHint && Boolean(appearanceDialRef.current)}
              anchorEl={appearanceDialRef.current}
              onClose={dismissDarkModeHint}
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
