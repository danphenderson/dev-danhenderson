import { renderHook, act } from '@testing-library/react';
import { useHomeWelcomeSequence } from '../../../src/hooks/useHomeWelcomeSequence';

type AudioConsent = 'unknown' | 'granted' | 'declined';

const CUSTOMIZE_AUTO_ADVANCE_DELAY_MS = 2250;

const createMockAudioState = (overrides: Record<string, unknown> = {}) => ({
  play: jest.fn().mockResolvedValue(undefined),
  pause: jest.fn(),
  isPlaying: false,
  ready: true,
  error: undefined as string | undefined,
  audioConsent: 'unknown' as AudioConsent,
  grantAudioConsent: jest.fn(),
  declineAudioConsent: jest.fn(),
  ...overrides,
});

const createMockOnboardingState = (overrides: Record<string, unknown> = {}) => ({
  onboardingCompleted: false,
  showCustomizeModal: false,
  showSettingsHint: false,
  openCustomizeModal: jest.fn(),
  advanceToSettingsHint: jest.fn(),
  completeOnboarding: jest.fn(),
  ...overrides,
});

let mockAudioState = createMockAudioState();
let mockOnboardingState = createMockOnboardingState();

jest.mock('../../../src/WelcomeAudioProvider', () => ({
  useWelcomeAudio: () => mockAudioState,
}));

jest.mock('../../../src/WelcomeOnboardingProvider', () => ({
  useWelcomeOnboarding: () => mockOnboardingState,
}));

describe('useHomeWelcomeSequence', () => {
  beforeEach(() => {
    mockAudioState = createMockAudioState();
    mockOnboardingState = createMockOnboardingState();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('opens prompt when audioConsent is unknown and onboarding has not been completed', () => {
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

  it('does not open prompt when onboarding is already completed', () => {
    mockOnboardingState = createMockOnboardingState({ onboardingCompleted: true });
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

  it('handlePlay calls play and closes prompt', async () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(true);

    await act(async () => {
      await result.current.handlePlay();
    });

    expect(mockAudioState.play).toHaveBeenCalledTimes(1);
    expect(result.current.isPromptOpen).toBe(false);
  });

  it('handlePlay sets isLoading during play', async () => {
    let resolvePlay: () => void = () => {};
    mockAudioState = createMockAudioState({
      play: jest.fn(
        () =>
          new Promise<void>((resolve) => {
            resolvePlay = resolve;
          })
      ),
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

  it('returns error from audio context', () => {
    mockAudioState = createMockAudioState({ error: 'Something went wrong' });
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.error).toBe('Something went wrong');
  });

  it('opens the customize modal once the audio prompt has been handled', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isPromptOpen).toBe(false);
    expect(mockOnboardingState.openCustomizeModal).toHaveBeenCalledTimes(1);
  });

  it('does not open customize modal when onboarding is already completed', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ onboardingCompleted: true });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isPromptOpen).toBe(false);
    expect(mockOnboardingState.openCustomizeModal).not.toHaveBeenCalled();
  });

  it('does not reopen the customize modal while the settings hint is already showing', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ showSettingsHint: true });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isPromptOpen).toBe(false);
    expect(mockOnboardingState.openCustomizeModal).not.toHaveBeenCalled();
  });

  it('auto-advances the customize step after 2250 ms', () => {
    jest.useFakeTimers();
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ showCustomizeModal: true });

    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isCustomizeOpen).toBe(true);

    act(() => {
      jest.advanceTimersByTime(CUSTOMIZE_AUTO_ADVANCE_DELAY_MS - 1);
    });

    expect(mockOnboardingState.advanceToSettingsHint).not.toHaveBeenCalled();
    expect(result.current.isCustomizeOpen).toBe(true);
    expect(result.current.isSettingsHintOpen).toBe(false);

    act(() => {
      jest.advanceTimersByTime(1);
    });

    expect(mockOnboardingState.advanceToSettingsHint).toHaveBeenCalledTimes(1);
  });

  it('handleCustomizeDismiss advances to the settings hint', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    act(() => {
      result.current.handleCustomizeDismiss();
    });

    expect(mockOnboardingState.advanceToSettingsHint).toHaveBeenCalledTimes(1);
    expect(mockOnboardingState.completeOnboarding).not.toHaveBeenCalled();
  });

  it('handleSettingsHintComplete calls completeOnboarding', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    act(() => {
      result.current.handleSettingsHintComplete();
    });

    expect(mockOnboardingState.completeOnboarding).toHaveBeenCalledTimes(1);
  });

  it('isHeroAnimationReady is true when onboarding is completed', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ onboardingCompleted: true });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isHeroAnimationReady).toBe(true);
  });

  it('isHeroAnimationReady is false while customize modal is showing', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ showCustomizeModal: true });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isHeroAnimationReady).toBe(false);
  });

  it('isHeroAnimationReady is false while the settings hint is showing', () => {
    mockAudioState = createMockAudioState({ audioConsent: 'declined' });
    mockOnboardingState = createMockOnboardingState({ showSettingsHint: true });
    const { result } = renderHook(() => useHomeWelcomeSequence());

    expect(result.current.isHeroAnimationReady).toBe(false);
    expect(result.current.isSettingsHintOpen).toBe(true);
  });

  it('isHeroAnimationReady is false while audio prompt is open', () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isPromptOpen).toBe(true);
    expect(result.current.isHeroAnimationReady).toBe(false);
  });
});
