import { useEffect, useState } from 'react';
import { useWelcomeAudio } from '../WelcomeAudioProvider';
import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

const CUSTOMIZE_AUTO_ADVANCE_DELAY_MS = 2250;

type HomeWelcomeSequence = {
  error?: string;
  isHeroAnimationReady: boolean;
  isLoading: boolean;
  isPromptOpen: boolean;
  isCustomizeOpen: boolean;
  isSettingsHintOpen: boolean;
  handleOptOut: () => void;
  handlePlay: () => Promise<void>;
  handleCustomizeDismiss: () => void;
  handleSettingsHintComplete: () => void;
};

export const useHomeWelcomeSequence = (): HomeWelcomeSequence => {
  const { play, isPlaying, error, audioConsent, declineAudioConsent } = useWelcomeAudio();
  const {
    onboardingCompleted,
    showCustomizeModal,
    showSettingsHint,
    openCustomizeModal,
    advanceToSettingsHint,
    completeOnboarding,
  } = useWelcomeOnboarding();
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
    if (
      onboardingCompleted ||
      !hasHandledAudioPrompt ||
      isPromptOpen ||
      showCustomizeModal ||
      showSettingsHint
    ) {
      return;
    }

    openCustomizeModal();
  }, [
    onboardingCompleted,
    hasHandledAudioPrompt,
    isPromptOpen,
    showCustomizeModal,
    showSettingsHint,
    openCustomizeModal,
  ]);

  /* Automatically advance the customize modal after the onboarding dwell time. */
  useEffect(() => {
    if (!showCustomizeModal) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      advanceToSettingsHint();
    }, CUSTOMIZE_AUTO_ADVANCE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showCustomizeModal, advanceToSettingsHint]);

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
    advanceToSettingsHint();
  };

  const handleSettingsHintComplete = () => {
    completeOnboarding();
  };

  return {
    error,
    isHeroAnimationReady:
      onboardingCompleted && !isPromptOpen && !showCustomizeModal && !showSettingsHint,
    isLoading,
    isPromptOpen,
    isCustomizeOpen: showCustomizeModal,
    isSettingsHintOpen: showSettingsHint,
    handleOptOut,
    handlePlay,
    handleCustomizeDismiss,
    handleSettingsHintComplete,
  };
};
