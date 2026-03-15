import { useEffect, useRef, useState } from 'react';

export type WebVitalEntry = {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
};

export type WebVitalsState = {
  metrics: Map<string, WebVitalEntry>;
  collected: boolean;
};

const supportsWebVitals = (): boolean =>
  typeof window !== 'undefined' &&
  typeof PerformanceObserver !== 'undefined' &&
  typeof performance !== 'undefined' &&
  typeof performance.getEntriesByType === 'function';

/**
 * Collects Core Web Vitals (CLS, INP, LCP, TTFB) and exposes them
 * as React state. Metrics arrive asynchronously — `collected` becomes true
 * once at least one metric has been received.
 *
 * Gracefully no-ops in environments without the Performance API (e.g. JSDOM).
 */
export function useWebVitals(): WebVitalsState {
  const [metrics, setMetrics] = useState<Map<string, WebVitalEntry>>(new Map());
  const [collected, setCollected] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current || !supportsWebVitals()) return;
    initialized.current = true;

    const handler = ({ name, value, rating }: { name: string; value: number; rating: 'good' | 'needs-improvement' | 'poor' }) => {
      setMetrics((prev) => {
        const next = new Map(prev);
        next.set(name, { name, value, rating });
        return next;
      });
      setCollected(true);
    };

    import('web-vitals').then(({ onCLS, onINP, onLCP, onTTFB }) => {
      onCLS(handler);
      onINP(handler);
      onLCP(handler);
      onTTFB(handler);
    });
  }, []);

  return { metrics, collected };
}
