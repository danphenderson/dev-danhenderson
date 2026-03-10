import { useEffect, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';

type HomeWelcomeSequence = {
  error?: string;
  isHeroAnimationReady: boolean;
  isLoading: boolean;
  isPromptOpen: boolean;
  handleOptOut: () => void;
  handlePlay: () => Promise<void>;
};

export const useHomeWelcomeSequence = (): HomeWelcomeSequence => {
  const {
    play,
    isPlaying,
    error,
    audioConsent,
    declineAudioConsent,
    showPauseHint,
    setShowPauseHint,
    showDarkModeHint,
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

    if (audioConsent === 'declined') {
      setIsPromptOpen(false);
    }
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
