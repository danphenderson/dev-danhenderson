import { renderHook, act } from '@testing-library/react';
import { useHomeWelcomeSequence } from './useHomeWelcomeSequence';

type AudioConsent = 'unknown' | 'granted' | 'declined';

const createMockAudioState = (overrides: Record<string, unknown> = {}) => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  isPlaying: false,
  ready: true,
  error: undefined as string | undefined,
  audioConsent: 'unknown' as AudioConsent,
  grantAudioConsent: jest.fn(),
  declineAudioConsent: jest.fn(),
  showPauseHint: false,
  setShowPauseHint: jest.fn(),
  showDarkModeHint: false,
  setShowDarkModeHint: jest.fn(),
  ...overrides,
});

let mockAudioState = createMockAudioState();

jest.mock('../WelcomeAudioProvider', () => ({
  useWelcomeAudio: () => mockAudioState,
}));

describe('useHomeWelcomeSequence', () => {
  beforeEach(() => {
    mockAudioState = createMockAudioState();
  });

  it('opens prompt when audioConsent is unknown', () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(true);
  });

  it('does not open prompt when audioConsent is granted', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'granted' });
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(false);
  });

  it('does not open prompt when audioConsent is declined', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(false);
  });

  it('handleOptOut calls declineAudioConsent and closes prompt', () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(true);

    act(() => {
      result.current.handleOptOut();
    });

    expect(mockAudioState.declineAudioConsent).toHaveBeenCalledTimes(1);
    expect(result.current.isPromptOpen).toBe(false);
  });

  it('handlePlay calls play, closes prompt, and shows pause hint', async () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(true);

    await act(async () => {
      await result.current.handlePlay();
    });

    expect(mockAudioState.play).toHaveBeenCalledTimes(1);
    expect(result.current.isPromptOpen).toBe(false);
    expect(mockAudioState.setShowPauseHint).toHaveBeenCalledWith(true);
  });

  it('handlePlay sets isLoading during play', async () => {
    let resolvePlay: () => void = () => {};
    mockAudioState = createMockAudioState({
      play: jest.fn(() => new Promise<void>((resolve) => { resolvePlay = resolve; })),
    });

    const { result } = renderHook(() => useHomeWelcomeSequence());

    let playPromise: Promise<void>;
    act(() => {
      playPromise = result.current.handlePlay();
    });

    expect(result.current.isLoading).toBe(true);

    await act(async () => {
      resolvePlay!();
      await playPromise!;
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('handlePlay handles play errors gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockAudioState = createMockAudioState({
      play: jest.fn().mockRejectedValue(new Error('Audio failed')),
    });

    const { result } = renderHook(() => useHomeWelcomeSequence());

    await act(async () => {
      await result.current.handlePlay();
    });

    expect(consoleSpy).toHaveBeenCalledWith('Unable to play welcome audio', expect.any(Error));
    expect(result.current.isLoading).toBe(false);

    consoleSpy.mockRestore();
  });

  it('cleans up pause and dark mode hints on unmount', () => {
    const { unmount } = renderHook(() => useHomeWelcomeSequence());
    unmount();

    expect(mockAudioState.setShowPauseHint).toHaveBeenCalledWith(false);
    expect(mockAudioState.setShowDarkModeHint).toHaveBeenCalledWith(false);
  });

  it('returns error from audio context', () => {
    mockAudioState = createMockAudioState({ error: 'Something went wrong' });
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.error).toBe('Something went wrong');
  });
});
