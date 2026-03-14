import { render, screen, act, waitFor } from '@testing-library/react';
import { WelcomeAudioProvider, useWelcomeAudio } from './WelcomeAudioProvider';

const AudioConsumer = () => {
  const { audioConsent, isPlaying, play, pause, grantAudioConsent, declineAudioConsent } =
    useWelcomeAudio();
  return (
    <div>
      <span data-testid="consent">{audioConsent}</span>
      <span data-testid="playing">{String(isPlaying)}</span>
      <button onClick={() => void play()}>play</button>
      <button onClick={pause}>pause</button>
      <button onClick={grantAudioConsent}>grant</button>
      <button onClick={declineAudioConsent}>decline</button>
    </div>
  );
};

const createMockSoundCloudWidget = () => {
  const listeners = new Map<string, Set<() => void>>();
  let paused = true;

  const emit = (event: string) => {
    listeners.get(event)?.forEach((listener) => listener());
  };

  const widget = {
    play: jest.fn(() => {
      paused = false;
      emit('play');
    }),
    pause: jest.fn(() => {
      paused = true;
      emit('pause');
    }),
    bind: jest.fn((event: string, listener: () => void) => {
      const eventListeners = listeners.get(event) ?? new Set<() => void>();
      eventListeners.add(listener);
      listeners.set(event, eventListeners);

      if (event === 'ready') {
        window.setTimeout(() => emit('ready'), 0);
      }
    }),
    unbind: jest.fn((event?: string, listener?: () => void) => {
      if (!event) {
        listeners.clear();
        return;
      }

      if (!listener) {
        listeners.delete(event);
        return;
      }

      const eventListeners = listeners.get(event);
      if (!eventListeners) return;

      eventListeners.delete(listener);
      if (eventListeners.size === 0) {
        listeners.delete(event);
      }
    }),
    isPaused: jest.fn((callback: (isPaused: boolean) => void) => callback(paused)),
    setLoop: jest.fn(),
  };

  return widget;
};

describe('WelcomeAudioProvider', () => {
  let soundCloudWidget: ReturnType<typeof createMockSoundCloudWidget>;

  beforeEach(() => {
    window.localStorage.clear();
    soundCloudWidget = createMockSoundCloudWidget();
    window.SC = {
      Widget: () => soundCloudWidget,
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete window.SC;
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

  it('grantAudioConsent persists granted to localStorage and renders the iframe', async () => {
    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'grant' }).click();
      await Promise.resolve();
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

  it('updates playback state when the widget emits play and pause events', async () => {
    render(
      <WelcomeAudioProvider>
        <AudioConsumer />
      </WelcomeAudioProvider>
    );

    await act(async () => {
      screen.getByRole('button', { name: 'play' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('consent')).toHaveTextContent('granted'));
    await waitFor(() => expect(screen.getByTestId('playing')).toHaveTextContent('true'));
    expect(soundCloudWidget.play).toHaveBeenCalledTimes(1);

    act(() => {
      screen.getByRole('button', { name: 'pause' }).click();
    });

    await waitFor(() => expect(screen.getByTestId('playing')).toHaveTextContent('false'));
    expect(soundCloudWidget.pause).toHaveBeenCalledTimes(1);
  });
});
