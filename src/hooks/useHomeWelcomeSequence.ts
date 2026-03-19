import { useEffect, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

type HomeWelcomeSequence = {
  error?: string;
  isHeroAnimationReady: boolean;
  isLoading: boolean;
  isPromptOpen: boolean;
  isCustomizeOpen: boolean;
  handleOptOut: () => void;
  handlePlay: () => Promise<void>;
  handleCustomizeDismiss: () => void;
};

export const useHomeWelcomeSequence = (): HomeWelcomeSequence => {
  const { play, isPlaying, error, audioConsent, declineAudioConsent } = useWelcomeAudio();
  const { onboardingCompleted, showCustomizeModal, openCustomizeModal, completeOnboarding } =
    useWelcomeOnboarding();
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const hasHandledAudioPrompt = audioConsent !== 'unknown';

  /* Open the audio prompt for first-time visitors. */
  useEffect(() => {
    if (onboardingCompleted) return;

    if (audioConsent === 'unknown' && !isPlaying) {
      setIsPromptOpen(true);
      return;
    }

    if (audioConsent === 'declined') {
      setIsPromptOpen(false);
    }
  }, [onboardingCompleted, audioConsent, isPlaying]);

  /* After the audio prompt is handled, show the customize modal. */
  useEffect(() => {
    if (onboardingCompleted || !hasHandledAudioPrompt || isPromptOpen || showCustomizeModal) return;
    openCustomizeModal();
  }, [onboardingCompleted, hasHandledAudioPrompt, isPromptOpen, showCustomizeModal, openCustomizeModal]);

  const handleOptOut = () => {
    declineAudioConsent();
    setIsPromptOpen(false);
  };

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

  const handleCustomizeDismiss = () => {
    completeOnboarding();
  };

  return {
    error,
    isHeroAnimationReady: onboardingCompleted && !isPromptOpen && !showCustomizeModal,
    isLoading,
    isPromptOpen,
    isCustomizeOpen: showCustomizeModal,
    handleOptOut,
    handlePlay,
    handleCustomizeDismiss,
  };
};
