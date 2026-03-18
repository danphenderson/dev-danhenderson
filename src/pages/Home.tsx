import { useCallback, useEffect, useRef, useState, type PointerEventHandler } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { motion, useDragControls, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { AnimatedContentCard } from '../components/AnimatedContentCard';
import BackgroundPaper from '../components/BackgroundPaper';
import { HeroMotionPath } from '../components/HeroMotionPath';
import { TerminalHeroContent } from '../components/TerminalHeroContent';
import type { IdeWindowState, TerminalLine } from '../types/ui';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';
import { MotionTiltCard } from '../motion';
import { VSCODE_COLORS, VSCODE_WINDOW_RADIUS } from '../components/ide/vscodeTokens';

const heroLines: TerminalLine[] = [
  { command: 'node --version', output: 'v22.14.0' },
  { command: 'git log --oneline -1', output: '9ab2238 polish: terminal UI chrome' },
  { command: 'npm run build', output: '\u2713 Compiled successfully in 2.4s' },
  { command: 'whoami --passions', output: 'mathematics \u00b7 computers \u00b7 adventures' },
  {
    command: 'for cmd ({julia,python,node}) $cmd --version',
    output: 'julia version 1.10.10\nPython 3.14.3\nv22.14.0',
  },
  {
    command: 'brew ls',
    output:
      '==> Formulae\nopenssl\npipenv\npre-commit\npyenv\npython@3.14\ngitsqlite\ngit-extras\njuliaup\n\n==> Casks\ncodex   iterm2  mactex',
  },
];

export default function Home() {
  const appStyles = useAppStyles();
  const { cardResetSx } = useComponentStyles();
  useDocumentMetadata({ ...siteRouteMap.home, canonicalPath: siteRouteMap.home.path });
  const { error, isHeroAnimationReady, isLoading, isPromptOpen, handleOptOut, handlePlay } =
    useHomeWelcomeSequence();
  const [isTypewriterPlaying, setIsTypewriterPlaying] = useState(false);
  const [canDragHeroWindow, setCanDragHeroWindow] = useState(false);
  const [isHeroWindowDragging, setIsHeroWindowDragging] = useState(false);
  const [ideWindowState, setIdeWindowState] = useState<IdeWindowState>('normal');
  // Close and minimize intentionally reopen a fresh IDE session on restore.
  const [ideSessionKey, setIdeSessionKey] = useState(0);

  const heroRef = useRef<HTMLDivElement>(null);
  const heroBoundsRef = useRef<HTMLDivElement>(null);
  const heroDragControls = useDragControls();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }

    const mediaQueryList = window.matchMedia('(hover: hover) and (pointer: fine)');

    const updateCanDragHeroWindow = () => {
      setCanDragHeroWindow(mediaQueryList.matches);
    };

    updateCanDragHeroWindow();

    if (typeof mediaQueryList.addEventListener === 'function') {
      mediaQueryList.addEventListener('change', updateCanDragHeroWindow);
      return () => mediaQueryList.removeEventListener('change', updateCanDragHeroWindow);
    }

    mediaQueryList.addListener(updateCanDragHeroWindow);
    return () => mediaQueryList.removeListener(updateCanDragHeroWindow);
  }, []);

  const handleMotionComplete = useCallback(() => {
    setIsTypewriterPlaying(true);
  }, []);

  const windowDragEnabled = canDragHeroWindow && isTypewriterPlaying;

  const handleTitleBarPointerDown = useCallback<PointerEventHandler<HTMLDivElement>>(
    (event) => {
      if (!windowDragEnabled || event.button !== 0) {
        return;
      }

      heroDragControls.start(event);
    },
    [heroDragControls, windowDragEnabled]
  );

  const handleHeroDragStart = useCallback(() => {
    setIsHeroWindowDragging(true);
  }, []);

  const handleHeroDragEnd = useCallback(() => {
    setIsHeroWindowDragging(false);
  }, []);

  const queueFreshIdeSession = useCallback(() => {
    setIdeSessionKey((prev) => prev + 1);
  }, []);

  const handleIdeClose = useCallback(() => {
    queueFreshIdeSession();
    setIdeWindowState('closed');
  }, [queueFreshIdeSession]);

  const handleIdeMinimize = useCallback(() => {
    queueFreshIdeSession();
    setIdeWindowState('minimized');
  }, [queueFreshIdeSession]);

  const handleIdeExpand = useCallback(() => {
    setIdeWindowState((prev) => (prev === 'expanded' ? 'normal' : 'expanded'));
  }, []);

  const handleIdeRestore = useCallback(() => {
    setIdeWindowState('normal');
  }, []);

  const ideVisible = ideWindowState !== 'closed' && ideWindowState !== 'minimized';

  return (
    <>
      <motion.div ref={heroRef} style={{ scale: heroScale, opacity: heroOpacity }}>
        <BackgroundPaper
          contentRef={heroBoundsRef}
          image="assets/home.jpg"
          contentAlign="flex-end"
          contentSx={appStyles.homeHeroContentSx}
          showShell={isHeroAnimationReady}
          shellSx={appStyles.homeHeroShellSx}
          shellWrapper={(shell) => (
            <HeroMotionPath active={isHeroAnimationReady} onComplete={handleMotionComplete}>
              <motion.div
                data-testid="home-hero-window"
                data-session-key={String(ideSessionKey)}
                drag={windowDragEnabled && ideWindowState === 'normal'}
                dragConstraints={heroBoundsRef}
                dragControls={heroDragControls}
                dragElastic={0}
                dragListener={false}
                dragMomentum={false}
                onDragEnd={handleHeroDragEnd}
                onDragStart={handleHeroDragStart}
                style={{
                  display: 'inline-block',
                  maxWidth: '100%',
                  width: ideWindowState === 'expanded' ? '100%' : undefined,
                }}
              >
                <AnimatePresence mode="wait">
                  {ideVisible && (
                    <motion.div
                      key={`ide-window-${ideSessionKey}`}
                      initial={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {shell}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </HeroMotionPath>
          )}
        >
          <MotionTiltCard
            disabled={isHeroWindowDragging || ideWindowState === 'expanded'}
            intensity={0.7}
          >
            <AnimatedContentCard sx={cardResetSx} visible={isHeroAnimationReady}>
              {isHeroAnimationReady ? (
                <TerminalHeroContent
                  key={ideSessionKey}
                  lines={heroLines}
                  onWindowDragPointerDown={handleTitleBarPointerDown}
                  playing={isTypewriterPlaying}
                  windowDragEnabled={windowDragEnabled}
                  windowDragging={isHeroWindowDragging}
                  onClose={handleIdeClose}
                  onMinimize={handleIdeMinimize}
                  onExpand={handleIdeExpand}
                  sx={ideWindowState === 'expanded' ? { width: '100%' } : undefined}
                />
              ) : null}
            </AnimatedContentCard>
          </MotionTiltCard>

          <Dialog open={isPromptOpen} onClose={handleOptOut} aria-labelledby="welcome-audio-title">
            <DialogTitle id="welcome-audio-title">Play welcome audio?</DialogTitle>
            <DialogContent>
              <Typography variant="body1">
                Would you like to hear a short verse while browsing the site? Use the pause button
                in the header to stop it anytime.
              </Typography>
              {error && (
                <Typography variant="caption" color="error">
                  {error}
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOptOut} autoFocus>
                No thanks
              </Button>
              <Button
                onClick={handlePlay}
                variant="contained"
                disabled={isLoading}
                aria-label="Play welcome audio"
              >
                {isLoading ? 'Loading…' : 'Play audio'}
              </Button>
            </DialogActions>
          </Dialog>
        </BackgroundPaper>
      </motion.div>

      {/* Restore controls — visible when IDE is closed or minimized */}
      <AnimatePresence>
        {ideWindowState === 'closed' && (
          <motion.div
            key="ide-restore-icon"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10 }}
          >
            <Tooltip title="Open Visual Studio Code" placement="left">
              <IconButton
                data-testid="ide-restore-button"
                onClick={handleIdeRestore}
                aria-label="Open Visual Studio Code"
                sx={{
                  width: 48,
                  height: 48,
                  backgroundColor: VSCODE_COLORS.statusBarBg,
                  color: '#fff',
                  borderRadius: `${VSCODE_WINDOW_RADIUS}px`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  '&:hover': { backgroundColor: '#005a9e' },
                }}
              >
                {/* VS Code-style icon: simplified editor icon */}
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  sx={{ width: 24, height: 24, fill: 'currentColor' }}
                >
                  <path d="M17 2H7c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 18H7V4h10v16zM8 6h3v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z" />
                </Box>
              </IconButton>
            </Tooltip>
          </motion.div>
        )}

        {ideWindowState === 'minimized' && (
          <motion.div
            key="ide-minimized-bar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10 }}
          >
            <Tooltip title="Restore window" placement="left">
              <Box
                data-testid="ide-minimized-bar"
                role="button"
                tabIndex={0}
                onClick={handleIdeRestore}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleIdeRestore();
                  }
                }}
                aria-label="Restore window"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 2,
                  py: 0.75,
                  backgroundColor: VSCODE_COLORS.titleBarBg,
                  borderRadius: `${VSCODE_WINDOW_RADIUS}px`,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  cursor: 'pointer',
                  userSelect: 'none',
                  transition: 'background-color 0.12s',
                  '&:hover': { backgroundColor: '#3c3c3d' },
                }}
              >
                {/* Mini traffic dots */}
                <Box sx={{ display: 'flex', gap: '4px' }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: VSCODE_COLORS.dotRed,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: VSCODE_COLORS.dotYellow,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: VSCODE_COLORS.dotGreen,
                    }}
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: VSCODE_COLORS.foreground,
                    fontSize: '0.7rem',
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                  }}
                >
                  dev-danhenderson
                </Typography>
              </Box>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
