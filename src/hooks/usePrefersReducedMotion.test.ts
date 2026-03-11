import { renderHook, act } from '@testing-library/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

describe('usePrefersReducedMotion', () => {
  it('returns false by default (setupTests mocks matches: false)', () => {
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });

  it('returns true when matchMedia reports reduced motion', () => {
    const listeners: Array<() => void> = [];
    const mediaQueryList = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_, cb: () => void) => listeners.push(cb)),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mediaQueryList);

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it('updates when the media query changes', () => {
    let changeHandler: (() => void) | undefined;
    const mediaQueryList = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn((_event: string, cb: () => void) => {
        changeHandler = cb;
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mediaQueryList);

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mediaQueryList.matches = true;
      changeHandler?.();
    });

    expect(result.current).toBe(true);
  });

  it('cleans up the event listener on unmount', () => {
    const mediaQueryList = {
      matches: false,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };

    window.matchMedia = jest.fn().mockReturnValue(mediaQueryList);

    const { unmount } = renderHook(() => usePrefersReducedMotion());
    unmount();

    expect(mediaQueryList.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
