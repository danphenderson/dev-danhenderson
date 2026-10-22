import { useCallback, useEffect, useRef, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

// Reading time, not animation time: keep preferences available with motion off too.
export const WELCOME_AUTO_DISMISS_MS = 5000;

export const useHomeWelcomeSequence = () => {
  const { play, pause, isPlaying, error } = useWelcomeAudio();
  const { completeOnboarding } = useWelcomeOnboarding();
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const mounted = useRef(false);
  const audioPending = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleDismiss = useCallback(() => {
    setIsWelcomeOpen(false);
    setIsInteracting(false);
    completeOnboarding();
  }, [completeOnboarding]);

  const handleOpen = () => {
    setIsInteracting(false);
    setIsWelcomeOpen(true);
  };

  useEffect(() => {
    if (!isWelcomeOpen || isInteracting) return;
    const timeoutId = window.setTimeout(handleDismiss, WELCOME_AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [isWelcomeOpen, isInteracting, handleDismiss]);

  const handleToggleAudio = async () => {
    if (isPlaying) {
      pause();
      return;
    }
    if (audioPending.current) return;

    audioPending.current = true;
    setIsAudioLoading(true);
    try {
      await play();
    } catch (err) {
      // The provider exposes an error and retains the header's retry control.
      console.error('Unable to play welcome audio', err);
    } finally {
      audioPending.current = false;
      if (mounted.current) setIsAudioLoading(false);
    }
  };

  return {
    error,
    isAudioPlaying: isPlaying,
    isAudioLoading,
    isWelcomeOpen,
    isHeroAnimationReady: true,
    setIsInteracting,
    handleDismiss,
    handleOpen,
    handleToggleAudio,
  };
};
