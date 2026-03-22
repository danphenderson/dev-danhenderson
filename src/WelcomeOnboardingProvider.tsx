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
  try {
    return window.localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

type WelcomeOnboardingContextValue = {
  onboardingCompleted: boolean;
  showCustomizeModal: boolean;
  showSettingsHint: boolean;
  openCustomizeModal: () => void;
  advanceToSettingsHint: () => void;
  completeOnboarding: () => void;
};

const WelcomeOnboardingContext = createContext<WelcomeOnboardingContextValue>({
  onboardingCompleted: false,
  showCustomizeModal: false,
  showSettingsHint: false,
  openCustomizeModal: () => {},
  advanceToSettingsHint: () => {},
  completeOnboarding: () => {},
});

export const WelcomeOnboardingProvider = ({ children }: PropsWithChildren) => {
  const [onboardingCompleted, setOnboardingCompleted] = useState(getStoredOnboardingCompleted);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [showSettingsHint, setShowSettingsHint] = useState(false);

  const openCustomizeModal = useCallback(() => {
    setShowCustomizeModal(true);
    setShowSettingsHint(false);
  }, []);

  const advanceToSettingsHint = useCallback(() => {
    setShowCustomizeModal(false);
    setShowSettingsHint(true);
  }, []);

  const completeOnboarding = useCallback(() => {
    setShowCustomizeModal(false);
    setShowSettingsHint(false);
    setOnboardingCompleted(true);
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');
      } catch {
        /* localStorage unavailable */
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      onboardingCompleted,
      showCustomizeModal,
      showSettingsHint,
      openCustomizeModal,
      advanceToSettingsHint,
      completeOnboarding,
    }),
    [
      advanceToSettingsHint,
      completeOnboarding,
      onboardingCompleted,
      openCustomizeModal,
      showCustomizeModal,
      showSettingsHint,
    ]
  );

  return (
    <WelcomeOnboardingContext.Provider value={value}>{children}</WelcomeOnboardingContext.Provider>
  );
};

export const useWelcomeOnboarding = () => useContext(WelcomeOnboardingContext);
