import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
import { useWelcomeAudio } from '../WelcomeAudioProvider';

export default function Home() {
  const {
    play,
    isPlaying,
    error,
    audioConsent,
    declineAudioConsent,
    showPauseHint,
    setShowPauseHint,
    setShowDarkModeHint,
  } = useWelcomeAudio();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [hasShownDarkModePrompt, setHasShownDarkModePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasHandledAudioPrompt = audioConsent !== 'unknown';

  useEffect(() => {
    if (audioConsent === 'unknown' && !isPlaying) {
      setIsPromptOpen(true);
      return;
    }

    setIsPromptOpen(false);
  }, [audioConsent, isPlaying]);

  useEffect(
    () => () => {
      setShowPauseHint(false);
      setShowDarkModeHint(false);
    },
    [setShowPauseHint, setShowDarkModeHint],
  );

  useEffect(() => {
    if (hasShownDarkModePrompt || !hasHandledAudioPrompt || showPauseHint || isPromptOpen) return;
    setShowDarkModeHint(true);
    setHasShownDarkModePrompt(true);
  }, [hasHandledAudioPrompt, hasShownDarkModePrompt, showPauseHint, isPromptOpen, setShowDarkModeHint]);

  const handleOptOut = () => {
    declineAudioConsent();
    setIsPromptOpen(false);
  };

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      await play();
      setIsPromptOpen(false);
      setShowPauseHint(true);
    } catch (err) {
      console.error('Unable to play welcome audio', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundPaper
      image="assets/home.jpg"
      contentAlign="flex-end"
      contentSx={{ pb: '194px' }}
      shellSx={{ p: 1.5, pb: 0.5 }}
    >
      <Stack spacing={2} alignItems="center">
        <Typography
          variant="h1"
          align="center"
          sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: '1.5' }}
        >
          Hi, my passions are mathematics, computers, and adventures
        </Typography>
      </Stack>

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
