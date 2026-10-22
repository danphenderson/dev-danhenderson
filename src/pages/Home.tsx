import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link as RouterLink } from 'react-router-dom';
import { cvSectionMetadata } from '../components/cv/cvSectionMetadata';
import { aboutMe } from '../data/cv';
import { Text } from '../components/text';
import { Box, Button, Stack, IconButton, Tooltip } from '@mui/material';
import {
  motion,
  useDragControls,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'motion/react';
import { AnimatedContentCard } from '../components/AnimatedContentCard';
import BackgroundPaper from '../components/BackgroundPaper';
import { FirstVisitWelcome } from '../components/FirstVisitWelcome';
import { HeroMotionPath } from '../components/HeroMotionPath';
import { TerminalHeroContent } from '../components/TerminalHeroContent';
import type { TerminalLine } from '../types/ui';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useHomeIdeOrchestration } from './homeIdeOrchestration';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';
import { useAppTheme } from '../ThemeProvider';
import { duration, MotionTiltCard, useMotionScale } from '../motion';
import { VSCODE_COLORS, VSCODE_WINDOW_RADIUS } from '../components/ide/vscodeTokens';

const heroLines: TerminalLine[] = [
  { command: 'node --version', output: 'v22.14.0' },
  { command: 'git log --oneline -1', output: '9ab2238 polish: terminal UI chrome' },
  { command: 'npm run build', output: '✓ Compiled successfully in 2.4s' },
  { command: 'whoami --passions', output: 'mathematics · computers · adventures' },
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
  const { motionIntensity, setMotionIntensity } = useAppTheme();
  const {
    error,
    isHeroAnimationReady,
    isAudioPlaying,
    isAudioLoading,
    isWelcomeOpen,
    setIsInteracting,
    handleDismiss,
    handleOpen,
    handleToggleAudio,
  } = useHomeWelcomeSequence();

  const preferencesTriggerRef = useRef<HTMLButtonElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroBoundsRef = useRef<HTMLDivElement>(null);
  const heroDragControls = useDragControls();
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);
  const { duration: motionDurationScale } = useMotionScale();
  const heroMotionStyle =
    motionDurationScale > 0 ? { scale: heroScale, opacity: heroOpacity } : { scale: 1, opacity: 1 };

  const {
    ideWindowState,
    ideSessionKey,
    ideVisible,
    expandedIdeViewport,
    ideWindowPortalContainer,
    expandDotHighlighted,
    isTypewriterPlaying,
    windowDragEnabled,
    isHeroWindowDragging,
    resizeWidth,
    resizeHeight,
    resizeEnabled,
    isResizing,
    setInlineIdeHost,
    setExpandedIdeHost,
    handleHeroMotionComplete,
    handleTitleBarPointerDown,
    handleHeroDragStart,
    handleHeroDragEnd,
    handleResizeStart,
    handleIdeClose,
    handleIdeMinimize,
    handleIdeExpand,
    handleIdeRestore,
  } = useHomeIdeOrchestration({
    dragControls: heroDragControls,
    heroRef,
    heroBoundsRef,
  });

  return (
    <>
      <motion.div ref={heroRef} style={{ position: 'relative', ...heroMotionStyle }}>
        <BackgroundPaper
          intro={
            <Stack spacing={2} sx={appStyles.homeIntroSx}>
              <Text role="pageTitle" component="h1">
                {aboutMe.name}
              </Text>
              <Text role="body" sx={{ maxWidth: 600 }}>
                Software developer building scientific, data, and AI-enabled systems.
              </Text>
              <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
                <Button component={RouterLink} to={siteRouteMap.cv.path} variant="contained">
                  Explore my CV
                </Button>
                <Button
                  component={RouterLink}
                  to={`${siteRouteMap.cv.path}#${cvSectionMetadata.coding.id}`}
                  variant="outlined"
                >
                  View projects
                </Button>
              </Stack>
              <Button
                ref={preferencesTriggerRef}
                onClick={handleOpen}
                size="small"
                sx={{ alignSelf: 'flex-start' }}
              >
                Customize appearance &amp; audio
              </Button>
            </Stack>
          }
          contentRef={heroBoundsRef}
          image="assets/home.jpg"
          contentAlign="flex-end"
          contentSx={appStyles.homeHeroContentSx}
          showShell={isHeroAnimationReady}
          shellSx={appStyles.homeHeroShellSx}
          shellWrapper={(shell) => (
            <HeroMotionPath active={isHeroAnimationReady} onComplete={handleHeroMotionComplete}>
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
                {ideWindowState === 'expanded' ? null : (
                  <AnimatePresence mode="wait">
                    {ideVisible && (
                      <motion.div
                        key={`ide-window-${ideSessionKey}`}
                        initial={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: duration.fast * motionDurationScale }}
                      >
                        {shell}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
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
                <Box
                  ref={setInlineIdeHost}
                  sx={{
                    display: 'inline-block',
                    maxWidth: '100%',
                    minWidth: 0,
                  }}
                />
              ) : null}
            </AnimatedContentCard>
          </MotionTiltCard>

          <FirstVisitWelcome
            open={isWelcomeOpen}
            returnFocusRef={preferencesTriggerRef}
            onClose={handleDismiss}
            onInteractionChange={setIsInteracting}
            motionIntensity={motionIntensity}
            onChangeMotionIntensity={setMotionIntensity}
            isAudioPlaying={isAudioPlaying}
            isAudioLoading={isAudioLoading}
            audioError={error}
            onToggleAudio={handleToggleAudio}
          />
        </BackgroundPaper>
      </motion.div>

      {ideWindowPortalContainer && isHeroAnimationReady && ideVisible
        ? createPortal(
            <TerminalHeroContent
              key={ideSessionKey}
              expanded={ideWindowState === 'expanded'}
              bootActive={isTypewriterPlaying && ideWindowState === 'expanded'}
              lines={heroLines}
              onWindowDragPointerDown={
                ideWindowState === 'normal' ? handleTitleBarPointerDown : undefined
              }
              playing={isTypewriterPlaying}
              windowDragEnabled={windowDragEnabled && !isResizing && ideWindowState === 'normal'}
              windowDragging={isHeroWindowDragging}
              onClose={handleIdeClose}
              onMinimize={handleIdeMinimize}
              onExpand={handleIdeExpand}
              expandHighlighted={expandDotHighlighted}
              resizeWidth={resizeWidth}
              resizeHeight={resizeHeight}
              resizeEnabled={resizeEnabled}
              isResizing={isResizing}
              onResizeStart={ideWindowState === 'normal' ? handleResizeStart : undefined}
              sx={
                ideWindowState === 'expanded'
                  ? {
                      width: '100%',
                      height: '100%',
                      borderRadius: 0,
                      boxShadow: 'none',
                      border: 'none',
                    }
                  : undefined
              }
            />,
            ideWindowPortalContainer
          )
        : null}

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
              transition={{ duration: duration.fast * motionDurationScale }}
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
              <Box
                ref={setExpandedIdeHost}
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
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
            transition={{ duration: duration.fast * motionDurationScale }}
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
            transition={{ duration: duration.fast * motionDurationScale }}
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
