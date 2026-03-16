import { useCallback, useRef, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material';
import { motion, useScroll, useTransform } from 'motion/react';
import { AnimatedContentCard } from '../components/AnimatedContentCard';
import BackgroundPaper from '../components/BackgroundPaper';
import { HeroMotionPath } from '../components/HeroMotionPath';
import { TerminalHeroContent } from '../components/TerminalHeroContent';
import type { TerminalLine } from '../components/text/useTerminalTypewriter';
import { siteRouteMap } from '../constants/siteRoutes';
import { useDocumentMetadata } from '../hooks/useDocumentMetadata';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';

const heroLines: TerminalLine[] = [
  { command: 'whoami --passions', output: 'mathematics' },
  { command: 'whoami --passions', output: 'computers' },
  { command: 'whoami --passions', output: 'adventures' },
];

export default function Home() {
  const appStyles = useAppStyles();
  const { cardResetSx } = useComponentStyles();
  useDocumentMetadata({ ...siteRouteMap.home, canonicalPath: siteRouteMap.home.path });
  const { error, isHeroAnimationReady, isLoading, isPromptOpen, handleOptOut, handlePlay } =
    useHomeWelcomeSequence();
  const [isTypewriterPlaying, setIsTypewriterPlaying] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.6]);

  const handleMotionComplete = useCallback(() => {
    setIsTypewriterPlaying(true);
  }, []);

  return (
    <motion.div ref={heroRef} style={{ scale: heroScale, opacity: heroOpacity }}>
      <BackgroundPaper
        image="assets/home.jpg"
        contentAlign="flex-end"
        contentSx={appStyles.homeHeroContentSx}
        showShell={isHeroAnimationReady}
        shellSx={appStyles.homeHeroShellSx}
        shellWrapper={(shell) => (
          <HeroMotionPath active={isHeroAnimationReady} onComplete={handleMotionComplete}>
            {shell}
          </HeroMotionPath>
        )}
      >
      <AnimatedContentCard sx={cardResetSx} visible={isHeroAnimationReady}>
        {isHeroAnimationReady ? (
          <TerminalHeroContent
            lines={heroLines}
            playing={isTypewriterPlaying}
          />
        ) : null}
      </AnimatedContentCard>

      <Dialog open={isPromptOpen} onClose={handleOptOut} aria-labelledby="welcome-audio-title">
        <DialogTitle id="welcome-audio-title">Play welcome audio?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Would you like to hear a short verse while browsing the site? Use the pause button in
            the header to stop it anytime.
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
  );
}
