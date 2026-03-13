import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { AnimatedContentCard, ANIMATED_CARD_DURATION_MS } from '../components/AnimatedContentCard';
import BackgroundPaper from '../components/BackgroundPaper';
import { HeroMotionPath } from '../components/HeroMotionPath';
import { useHomeWelcomeSequence } from '../hooks/useHomeWelcomeSequence';
import { useAppStyles } from '../styles/appStyles';
import { useComponentStyles } from '../styles/componentStyles';
import { DisplayTitle } from '../components/text';

export default function Home() {
  const appStyles = useAppStyles();
  const { cardResetSx } = useComponentStyles();
  const { error, isHeroAnimationReady, isLoading, isPromptOpen, handleOptOut, handlePlay } =
    useHomeWelcomeSequence();

  const [isMotionPathPlaying, setIsMotionPathPlaying] = useState(false);

  useEffect(() => {
    if (!isHeroAnimationReady) return undefined;
    const id = window.setTimeout(() => setIsMotionPathPlaying(true), ANIMATED_CARD_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [isHeroAnimationReady]);

  return (
    <BackgroundPaper
      image="assets/home.jpg"
      contentAlign="flex-end"
      contentSx={appStyles.homeHeroContentSx}
      showShell={isHeroAnimationReady}
      shellSx={appStyles.homeHeroShellSx}
    >
      <AnimatedContentCard sx={cardResetSx} visible={isHeroAnimationReady}>
        <Stack spacing={2} alignItems="center">
          <HeroMotionPath playing={isMotionPathPlaying}>
            <DisplayTitle align="center" sx={appStyles.homeHeroTitleSx}>
              Hi, my passions are mathematics, computers, and adventures
            </DisplayTitle>
          </HeroMotionPath>
        </Stack>
      </AnimatedContentCard>

      <Dialog open={isPromptOpen} onClose={handleOptOut} aria-labelledby="welcome-audio-title">
        <DialogTitle id="welcome-audio-title">Play welcome audio?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Would you like to hear a short verse while browsing the site? Use the pause button in the header to stop it anytime.
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
          <Button onClick={handlePlay} variant="contained" disabled={isLoading} aria-label="Play welcome audio">
            {isLoading ? 'Loading…' : 'Play audio'}
          </Button>
        </DialogActions>
      </Dialog>
    </BackgroundPaper>
  );
}
