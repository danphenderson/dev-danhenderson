import { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from 'react';

type WelcomeOnboardingContextValue = {
  showPauseHint: boolean;
  showDarkModeHint: boolean;
  openPauseHint: () => void;
  dismissPauseHint: () => void;
  openDarkModeHint: () => void;
  dismissDarkModeHint: () => void;
  resetHints: () => void;
};

const WelcomeOnboardingContext = createContext<WelcomeOnboardingContextValue>({
  showPauseHint: false,
  showDarkModeHint: false,
  openPauseHint: () => {},
  dismissPauseHint: () => {},
  openDarkModeHint: () => {},
  dismissDarkModeHint: () => {},
  resetHints: () => {},
});

export const WelcomeOnboardingProvider = ({ children }: PropsWithChildren) => {
  const [showPauseHint, setShowPauseHint] = useState(false);
  const [showDarkModeHint, setShowDarkModeHint] = useState(false);

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

  const value = useMemo(
    () => ({
      showPauseHint,
      showDarkModeHint,
      openPauseHint,
      dismissPauseHint,
      openDarkModeHint,
      dismissDarkModeHint,
      resetHints,
    }),
    [dismissDarkModeHint, dismissPauseHint, openDarkModeHint, openPauseHint, resetHints, showDarkModeHint, showPauseHint]
  );

  return (
    <WelcomeOnboardingContext.Provider value={value}>
      {children}
    </WelcomeOnboardingContext.Provider>
  );
};

export const useWelcomeOnboarding = () => useContext(WelcomeOnboardingContext);
