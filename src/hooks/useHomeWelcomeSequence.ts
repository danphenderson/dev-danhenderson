import { useEffect, useRef, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

// Reading time, not animation time: keep preferences available with motion off too.
export const WELCOME_AUTO_DISMISS_MS = 5000;

export const useHomeWelcomeSequence = () => {
  const { play, pause, isPlaying, error } = useWelcomeAudio();
  const { onboardingCompleted, completeOnboarding } = useWelcomeOnboarding();
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

  useEffect(() => {
    if (onboardingCompleted || isInteracting) return;
    const timeoutId = window.setTimeout(completeOnboarding, WELCOME_AUTO_DISMISS_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onboardingCompleted, isInteracting, completeOnboarding]);

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
    isWelcomeOpen: !onboardingCompleted,
    isHeroAnimationReady: onboardingCompleted,
    setIsInteracting,
    handleDismiss: completeOnboarding,
    handleToggleAudio,
  };
};
