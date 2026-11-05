import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { WelcomeAudioProvider, useWelcomeAudio } from '../../src/WelcomeAudioProvider';

const CONSENT_KEY = 'danhenderson-welcome-audio-consent';
const LEGACY_KEY = 'danhenderson-welcome-audio-prompt';
const mockPlayError = jest.fn();

const AudioConsumer = () => {
  const { isPlaying, error, play, pause } = useWelcomeAudio();
  return (
    <>
      <span data-testid="playing">{String(isPlaying)}</span>
      <span data-testid="error">{error}</span>
      <button onClick={() => void play().catch(mockPlayError)}>play</button>
      <button onClick={pause}>pause</button>
    </>
  );
};

const renderAudio = () =>
  render(
    <WelcomeAudioProvider>
      <AudioConsumer />
    </WelcomeAudioProvider>
  );
const audioElement = () => screen.getByTestId('welcome-audio') as HTMLAudioElement;

function startPlayback(this: HTMLMediaElement) {
  Object.defineProperty(this, 'paused', { configurable: true, value: false });
  this.dispatchEvent(new Event('playing'));
  return Promise.resolve();
}

describe('WelcomeAudioProvider', () => {
  let play: jest.SpyInstance;
  let pause: jest.SpyInstance;
  let load: jest.SpyInstance;

  beforeEach(() => {
    window.localStorage.clear();
    mockPlayError.mockReset();
    play = jest.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(startPlayback);
    pause = jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(function () {
      Object.defineProperty(this, 'paused', { configurable: true, value: true });
      this.dispatchEvent(new Event('pause'));
    });
    load = jest.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(function () {
      Object.defineProperty(this, 'error', { configurable: true, value: null });
    });
  });

  afterEach(() => {
    cleanup();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it.each([null, 'unknown', 'granted', 'declined'])(
    'stays paused without a media source for stored consent %s',
    (consent) => {
      if (consent) window.localStorage.setItem(CONSENT_KEY, consent);
      renderAudio();

      expect(audioElement()).not.toHaveAttribute('src');
      expect(audioElement()).toHaveAttribute('preload', 'none');
      expect(audioElement()).not.toHaveAttribute('autoplay');
      expect(screen.getByTestId('playing')).toHaveTextContent('false');
      expect(play).not.toHaveBeenCalled();
      expect(window.localStorage.getItem(CONSENT_KEY)).toBe(consent);
    }
  );

  it('starts the local track only on explicit play and preserves position on pause/resume', async () => {
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    const audio = audioElement();
    expect(audio).toHaveAttribute('src', '/assets/verse.mp3');
    expect(audio.loop).toBe(true);
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted');
    audio.currentTime = 12;

    act(() => screen.getByRole('button', { name: 'pause' }).click());
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect(pause).toHaveBeenCalledTimes(1);
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    expect(audio.currentTime).toBe(12);
    expect(load).not.toHaveBeenCalled();
    expect(mockPlayError).not.toHaveBeenCalled();
  });

  it('leaves legacy declined consent paused and migrates it only on explicit play', async () => {
    window.localStorage.setItem(LEGACY_KEY, 'dismissed');
    renderAudio();
    expect(play).not.toHaveBeenCalled();
    expect(window.localStorage.getItem(LEGACY_KEY)).toBe('dismissed');
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(window.localStorage.getItem(LEGACY_KEY)).toBeNull();
    expect(window.localStorage.getItem(CONSENT_KEY)).toBe('granted');
  });

  it('can play when preference storage is unavailable', async () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Blocked');
    });
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
  });

  it('waits for native playback and coalesces concurrent play requests', async () => {
    let resolvePlayback!: () => void;
    play.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolvePlayback = resolve;
        })
    );
    renderAudio();
    await act(async () => {
      screen.getByRole('button', { name: 'play' }).click();
      screen.getByRole('button', { name: 'play' }).click();
    });
    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    await act(async () => {
      Object.defineProperty(audioElement(), 'paused', { configurable: true, value: false });
      fireEvent.playing(audioElement());
      resolvePlayback();
    });
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
  });

  it('reports rejected native playback and permits retry', async () => {
    const blocked = new DOMException('Playback blocked', 'NotAllowedError');
    play.mockRejectedValueOnce(blocked);
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(mockPlayError).toHaveBeenCalledWith(blocked);
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('Audio could not start.');

    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
  });

  it('times out stalled playback, stops it, and permits retry', async () => {
    jest.useFakeTimers();
    play.mockImplementationOnce(() => new Promise<void>(() => {}));
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    await act(async () => jest.advanceTimersByTimeAsync(8000));
    expect(mockPlayError).toHaveBeenCalledWith(
      new Error('Audio could not start. Please try again.')
    );
    expect(pause).toHaveBeenCalled();
    expect(screen.getByTestId('playing')).toHaveTextContent('false');

    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
  });

  it('cancels pending playback on pause and rejects late playing events', async () => {
    let resolvePlayback!: () => void;
    play.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          resolvePlayback = resolve;
        })
    );
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    await act(async () => screen.getByRole('button', { name: 'pause' }).click());
    expect(mockPlayError).toHaveBeenCalledWith(expect.objectContaining({ name: 'AbortError' }));
    await act(async () => {
      fireEvent.playing(audioElement());
      resolvePlayback();
    });
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toBeEmptyDOMElement();
  });

  it('reports a media error after playback starts and reloads the source on retry', async () => {
    renderAudio();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    Object.defineProperty(audioElement(), 'error', { configurable: true, value: { code: 4 } });
    act(() => fireEvent.error(audioElement()));
    expect(screen.getByTestId('playing')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('Audio could not start.');

    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    expect(load).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('playing')).toHaveTextContent('true');
  });

  it('cancels pending playback and releases the source on unmount', async () => {
    play.mockImplementationOnce(() => new Promise<void>(() => {}));
    const { unmount } = renderAudio();
    const audio = audioElement();
    await act(async () => screen.getByRole('button', { name: 'play' }).click());
    await act(async () => unmount());
    await waitFor(() =>
      expect(mockPlayError).toHaveBeenCalledWith(expect.objectContaining({ name: 'AbortError' }))
    );
    expect(audio).not.toHaveAttribute('src');
    expect(pause).toHaveBeenCalled();
    expect(load).toHaveBeenCalled();
  });
});
