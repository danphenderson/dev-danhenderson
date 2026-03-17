import { render, screen, act } from '@testing-library/react';
import {
  WelcomeOnboardingProvider,
  useWelcomeOnboarding,
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
  } = useWelcomeOnboarding();

  return (
    <div>
      <span data-testid="pause-hint">{String(showPauseHint)}</span>
      <span data-testid="dark-mode-hint">{String(showDarkModeHint)}</span>
      <button onClick={openPauseHint}>Open pause</button>
      <button onClick={dismissPauseHint}>Dismiss pause</button>
      <button onClick={openDarkModeHint}>Open dark mode</button>
      <button onClick={dismissDarkModeHint}>Dismiss dark mode</button>
      <button onClick={resetHints}>Reset</button>
    </div>
  );
};

describe('WelcomeOnboardingProvider', () => {
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
});
