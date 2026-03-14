import { useEffect, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

type HomeWelcomeSequence = {
  error?: string;
  isHeroAnimationReady: boolean;
  isLoading: boolean;
  isPromptOpen: boolean;
  handleOptOut: () => void;
  handlePlay: () => Promise<void>;
};

export const useHomeWelcomeSequence = (): HomeWelcomeSequence => {
  const { play, isPlaying, error, audioConsent, declineAudioConsent } = useWelcomeAudio();
  const {
    showPauseHint,
    showDarkModeHint,
    openPauseHint,
    openDarkModeHint,
    dismissPauseHint,
    dismissDarkModeHint,
    resetHints,
  } = useWelcomeOnboarding();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [hasShownDarkModePrompt, setHasShownDarkModePrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasHandledAudioPrompt = audioConsent !== 'unknown';

  useEffect(() => {
    if (audioConsent === 'unknown' && !isPlaying) {
      setIsPromptOpen(true);
      return;
    }

    if (audioConsent === 'declined') {
      setIsPromptOpen(false);
    }
  }, [audioConsent, isPlaying]);

  useEffect(
    () => () => {
      resetHints();
    },
    [resetHints]
  );

  useEffect(() => {
    if (hasShownDarkModePrompt || !hasHandledAudioPrompt || showPauseHint || isPromptOpen) return;
    openDarkModeHint();
    setHasShownDarkModePrompt(true);
  }, [
    hasHandledAudioPrompt,
    hasShownDarkModePrompt,
    showPauseHint,
    isPromptOpen,
    openDarkModeHint,
  ]);

  const handleOptOut = () => {
    declineAudioConsent();
    setIsPromptOpen(false);
    dismissPauseHint();
  };

  const handlePlay = async () => {
    try {
      setIsLoading(true);
      await play();
      setIsPromptOpen(false);
      dismissDarkModeHint();
      openPauseHint();
    } catch (err) {
      console.error('Unable to play welcome audio', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    error,
    isHeroAnimationReady:
      hasHandledAudioPrompt &&
      hasShownDarkModePrompt &&
      !isPromptOpen &&
      !showPauseHint &&
      !showDarkModeHint,
    isLoading,
    isPromptOpen,
    handleOptOut,
    handlePlay,
  };
};
