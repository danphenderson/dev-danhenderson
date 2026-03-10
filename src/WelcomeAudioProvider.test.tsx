import { render, screen, act } from '@testing-library/react';
import { WelcomeAudioProvider, useWelcomeAudio } from './WelcomeAudioProvider';

const AudioConsumer = () => {
  const {
    audioConsent,
    isPlaying,
    grantAudioConsent,
    declineAudioConsent,
  } = useWelcomeAudio();
  return (
    <div>
      <span data-testid="consent">{audioConsent}</span>
      <span data-testid="playing">{String(isPlaying)}</span>
      <button onClick={grantAudioConsent}>grant</button>
      <button onClick={declineAudioConsent}>decline</button>
    </div>
  );
};

describe('WelcomeAudioProvider', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('provides default context values', () => {
    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    expect(screen.getByTestId('consent')).toHaveTextContent('unknown');
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
  });

  it('grantAudioConsent persists granted to localStorage and renders the iframe', () => {
    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'grant' }).click();
    });

    expect(screen.getByTestId('consent')).toHaveTextContent('granted');
    expect(window.localStorage.getItem('danhenderson-welcome-audio-consent')).toBe('granted');
    expect(screen.getByTitle('Welcome audio')).toBeInTheDocument();
  });

  it('declineAudioConsent persists declined to localStorage', () => {
    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    act(() => {
      screen.getByRole('button', { name: 'decline' }).click();
    });

    expect(screen.getByTestId('consent')).toHaveTextContent('declined');
    expect(window.localStorage.getItem('danhenderson-welcome-audio-consent')).toBe('declined');
  });

  it('reads stored consent from localStorage on mount', () => {
    window.localStorage.setItem('danhenderson-welcome-audio-consent', 'declined');

    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    expect(screen.getByTestId('consent')).toHaveTextContent('declined');
  });

  it('migrates legacy dismissed prompt to declined consent', () => {
    window.localStorage.setItem('danhenderson-welcome-audio-prompt', 'dismissed');

    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    expect(screen.getByTestId('consent')).toHaveTextContent('declined');
  });
});
