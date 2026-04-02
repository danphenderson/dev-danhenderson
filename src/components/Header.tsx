import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Box, Slide } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';
import { primaryNavigationRoutes } from '../constants/siteRoutes';
import { useAppTheme } from '../ThemeProvider';
import { useMotionScale } from '../motion';
import { avatar as avatarSrc } from '../data/cv';
import { useAppStyles } from '../styles/appStyles';
import { SPRING_EASING_CSS } from '../styles/springEasing';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';
import { HEADER_HIDE_SCROLL_TRIGGER_OPTIONS } from './header/headerScroll';
import { HeaderNav } from './header/HeaderNav';
import { HeaderSettingsPopover } from './header/HeaderSettingsPopover';

const SLIDE_BASE_ENTER_MS = 225;
const SLIDE_BASE_EXIT_MS = 195;

const HideOnScroll = ({ children }: { children: React.ReactElement }) => {
  const trigger = useScrollTrigger(HEADER_HIDE_SCROLL_TRIGGER_OPTIONS);
  const { duration: dFactor } = useMotionScale();
  const timeout =
    dFactor === 0
      ? 0
      : {
          enter: Math.round(SLIDE_BASE_ENTER_MS * dFactor),
          exit: Math.round(SLIDE_BASE_EXIT_MS * dFactor),
        };

  return (
    <Slide
      appear={false}
      direction="down"
      in={!trigger}
      timeout={timeout}
      easing={{ enter: SPRING_EASING_CSS, exit: undefined }}
    >
      {children}
    </Slide>
  );
};

export default function Header() {
  const {
    mode,
    appearance,
    motionIntensity,
    effectiveMotionIntensity,
    isSystemMotionOverrideActive,
    setAppearance,
    setMotionIntensity,
    toggleTheme,
  } = useAppTheme();
  const appStyles = useAppStyles();
  const muiTheme = useMuiTheme();
  const location = useLocation();
  const { isPlaying, pause, play, audioConsent } = useWelcomeAudio();
  const { onboardingCompleted, showSettingsHint } = useWelcomeOnboarding();
  const path = location.pathname.toLowerCase();
  const highlightSettingsTrigger = path === '/' && showSettingsHint;
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const iconButtonSize = isMobile ? 'medium' : ('large' as const);
  const [mobileMenuAnchor, setMobileMenuAnchor] = React.useState<null | HTMLElement>(null);
  const mobileMenuOpen = Boolean(mobileMenuAnchor);

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
              <HeaderSettingsPopover
                mode={mode}
                onToggleTheme={toggleTheme}
                appearance={appearance}
                onChangeAppearance={setAppearance}
                motionIntensity={motionIntensity}
                effectiveMotionIntensity={effectiveMotionIntensity}
                isSystemMotionOverrideActive={isSystemMotionOverrideActive}
                onChangeMotionIntensity={setMotionIntensity}
                showAudioControl={audioConsent === 'granted' || onboardingCompleted}
                isPlaying={isPlaying}
                onToggleAudio={handleAudioToggle}
                highlightSettingsTrigger={highlightSettingsTrigger}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar data-testid="header-offset" sx={appStyles.headerOffsetToolbarSx} />
    </>
  );
}
