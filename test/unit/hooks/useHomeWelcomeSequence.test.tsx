import { act, renderHook } from '@testing-library/react';
import {
  WelcomeOnboardingProvider,
  ONBOARDING_COMPLETED_STORAGE_KEY,
} from '../../../src/WelcomeOnboardingProvider';
import { useHomeWelcomeSequence } from '../../../src/hooks/useHomeWelcomeSequence';

const renderSequence = () =>
  renderHook(() => useHomeWelcomeSequence(), { wrapper: WelcomeOnboardingProvider });

describe('Home customization persistence', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => jest.useRealTimers());

  it('is optional on a first visit, remains open until dismissed, and preserves audio consent', () => {
    jest.useFakeTimers();
    const { result } = renderSequence();
    expect(result.current.isHeroAnimationReady).toBe(true);
    expect(result.current.isCustomizeOpen).toBe(false);
    act(() => result.current.handleCustomizeOpen());
    act(() => jest.advanceTimersByTime(30_000));
    expect(result.current.isCustomizeOpen).toBe(true);
    expect(result.current.isHeroAnimationReady).toBe(true);
    expect(result.current.isSettingsHintOpen).toBe(false);
    expect(window.localStorage.getItem('danhenderson-welcome-audio-consent')).toBeNull();
    act(() => result.current.handleCustomizeDismiss());
    expect(result.current.isCustomizeOpen).toBe(false);
    expect(result.current.isSettingsHintOpen).toBe(true);
    act(() => result.current.handleSettingsHintComplete());
    expect(result.current.isSettingsHintOpen).toBe(false);
    expect(window.localStorage.getItem(ONBOARDING_COMPLETED_STORAGE_KEY)).toBe('true');
  });

  it('lets returning visitors reopen customization without an automatic tour', () => {
    window.localStorage.setItem(ONBOARDING_COMPLETED_STORAGE_KEY, 'true');
    const { result } = renderSequence();
    expect(result.current.isHeroAnimationReady).toBe(true);
    expect(result.current.isCustomizeOpen).toBe(false);
    act(() => result.current.handleCustomizeOpen());
    expect(result.current.isCustomizeOpen).toBe(true);
  });
});
