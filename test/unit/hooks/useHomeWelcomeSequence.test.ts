import { act, renderHook } from '@testing-library/react';
import { useHomeWelcomeSequence } from '../../../src/hooks/useHomeWelcomeSequence';

const mockOnboarding = {
  showCustomizeModal: false,
  showSettingsHint: false,
  openCustomizeModal: jest.fn(),
  advanceToSettingsHint: jest.fn(),
  completeOnboarding: jest.fn(),
};
jest.mock('../../../src/WelcomeOnboardingProvider', () => ({
  useWelcomeOnboarding: () => mockOnboarding,
}));

describe('optional Home customization', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('keeps the hero available without opening or scheduling onboarding', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useHomeWelcomeSequence());
    expect(result.current.isHeroAnimationReady).toBe(true);
    expect(mockOnboarding.openCustomizeModal).not.toHaveBeenCalled();
    expect(jest.getTimerCount()).toBe(0);
  });

  it('opens and advances only through explicit actions', () => {
    const { result } = renderHook(() => useHomeWelcomeSequence());
    act(() => result.current.handleCustomizeOpen());
    expect(mockOnboarding.openCustomizeModal).toHaveBeenCalledTimes(1);
    act(() => result.current.handleCustomizeDismiss());
    expect(mockOnboarding.advanceToSettingsHint).toHaveBeenCalledTimes(1);
    act(() => result.current.handleSettingsHintComplete());
    expect(mockOnboarding.completeOnboarding).toHaveBeenCalledTimes(1);
  });
});
