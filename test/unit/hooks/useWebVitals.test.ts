import { renderHook, act } from '@testing-library/react';

/* ── web-vitals mock ── */

jest.mock('web-vitals', () => ({
  onCLS: jest.fn(),
  onINP: jest.fn(),
  onLCP: jest.fn(),
  onTTFB: jest.fn(),
}));

import { useWebVitals } from '../../../src/hooks/useWebVitals';

/* Helper: flush the dynamic import('web-vitals') promise chain */
const flushImport = async () => {
  await act(async () => {
    // Multiple ticks to resolve import() → .then() microtask chain
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
  });
};

describe('useWebVitals', () => {
  /* Polyfill the Performance APIs that JSDOM lacks so supportsWebVitals() passes */
  beforeAll(() => {
    if (typeof globalThis.PerformanceObserver === 'undefined') {
      // @ts-expect-error — minimal stub for the environment guard
      globalThis.PerformanceObserver = class {};
    }
    if (typeof performance.getEntriesByType !== 'function') {
      // @ts-expect-error — minimal stub
      performance.getEntriesByType = () => [];
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty metrics and collected false initially', () => {
    const { result } = renderHook(() => useWebVitals());

    expect(result.current.metrics.size).toBe(0);
    expect(result.current.collected).toBe(false);
  });

  it('registers all four web-vitals reporters on mount', async () => {
    const webVitals = require('web-vitals');

    renderHook(() => useWebVitals());
    await flushImport();

    expect(webVitals.onCLS).toHaveBeenCalledTimes(1);
    expect(webVitals.onINP).toHaveBeenCalledTimes(1);
    expect(webVitals.onLCP).toHaveBeenCalledTimes(1);
    expect(webVitals.onTTFB).toHaveBeenCalledTimes(1);
  });

  it('accumulates a metric and sets collected to true', async () => {
    const webVitals = require('web-vitals');

    const { result } = renderHook(() => useWebVitals());
    await flushImport();

    // Extract the handler that the hook registered with onCLS
    const clsHandler = webVitals.onCLS.mock.calls[0]?.[0];
    expect(clsHandler).toBeInstanceOf(Function);

    act(() => {
      clsHandler({ name: 'CLS', value: 0.05, rating: 'good' });
    });

    expect(result.current.collected).toBe(true);
    expect(result.current.metrics.size).toBe(1);
    expect(result.current.metrics.get('CLS')).toEqual({
      name: 'CLS',
      value: 0.05,
      rating: 'good',
    });
  });

  it('updates an existing metric key with a newer value', async () => {
    const webVitals = require('web-vitals');

    const { result } = renderHook(() => useWebVitals());
    await flushImport();

    const clsHandler = webVitals.onCLS.mock.calls[0]?.[0];

    act(() => {
      clsHandler({ name: 'CLS', value: 0.05, rating: 'good' });
    });

    act(() => {
      clsHandler({ name: 'CLS', value: 0.12, rating: 'needs-improvement' });
    });

    expect(result.current.metrics.size).toBe(1);
    expect(result.current.metrics.get('CLS')).toEqual({
      name: 'CLS',
      value: 0.12,
      rating: 'needs-improvement',
    });
  });

  it('accumulates multiple distinct metrics', async () => {
    const webVitals = require('web-vitals');

    const { result } = renderHook(() => useWebVitals());
    await flushImport();

    const clsHandler = webVitals.onCLS.mock.calls[0]?.[0];
    const lcpHandler = webVitals.onLCP.mock.calls[0]?.[0];

    act(() => {
      clsHandler({ name: 'CLS', value: 0.05, rating: 'good' });
      lcpHandler({ name: 'LCP', value: 1200, rating: 'good' });
    });

    expect(result.current.metrics.size).toBe(2);
    expect(result.current.metrics.has('CLS')).toBe(true);
    expect(result.current.metrics.has('LCP')).toBe(true);
  });
});
