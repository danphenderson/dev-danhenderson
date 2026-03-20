import { render, screen, act } from '@testing-library/react';
import {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} from '../../src/WelcomeOnboardingProvider';

const TestConsumer = () => {
  const { onboardingCompleted, showCustomizeModal, openCustomizeModal, completeOnboarding } =
    useWelcomeOnboarding();

  return (
    <div>
      <span data-testid="onboarding-completed">{String(onboardingCompleted)}</span>
      <span data-testid="customize-modal">{String(showCustomizeModal)}</span>
      <button onClick={openCustomizeModal}>Open customize</button>
      <button onClick={completeOnboarding}>Complete onboarding</button>
    </div>
  );
};

describe('WelcomeOnboardingProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
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
