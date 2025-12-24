import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
import { useWelcomeAudio } from '../WelcomeAudioProvider';

export default function Home() {
  const { play, isPlaying, ready, error, showPauseHint, setShowPauseHint, setShowDarkModeHint } = useWelcomeAudio();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [hasHandledAudioPrompt, setHasHandledAudioPrompt] = useState(false);
  const [hasShownDarkModePrompt, setHasShownDarkModePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ready && !isPlaying && !hasHandledAudioPrompt) {
      setIsPromptOpen(true);
    }
  }, [ready, isPlaying, hasHandledAudioPrompt]);

  useEffect(
    () => () => {
      setShowPauseHint(false);
      setShowDarkModeHint(false);
    },
    [setShowPauseHint, setShowDarkModeHint],
  );

  useEffect(() => {
    if (error && !isPromptOpen) {
      setHasHandledAudioPrompt(true);
    }
  }, [error, isPromptOpen]);

  useEffect(() => {
    if (ready && isPlaying && !isPromptOpen) {
      setHasHandledAudioPrompt(true);
    }
  }, [ready, isPlaying, isPromptOpen]);

  useEffect(() => {
    if (hasShownDarkModePrompt || !hasHandledAudioPrompt || showPauseHint || isPromptOpen) return;
    setShowDarkModeHint(true);
    setHasShownDarkModePrompt(true);
  }, [hasHandledAudioPrompt, hasShownDarkModePrompt, showPauseHint, isPromptOpen, setShowDarkModeHint]);

  const handleCloseAudioPrompt = () => {
    setIsPromptOpen(false);
    setHasHandledAudioPrompt(true);
  };

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      await play();
      handleCloseAudioPrompt();
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

      <Dialog open={isPromptOpen} onClose={handleCloseAudioPrompt} aria-labelledby="welcome-audio-title">
        <DialogTitle id="welcome-audio-title">Play welcome audio?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Would you like to hear a short verse while browsing the site? You can stop it any time from your browser controls.
          </Typography>
          {error && (
            <Typography variant="caption" color="error">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAudioPrompt}>No thanks</Button>
          <Button onClick={handlePlay} variant="contained" disabled={isLoading} aria-label="Play welcome audio">
            {isLoading ? 'Loading…' : 'Play audio'}
          </Button>
        </DialogActions>
      </Dialog>

    </BackgroundPaper>
  );
}
