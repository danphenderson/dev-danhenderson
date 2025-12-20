import { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import BackgroundPaper from '../components/BackgroundPaper';
import { useWelcomeAudio } from '../WelcomeAudioProvider';

export default function Home() {
  const { play, isPlaying, ready, error } = useWelcomeAudio();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (ready && !isPlaying) {
      setIsPromptOpen(true);
    }
  }, [ready, isPlaying]);

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      await play();
      setIsPromptOpen(false);
    } catch (err) {
      console.error('Unable to play welcome audio', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BackgroundPaper image="assets/home.jpg">
      <Stack spacing={2} alignItems="center">
        <Typography
          variant="h1"
          align="center"
          sx={{ color: '#fff', fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: '1.5' }}
        >
          Hi, I'm a Software Developer, Photographer, and Adventurer.
        </Typography>
      </Stack>

      <Dialog open={isPromptOpen} onClose={() => setIsPromptOpen(false)} aria-labelledby="welcome-audio-title">
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
          <Button onClick={() => setIsPromptOpen(false)}>No thanks</Button>
          <Button onClick={handlePlay} variant="contained" disabled={isLoading} aria-label="Play welcome audio">
            {isLoading ? 'Loading…' : 'Play audio'}
          </Button>
        </DialogActions>
      </Dialog>
    </BackgroundPaper>
  );
}
