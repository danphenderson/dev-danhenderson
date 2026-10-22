import { useWelcomeOnboarding } from '../WelcomeOnboardingProvider';

/** Optional customization never gates the portfolio or dismisses a reader's controls. */
export const useHomeWelcomeSequence = () => {
  const {
    showCustomizeModal,
    showSettingsHint,
    openCustomizeModal,
    advanceToSettingsHint,
    completeOnboarding,
  } = useWelcomeOnboarding();

  return {
    isHeroAnimationReady: true,
    isCustomizeOpen: showCustomizeModal,
    isSettingsHintOpen: showSettingsHint,
    handleCustomizeOpen: openCustomizeModal,
    handleCustomizeDismiss: advanceToSettingsHint,
    handleSettingsHintComplete: completeOnboarding,
  };
};
