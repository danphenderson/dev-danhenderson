import { useCallback, useEffect, useRef, useState, type PointerEventHandler } from 'react';
import { createPortal } from 'react-dom';
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
import type { IdeResizeEdge, IdeWindowSize, IdeWindowState, TerminalLine } from '../types/ui';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';
import { MotionTiltCard } from '../motion';
import { VSCODE_COLORS, VSCODE_RESIZE, VSCODE_WINDOW_RADIUS } from '../components/ide/vscodeTokens';

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

type ExpandedIdeViewport = {
  top: number;
  left: number;
  width: number;
  height: number;
};

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
  const [expandedIdeViewport, setExpandedIdeViewport] = useState<ExpandedIdeViewport | null>(null);
  // Close and minimize intentionally reopen a fresh IDE session on restore.
  const [ideSessionKey, setIdeSessionKey] = useState(0);
  const [ideWindowSize, setIdeWindowSize] = useState<IdeWindowSize>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeEdgeRef = useRef<IdeResizeEdge | null>(null);
  const resizeInitialPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const resizeInitialSizeRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

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

  const updateExpandedIdeViewport = useCallback(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    const mainContent = document.getElementById('main-content');

    if (!mainContent) {
      setExpandedIdeViewport({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      });
      return;
    }

    const mainRect = mainContent.getBoundingClientRect();
    const headerRect = document.getElementById('site-navigation')?.getBoundingClientRect();
    const top = Math.max(0, mainRect.top, headerRect?.bottom ?? 0);
    const left = Math.max(0, mainRect.left);
    const visibleRight = Math.min(window.innerWidth, mainRect.right);
    const visibleBottom = Math.min(window.innerHeight, mainRect.bottom);
    const width = Math.max(0, visibleRight - left);
    const height = Math.max(0, visibleBottom - top);

    if (width === 0 || height === 0) {
      setExpandedIdeViewport(null);
      return;
    }

    setExpandedIdeViewport({ top, left, width, height });
  }, []);

  useEffect(() => {
    if (ideWindowState !== 'expanded') {
      setExpandedIdeViewport(null);
      return undefined;
    }

    updateExpandedIdeViewport();

    let frameId: number | null = null;

    const handleViewportChange = () => {
      if (frameId !== null) {
        return;
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateExpandedIdeViewport();
      });
    };

    window.addEventListener('resize', handleViewportChange);
    window.addEventListener('scroll', handleViewportChange, { passive: true });

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('resize', handleViewportChange);
      window.removeEventListener('scroll', handleViewportChange);
    };
  }, [ideWindowState, updateExpandedIdeViewport]);

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
    setIdeWindowSize(null);
  }, [queueFreshIdeSession]);

  const handleIdeMinimize = useCallback(() => {
    queueFreshIdeSession();
    setIdeWindowState('minimized');
    setIdeWindowSize(null);
  }, [queueFreshIdeSession]);

  const handleIdeExpand = useCallback(() => {
    setIdeWindowState((prev) => (prev === 'expanded' ? 'normal' : 'expanded'));
  }, []);

  const handleIdeRestore = useCallback(() => {
    setIdeWindowState('normal');
    setIdeWindowSize(null);
  }, []);

  const ideVisible = ideWindowState !== 'closed' && ideWindowState !== 'minimized';

  const resizeEnabled = canDragHeroWindow && ideWindowState === 'normal' && !isHeroWindowDragging;

  const handleResizeStart = useCallback(
    (edge: IdeResizeEdge, event: React.PointerEvent<HTMLDivElement>) => {
      if (!resizeEnabled) return;

      const heroEl = heroRef.current?.querySelector<HTMLElement>('[data-testid="terminal-hero"]');
      if (!heroEl) return;

      const rect = heroEl.getBoundingClientRect();
      const boundsRect = heroBoundsRef.current?.getBoundingClientRect();
      const startClientX = Number.isFinite(event.clientX) ? event.clientX : rect.right;
      const startClientY = Number.isFinite(event.clientY) ? event.clientY : rect.bottom;
      const maxWidth = Math.max(
        VSCODE_RESIZE.minWidth,
        boundsRect ? boundsRect.right - rect.left : window.innerWidth - rect.left
      );
      const maxHeight = Math.max(
        VSCODE_RESIZE.minHeight,
        boundsRect ? boundsRect.bottom - rect.top : window.innerHeight - rect.top
      );

      resizeEdgeRef.current = edge;
      resizeInitialPointerRef.current = { x: startClientX, y: startClientY };
      resizeInitialSizeRef.current = { width: rect.width, height: rect.height };
      setIsResizing(true);

      const handleMove = (e: PointerEvent) => {
        const currentClientX = Number.isFinite(e.clientX)
          ? e.clientX
          : resizeInitialPointerRef.current.x;
        const currentClientY = Number.isFinite(e.clientY)
          ? e.clientY
          : resizeInitialPointerRef.current.y;
        const dx = currentClientX - resizeInitialPointerRef.current.x;
        const dy = currentClientY - resizeInitialPointerRef.current.y;
        const activeEdge = resizeEdgeRef.current;
        const initial = resizeInitialSizeRef.current;

        let newWidth = initial.width;
        let newHeight = initial.height;

        if (activeEdge === 'right' || activeEdge === 'corner') {
          newWidth = Math.min(Math.max(initial.width + dx, VSCODE_RESIZE.minWidth), maxWidth);
        }
        if (activeEdge === 'bottom' || activeEdge === 'corner') {
          newHeight = Math.min(Math.max(initial.height + dy, VSCODE_RESIZE.minHeight), maxHeight);
        }

        setIdeWindowSize({ width: newWidth, height: newHeight });
      };

      const handleUp = () => {
        document.removeEventListener('pointermove', handleMove);
        document.removeEventListener('pointerup', handleUp);
        setIsResizing(false);
        resizeEdgeRef.current = null;
      };

      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    },
    [resizeEnabled]
  );

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
                drag={windowDragEnabled && ideWindowState === 'normal' && !isResizing}
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
                }}
              >
                <AnimatePresence mode="wait">
                  {ideVisible && ideWindowState !== 'expanded' && (
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
            disabled={isHeroWindowDragging || isResizing || ideWindowState === 'expanded'}
            intensity={0.7}
          >
            <AnimatedContentCard sx={cardResetSx} visible={isHeroAnimationReady}>
              {isHeroAnimationReady ? (
                <TerminalHeroContent
                  key={ideSessionKey}
                  expanded={false}
                  lines={heroLines}
                  onWindowDragPointerDown={handleTitleBarPointerDown}
                  playing={isTypewriterPlaying}
                  windowDragEnabled={windowDragEnabled && !isResizing}
                  windowDragging={isHeroWindowDragging}
                  onClose={handleIdeClose}
                  onMinimize={handleIdeMinimize}
                  onExpand={handleIdeExpand}
                  resizeWidth={ideWindowSize?.width}
                  resizeHeight={ideWindowSize?.height}
                  resizeEnabled={resizeEnabled}
                  isResizing={isResizing}
                  onResizeStart={handleResizeStart}
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

      {/* Expanded IDE — portal-rendered so it escapes the transform hierarchy and covers the full background */}
      {createPortal(
        <AnimatePresence>
          {ideWindowState === 'expanded' && expandedIdeViewport !== null && (
            <motion.div
              data-testid="home-ide-expanded"
              key="ide-expanded"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              style={{
                position: 'fixed',
                top: expandedIdeViewport.top,
                left: expandedIdeViewport.left,
                width: expandedIdeViewport.width,
                height: expandedIdeViewport.height,
                zIndex: 1050,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: VSCODE_COLORS.editorBg,
              }}
            >
              <TerminalHeroContent
                key={ideSessionKey}
                expanded
                lines={heroLines}
                playing={isTypewriterPlaying}
                onClose={handleIdeClose}
                onMinimize={handleIdeMinimize}
                onExpand={handleIdeExpand}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 0,
                  boxShadow: 'none',
                  border: 'none',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

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
                {/* VS Code logo mark */}
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  sx={{ width: 26, height: 26, fill: 'currentColor' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M17.484.18l-9.777 9.396L3.054 5.896 0 7.368v9.264l3.054 1.472 4.651-3.678 9.777 9.396L24 21.82V2.18L17.484.18zm.626 18.335L9.72 12l8.39-6.515v13.03z"
                  />
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
              <IconButton
                data-testid="ide-minimized-bar"
                onClick={handleIdeRestore}
                aria-label="Restore window"
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
                {/* VS Code logo mark */}
                <Box
                  component="svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  sx={{ width: 26, height: 26, fill: 'currentColor' }}
                >
                  <path
                    fillRule="evenodd"
                    d="M17.484.18l-9.777 9.396L3.054 5.896 0 7.368v9.264l3.054 1.472 4.651-3.678 9.777 9.396L24 21.82V2.18L17.484.18zm.626 18.335L9.72 12l8.39-6.515v13.03z"
                  />
                </Box>
              </IconButton>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
