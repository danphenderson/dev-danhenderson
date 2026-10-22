import { StrictMode, type PropsWithChildren } from 'react';
import { act, renderHook } from '@testing-library/react';
import {
  WelcomeOnboardingProvider,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} from '../../../src/WelcomeOnboardingProvider';
import {
  useHomeWelcomeSequence,
  WELCOME_AUTO_DISMISS_MS,
} from '../../../src/hooks/useHomeWelcomeSequence';

const mockPlay = jest.fn<Promise<void>, []>();
const mockPause = jest.fn();
const mockDecline = jest.fn();
let mockIsPlaying = false;
jest.mock('../../../src/WelcomeAudioProvider', () => ({
  useWelcomeAudio: () => ({
    play: mockPlay,
    pause: mockPause,
    isPlaying: mockIsPlaying,
    audioConsent: 'unknown',
    declineAudioConsent: mockDecline,
  }),
}));

const wrapper = ({ children }: PropsWithChildren) => (
  <StrictMode>
    <WelcomeOnboardingProvider>{children}</WelcomeOnboardingProvider>
  </StrictMode>
);

describe('useHomeWelcomeSequence', () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
    jest.clearAllMocks();
    mockPlay.mockResolvedValue(undefined);
    mockIsPlaying = false;
  });
  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('automatically enters the IDE without audio consent or button clicks', () => {
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    expect(result.current.isWelcomeOpen).toBe(true);
    expect(result.current.isHeroAnimationReady).toBe(false);
    act(() => jest.advanceTimersByTime(WELCOME_AUTO_DISMISS_MS - 1));
    expect(result.current.isWelcomeOpen).toBe(true);
    act(() => jest.advanceTimersByTime(1));
    expect(result.current.isWelcomeOpen).toBe(false);
    expect(result.current.isHeroAnimationReady).toBe(true);
    expect(localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)).toBe('true');
    expect(mockPlay).not.toHaveBeenCalled();
    expect(mockDecline).not.toHaveBeenCalled();
  });

  it('pauses for interaction and gives a fresh reading interval on release', () => {
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    act(() => jest.advanceTimersByTime(2000));
    act(() => result.current.setIsInteracting(true));
    act(() => jest.advanceTimersByTime(20000));
    expect(result.current.isWelcomeOpen).toBe(true);
    act(() => result.current.setIsInteracting(false));
    act(() => jest.advanceTimersByTime(WELCOME_AUTO_DISMISS_MS));
    expect(result.current.isHeroAnimationReady).toBe(true);
  });

  it('completes immediately on dismissal and stays completed on remount', () => {
    const first = renderHook(useHomeWelcomeSequence, { wrapper });
    act(() => first.result.current.handleDismiss());
    expect(first.result.current.isHeroAnimationReady).toBe(true);
    first.unmount();
    const next = renderHook(useHomeWelcomeSequence, { wrapper });
    expect(next.result.current.isWelcomeOpen).toBe(false);
    expect(next.result.current.isHeroAnimationReady).toBe(true);
  });

  it('clears the dismissal timer on unmount', () => {
    const { unmount } = renderHook(useHomeWelcomeSequence, { wrapper });
    unmount();
    act(() => jest.advanceTimersByTime(WELCOME_AUTO_DISMISS_MS));
    expect(localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)).toBeNull();
  });

  it('keeps entry available while audio is pending and ignores duplicate play requests', async () => {
    let resolve!: () => void;
    mockPlay.mockImplementation(
      () =>
        new Promise<void>((done) => {
          resolve = done;
        })
    );
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleToggleAudio();
      void result.current.handleToggleAudio();
    });
    expect(mockPlay).toHaveBeenCalledTimes(1);
    expect(result.current.isAudioLoading).toBe(true);
    act(() => jest.advanceTimersByTime(WELCOME_AUTO_DISMISS_MS));
    expect(result.current.isHeroAnimationReady).toBe(true);
    await act(async () => {
      resolve();
      await pending;
    });
    expect(result.current.isAudioLoading).toBe(false);
    expect(result.current.isWelcomeOpen).toBe(false);
  });

  it('does not block dismissal after audio fails', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockPlay.mockRejectedValue(new Error('Audio unavailable'));
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    await act(async () => result.current.handleToggleAudio());
    expect(result.current.isAudioLoading).toBe(false);
    act(() => result.current.handleDismiss());
    expect(result.current.isHeroAnimationReady).toBe(true);
  });

  it('pauses audio that is already playing', async () => {
    mockIsPlaying = true;
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    await act(async () => result.current.handleToggleAudio());
    expect(mockPause).toHaveBeenCalledTimes(1);
    expect(mockPlay).not.toHaveBeenCalled();
  });

  it('still enters when localStorage cannot persist completion', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage blocked');
    });
    const { result } = renderHook(useHomeWelcomeSequence, { wrapper });
    act(() => jest.advanceTimersByTime(WELCOME_AUTO_DISMISS_MS));
    expect(result.current.isHeroAnimationReady).toBe(true);
  });
});
