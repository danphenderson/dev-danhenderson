import { render, screen, act } from '@testing-library/react';
import {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} from '../../src/WelcomeOnboardingProvider';

const TestConsumer = () => {
  const {
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
  } = useWelcomeOnboarding();

  return (
    <div>
      <span data-testid="pause-hint">{String(showPauseHint)}</span>
      <span data-testid="dark-mode-hint">{String(showDarkModeHint)}</span>
      <span data-testid="onboarding-completed">{String(onboardingCompleted)}</span>
      <span data-testid="customize-modal">{String(showCustomizeModal)}</span>
      <button onClick={openPauseHint}>Open pause</button>
      <button onClick={dismissPauseHint}>Dismiss pause</button>
      <button onClick={openDarkModeHint}>Open dark mode</button>
      <button onClick={dismissDarkModeHint}>Dismiss dark mode</button>
      <button onClick={resetHints}>Reset</button>
      <button onClick={openCustomizeModal}>Open customize</button>
      <button onClick={completeOnboarding}>Complete onboarding</button>
    </div>
  );
};

describe('WelcomeOnboardingProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('defaults to both hints hidden', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    expect(screen.getByTestId('pause-hint')).toHaveTextContent('false');
    expect(screen.getByTestId('dark-mode-hint')).toHaveTextContent('false');
  });

  it('opens and dismisses the pause hint', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    act(() => screen.getByText('Open pause').click());
    expect(screen.getByTestId('pause-hint')).toHaveTextContent('true');

    act(() => screen.getByText('Dismiss pause').click());
    expect(screen.getByTestId('pause-hint')).toHaveTextContent('false');
  });

  it('opens and dismisses the dark mode hint', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    act(() => screen.getByText('Open dark mode').click());
    expect(screen.getByTestId('dark-mode-hint')).toHaveTextContent('true');

    act(() => screen.getByText('Dismiss dark mode').click());
    expect(screen.getByTestId('dark-mode-hint')).toHaveTextContent('false');
  });

  it('resets both hints simultaneously', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    act(() => {
      screen.getByText('Open pause').click();
      screen.getByText('Open dark mode').click();
    });

    expect(screen.getByTestId('pause-hint')).toHaveTextContent('true');
    expect(screen.getByTestId('dark-mode-hint')).toHaveTextContent('true');

    act(() => screen.getByText('Reset').click());

    expect(screen.getByTestId('pause-hint')).toHaveTextContent('false');
    expect(screen.getByTestId('dark-mode-hint')).toHaveTextContent('false');
  });

  it('defaults onboardingCompleted to false when localStorage is empty', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    expect(screen.getByTestId('onboarding-completed')).toHaveTextContent('false');
    expect(screen.getByTestId('customize-modal')).toHaveTextContent('false');
  });

  it('reads onboardingCompleted from localStorage on mount', () => {
    window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');

    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    expect(screen.getByTestId('onboarding-completed')).toHaveTextContent('true');
  });

  it('opens and closes the customize modal', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    act(() => screen.getByText('Open customize').click());
    expect(screen.getByTestId('customize-modal')).toHaveTextContent('true');
  });

  it('completeOnboarding closes modal, sets completed, and persists to localStorage', () => {
    render(
      <WelcomeOnboardingProvider>
        <TestConsumer />
      </WelcomeOnboardingProvider>
    );

    act(() => screen.getByText('Open customize').click());
    expect(screen.getByTestId('customize-modal')).toHaveTextContent('true');

    act(() => screen.getByText('Complete onboarding').click());

    expect(screen.getByTestId('customize-modal')).toHaveTextContent('false');
    expect(screen.getByTestId('onboarding-completed')).toHaveTextContent('true');
    expect(window.localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)).toBe('true');
  });
});
