import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

/* IntersectionObserver stub for motion/react's useInView hook. */
if (typeof window.IntersectionObserver === 'undefined') {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = '';
    readonly thresholds: ReadonlyArray<number> = [];
    private callback: IntersectionObserverCallback;

    constructor(callback: IntersectionObserverCallback) {
      this.callback = callback;
    }

    observe(target: Element) {
      // Synchronously report as intersecting so content is visible in tests.
      this.callback(
        [{ isIntersecting: true, target, intersectionRatio: 1 } as IntersectionObserverEntry],
        this
      );
    }
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverStub,
  });

  Object.defineProperty(global, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: IntersectionObserverStub,
  });
}
