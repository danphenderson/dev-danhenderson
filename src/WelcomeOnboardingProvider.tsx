import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

export const ONBOARDING_COMPLETED_STORAGE_KEY = 'danhenderson-onboarding-completed';

const getStoredOnboardingCompleted = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY) === 'true';
};

type WelcomeOnboardingContextValue = {
  showPauseHint: boolean;
  showDarkModeHint: boolean;
  openPauseHint: () => void;
  dismissPauseHint: () => void;
  openDarkModeHint: () => void;
  dismissDarkModeHint: () => void;
  resetHints: () => void;
  onboardingCompleted: boolean;
  showCustomizeModal: boolean;
  openCustomizeModal: () => void;
  completeOnboarding: () => void;
};

const WelcomeOnboardingContext = createContext<WelcomeOnboardingContextValue>({
  showPauseHint: false,
  showDarkModeHint: false,
  openPauseHint: () => {},
  dismissPauseHint: () => {},
  openDarkModeHint: () => {},
  dismissDarkModeHint: () => {},
  resetHints: () => {},
  onboardingCompleted: false,
  showCustomizeModal: false,
  openCustomizeModal: () => {},
  completeOnboarding: () => {},
});

export const WelcomeOnboardingProvider = ({ children }: PropsWithChildren) => {
  const [showPauseHint, setShowPauseHint] = useState(false);
  const [showDarkModeHint, setShowDarkModeHint] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(getStoredOnboardingCompleted);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const openPauseHint = useCallback(() => {
    setShowPauseHint(true);
  }, []);

  const dismissPauseHint = useCallback(() => {
    setShowPauseHint(false);
  }, []);

  const openDarkModeHint = useCallback(() => {
    setShowDarkModeHint(true);
  }, []);

  const dismissDarkModeHint = useCallback(() => {
    setShowDarkModeHint(false);
  }, []);

  const resetHints = useCallback(() => {
    setShowPauseHint(false);
    setShowDarkModeHint(false);
  }, []);

  const openCustomizeModal = useCallback(() => {
    setShowCustomizeModal(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    setShowCustomizeModal(false);
    setOnboardingCompleted(true);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');
    }
  }, []);

  const value = useMemo(
    () => ({
      showPauseHint,
      showDarkModeHint,
      openPauseHint,
      dismissPauseHint,
      openDarkModeHint,
      dismissDarkModeHint,
      resetHints,
      onboardingCompleted,
      showCustomizeModal,
      openCustomizeModal,
      completeOnboarding,
    }),
    [
      completeOnboarding,
      dismissDarkModeHint,
      dismissPauseHint,
      onboardingCompleted,
      openCustomizeModal,
      openDarkModeHint,
      openPauseHint,
      resetHints,
      showCustomizeModal,
      showDarkModeHint,
      showPauseHint,
    ]
  );

  return (
    <WelcomeOnboardingContext.Provider value={value}>{children}</WelcomeOnboardingContext.Provider>
  );
};

export const useWelcomeOnboarding = () => useContext(WelcomeOnboardingContext);
