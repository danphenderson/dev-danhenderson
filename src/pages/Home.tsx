import { useCallback, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { AnimatedContentCard } from '../components/AnimatedContentCard';
import BackgroundPaper from '../components/BackgroundPaper';
import { HeroMotionPath } from '../components/HeroMotionPath';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';
import { DisplayTitle, TypewriterLoopText } from '../components/text';

const heroPrefix = 'Hi, my passion is ';
const heroPassions = ['mathematics!', 'computers!', 'adventures!'];

export default function Home() {
  const appStyles = useAppStyles();
  const { cardResetSx } = useComponentStyles();
  const { error, isHeroAnimationReady, isLoading, isPromptOpen, handleOptOut, handlePlay } =
    useHomeWelcomeSequence();
  const [isTypewriterPlaying, setIsTypewriterPlaying] = useState(false);

  const handleMotionComplete = useCallback(() => {
    setIsTypewriterPlaying(true);
  }, []);

  return (
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
        <Stack spacing={2} alignItems="center">
          <DisplayTitle align="center" sx={appStyles.homeHeroTitleSx}>
            {isHeroAnimationReady ? (
              <TypewriterLoopText
                prefix={heroPrefix}
                words={heroPassions}
                timingPreset="headline"
                playing={isTypewriterPlaying}
              />
            ) : null}
          </DisplayTitle>
        </Stack>
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
  );
}
